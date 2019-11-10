import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { withStyles } from '@material-ui/core/styles';

function MenuItem({ ...props }) {
  return <ListItem button {...props} />;
}

const Sidebar = withStyles((theme) => ({
  paper: {
    width: theme.app.sidebarWidth,
  },
}))(({ classes, onClose, ...props }) => {
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
          <MenuItem onClick={onClose}>
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

export default Sidebar;
