import React from "react";
import clsx from "clsx";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import DashboardIcon from "@material-ui/icons/Dashboard";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import CronView from "./views/cron/CronView";
import DashboardView from "./views/dashboard/DashboardView";
import QueuesView from "./views/queues/QueuesView";
import ListItemLink from "./common/ListItemLink";

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: 36,
    color: theme.palette.grey[700],
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
    color: theme.palette.grey[800],
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  mainContainer: {
    display: "flex",
    width: "100vw",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  notification: {
    color: theme.palette.grey[700],
  },
}));

function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <Router>
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar} elevation={0} variant="outlined">
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Asynq Monitoring
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon className={classes.notification} />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.mainContainer}>
          <Drawer
            variant="permanent"
            classes={{
              paper: clsx(
                classes.drawerPaper,
                !open && classes.drawerPaperClose
              ),
            }}
            open={open}
          >
            <div className={classes.appBarSpacer} />
            <List>
              <div>
                <ListItemLink
                  to="/"
                  primary="Dashboard"
                  icon={<DashboardIcon />}
                />
                <ListItemLink
                  to="/queues"
                  primary="Queues"
                  icon={<BarChartIcon />}
                />
                <ListItemLink to="/cron" primary="Cron" icon={<LayersIcon />} />
              </div>
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Switch>
              <Route path="/queues">
                <QueuesView />
              </Route>
              <Route path="/cron">
                <CronView />
              </Route>
              <Route path="/">
                <DashboardView />
              </Route>
            </Switch>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
