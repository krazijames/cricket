import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import {
  Avatar,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';

import { Page } from 'components';
import { paths } from 'data';

import AddItemDialog from './AddItemDialog';
import itemMapper from './itemMapper';

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
        <IconButton onClick={onRemoveButtonClick}>
          <CloseIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
});
