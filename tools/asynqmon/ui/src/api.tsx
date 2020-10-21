import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

interface FetchQueuesResponse {
  queues: Queue[];
}

export interface Queue {
  queue: string;
  paused: boolean;
  size: number;
  active: number;
  pending: number;
  scheduled: number;
  retry: number;
  dead: number;
  processed: number;
  failed: number;
}

export async function fetchQueues(): Promise<FetchQueuesResponse> {
  const resp = await axios({
    method: "get",
    url: `${BASE_URL}/queues`,
  });
  return resp.data;
}