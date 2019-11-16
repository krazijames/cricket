import React from 'react';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import EditPlaylistDialog from './EditPlaylistDialog';
import DeletePlaylistDialog from './DeletePlaylistDialog';

export default withStyles((theme) => ({}))(function Playlists({
  classes,
  playlist,
  count = 0,
  ...props
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState();

  const handleOpenMenuButtonClick = React.useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = React.useCallback(() => {
    setAnchorEl();
  }, []);

  const openDeleteDialog = React.useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = React.useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  const handleDeleteButtonClick = React.useCallback(() => {
    closeMenu();
    openDeleteDialog();
  }, [closeMenu, openDeleteDialog]);

  const openEditDialog = React.useCallback(() => {
    setIsEditDialogOpen(true);
  }, []);

  const closeEditDialog = React.useCallback(() => {
    setIsEditDialogOpen(false);
  }, []);

  const handleEditButtonClick = React.useCallback(() => {
    closeMenu();
    openEditDialog();
  }, [closeMenu, openEditDialog]);

  return (
    <>
      <ListItem
        component={Link}
        button
        to={`/playlist/${playlist.id}`}
        {...props}
      >
        <ListItemIcon>
          <VideoLibraryIcon />
        </ListItemIcon>
        <ListItemText primary={playlist.name} secondary={`${count} Items`} />
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={handleOpenMenuButtonClick}>
            <MoreVertIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem dense onClick={handleEditButtonClick}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>

        <MenuItem dense onClick={handleDeleteButtonClick}>
          <ListItemIcon>
            <CloseIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <EditPlaylistDialog
        open={isEditDialogOpen}
        playlist={playlist}
        onClose={closeEditDialog}
      />

      <DeletePlaylistDialog
        open={isDeleteDialogOpen}
        playlist={playlist}
        onClose={closeDeleteDialog}
      />
    </>
  );
});
