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

export default withStyles((theme) => ({}))(function PlaylistItem({
  classes,
  item,
  onRemoveButtonClick,
  ...props
}) {
  return (
    <ListItem alignItems="flex-start" button {...props}>
      <ListItemAvatar>
        <Avatar src={item.thumbnailUrl} variant="rounded" />
      </ListItemAvatar>
      <ListItemText primary={item.title} secondary={item.author} />
      <ListItemSecondaryAction>
        <IconButton size="small" onClick={onRemoveButtonClick}>
          <CloseIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
});
