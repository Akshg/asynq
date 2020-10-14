import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import CronView from "./CronView";
import DashboardView from "./DashboardView";
import QueuesView from "./QueuesView";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/queues">Queues</Link>
            </li>
            <li>
              <Link to="/cron">Cron</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
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
      </div>
    </Router>
  );
}

export default App;
