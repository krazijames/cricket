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

import { useAddItemDialog } from './AddItemDialog';
import itemMapper from './itemMapper';
import PlaylistItem from './PlaylistItem';
import PlaylistToolbar, { PlayerState } from './PlaylistToolbar';

const scrollDuration = 300;

const SortablePlaylistItem = SortableElement(function SortablePlaylistItem({
  item,
  ...props
}) {
  return (
    <ScrollElement name={item.id}>
      <PlaylistItem ContainerComponent="div" item={item} {...props} />
    </ScrollElement>
  );
});

const SortablePlaylist = SortableContainer(function SortablePlaylist({
  index,
  playlistId,
  items,
  currentItem,
  selectItem,
  ...props
}) {
  return (
    <List dense {...props}>
      {_.map(items, (item, index) => (
        <SortablePlaylistItem
          key={item.id}
          index={index}
          playlistId={playlistId}
          item={item}
          selected={currentItem && item.id === currentItem.id}
          onClick={selectItem(item)}
        />
      ))}
    </List>
  );
});

export default withStyles((theme) => ({
  root: {},
  contentContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  emptyMessageContainer: {
    flex: 1,
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',

    padding: theme.spacing(4),
    textAlign: 'center',
  },
  list: {
    marginBottom: '56vw',
  },
  toolbar: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    left: 0,
  },
  playlistToolbarSpacer: theme.mixins.toolbar,
}))(function Playlist({ classes }) {
  const { playlistId } = useParams();
  const [isPending, setIsPending] = React.useState();
  const [playlist, setPlaylist] = React.useState();
  const [items, setItems] = React.useState();
  const [currentItem, setCurrentItem] = React.useState();
  const [keepScrollToCurrentItem, setKeepScrollToCurrentItem] = React.useState(
    false,
  );

  const [
    AddItemDialog,
    openAddItemDalog,
    closeAddItemDialog,
  ] = useAddItemDialog();

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

  const toggleKeepScrollToCurrentItem = React.useCallback(() => {
    setKeepScrollToCurrentItem((prevState) => !prevState);
  }, []);

  React.useEffect(() => {
    if (!keepScrollToCurrentItem) {
      return;
    }

    scrollToCurrentItem();
  }, [keepScrollToCurrentItem, scrollToCurrentItem]);

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
      classes={{
        root: classes.root,
        contentContainer: classes.contentContainer,
      }}
      title={playlist ? playlist.name : 'Playlist'}
      showHomeButton
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
            className={classes.list}
            playlistId={playlistId}
            items={items}
            currentItem={currentItem}
            selectItem={selectItem}
            lockAxis="y"
            pressDelay={200}
            helperClass="sorting"
            useWindowAsScrollContainer
            onSortEnd={handleSortEnd}
          />
        ))}

      <div className={classes.playlistToolbarSpacer} />

      <PlaylistToolbar
        className={classes.toolbar}
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
          color: keepScrollToCurrentItem ? 'primary' : 'default',
          onClick: toggleKeepScrollToCurrentItem,
        }}
        scrollToBottomButtonProps={{
          onClick: scrollToBottom,
        }}
        addItemButtonProps={{
          onClick: openAddItemDalog,
        }}
        onStateChange={handlePlayerStateChange}
      />

      <AddItemDialog onOk={addItem} />
    </Page>
  );
});
