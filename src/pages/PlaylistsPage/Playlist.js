import { usePopover } from '@cricket/hooks';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import React from 'react';
import { Link } from 'react-router-dom';

import { useDeletePlaylistDialog } from './DeletePlaylistDialog';
import { useEditPlaylistDialog } from './EditPlaylistDialog';

export default withStyles((theme) => ({}))(function Playlists({
  classes,
  playlist,
  ...props
}) {
  const [
    DeletePlaylistDialog,
    openDeletePlaylistDialog,
  ] = useDeletePlaylistDialog();
  const [EditPlaylistDialog, openEditPlaylistDialog] = useEditPlaylistDialog();
  const [PlaylistMenu, openPlaylistMenu, closePlaylistMenu] = usePopover(Menu);

  const handleDeleteButtonClick = React.useCallback(() => {
    closePlaylistMenu();
    openDeletePlaylistDialog();
  }, [closePlaylistMenu, openDeletePlaylistDialog]);

  const handleEditButtonClick = React.useCallback(() => {
    closePlaylistMenu();
    openEditPlaylistDialog();
  }, [closePlaylistMenu, openEditPlaylistDialog]);

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
        <ListItemText primary={playlist.name} />
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={openPlaylistMenu}>
            <MoreVertIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      <PlaylistMenu>
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
      </PlaylistMenu>

      <EditPlaylistDialog playlist={playlist} />

      <DeletePlaylistDialog playlist={playlist} />
    </>
  );
});
