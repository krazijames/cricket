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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';
import { formatDistanceWithOptions } from 'date-fns/fp';
import { Link } from 'react-router-dom';

import DeletePlaylistDialog from './DeletePlaylistDialog';

export default withStyles((theme) => ({}))(function Playlists({
  classes,
  playlist,
  ...props
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

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

  const handleDeleteButtonClick = React.useCallback(async () => {
    closeMenu();
    openDeleteDialog();
  }, [closeMenu, openDeleteDialog]);

  return (
    <>
      <ListItem
        component={Link}
        button
        to={`/playlist/${playlist.id}`}
        {...props}
      >
        <ListItemText
          primary={playlist.name}
          secondary={formatDistanceWithOptions(
            { addSuffix: true },
            new Date(),
          )(playlist.createdAt.toDate())}
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={handleOpenMenuButtonClick}>
            <MoreVertIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem dense onClick={handleDeleteButtonClick}>
          <ListItemIcon>
            <CloseIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <DeletePlaylistDialog
        open={isDeleteDialogOpen}
        playlist={playlist}
        onClose={closeDeleteDialog}
      />
    </>
  );
});
