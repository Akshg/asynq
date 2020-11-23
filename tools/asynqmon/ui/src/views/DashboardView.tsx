import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {
  listQueuesAsync,
  pauseQueueAsync,
  resumeQueueAsync,
} from "../actions/queuesActions";
import { AppState } from "../store";
import QueueSizeChart from "../components/QueueSizeChart";
import ProcessedTasksChart from "../components/ProcessedTasksChart";
import QueuesOverviewTable from "../components/QueuesOverviewTable";

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
  chartHeader: {
    marginBottom: theme.spacing(2),
  },
  chartContainer: {
    width: "100%",
    height: "300px",
  },
}));

function mapStateToProps(state: AppState) {
  return {
    loading: state.queues.loading,
    queues: state.queues.data.map((q) => ({
      ...q.currentStats,
      pauseRequestPending: q.pauseRequestPending,
    })),
    pollInterval: state.settings.pollInterval,
  };
}

const mapDispatchToProps = {
  listQueuesAsync,
  pauseQueueAsync,
  resumeQueueAsync,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

function DashboardView(props: Props) {
  const { pollInterval, listQueuesAsync, queues } = props;
  const classes = useStyles();

  useEffect(() => {
    listQueuesAsync();
    const interval = setInterval(listQueuesAsync, pollInterval * 1000);
    return () => clearInterval(interval);
  }, [pollInterval, listQueuesAsync]);

  const processedStats = queues.map((q) => ({
    queue: q.queue,
    succeeded: q.processed - q.failed,
    failed: q.failed,
  }));

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper className={classes.paper} variant="outlined">
            <Typography variant="h6" className={classes.chartHeader}>
              Queue Size
            </Typography>
            <div className={classes.chartContainer}>
              <QueueSizeChart data={queues} />
            </div>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper className={classes.paper} variant="outlined">
            <Typography variant="h6" className={classes.chartHeader}>
              Tasks Processed
            </Typography>
            <div className={classes.chartContainer}>
              <ProcessedTasksChart data={processedStats} />
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper className={classes.paper} variant="outlined">
            {/* TODO: Add loading indicator  */}
            <QueuesOverviewTable
              queues={queues}
              onPauseClick={props.pauseQueueAsync}
              onResumeClick={props.resumeQueueAsync}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default connector(DashboardView);
