import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { fetchQueues, Queue } from "../api";
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
}))

interface Props {
  pollInterval: number; // polling interval in seconds.
};

function DashboardView(props: Props) {
  const classes = useStyles();
  const [queues, setQueues] = useState<Queue[]>([]);

  useEffect(() => {
    const loadQueues = () => {
      fetchQueues().then(data => {
        setQueues(data.queues);
      });
    };
    loadQueues();
    const handle = setInterval(loadQueues, props.pollInterval * 1000)
    return () => clearInterval(handle);
  }, [props.pollInterval]);

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

export default DashboardView;
