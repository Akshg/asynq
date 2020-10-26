import React, { useState } from "react";
import clsx from "clsx";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Slider from "@material-ui/core/Slider";
import DashboardIcon from "@material-ui/icons/Dashboard";
import LayersIcon from "@material-ui/icons/Layers";
import { paths } from "./paths";
import CronView from "./views/CronView";
import QueueDetailsView from "./views/QueueDetailsView";
import DashboardView from "./views/DashboardView";
import ListItemLink from "./components/ListItemLink";

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
  slider: {
    width: "200px",
    minWidth: "180px",
  },
  sliderLabel: {
    fontSize: "12px",
    paddingTop: "16px",
    paddingBottom: "4px",
  },
}));

const initialSliderValue = 4;

function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  // Note: We need to keep `sliderValue` and `pollInterval` distinct
  // to avoid changing `pollInterval` while user is using the slider the change the value.
  const [sliderValue, setSliderValue] = useState(initialSliderValue);
  const handleSliderValueChange = (event: any, val: number | number[]) => {
    setSliderValue(val as number);
  };
  const [pollInterval, setPollInterval] = useState(initialSliderValue);
  const handleSliderValueCommited = (event: any, val: number | number[]) => {
    setPollInterval(val as number);
  };
  return (
    <Router>
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classes.appBar}
          elevation={0}
          variant="outlined"
        >
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
            <div className={classes.slider}>
              <Typography
                gutterBottom
                color="primary"
                className={classes.sliderLabel}
              >
                Polling Interval (Every {sliderValue} seconds)
              </Typography>
              <Slider
                value={sliderValue}
                onChange={handleSliderValueChange}
                onChangeCommitted={handleSliderValueCommited}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                step={1}
                marks={true}
                min={2}
                max={20}
              />
            </div>
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
                <ListItemLink to="/cron" primary="Cron" icon={<LayersIcon />} />
              </div>
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Switch>
              <Route path={paths.QUEUE_DETAILS}>
                <QueueDetailsView pollInterval={pollInterval} />
              </Route>
              <Route path={paths.CRON}>
                <CronView />
              </Route>
              <Route path={paths.HOME}>
                <DashboardView pollInterval={pollInterval} />
              </Route>
            </Switch>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
