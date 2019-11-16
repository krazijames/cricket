import React from 'react';
import {
  AppBar as MuiAppBar,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import Auth from './Auth';

export default withStyles((theme) => ({
  primaryButton: {
    marginRight: theme.spacing(0.5),
  },
  title: {
    flexGrow: 1,
    marginRight: theme.spacing(1),
  },
}))(function AppBar({
  classes,
  title,
  primaryButtonProps,
  children,
  ...props
}) {
  return (
    <MuiAppBar position="fixed" {...props}>
      <Toolbar>
        <IconButton
          classes={{ root: classes.primaryButton }}
          color="inherit"
          edge="start"
          {...primaryButtonProps}
        />

        <Typography className={classes.title} variant="h6" noWrap>
          {title}
        </Typography>

        <Auth />
      </Toolbar>
    </MuiAppBar>
  );
});
