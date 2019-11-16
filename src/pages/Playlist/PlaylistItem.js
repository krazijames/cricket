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

import { useDeleteItemDialog } from './DeleteItemDialog';

export default withStyles((theme) => ({}))(function PlaylistItem({
  classes,
  playlistId,
  item,
  ...props
}) {
  const [DeleteDialog, openDeleteDialog] = useDeleteItemDialog();

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

      <DeleteDialog playlistId={playlistId} item={item} />
    </>
  );
});
