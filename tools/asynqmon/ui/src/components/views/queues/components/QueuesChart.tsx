import React, { ReactElement } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: 300,
  },
})

const data = [
  {
    name: 'default',
    active: 4,
    pending: 24,
    scheduled: 52,
    retry: 14,
    dead: 0,
  },
  {
    name: 'email',
    active: 10,
    pending: 24,
    scheduled: 42,
    retry: 4,
    dead: 0,
  },
  {
    name: 'critical',
    active: 4,
    pending: 19,
    scheduled: 2,
    retry: 14,
    dead: 4,
  },
  {
    name: 'low',
    active: 4,
    pending: 4,
    scheduled: 2,
    retry: 1,
    dead: 1,
  },
];

function QueuesChart(): ReactElement {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Legend />
          {/*  colors: https://www.color-hex.com/color-palette/700 */}
          <Bar dataKey="active" stackId="a" fill="#00b159" />
          <Bar dataKey="pending" stackId="a" fill="#00aedb" />
          <Bar dataKey="scheduled" stackId="a" fill="#ffc425" />
          <Bar dataKey="retry" stackId="a" fill="#f37735" />
          <Bar dataKey="dead" stackId="a" fill="#d11141" />
        </BarChart>

      </ResponsiveContainer>
    </div>
  );
}

export default QueuesChart;