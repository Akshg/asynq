import React, { ReactElement } from "react";
import { useTheme } from "@material-ui/core/styles";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

export interface HourlyStat {
  time: string;
  succeeded: number;
  failed: number,
}

interface Props {
  data: HourlyStat[],
}

export default function Chart(props: Props): ReactElement {
  const theme = useTheme();

  return (
    <React.Fragment>
      <div>Today</div>
      <ResponsiveContainer>
        <LineChart
          data={props.data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="succeeded"
            stroke={theme.palette.success.main}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="failed"
            stroke={theme.palette.error.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
