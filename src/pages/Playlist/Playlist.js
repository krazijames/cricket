import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import {
  Avatar,
  Fab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withStyles, useTheme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';

import { AsyncContainer, Page } from 'components';
import { paths } from 'data';

import AddItemDialog from './AddItemDialog';
import itemMapper from './itemMapper';

export default withStyles((theme) => ({
  root: {
    flex: 1,
    paddingBottom: theme.spacing(10),
  },
  progressContainer: {
    position: 'fixed',
  },
  emptyMessageContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',

    padding: theme.spacing(4),
    textAlign: 'center',
  },
  addItemButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}))(function Playlist({ classes }) {
  const theme = useTheme();
  const { playlistId } = useParams();
  const [isPending, setIsPending] = React.useState();
  const [playlist, setPlaylist] = React.useState();
  const [items, setItems] = React.useState([]);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = React.useState(false);

  function openAddItemDalog() {
    setIsAddItemDialogOpen(true);
  }

  function closeAddItemDialog() {
    setIsAddItemDialogOpen(false);
  }

  async function addItem(item) {
    try {
      setIsPending(true);
      closeAddItemDialog();
      firebase
        .firestore()
        .collection(`${paths.PLAYLISTS}/${playlistId}/${paths.PLAYLIST_ITEMS}`)
        .add({
          ...item,
          displayOrder: fp.isEmpty(items) ? 0 : fp.last(items).displayOrder + 1,
          createdAt: new Date(),
        });
    } finally {
      setIsPending(false);
    }
  }

  React.useEffect(() => {
    return firebase
      .firestore()
      .doc(`${paths.PLAYLISTS}/${playlistId}`)
      .onSnapshot((doc) => {
        setPlaylist({ id: doc.id, ...doc.data() });
      });
  }, [playlistId]);

  React.useEffect(() => {
    return firebase
      .firestore()
      .collection(`${paths.PLAYLISTS}/${playlistId}/${paths.PLAYLIST_ITEMS}`)
      .orderBy('displayOrder')
      .onSnapshot((querySnapshot) => {
        const newItems = [];

        querySnapshot.forEach((doc) => {
          newItems.push(
            itemMapper({
              id: doc.id,
              ...doc.data(),
            }),
          );
        });

        setItems(newItems);
      });
  }, [playlistId]);

  return (
    <Page
      title={playlist && playlist.name}
      component={AsyncContainer}
      classes={{
        root: classes.root,
        progressContainer: classes.progressContainer,
      }}
      progressProps={{ size: theme.spacing(10) }}
      loading={!playlist || !items || isPending}
    >
      {items &&
        (_.isEmpty(items) ? (
          <div className={classes.emptyMessageContainer}>
            <Typography variant="h5" color="textSecondary">
              Add New Item!
            </Typography>
          </div>
        ) : (
          <List dense>
            {_.map(items, (item) => (
              <ListItem key={item.mediaId} alignItems="flex-start" button>
                <ListItemAvatar>
                  <Avatar src={item.thumbnailUrl} variant="rounded" />
                </ListItemAvatar>
                <ListItemText primary={item.title} secondary={item.author} />
              </ListItem>
            ))}
          </List>
        ))}

      <Fab
        classes={{ root: classes.addItemButton }}
        color="primary"
        onClick={openAddItemDalog}
      >
        <AddIcon />
      </Fab>

      <AddItemDialog
        open={isAddItemDialogOpen}
        onOk={addItem}
        onClose={closeAddItemDialog}
      />
    </Page>
  );
});
