import React, { useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import IconButton from "@material-ui/core/IconButton";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import { Queue } from "../api";
import { queueDetailsPath } from "../paths";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  linkCell: {
    fontWeight: 600,
  },
  footerCell: {
    fontWeight: 600,
    fontSize: "0.875rem",
    borderBottom: "none",
    backgroundColor: "#f5f9fa",
  },
});

interface Props {
  queues: Queue[];
}

enum SortBy {
  Queue,
  Size,
  Active,
  Pending,
  Scheduled,
  Retry,
  Dead,
  Processed,
  Failed,

  None, // disable sort
}

enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

const columnConfig = [
  { label: "Queue", key: "queue", sortBy: SortBy.Queue },
  { label: "Size", key: "size", sortBy: SortBy.Size },
  { label: "Active", key: "active", sortBy: SortBy.Active },
  { label: "Pending", key: "pending", sortBy: SortBy.Pending },
  { label: "Scheduled", key: "scheduled", sortBy: SortBy.Scheduled },
  { label: "Retry", key: "retry", sortBy: SortBy.Retry },
  { label: "Dead", key: "dead", sortBy: SortBy.Dead },
  { label: "Processed", key: "processed", sortBy: SortBy.Processed },
  { label: "Failed", key: "failed", sortBy: SortBy.Failed },
  { label: "Pause", key: "pause", sortBy: SortBy.None },
];

// sortQueues takes a array of queues and return a sorted array.
// It returns a new array and leave the original array untouched.
function sortQueues(
  queues: Queue[],
  cmpFn: (first: Queue, second: Queue) => number
): Queue[] {
  let copy = [...queues];
  copy.sort(cmpFn);
  return copy;
}

export default function QueuesOverviewTable(props: Props) {
  const classes = useStyles();
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Queue);
  const [sortDir, setSortDir] = useState<SortDirection>(SortDirection.Asc);
  const total = getAggregateCounts(props.queues);

  const createSortClickHandler = (sortKey: SortBy) => (e: React.MouseEvent) => {
    if (sortKey === sortBy) {
      // Toggle sort direction.
      const nextSortDir =
        sortDir === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc;
      setSortDir(nextSortDir);
    } else {
      // Change the sort key.
      setSortBy(sortKey);
    }
  };

  const cmpFunc = (q1: Queue, q2: Queue): number => {
    let isQ1Smaller: boolean;
    switch (sortBy) {
      case SortBy.Queue:
        if (q1.queue === q2.queue) return 0;
        isQ1Smaller = q1.queue < q2.queue;
        break;
      case SortBy.Size:
        if (q1.size === q2.size) return 0;
        isQ1Smaller = q1.size < q2.size;
        break;
      case SortBy.Active:
        if (q1.active === q2.active) return 0;
        isQ1Smaller = q1.active < q2.active;
        break;
      case SortBy.Pending:
        if (q1.pending === q2.pending) return 0;
        isQ1Smaller = q1.pending < q2.pending;
        break;
      case SortBy.Scheduled:
        if (q1.scheduled === q2.scheduled) return 0;
        isQ1Smaller = q1.scheduled < q2.scheduled;
        break;
      case SortBy.Retry:
        if (q1.retry === q2.retry) return 0;
        isQ1Smaller = q1.retry < q2.retry;
        break;
      case SortBy.Dead:
        if (q1.dead === q2.dead) return 0;
        isQ1Smaller = q1.dead < q2.dead;
        break;
      case SortBy.Processed:
        if (q1.processed === q2.processed) return 0;
        isQ1Smaller = q1.processed < q2.processed;
        break;
      case SortBy.Failed:
        if (q1.failed === q2.failed) return 0;
        isQ1Smaller = q1.failed < q2.failed;
        break;
      default:
        // eslint-disable-next-line no-throw-literal
        throw `Unexpected order by value: ${sortBy}`;
    }
    if (sortDir === SortDirection.Asc) {
      return isQ1Smaller ? -1 : 1;
    } else {
      return isQ1Smaller ? 1 : -1;
    }
  };

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="queues overview table">
        <TableHead>
          <TableRow>
            {columnConfig.map((cfg, i) => (
              <TableCell key={cfg.key} align={i === 0 ? "left" : "right"}>
                {cfg.sortBy !== SortBy.None ? (
                  <TableSortLabel
                    active={sortBy === cfg.sortBy}
                    direction={sortDir}
                    onClick={createSortClickHandler(cfg.sortBy)}
                  >
                    {cfg.label}
                  </TableSortLabel>
                ) : (
                  <div>{cfg.label}</div>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortQueues(props.queues, cmpFunc).map((q) => (
            <TableRow key={q.queue}>
              <TableCell
                component="th"
                scope="row"
                className={classes.linkCell}
              >
                <Link to={queueDetailsPath(q.queue)}>
                  {q.queue}
                  {q.paused ? " (paused)" : ""}
                </Link>
              </TableCell>
              <TableCell align="right">{q.size}</TableCell>
              <TableCell align="right">{q.active}</TableCell>
              <TableCell align="right">{q.pending}</TableCell>
              <TableCell align="right">{q.scheduled}</TableCell>
              <TableCell align="right">{q.retry}</TableCell>
              <TableCell align="right">{q.dead}</TableCell>
              <TableCell align="right">{q.processed}</TableCell>
              <TableCell align="right">{q.failed}</TableCell>
              <TableCell align="right">
                {q.paused ? (
                  <IconButton
                    color="secondary"
                    onClick={() => console.log("resume the queue", q.queue)}
                  >
                    <PlayCircleFilledIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    color="primary"
                    onClick={() => console.log("pause the queue", q.queue)}
                  >
                    <PauseCircleFilledIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className={classes.footerCell}>Total</TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.size}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.active}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.pending}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.scheduled}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.retry}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.dead}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.processed}
            </TableCell>
            <TableCell className={classes.footerCell} align="right">
              {total.failed}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

interface AggregateCounts {
  size: number;
  active: number;
  pending: number;
  scheduled: number;
  retry: number;
  dead: number;
  processed: number;
  failed: number;
}

function getAggregateCounts(queues: Queue[]): AggregateCounts {
  let total = {
    size: 0,
    active: 0,
    pending: 0,
    scheduled: 0,
    retry: 0,
    dead: 0,
    processed: 0,
    failed: 0,
  };
  queues.forEach((q) => {
    total.size += q.size;
    total.active += q.active;
    total.pending += q.pending;
    total.scheduled += q.scheduled;
    total.retry += q.retry;
    total.dead += q.dead;
    total.processed += q.processed;
    total.failed += q.failed;
  });
  return total;
}
