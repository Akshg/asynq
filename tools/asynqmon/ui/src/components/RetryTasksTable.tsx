import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import SyntaxHighlighter from "react-syntax-highlighter";
import syntaxHighlightStyle from "react-syntax-highlighter/dist/esm/styles/hljs/github";
import { listRetryTasksAsync } from "../actions/tasksActions";
import { AppState } from "../store";
import { RetryTask } from "../api";
import TablePaginationActions, {
  defaultPageSize,
  rowsPerPageOptions,
} from "./TablePaginationActions";
import { durationBefore } from "../timeutil";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function mapStateToProps(state: AppState) {
  return {
    loading: state.tasks.retryTasks.loading,
    tasks: state.tasks.retryTasks.data,
    pollInterval: state.settings.pollInterval,
  };
}

const mapDispatchToProps = { listRetryTasksAsync };

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

interface Props {
  queue: string; // name of the queue.
  totalTaskCount: number; // totoal number of scheduled tasks.
}

function RetryTasksTable(props: Props & ReduxProps) {
  const { pollInterval, listRetryTasksAsync, queue } = props;
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const pageOpts = { page: page + 1, size: pageSize };
    listRetryTasksAsync(queue, pageOpts);
    const interval = setInterval(() => {
      listRetryTasksAsync(queue, pageOpts);
    }, pollInterval * 1000);
    return () => clearInterval(interval);
  }, [pollInterval, listRetryTasksAsync, queue, page, pageSize]);

  if (props.tasks.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        No retry tasks at this time.
      </Alert>
    );
  }

  const columns = [
    { label: "" },
    { label: "ID" },
    { label: "Type" },
    { label: "Retry In" },
    { label: "Last Error" },
    { label: "Retried" },
    { label: "Max Retry" },
    { label: "Actions" },
  ];

  return (
    <TableContainer component={Paper}>
      <Table
        stickyHeader={true}
        className={classes.table}
        aria-label="retry tasks table"
        size="small"
      >
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.label}>{col.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.tasks.map((task) => (
            <Row key={task.id} task={task} />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              colSpan={columns.length}
              count={props.totalTaskCount}
              rowsPerPage={pageSize}
              page={page}
              SelectProps={{
                inputProps: { "aria-label": "rows per page" },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Row(props: { task: RetryTask }) {
  const { task } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  return (
    <React.Fragment>
      <TableRow key={task.id} className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {task.id}
        </TableCell>
        <TableCell>{task.type}</TableCell>
        <TableCell>{durationBefore(task.next_process_at)}</TableCell>
        <TableCell>{task.error_message}</TableCell>
        <TableCell>{task.retried}</TableCell>
        <TableCell>{task.max_retry}</TableCell>
        <TableCell>
          <Button>Cancel</Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Payload
              </Typography>
              <SyntaxHighlighter language="json" style={syntaxHighlightStyle}>
                {JSON.stringify(task.payload, null, 2)}
              </SyntaxHighlighter>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default connector(RetryTasksTable);
