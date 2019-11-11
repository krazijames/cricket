import React from 'react';
import {
  AppBar as MuiAppBar,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/core/styles';

import Auth from './Auth';

export default withStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(0.5),
  },
  title: {
    flexGrow: 1,
  },
}))(function AppBar({ classes, children, onMenuButtonClick, ...props }) {
  return (
    <MuiAppBar position="fixed" {...props}>
      <Toolbar>
        <IconButton
          className={classes.menuButton}
          color="inherit"
          edge="start"
          onClick={onMenuButtonClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography className={classes.title} variant="h6">
          Cricket
        </Typography>

        <Auth />
      </Toolbar>
    </MuiAppBar>
  );
});
