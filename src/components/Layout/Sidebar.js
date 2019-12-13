import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import React from 'react';
import { NavLink } from 'react-router-dom';

function MenuItem({ ...props }) {
  return (
    <ListItem
      component={NavLink}
      button
      activeClassName="Mui-selected"
      {...props}
    />
  );
}

export default withStyles((theme) => ({
  paper: {
    width: theme.app.sidebarWidth,
  },
}))(function Sidebar({ classes, onClose, ...props }) {
  return (
    <Drawer
      classes={{ paper: classes.paper }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      onClose={onClose}
      {...props}
    >
      <nav>
        <List>
          <MenuItem to="/" onClick={onClose}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </MenuItem>
        </List>
      </nav>
    </Drawer>
  );
});
