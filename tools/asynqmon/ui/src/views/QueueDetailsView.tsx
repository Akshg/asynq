import React, { useEffect } from "react";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import Typography from "@material-ui/core/Typography";
import Chart, { HourlyStat } from "../components/Chart";
import Copyright from "../components/Copyright";
import CurrentStats from "../components/CurrentStats";
import ErrorRatePanel from "../components/ErrorRatePanel";
import HistoryStats from "../components/HistoryStats";
import { getQueueAsync, pauseQueueAsync, resumeQueueAsync } from "../actions";
import { AppState } from "../store";
import { connect, ConnectedProps } from "react-redux";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  alignRight: {
    textAlign: "right",
  },
}));

interface RouteParams {
  qname: string;
}

function mapStateToProps(state: AppState) {
  return { queues: state.queues.data };
}

const mapDispatchToProps = {
  getQueueAsync,
  pauseQueueAsync,
  resumeQueueAsync,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  pollInterval: number; // polling interval in seconds.
};

function QueueDetailsView(props: Props) {
  const classes = useStyles();
  const { qname } = useParams<RouteParams>();
  const queueInfo = props.queues.find((q) => q.name === qname) || null;
  const { getQueueAsync, pollInterval } = props;

  useEffect(() => {
    getQueueAsync(qname);
    const interval = setInterval(
      () => getQueueAsync(qname),
      pollInterval * 1000
    );
    return () => clearInterval(interval);
  }, [pollInterval, qname, getQueueAsync]);

  const isPaused = queueInfo !== null && queueInfo.currentStats.paused;
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <Typography variant="h6">
            Queue: {qname}
            {isPaused ? " (paused)" : ""}
          </Typography>
        </Grid>
        <Grid item xs={2} className={classes.alignRight}>
          {isPaused ? (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PlayCircleFilledIcon />}
              onClick={() => props.resumeQueueAsync(qname)}
              disabled={queueInfo !== null && queueInfo.pauseRequestPending}
            >
              Resume
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PauseCircleFilledIcon />}
              onClick={() => props.pauseQueueAsync(qname)}
              disabled={queueInfo !== null && queueInfo.pauseRequestPending}
            >
              Pause
            </Button>
          )}
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper} variant="outlined">
            <CurrentStats
              active={queueInfo !== null ? queueInfo.currentStats.active : 0}
              pending={queueInfo !== null ? queueInfo.currentStats.pending : 0}
              scheduled={
                queueInfo !== null ? queueInfo.currentStats.scheduled : 0
              }
              retry={queueInfo !== null ? queueInfo.currentStats.retry : 0}
              dead={queueInfo !== null ? queueInfo.currentStats.dead : 0}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper} variant="outlined">
            <Chart data={hourlyData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper} variant="outlined">
            <ErrorRatePanel
              processed={
                queueInfo !== null ? queueInfo.currentStats.processed : 0
              }
              failed={queueInfo !== null ? queueInfo.currentStats.failed : 0}
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper} variant="outlined">
            <HistoryStats data={queueInfo !== null ? queueInfo.history : []} />
          </Paper>
        </Grid>
      </Grid>
      <Box pt={4}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default connector(QueueDetailsView);

function createDataPoint(
  time: string,
  succeeded: number,
  failed: number
): HourlyStat {
  return { time, succeeded, failed };
}

const hourlyData = [
  createDataPoint("00:00", 23, 0),
  createDataPoint("03:00", 50, 2),
  createDataPoint("06:00", 133, 7),
  createDataPoint("09:00", 194, 7),
  createDataPoint("12:00", 280, 80),
  createDataPoint("15:00", 359, 80),
  createDataPoint("18:00", 458, 80),
  createDataPoint("21:00", 589, 101),
  createDataPoint("24:00", 677, 122),
];
