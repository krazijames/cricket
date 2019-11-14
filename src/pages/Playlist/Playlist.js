import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import { Fab, List, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';
import {
  Element as ScrollElement,
  animateScroll as scroll,
  scroller,
} from 'react-scroll';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';

import { Page } from 'components';
import { paths } from 'data';

import AddItemDialog from './AddItemDialog';
import itemMapper from './itemMapper';
import PlaylistItem from './PlaylistItem';
import MediaPlayer, { PlayerState } from './MediaPlayer';

const scrollDuration = 300;

const SortablePlaylistItem = SortableElement(({ item, ...props }) => (
  <ScrollElement name={item.id}>
    <PlaylistItem ContainerComponent="div" item={item} {...props} />
  </ScrollElement>
));

const SortablePlaylist = SortableContainer(
  ({ index, items, currentItem, selectItem, removeItem, ...props }) => (
    <List dense {...props}>
      {_.map(items, (item, index) => (
        <SortablePlaylistItem
          key={item.id}
          index={index}
          item={item}
          selected={currentItem && item.id === currentItem.id}
          onClick={selectItem(item)}
          onRemoveButtonClick={removeItem(item)}
        />
      ))}
    </List>
  ),
);

export default withStyles((theme) => ({
  root: {
    paddingBottom: 'calc(56vw + 60px)',
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
  mediaPlayer: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    left: 0,
  },
  mediaPlayerToolbar: {
    paddingRight: theme.spacing(8),
  },
  addItemButton: {
    position: 'fixed',
    right: theme.spacing(1),
    bottom: theme.spacing(1),
    zIndex: theme.zIndex.appBar,
  },
}))(function Playlist({ classes }) {
  const { playlistId } = useParams();
  const [isPending, setIsPending] = React.useState();
  const [playlist, setPlaylist] = React.useState();
  const [items, setItems] = React.useState();
  const [currentItem, setCurrentItem] = React.useState();
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = React.useState(false);

  const scrollToCurrentItem = React.useCallback(() => {
    if (!currentItem) {
      return;
    }

    scroller.scrollTo(currentItem.id, {
      duration: scrollDuration,
      smooth: true,
      offset: -100,
    });
  }, [currentItem]);

  const scrollToBottom = React.useCallback(() => {
    scroll.scrollToBottom({
      duration: scrollDuration,
    });
  }, []);

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
        await firebase
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
        scrollToBottom();
      } finally {
        setIsPending(false);
      }
    },
    [playlistId, items, closeAddItemDialog, scrollToBottom],
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

  const PlayItem = React.useCallback(() => {
    if (_.isEmpty(items)) {
      return;
    }

    if (!currentItem) {
      setCurrentItem(items[0]);
    }
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

  const handleSortEnd = React.useCallback(
    async ({ oldIndex, newIndex }) => {
      const sortedItems = _.map(
        arrayMove(items, oldIndex, newIndex),
        (item, index) => ({
          ...item,
          displayOrder: index,
        }),
      );

      setItems(sortedItems);

      const db = firebase.firestore();
      const batch = db.batch();
      _.forEach(sortedItems, (item) => {
        batch.update(
          db
            .collection(
              `${paths.PLAYLISTS}/${playlistId}/${paths.PLAYLIST_ITEMS}`,
            )
            .doc(item.id),
          {
            displayOrder: item.displayOrder,
          },
        );
      });
      await batch.commit();
    },
    [playlistId, items],
  );

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
          <SortablePlaylist
            items={items}
            currentItem={currentItem}
            selectItem={selectItem}
            removeItem={removeItem}
            lockAxis="y"
            pressDelay={200}
            helperClass="sorting"
            useWindowAsScrollContainer
            onSortEnd={handleSortEnd}
          />
        ))}

      <MediaPlayer
        classes={{
          root: classes.mediaPlayer,
          toolbar: classes.mediaPlayerToolbar,
        }}
        // style={{ display: currentItem ? 'block' : 'none' }}
        type={currentItem && currentItem.type}
        mediaId={currentItem && currentItem.mediaId}
        prevButtonProps={{
          disabled: _.size(items) < 2 || !currentItem,
          onClick: playPrevItem,
        }}
        playPauseButtonProps={{
          disabled: _.isEmpty(items),
          onClick: PlayItem,
        }}
        nextButtonProps={{
          disabled: _.size(items) < 2 || !currentItem,
          onClick: playNextItem,
        }}
        toggleVideoButtonProps={{}}
        scrollToCurrentItemButtonProps={{
          disabled: !currentItem,
          onClick: scrollToCurrentItem,
        }}
        scrollToBottomButtonProps={{
          onClick: scrollToBottom,
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
