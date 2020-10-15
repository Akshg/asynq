import React from "react";
import Typography from "@material-ui/core/Typography";

interface Props {
  children: JSX.Element | string;
}

export default function Title(props: Props) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}
