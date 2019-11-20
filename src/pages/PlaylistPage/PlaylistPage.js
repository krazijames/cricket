import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';
import { animateScroll as scroll } from 'react-scroll';

import { Page } from 'components';
import { paths } from 'data';
import { NotFoundPage } from 'pages';

import { useAddItemDialog } from './AddItemDialog';
import itemMapper from './itemMapper';
import PlaylistToolbar from './PlaylistToolbar';
import useMediaPlayer from './useMediaPlayer';
import Playlist from './Playlist';

const scrollDuration = 300;

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
    maxHeight: '50vh',

    opacity: 0,
    transition: 'opacity .3s',
  },
  mediaPlayerVisible: {
    opacity: 1,
    pointerEvents: 'auto',
  },
}))(function PlaylistPage({ classes }) {
  const { playlistId } = useParams();
  const [isPending, setIsPending] = React.useState();
  const [error, setError] = React.useState();
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
          .collection(`${paths.PLAYLISTS}/${playlistId}/${paths.ITEMS}`)
          .add({
            type,
            data,
            displayOrder: fp.isEmpty(items)
              ? 0
              : fp.last(items).displayOrder + 1,
            createdAt: new Date(),
          });
        scrollToBottom();
      } catch (error) {
        setError(error);
      } finally {
        setIsPending(false);
      }
    },
    [playlistId, items, closeAddItemDialog, scrollToBottom],
  );

  const toggleKeepScrollToCurrentItem = React.useCallback(() => {
    setKeepScrollToCurrentItem((prevState) => !prevState);
  }, []);

  const toggleMediaPlayerVisible = React.useCallback(() => {
    setIsMediaPlayerVisible((prevState) => !prevState);
  }, []);

  React.useEffect(
    function subscribePlaylist() {
      return firebase
        .firestore()
        .doc(`${paths.PLAYLISTS}/${playlistId}`)
        .onSnapshot((doc) => {
          setPlaylist({ id: doc.id, exists: doc.exists, ...doc.data() });
        }, setError);
    },
    [playlistId],
  );

  React.useEffect(
    function subscribePlaylistItems() {
      return firebase
        .firestore()
        .collection(`${paths.PLAYLISTS}/${playlistId}/${paths.ITEMS}`)
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
        }, setError);
    },
    [playlistId],
  );

  if (playlist && !playlist.exists) {
    return <NotFoundPage />;
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
      error={error}
    >
      {items &&
        (_.isEmpty(items) ? (
          <div className={classes.emptyMessageContainer}>
            <Typography variant="h5" color="textSecondary">
              Add New Item!
            </Typography>
          </div>
        ) : (
          <Playlist
            className={classes.list}
            playlistId={playlistId}
            items={items}
            currentItem={currentItem}
            keepScrollToCurrentItem={keepScrollToCurrentItem}
            onItemClick={setCurrentItem}
            onItemSorted={setItems}
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
            currentItem &&
            classes.mediaPlayerVisible}`}
        />
        <div className={classes.playlistToolbarSpacer} />
      </div>

      <AddItemDialog onOk={addItem} />
    </Page>
  );
});
