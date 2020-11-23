import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import {
  listQueuesAsync,
  pauseQueueAsync,
  resumeQueueAsync,
} from "../actions/queuesActions";
import { AppState } from "../store";
import QueueSizeChart from "../components/QueueSizeChart";
import ProcessedTasksChart from "../components/ProcessedTasksChart";
import QueuesOverviewTable from "../components/QueuesOverviewTable";
import Tooltip from "../components/Tooltip";
import { getCurrentUTCDate } from "../timeutil";

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
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  chartContainer: {
    width: "100%",
    height: "300px",
  },
  infoIcon: {
    marginLeft: theme.spacing(1),
    color: theme.palette.grey[500],
    cursor: "pointer",
  },
  tooltipSection: {
    marginBottom: "4px",
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
            <div className={classes.chartHeader}>
              <Typography variant="h6">Queue Size</Typography>
              <Tooltip
                title={
                  <div>
                    <div className={classes.tooltipSection}>
                      Total number of tasks in the queue
                    </div>
                    <div className={classes.tooltipSection}>
                      <strong>Active</strong>: number of tasks currently being
                      processed
                    </div>
                    <div className={classes.tooltipSection}>
                      <strong>Pending</strong>: number of tasks ready to be
                      processed
                    </div>
                    <div className={classes.tooltipSection}>
                      <strong>Scheduled</strong>: number of tasks scheduled to
                      be processed in the future
                    </div>
                    <div className={classes.tooltipSection}>
                      <strong>Retry</strong>: number of tasks scheduled to be
                      retried in the future
                    </div>
                    <div>
                      <strong>Dead</strong>: number of tasks exhausted their
                      retries
                    </div>
                  </div>
                }
              >
                <InfoIcon fontSize="small" className={classes.infoIcon} />
              </Tooltip>
            </div>
            <div className={classes.chartContainer}>
              <QueueSizeChart data={queues} />
            </div>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper className={classes.paper} variant="outlined">
            <div className={classes.chartHeader}>
              <Typography variant="h6">Tasks Processed</Typography>
              <Tooltip
                title={
                  <div>
                    <div className={classes.tooltipSection}>
                      Total number of tasks processed today (
                      {getCurrentUTCDate()} UTC)
                    </div>
                    <div className={classes.tooltipSection}>
                      <strong>Succeeded</strong>: number of tasks successfully
                      processed from the queue
                    </div>
                    <div>
                      <strong>Failed</strong>: number of tasks failed to be
                      processed from the queue
                    </div>
                  </div>
                }
              >
                <InfoIcon fontSize="small" className={classes.infoIcon} />
              </Tooltip>
            </div>
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
