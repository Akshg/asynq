package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/go-redis/redis/v7"
	"github.com/gorilla/mux"
	"github.com/hibiken/asynq/internal/rdb"
	"github.com/rs/cors"
)

// staticFileServer implements the http.Handler interface, so we can use it
// to respond to HTTP requests. The path to the static directory and
// path to the index file within that static directory are used to
// serve the SPA in the given static directory.
type staticFileServer struct {
	staticPath string
	indexPath  string
}

// ServeHTTP inspects the URL path to locate a file within the static dir
// on the SPA handler. If a file is found, it will be served. If not, the
// file located at the index path on the SPA handler will be served. This
// is suitable behavior for serving an SPA (single page application).
func (srv *staticFileServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// get the absolute path to prevent directory traversal
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		// if we failed to get the absolute path respond with a 400 bad request
		// and stop
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// prepend the path with the path to the static directory
	path = filepath.Join(srv.staticPath, path)

	// check whether a file exists at the given path
	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		// file does not exist, serve index.html
		http.ServeFile(w, r, filepath.Join(srv.staticPath, srv.indexPath))
		return
	} else if err != nil {
		// if we got an error (that wasn't that the file doesn't exist) stating the
		// file, return a 500 internal server error and stop
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// otherwise, use http.FileServer to serve the static dir
	http.FileServer(http.Dir(srv.staticPath)).ServeHTTP(w, r)
}

var redisClient *rdb.RDB

const addr = "127.0.0.1:8080"

func main() {
	redisClient = rdb.NewRDB(redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	}))
	defer redisClient.Close()

	router := mux.NewRouter()

	api := router.PathPrefix("/api").Subrouter()
	api.HandleFunc("/queues", handleListQueues)
	api.HandleFunc("/queues/{qname}", handleGetQueue)

	fs := &staticFileServer{staticPath: "ui/build", indexPath: "index.html"}
	router.PathPrefix("/").Handler(fs)

	handler := cors.Default().Handler(router)

	srv := &http.Server{
		Handler:      handler,
		Addr:         addr,
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
	}

	fmt.Printf("Asynq Monitoring WebUI server is running on %s\n", addr)
	log.Fatal(srv.ListenAndServe())
}

func handleListQueues(w http.ResponseWriter, r *http.Request) {
	qnames, err := redisClient.AllQueues()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var stats []*rdb.Stats
	for _, qname := range qnames {
		s, err := redisClient.CurrentStats(qname)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		stats = append(stats, s)
	}
	payload := map[string]interface{}{"queues": stats}
	json.NewEncoder(w).Encode(payload)
}

func handleGetQueue(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	qname := vars["qname"]

	payload := make(map[string]interface{})
	stats, err := redisClient.CurrentStats(qname)
	if err != nil {
		notFoundErr, ok := err.(*rdb.ErrQueueNotFound)
		if ok {
			http.Error(w, notFoundErr.Error(), http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	payload["current"] = stats

	// TODO: make this n a variable
	dailyStats, err := redisClient.HistoricalStats(qname, 10)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	payload["history"] = dailyStats
	json.NewEncoder(w).Encode(payload)
}
