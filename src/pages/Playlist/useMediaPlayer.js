import React from 'react';
import _ from 'lodash';

import MediaPlayer, { PlayerState } from './MediaPlayer';

export default (items) => {
  const [currentItem, setCurrentItem] = React.useState();
  const [playerState, setPlayerState] = React.useState();
  const [shouldPlay, setShouldPlay] = React.useState(false);

  const playPrev = React.useCallback(() => {
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

    if (currentItemIndex < 0) {
      setCurrentItem(items[0]);
      return;
    }

    const prevItemIndex =
      (currentItemIndex - 1 + _.size(items)) % _.size(items);

    setCurrentItem(items[prevItemIndex]);
  }, [items, currentItem]);

  const play = React.useCallback(() => {
    if (_.isEmpty(items)) {
      return;
    }

    if (!currentItem) {
      setCurrentItem(items[0]);
    }

    setShouldPlay(true);
  }, [items, currentItem]);

  const pause = React.useCallback(() => {
    setShouldPlay(false);
  }, []);

  const togglePlayPause = React.useCallback(() => {
    if (playerState !== PlayerState.PLAYING) {
      play();
    } else {
      pause();
    }
  }, [playerState, play, pause]);

  const playNext = React.useCallback(() => {
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

    if (currentItemIndex < 0) {
      setCurrentItem(items[0]);
      return;
    }

    const nextItemIndex = (currentItemIndex + 1) % _.size(items);

    setCurrentItem(items[nextItemIndex]);
  }, [items, currentItem]);

  const handleStateChange = React.useCallback(
    (newState) => {
      setPlayerState(newState);
      setShouldPlay(newState !== PlayerState.PAUSED);

      switch (newState) {
        case PlayerState.ENDED:
          playNext();
          return;
        default:
          return;
      }
    },
    [playNext],
  );

  const playerProps = React.useRef();

  playerProps.current = {
    type: currentItem && currentItem.type,
    mediaId: currentItem && currentItem.mediaId,
    play: shouldPlay,
    onStateChange: handleStateChange,
  };

  const ControlledMediaPlayer = React.useCallback(
    function ControlledMediaPlayer({ ...props }) {
      return <MediaPlayer {...playerProps.current} {...props} />;
    },
    [],
  );

  return [
    ControlledMediaPlayer,
    {
      currentItem,
      setCurrentItem,
      playerState,
      playPrev,
      play,
      pause,
      togglePlayPause,
      playNext,
    },
  ];
};
