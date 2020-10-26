import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Chart, { HourlyStat } from "../components/Chart";
import Copyright from "../components/Copyright";
import CurrentStats from "../components/CurrentStats";
import ErrorRatePanel from "../components/ErrorRatePanel";
import HistoryStats from "../components/HistoryStats";
import { DailyStat, getQueue, Queue } from "../api";

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
}));

interface RouteParams {
  qname: string;
}

interface Props {
  pollInterval: number; // polling interval in seconds.
}

function QueueDetailsView(props: Props) {
  const classes = useStyles();
  const [queueInfo, setQueueInfo] = useState<Queue | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const { qname } = useParams<RouteParams>();

  useEffect(() => {
    const loadData = () => {
      getQueue(qname).then((data) => {
        setQueueInfo(data.current);
        setDailyStats(data.history);
      });
    };
    loadData();
    const handle = setInterval(loadData, props.pollInterval * 1000);
    return () => clearInterval(handle);
  }, [props.pollInterval, qname]);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Queue: {qname}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper} variant="outlined">
            <CurrentStats
              active={queueInfo !== null ? queueInfo.active : 0}
              pending={queueInfo !== null ? queueInfo.pending : 0}
              scheduled={queueInfo !== null ? queueInfo.scheduled : 0}
              retry={queueInfo !== null ? queueInfo.retry : 0}
              dead={queueInfo !== null ? queueInfo.dead : 0}
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
              processed={queueInfo !== null ? queueInfo.processed : 0}
              failed={queueInfo !== null ? queueInfo.failed : 0}
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper} variant="outlined">
            <HistoryStats data={dailyStats} />
          </Paper>
        </Grid>
      </Grid>
      <Box pt={4}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default QueueDetailsView;

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
