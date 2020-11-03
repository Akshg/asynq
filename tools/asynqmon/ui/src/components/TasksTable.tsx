import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ActiveTasksTable from "./ActiveTasksTable";
import PendingTasksTable from "./PendingTasksTable";
import ScheduledTasksTable from "./ScheduledTasksTable";
import RetryTasksTable from "./RetryTasksTable";
import DeadTasksTable from "./DeadTasksTable";
import { useHistory } from "react-router-dom";
import { tasksPath } from "../paths";

interface TabPanelProps {
  children?: React.ReactNode;
  selected: string; // currently selected value
  value: string; // tab panel will be shown if selected value equals to the value
}

const TabPanelRoot = styled.div`
  flex: 1;
`;

function TabPanel(props: TabPanelProps) {
  const { children, value, selected, ...other } = props;

  return (
    <TabPanelRoot
      role="tabpanel"
      hidden={value !== selected}
      id={`scrollable-auto-tabpanel-${selected}`}
      aria-labelledby={`scrollable-auto-tab-${selected}`}
      {...other}
    >
      {value === selected && children}
    </TabPanelRoot>
  );
}

function a11yProps(value: string) {
  return {
    id: `scrollable-auto-tab-${value}`,
    "aria-controls": `scrollable-auto-tabpanel-${value}`,
  };
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const TaskCount = styled.div`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;

const Heading = styled.div`
  opacity: 0.7;
  font-size: 1.7rem;
  font-weight: 500;
  background: #f5f7f9;
  padding-left: 28px;
  padding-top: 28px;
  padding-bottom: 28px;
`;

const PanelContainer = styled.div`
  padding: 24px;
  background: #ffffff;
  height: 100%;
`;

const TabsContainer = styled.div`
  background: #f5f7f9;
`;

const useStyles = makeStyles((theme) => ({
  heading: {
    padingLeft: theme.spacing(2),
  },
  tabsRoot: {
    paddingLeft: theme.spacing(2),
    background: theme.palette.background.default,
  },
  tabsIndicator: {
    right: "auto",
    left: "0",
  },
  tabroot: {
    width: "204px",
    textAlign: "left",
    padding: theme.spacing(2),
  },
  tabwrapper: {
    alignItems: "flex-start",
  },
  tabSelected: {
    background: theme.palette.common.white,
    boxShadow: theme.shadows[1],
  },
}));

interface Props {
  queue: string;
  selected: string;
}

function TasksTable(props: Props) {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Container>
      <TabsContainer>
        <Heading>Tasks</Heading>
        <Tabs
          value={props.selected}
          onChange={(_, value: string) =>
            history.push(tasksPath(props.queue, value))
          }
          aria-label="tasks table"
          orientation="vertical"
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
        >
          <Tab
            value="active"
            label="Active"
            icon={<TaskCount>0</TaskCount>}
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("active")}
          />
          <Tab
            value="pending"
            label="Pending"
            icon={<TaskCount>12</TaskCount>}
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("pending")}
          />
          <Tab
            value="scheduled"
            label="Scheduled"
            icon={<TaskCount>37</TaskCount>}
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("scheduled")}
          />
          <Tab
            value="retry"
            label="Retry"
            icon={<TaskCount>2</TaskCount>}
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("retry")}
          />
          <Tab
            value="dead"
            label="Dead"
            icon={<TaskCount>1</TaskCount>}
            classes={{
              root: classes.tabroot,
              wrapper: classes.tabwrapper,
              selected: classes.tabSelected,
            }}
            {...a11yProps("dead")}
          />
        </Tabs>
      </TabsContainer>
      <TabPanel value="active" selected={props.selected}>
        <PanelContainer>
          <ActiveTasksTable />
        </PanelContainer>
      </TabPanel>
      <TabPanel value="pending" selected={props.selected}>
        <PanelContainer>
          <PendingTasksTable />
        </PanelContainer>
      </TabPanel>
      <TabPanel value="scheduled" selected={props.selected}>
        <PanelContainer>
          <ScheduledTasksTable />
        </PanelContainer>
      </TabPanel>
      <TabPanel value="retry" selected={props.selected}>
        <PanelContainer>
          <RetryTasksTable />
        </PanelContainer>
      </TabPanel>
      <TabPanel value="dead" selected={props.selected}>
        <PanelContainer>
          <DeadTasksTable />
        </PanelContainer>
      </TabPanel>
    </Container>
  );
}

export default TasksTable;
