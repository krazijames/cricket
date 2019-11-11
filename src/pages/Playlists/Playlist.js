import React from 'react';
import {
  Card,
  CardHeader,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';

import EditPlaylistDialog from './EditPlaylistDialog';

export default withStyles((theme) => ({}))(function Playlist({
  playlist: { id, name },
  ...props
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  function onOpenMenuButtonClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function closeMenu() {
    setAnchorEl(null);
  }

  function onEditButtonClick() {
    closeMenu();
    setIsEditDialogOpen(true);
  }

  function closeEditDialog() {
    setIsEditDialogOpen(false);
  }

  return (
    <Card {...props}>
      <CardHeader
        title={name}
        action={
          <IconButton onClick={onOpenMenuButtonClick}>
            <MoreVertIcon />
          </IconButton>
        }
      />
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem onClick={onEditButtonClick}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Rename" />
        </MenuItem>
      </Menu>

      <EditPlaylistDialog
        playlist={{ id, name }}
        open={isEditDialogOpen}
        onClose={closeEditDialog}
      />
    </Card>
  );
});
