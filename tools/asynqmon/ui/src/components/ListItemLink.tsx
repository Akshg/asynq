import React, { ReactElement } from "react";
import clsx from "clsx";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import {
  useRouteMatch,
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

const useStyles = makeStyles({
  selected: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
});

interface Props {
  to: string;
  primary: string;
  icon?: ReactElement;
}

// Note: See https://material-ui.com/guides/composition/ for details.
function ListItemLink(props: Props): ReactElement {
  const classes = useStyles();
  const { icon, primary, to } = props;
  const isMatch = useRouteMatch({
    path: to,
    strict: true,
    sensitive: true,
    exact: true,
  });
  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<RouterLinkProps, "to">>((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );
  return (
    <li>
      <ListItem
        button
        component={renderLink}
        className={clsx(isMatch && classes.selected)}
      >
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

export default ListItemLink;
