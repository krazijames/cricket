import React from 'react';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

import DeleteItemDialog from './DeleteItemDialog';

export default withStyles((theme) => ({}))(function PlaylistItem({
  classes,
  playlistId,
  item,
  ...props
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const openDeleteDialog = React.useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = React.useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  return (
    <>
      <ListItem alignItems="flex-start" button {...props}>
        <ListItemAvatar>
          <Avatar src={item.thumbnailUrl} variant="rounded" />
        </ListItemAvatar>
        <ListItemText primary={item.title} secondary={item.author} />
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={openDeleteDialog}>
            <CloseIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      <DeleteItemDialog
        open={isDeleteDialogOpen}
        playlistId={playlistId}
        item={item}
        onClose={closeDeleteDialog}
      />
    </>
  );
});
