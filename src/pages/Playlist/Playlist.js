import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import { List, Typography } from '@material-ui/core';
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
import { NotFound } from 'pages';

import { useAddItemDialog } from './AddItemDialog';
import itemMapper from './itemMapper';
import PlaylistItem from './PlaylistItem';
import PlaylistToolbar from './PlaylistToolbar';
import useMediaPlayer from './useMediaPlayer';

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
  playlistToolbarSpacer: theme.mixins.toolbar,
  toolbar: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    left: 0,
  },
  mediaPlayerContainer: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
  },
  mediaPlayer: {
    height: '56vw',

    opacity: 0,
    transition: 'opacity .3s',
  },
  mediaPlayerVisible: {
    opacity: 1,
    pointerEvents: 'auto',
  },
}))(function Playlist({ classes }) {
  const { playlistId } = useParams();
  const [isPending, setIsPending] = React.useState();
  const [playlist, setPlaylist] = React.useState();
  const [items, setItems] = React.useState();
  const [keepScrollToCurrentItem, setKeepScrollToCurrentItem] = React.useState(
    false,
  );
  const [isMediaPlayerVisible, setIsMediaPlayerVisible] = React.useState(false);

  const [
    MediaPlayer,
    {
      currentItem,
      setCurrentItem,
      playerState,
      playPrev,
      togglePlayPause,
      playNext,
    },
  ] = useMediaPlayer(items);

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

  const selectItem = React.useCallback(
    (item) => {
      return () => {
        setCurrentItem(item);
      };
    },
    [setCurrentItem],
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

  const toggleMediaPlayerVisible = React.useCallback(() => {
    setIsMediaPlayerVisible((prevState) => !prevState);
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
        setPlaylist({ id: doc.id, exists: doc.exists, ...doc.data() });
      });
  }, [playlistId]);

  React.useEffect(() => {
    return firebase
      .firestore()
      .collection(`${paths.PLAYLISTS}/${playlistId}/${paths.PLAYLIST_ITEMS}`)
      .orderBy('displayOrder')
      .onSnapshot((querySnapshot) => {
        setItems(
          fp.flow(
            fp.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })),
            fp.map(itemMapper),
          )(querySnapshot.docs),
        );
      });
  }, [playlistId]);

  if (playlist && !playlist.exists) {
    return <NotFound />;
  }

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
        mediaPlayerState={playerState}
        prevButtonProps={{
          disabled: _.size(items) < 2 || !currentItem,
          onClick: playPrev,
        }}
        playPauseButtonProps={{
          disabled: _.isEmpty(items),
          onClick: togglePlayPause,
        }}
        nextButtonProps={{
          disabled: _.size(items) < 2 || !currentItem,
          onClick: playNext,
        }}
        toggleVideoButtonProps={{
          color: isMediaPlayerVisible ? 'primary' : 'default',
          onClick: toggleMediaPlayerVisible,
        }}
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
      />

      <div className={classes.mediaPlayerContainer}>
        <MediaPlayer
          containerClassName={`${classes.mediaPlayer} ${isMediaPlayerVisible &&
            classes.mediaPlayerVisible}`}
        />
        <div className={classes.playlistToolbarSpacer} />
      </div>

      <AddItemDialog onOk={addItem} />
    </Page>
  );
});
