import React, { ReactElement } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

interface Props {
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
  return (
    <div className={classes.root}>
      <div className={classes.item}>
        <Typography variant="h6">{props.active}</Typography>
        <Typography color="textSecondary">Active</Typography>
      </div>
      <div className={classes.item}>
        <Typography variant="h6">{props.pending}</Typography>
        <Typography color="textSecondary">Pending</Typography>
      </div>
      <div className={classes.item}>
        <Typography variant="h6">{props.scheduled}</Typography>
        <Typography color="textSecondary">Scheduled</Typography>
      </div>
      <div className={classes.item}>
        <Typography variant="h6">{props.retry}</Typography>
        <Typography color="textSecondary">Retry</Typography>
      </div>
      <div className={classes.item}>
        <Typography variant="h6">{props.dead}</Typography>
        <Typography color="textSecondary">Dead</Typography>
      </div>
    </div>
  );
}

export default CurrentStats;
