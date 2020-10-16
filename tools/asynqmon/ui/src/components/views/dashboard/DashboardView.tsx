import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chart, { HourlyStat } from "./components/Chart";
import Copyright from "./components/Copyright";
import CurrentStats from "./components/CurrentStats";
import ErrorRatePanel from "./components/ErrorRatePanel";
import HistoryStats from "./components/HistoryStats";

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

function DashboardView() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper} variant="outlined">
            <CurrentStats
              active={12}
              pending={40}
              scheduled={37}
              retry={5}
              dead={1}
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
            <ErrorRatePanel succeeded={12934} failed={23} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper} variant="outlined">
            <HistoryStats data={dailyStatsData} />
          </Paper>
        </Grid>
      </Grid>
      <Box pt={4}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default DashboardView;

const dailyStatsData = [
  {
    date: '2020-09-29', succeeded: 4000, failed: 2400,
  },
  {
    date: '2020-09-30', succeeded: 4000, failed: 2400,
  },
  {
    date: '2020-10-01', succeeded: 4000, failed: 2400,
  },
  {
    date: '2020-10-02', succeeded: 4000, failed: 2400,
  },
  {
    date: '2020-10-03', succeeded: 4000, failed: 2400,
  },
  {
    date: '2020-10-04', succeeded: 4000, failed: 2400,
  },
  {
    date: '2020-10-05', succeeded: 4000, failed: 2400,
  },
  {
    date: '2020-10-06', succeeded: 4000, failed: 2400,
  },
  {
    date: '2020-10-07', succeeded: 4000, failed: 2400,
  },
  {
    date: '2020-10-08', succeeded: 3000, failed: 1398,
  },
  {
    date: '2020-10-09', succeeded: 2000, failed: 9800,
  },
  {
    date: '2020-10-10', succeeded: 2780, failed: 3908,
  },
  {
    date: '2020-10-11', succeeded: 1890, failed: 4800,
  },
  {
    date: '2020-10-12', succeeded: 2390, failed: 3800,
  },
  {
    date: '2020-10-13', succeeded: 3490, failed: 4300
  },
  {
    date: '2020-10-14', succeeded: 3490, failed: 4300,
  },
  {
    date: '2020-10-15', succeeded: 3490, failed: 4300,
  },
  {
    date: '2020-10-16', succeeded: 3490, failed: 4300,
  },
  {
    date: '2020-10-17', succeeded: 3490, failed: 4300,
  },
];

function createDataPoint(time: string, succeeded: number, failed: number): HourlyStat {
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