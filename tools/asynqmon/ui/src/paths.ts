export const paths = {
  HOME: "/",
  CRON: "/cron",
  QUEUE_DETAILS: "/queues/:qname",
  TASKS: "/queues/:qname/tasks/:state",
};

export function queueDetailsPath(qname: string): string {
  return paths.QUEUE_DETAILS.replace(":qname", qname);
}

export function tasksPath(qname: string, state: string): string {
  return paths.TASKS.replace(":qname", qname).replace(":state", state);
}
