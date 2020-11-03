import React from "react";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
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
import SyntaxHighlighter from "react-syntax-highlighter";
import syntaxHighlightStyle from "react-syntax-highlighter/dist/esm/styles/hljs/github";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(
  id: string,
  type: string,
  payload: Object,
  workerStarted: string,
  timeBeforeDeadline: string
) {
  return { id, type, payload, workerStarted, timeBeforeDeadline };
}

const rows = [
  createData(
    "jklfdjasf12323kjkldsaf",
    "generate_thumbnail",
    { userId: 13 },
    "5s ago",
    "29m55s"
  ),
  createData("fdfdfadsfdaskl123232jk", "reindex", {}, "1m ago", "29m"),
  createData(
    "fdafkd12343l333333332l",
    "send_email",
    { userId: 23 },
    "1m ago",
    "14m"
  ),
  createData(
    "lklfdjasf12323kjkldsaf",
    "send_email",
    { userId: 32 },
    "3s ago",
    "29m57s"
  ),
  createData(
    "7klfdjasf12323kjkldsaf",
    "send_email",
    { userId: 123 },
    "10s ago",
    "2m50s"
  ),
  createData(
    "fdafkd62343l333333332l",
    "send_email",
    { userId: 23 },
    "1m ago",
    "14m"
  ),
  createData(
    "lklfdj9sf12323kjkldsaf",
    "send_email",
    { userId: 32 },
    "3s ago",
    "29m57s"
  ),
  createData(
    "7klfdjksf12323kjkldsaf",
    "send_email",
    { userId: 123 },
    "10s ago",
    "2m50s"
  ),
  createData(
    "fdafkd22343l333333332l",
    "send_email",
    { userId: 23 },
    "1m ago",
    "14m"
  ),
  createData(
    "lklfdjlsf12323kjkldsaf",
    "send_email",
    { userId: 32 },
    "3s ago",
    "29m57s"
  ),
  createData(
    "7klfdjisf12323kjkldsaf",
    "send_email",
    { userId: 123 },
    "10s ago",
    "2m50s"
  ),
];

function ActiveTasksTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table
        stickyHeader={true}
        className={classes.table}
        aria-label="active tasks table"
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Worker started</TableCell>
            <TableCell align="right">Time before Deadline</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 30, 60, 100]}
              colSpan={6}
              count={rows.length}
              rowsPerPage={rowsPerPage}
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

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  return (
    <React.Fragment>
      <TableRow key={row.id} className={classes.root}>
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
          {row.id}
        </TableCell>
        <TableCell align="right">{row.type}</TableCell>
        <TableCell align="right">{row.workerStarted}</TableCell>
        <TableCell align="right">{row.timeBeforeDeadline}</TableCell>
        <TableCell align="right">
          <Button>Cancel</Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Payload
              </Typography>
              <SyntaxHighlighter language="json" style={syntaxHighlightStyle}>
                {JSON.stringify(row.payload, null, 2)}
              </SyntaxHighlighter>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const usePaginationActionStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  })
);

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const classes = usePaginationActionStyles();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

export default ActiveTasksTable;
