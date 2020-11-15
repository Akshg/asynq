import axios from "axios";

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
}

export interface ListPendingTasksResponse {
  tasks: PendingTask[];
}

export interface ListScheduledTasksResponse {
  tasks: ScheduledTask[];
}

export interface ListRetryTasksResponse {
  tasks: RetryTask[];
}

export interface ListDeadTasksResponse {
  tasks: DeadTask[];
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
  qname: string
): Promise<ListActiveTasksResponse> {
  const resp = await axios({
    method: "get",
    url: `${BASE_URL}/queues/${qname}/active_tasks`,
  });
  return resp.data;
}

export async function listPendingTasks(
  qname: string
): Promise<ListPendingTasksResponse> {
  const resp = await axios({
    method: "get",
    url: `${BASE_URL}/queues/${qname}/pending_tasks`,
  });
  return resp.data;
}

export async function listScheduledTasks(
  qname: string
): Promise<ListScheduledTasksResponse> {
  const resp = await axios({
    method: "get",
    url: `${BASE_URL}/queues/${qname}/scheduled_tasks`,
  });
  return resp.data;
}

export async function listRetryTasks(
  qname: string
): Promise<ListRetryTasksResponse> {
  const resp = await axios({
    method: "get",
    url: `${BASE_URL}/queues/${qname}/retry_tasks`,
  });
  return resp.data;
}

export async function listDeadTasks(
  qname: string
): Promise<ListDeadTasksResponse> {
  const resp = await axios({
    method: "get",
    url: `${BASE_URL}/queues/${qname}/dead_tasks`,
  });
  return resp.data;
}
