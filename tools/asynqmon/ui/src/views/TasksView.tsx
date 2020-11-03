import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TasksTable from "../components/TasksTable";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: 0,
    height: "100%",
  },
  gridContainer: {
    height: "100%",
    paddingBottom: 0,
  },
  gridItem: {
    height: "100%",
    paddingBottom: 0,
  },
}));

interface RouteParams {
  qname: string;
  state: string;
}

function TasksView() {
  const classes = useStyles();
  const { state: selectedState, qname } = useParams<RouteParams>();
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={0} className={classes.gridContainer}>
        <Grid item xs={12} className={classes.gridItem}>
          <TasksTable queue={qname} selected={selectedState} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default TasksView;
