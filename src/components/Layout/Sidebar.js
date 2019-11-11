import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import HomeIcon from '@material-ui/icons/Home';
import { withStyles } from '@material-ui/core/styles';
import { Link } from '@reach/router';

function MenuItem({ ...props }) {
  return <ListItem component={Link} button {...props} />;
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
          <MenuItem to="/" onClick={onClose}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </MenuItem>
          <MenuItem to="/playlist" onClick={onClose}>
            <ListItemIcon>
              <VideoLibraryIcon />
            </ListItemIcon>
            <ListItemText primary="Playlists" />
          </MenuItem>
        </List>
      </nav>
    </Drawer>
  );
});

export default Sidebar;
