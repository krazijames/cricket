import React from 'react';
import { Card, IconButton, Toolbar } from '@material-ui/core';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { withStyles } from '@material-ui/core/styles';
import YouTube from 'react-youtube';

import { AsyncContainer } from 'components';

export const PlayerState = {
  UNSTARTED: 'unstarted',
  ENDED: 'ended',
  PLAYING: 'playing',
  PAUSED: 'paused',
  BUFFERING: 'buffering',
  CUED: 'cued',
};

function mapYouTubePlayerState(youTubePlayerState) {
  switch (youTubePlayerState) {
    case YouTube.PlayerState.UNSTARTED:
      return PlayerState.UNSTARTED;
    case YouTube.PlayerState.ENDED:
      return PlayerState.ENDED;
    case YouTube.PlayerState.PLAYING:
      return PlayerState.PLAYING;
    case YouTube.PlayerState.PAUSED:
      return PlayerState.PAUSED;
    case YouTube.PlayerState.BUFFERING:
      return PlayerState.BUFFERING;
    case YouTube.PlayerState.CUED:
      return PlayerState.CUED;
    default:
      return;
  }
}

const youtubeOptions = {
  width: '100%',
  height: '100%',
  allow: 'autoplay; fullscreen',
  allowFullScreen: true,
  playerVars: {
    autoplay: 1,
    playsinline: 1,
    controls: 0,
    showinfo: 0,
    modestbranding: 1,
  },
};

export default withStyles((theme) => ({
  youTubeContainer: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
    opacity: 0,
  },
  youTube: {},
  exitFullscreenButton: {
    position: 'fixed',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
}))(function MediaPlayer({
  classes,
  type,
  mediaId,
  fullscreen,
  prevButtonProps,
  playPauseButtonProps,
  nextButtonProps,
  onStateChange = () => {},
  ...props
}) {
  const [playerState, setPlayerState] = React.useState();

  const playerRef = React.useRef();

  const handleReady = React.useCallback((event) => {
    playerRef.current = event.target;
  }, []);

  const handleStateChange = React.useCallback(
    (event) => {
      const newState = mapYouTubePlayerState(event.target.getPlayerState());
      setPlayerState(newState);
      onStateChange(newState);
    },
    [onStateChange],
  );

  const handlePlayPauseButtonClick = React.useCallback(() => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    switch (playerState) {
      case PlayerState.PAUSED:
        player.playVideo();
        return;
      case PlayerState.PLAYING:
        player.pauseVideo();
        return;
      default:
        return;
    }
  }, [playerState]);

  return (
    <Card {...props}>
      <Toolbar>
        <div className={classes.youTubeContainer}>
          <YouTube
            containerClassName={classes.youTube}
            videoId={mediaId}
            opts={youtubeOptions}
            onReady={handleReady}
            onStateChange={handleStateChange}
          />
        </div>

        <div className={classes.controls}>
          <IconButton size="small" {...prevButtonProps}>
            <SkipPreviousIcon />
          </IconButton>

          <AsyncContainer
            display="inline-flex"
            loading={playerState === PlayerState.BUFFERING}
            loadingContentOpacity={0}
          >
            <IconButton
              {...playPauseButtonProps}
              onClick={handlePlayPauseButtonClick}
            >
              {playerState === PlayerState.PLAYING ? (
                <PauseIcon />
              ) : (
                <PlayArrowIcon />
              )}
            </IconButton>
          </AsyncContainer>

          <IconButton size="small" {...nextButtonProps}>
            <SkipNextIcon />
          </IconButton>
        </div>
      </Toolbar>
    </Card>
  );
});
