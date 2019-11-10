import React from 'react';
import {
  AppBar as MuiAppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/core/styles';
import { Link } from '@reach/router';

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
        <Button component={Link} to="signin">
          Sign In
        </Button>
      </Toolbar>
    </MuiAppBar>
  );
});

export default AppBar;
