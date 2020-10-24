import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

interface Props {
  processed: number;
  failed: number;
}

const useStyles = makeStyles((theme) => ({
  countRow: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  countRowItem: {
    width: "50%",
    textAlign: "center",
  },
  errrateRow: {
    textAlign: "center",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
}));

export default function ErrorRatePanel(props: Props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography variant="h6" color="textSecondary">
        Today
      </Typography>
      <div className={classes.errrateRow}>
        <Typography component="p" variant="h5">
          {props.processed === 0
            ? "N/A"
            : (props.failed / props.processed).toFixed(4)}
        </Typography>
        <Typography color="textSecondary">Error Rate</Typography>
      </div>
      <Divider />
      <div className={classes.countRow}>
        <div className={classes.countRowItem}>
          <Typography component="p" variant="h5">
            {props.processed - props.failed}
          </Typography>
          <Typography color="textSecondary">Succeeded</Typography>
        </div>
        <div className={classes.countRowItem}>
          <Typography component="p" variant="h5">
            {props.failed}
          </Typography>
          <Typography color="textSecondary">Failed</Typography>
        </div>
      </div>
    </React.Fragment>
  );
}
