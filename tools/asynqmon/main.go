package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	const addr = "127.0.0.1:8080"

	fs := http.FileServer(http.Dir("./ui/build"))
	http.Handle("/", fs)

	fmt.Printf("Asynq Monitoring WebUI server is running on %s\n", addr)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatal(err)
	}
}
