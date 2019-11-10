import React from 'react';
import {
  AppBar as MuiAppBar,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/core/styles';

const AppBar = withStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(0.5),
  },
  title: {
    flexGrow: 1,
  },
}))(({ classes, children, onMenuButtonClick, ...props }) => {
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
      </Toolbar>
    </MuiAppBar>
  );
});

export default AppBar;
