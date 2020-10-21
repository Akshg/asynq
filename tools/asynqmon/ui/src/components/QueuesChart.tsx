import React, { ReactElement } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Text
} from 'recharts';
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom"
import styled from "styled-components";
import { queueDetailsPath } from "../paths";
import { Queue } from '../api';

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: 300,
  },
})

interface Props {
  queues: Queue[],
};

function QueuesChart(props: Props): ReactElement {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={props.queues}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
          barSize={45}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" minTickGap={1} />
          <YAxis
            dataKey="queue"
            type="category"
            tick={LinkTick}
          />
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

interface RechartsTickProps {
  payload: {
    value: string;
  };
}

function LinkTick(props: RechartsTickProps) {
  return (
    <StyledLink to={queueDetailsPath(props.payload.value)}>
      <Text {...props}>
        {props.payload.value}
      </Text>
    </StyledLink>
  )
}

const StyledLink = styled(Link)`
  font-size: 16px;
  font-weight: 600;
  text-decoration: underline;
`;

export default QueuesChart;