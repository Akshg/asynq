import React, { ReactElement } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { DailyStat } from "../api";

interface Props {
  data: DailyStat[];
}

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: 300,
  },
});

function formatDate(timestamp: string): string {
  let date: number;
  try {
    date = Date.parse(timestamp);
  } catch (err) {
    console.error("could not parse timestamp:", timestamp);
    return "unkonwn-date";
  }
  return new Intl.DateTimeFormat("en-US").format(date);
}

function HistoryStats(props: Props): ReactElement {
  const theme = useTheme();
  const classes = useStyles();
  const chartData = props.data.map((stat) => ({
    ...stat,
    succeeded: stat.processed - stat.failed,
    date: formatDate(stat.date),
  }));
  return (
    <React.Fragment>
      <div>History</div>
      <div className={classes.container}>
        <ResponsiveContainer>
          <BarChart
            data={chartData.reverse()}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="succeeded"
              stackId="a"
              fill={theme.palette.success.light}
            />
            <Bar
              dataKey="failed"
              stackId="a"
              fill={theme.palette.error.light}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </React.Fragment>
  );
}

export default HistoryStats;
