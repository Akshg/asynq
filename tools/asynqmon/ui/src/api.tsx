import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export interface ListQueuesResponse {
  queues: Queue[];
}

export interface GetQueueResponse {
  current: Queue;
  history: DailyStat[];
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
  timestamp: string;
}

export interface DailyStat {
  date: string;
  processed: number;
  failed: number;
}

export async function listQueues(): Promise<ListQueuesResponse> {
  const resp = await axios({
    method: "get",
    url: `${BASE_URL}/queues`,
  });
  return resp.data;
}

export async function getQueue(qname: string): Promise<GetQueueResponse> {
  const resp = await axios({
    method: "get",
    url: `${BASE_URL}/queues/${qname}`,
  });
  return resp.data;
}

export async function pauseQueue(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/pause`,
  });
}

export async function resumeQueue(qname: string): Promise<void> {
  await axios({
    method: "post",
    url: `${BASE_URL}/queues/${qname}/resume`,
  });
}
