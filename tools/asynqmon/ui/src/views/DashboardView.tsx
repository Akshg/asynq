import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { listQueuesAsync } from "../actions";
import QueuesOverviewTable from "../components/QueuesOverviewTable";
import { AppState } from "../store";

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
}));

function mapStateToProps(state: AppState) {
  return {
    loading: state.queues.loading,
    queues: state.queues.data.map((q) => q.currentStats),
  };
}

const mapDispatchToProps = {
  listQueuesAsync,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  pollInterval: number; // polling interval in seconds.
};

function DashboardView(props: Props) {
  const { pollInterval, listQueuesAsync, queues } = props;
  const classes = useStyles();

  useEffect(() => {
    listQueuesAsync();
    const interval = setInterval(listQueuesAsync, pollInterval * 1000);
    return () => clearInterval(interval);
  }, [pollInterval, listQueuesAsync]);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper} variant="outlined">
            {/* TODO: Add loading indicator  */}
            <QueuesOverviewTable queues={queues} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default connector(DashboardView);
