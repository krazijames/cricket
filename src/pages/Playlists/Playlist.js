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

import { useEditPlaylistDialog } from './EditPlaylistDialog';
import { useDeletePlaylistDialog } from './DeletePlaylistDialog';

export default withStyles((theme) => ({}))(function Playlists({
  classes,
  playlist,
  count = 0,
  ...props
}) {
  const [
    DeletePlaylistDialog,
    openDeletePlaylistDialog,
  ] = useDeletePlaylistDialog();
  const [EditPlaylistDialog, openEditPlaylistDialog] = useEditPlaylistDialog();

  const [anchorEl, setAnchorEl] = React.useState();

  const handleOpenMenuButtonClick = React.useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = React.useCallback(() => {
    setAnchorEl();
  }, []);

  const handleDeleteButtonClick = React.useCallback(() => {
    closeMenu();
    openDeletePlaylistDialog();
  }, [closeMenu, openDeletePlaylistDialog]);

  const handleEditButtonClick = React.useCallback(() => {
    closeMenu();
    openEditPlaylistDialog();
  }, [closeMenu, openEditPlaylistDialog]);

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

      <EditPlaylistDialog playlist={playlist} />

      <DeletePlaylistDialog playlist={playlist} />
    </>
  );
});
