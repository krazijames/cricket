import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import { Fab, List, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';

import { Page } from 'components';
import { paths } from 'data';

import AddItemDialog from './AddItemDialog';
import itemMapper from './itemMapper';
import PlaylistItem from './PlaylistItem';
import MediaPlayer, { PlayerState } from './MediaPlayer';

export default withStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(10),
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
    right: theme.spacing(1),
    bottom: theme.spacing(1.5),
    zIndex: theme.zIndex.appBar,
  },
  mediaPlayer: {
    position: 'fixed',
    right: theme.spacing(7),
    bottom: theme.spacing(1),
    left: theme.spacing(1),
  },
}))(function Playlist({ classes }) {
  const { playlistId } = useParams();
  const [isPending, setIsPending] = React.useState();
  const [playlist, setPlaylist] = React.useState();
  const [items, setItems] = React.useState();
  const [currentItem, setCurrentItem] = React.useState();
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = React.useState(false);

  const openAddItemDalog = React.useCallback(() => {
    setIsAddItemDialogOpen(true);
  }, []);

  const closeAddItemDialog = React.useCallback(() => {
    setIsAddItemDialogOpen(false);
  }, []);

  const addItem = React.useCallback(
    async ({ type, data }) => {
      try {
        setIsPending(true);
        closeAddItemDialog();
        firebase
          .firestore()
          .collection(
            `${paths.PLAYLISTS}/${playlistId}/${paths.PLAYLIST_ITEMS}`,
          )
          .add({
            type,
            data,
            displayOrder: fp.isEmpty(items)
              ? 0
              : fp.last(items).displayOrder + 1,
            createdAt: new Date(),
          });
      } finally {
        setIsPending(false);
      }
    },
    [playlistId, items, closeAddItemDialog],
  );

  const removeItem = React.useCallback(
    ({ id }) => {
      return async () => {
        try {
          setIsPending(true);
          await firebase
            .firestore()
            .doc(
              `${paths.PLAYLISTS}/${playlistId}/${paths.PLAYLIST_ITEMS}/${id}`,
            )
            .delete();
        } finally {
          setIsPending(false);
        }
      };
    },
    [playlistId],
  );

  const selectItem = React.useCallback((item) => {
    return () => {
      setCurrentItem(item);
    };
  }, []);

  const playPrevItem = React.useCallback(() => {
    if (_.isEmpty(items)) {
      return;
    }

    if (!currentItem) {
      setCurrentItem(items[0]);
      return;
    }

    const currentItemIndex = _.findIndex(
      items,
      ({ id }) => id === currentItem.id,
    );
    const prevItemIndex =
      (currentItemIndex - 1 + _.size(items)) % _.size(items);

    setCurrentItem(items[prevItemIndex]);
  }, [items, currentItem]);

  const playNextItem = React.useCallback(() => {
    if (_.isEmpty(items)) {
      return;
    }

    if (!currentItem) {
      setCurrentItem(items[0]);
      return;
    }

    const currentItemIndex = _.findIndex(
      items,
      ({ id }) => id === currentItem.id,
    );
    const nextItemIndex = (currentItemIndex + 1) % _.size(items);

    setCurrentItem(items[nextItemIndex]);
  }, [items, currentItem]);

  const handlePlayerStateChange = React.useCallback(
    (playerState) => {
      switch (playerState) {
        case PlayerState.ENDED:
          playNextItem();
          return;
        default:
          return;
      }
    },
    [playNextItem],
  );

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
      className={classes.root}
      title={playlist && playlist.name}
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
              <PlaylistItem
                key={item.id}
                item={item}
                selected={currentItem && item.id === currentItem.id}
                onClick={selectItem(item)}
                onRemoveButtonClick={removeItem(item)}
              />
            ))}
          </List>
        ))}

      <MediaPlayer
        className={classes.mediaPlayer}
        // style={{ display: currentItem ? 'block' : 'none' }}
        type={currentItem && currentItem.type}
        mediaId={currentItem && currentItem.mediaId}
        prevButtonProps={{
          disabled: _.size(items) < 2,
          onClick: playPrevItem,
        }}
        playPauseButtonProps={{
          disabled: _.isEmpty(items),
        }}
        nextButtonProps={{
          disabled: _.size(items) < 2,
          onClick: playNextItem,
        }}
        onStateChange={handlePlayerStateChange}
      />

      <Fab
        classes={{ root: classes.addItemButton }}
        size="small"
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
