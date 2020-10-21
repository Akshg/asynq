export const paths = {
  HOME: "/",
  CRON: "/cron",
  QUEUE_DETAILS: "/queues/:qname",
}

export function queueDetailsPath(qname: string): string {
  return paths.QUEUE_DETAILS.replace(":qname", qname);
}