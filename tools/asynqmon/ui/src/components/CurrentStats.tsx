import React, { ReactElement } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { tasksPath } from "../paths";

interface Props {
  queue: string; // name of the queue
  active: number;
  pending: number;
  scheduled: number;
  retry: number;
  dead: number;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "space-around",
  },
  item: {
    textAlign: "center",
  },
});

function CurrentStats(props: Props): ReactElement {
  const classes = useStyles();
  const { queue } = props;
  return (
    <div className={classes.root}>
      <Link to={tasksPath(queue, "active")} className={classes.item}>
        <Typography variant="h6">{props.active}</Typography>
        <Typography color="textSecondary">Active</Typography>
      </Link>
      <Link to={tasksPath(queue, "pending")} className={classes.item}>
        <Typography variant="h6">{props.pending}</Typography>
        <Typography color="textSecondary">Pending</Typography>
      </Link>
      <Link to={tasksPath(queue, "scheduled")} className={classes.item}>
        <Typography variant="h6">{props.scheduled}</Typography>
        <Typography color="textSecondary">Scheduled</Typography>
      </Link>
      <Link to={tasksPath(queue, "retry")} className={classes.item}>
        <Typography variant="h6">{props.retry}</Typography>
        <Typography color="textSecondary">Retry</Typography>
      </Link>
      <Link to={tasksPath(queue, "dead")} className={classes.item}>
        <Typography variant="h6">{props.dead}</Typography>
        <Typography color="textSecondary">Dead</Typography>
      </Link>
    </div>
  );
}

export default CurrentStats;
