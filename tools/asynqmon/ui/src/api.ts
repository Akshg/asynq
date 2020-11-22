import axios from "axios";
import queryString from "query-string";

const BASE_URL = "http://localhost:8080/api";

export interface ListQueuesResponse {
  queues: Queue[];
}

export interface GetQueueResponse {
  current: Queue;
  history: DailyStat[];
}

export interface ListActiveTasksResponse {
  tasks: ActiveTask[];
  stats: Queue;
}

export interface ListPendingTasksResponse {
  tasks: PendingTask[];
  stats: Queue;
}

export interface ListScheduledTasksResponse {
  tasks: ScheduledTask[];
  stats: Queue;
}

export interface ListRetryTasksResponse {
  tasks: RetryTask[];
  stats: Queue;
}

export interface ListDeadTasksResponse {
  tasks: DeadTask[];
  stats: Queue;
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

// BaseTask corresponds to asynq.Task type.
interface BaseTask {
  type: string;
  payload: { [key: string]: any };
}

export interface ActiveTask extends BaseTask {
  id: string;
  queue: string;
}

export interface PendingTask extends BaseTask {
  id: string;
  queue: string;
}

export interface ScheduledTask extends BaseTask {
  id: string;
  queue: string;
  next_process_at: string;
}

export interface RetryTask extends BaseTask {
  id: string;
  queue: string;
  next_process_at: string;
  max_retry: number;
  retried: number;
  error_message: string;
}

export interface DeadTask extends BaseTask {
  id: string;
  queue: string;
  max_retry: number;
  retried: number;
  last_failed_at: string;
  error_message: string;
}

export interface PaginationOptions extends Record<string, number | undefined> {
  size?: number; // size of the page
  page?: number; // page number (1 being the first page)
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

export async function listActiveTasks(
  qname: string,
  pageOpts?: PaginationOptions
): Promise<ListActiveTasksResponse> {
  let url = `${BASE_URL}/queues/${qname}/active_tasks`;
  if (pageOpts) {
    url += `?${queryString.stringify(pageOpts)}`;
  }
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}

export async function listPendingTasks(
  qname: string,
  pageOpts?: PaginationOptions
): Promise<ListPendingTasksResponse> {
  let url = `${BASE_URL}/queues/${qname}/pending_tasks`;
  if (pageOpts) {
    url += `?${queryString.stringify(pageOpts)}`;
  }
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}

export async function listScheduledTasks(
  qname: string,
  pageOpts?: PaginationOptions
): Promise<ListScheduledTasksResponse> {
  let url = `${BASE_URL}/queues/${qname}/scheduled_tasks`;
  if (pageOpts) {
    url += `?${queryString.stringify(pageOpts)}`;
  }
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}

export async function listRetryTasks(
  qname: string,
  pageOpts?: PaginationOptions
): Promise<ListRetryTasksResponse> {
  let url = `${BASE_URL}/queues/${qname}/retry_tasks`;
  if (pageOpts) {
    url += `?${queryString.stringify(pageOpts)}`;
  }
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}

export async function listDeadTasks(
  qname: string,
  pageOpts?: PaginationOptions
): Promise<ListDeadTasksResponse> {
  let url = `${BASE_URL}/queues/${qname}/dead_tasks`;
  if (pageOpts) {
    url += `?${queryString.stringify(pageOpts)}`;
  }
  const resp = await axios({
    method: "get",
    url,
  });
  return resp.data;
}
