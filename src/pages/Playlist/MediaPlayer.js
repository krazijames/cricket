import React from 'react';
import { Card, IconButton, Toolbar } from '@material-ui/core';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
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
  toolbar: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
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
  controls: {
    flex: 1,
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

    if (player) {
      switch (playerState) {
        case PlayerState.PAUSED:
          player.playVideo();
          break;
        case PlayerState.PLAYING:
          player.pauseVideo();
          break;
        default:
          break;
      }
    }

    playPauseButtonProps.onClick();
  }, [playerState, playPauseButtonProps]);

  return (
    <Card square {...props}>
      <Toolbar className={classes.toolbar}>
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
          <IconButton {...prevButtonProps}>
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

          <IconButton {...nextButtonProps}>
            <SkipNextIcon />
          </IconButton>
        </div>

        <div>
          <IconButton>
            <MyLocationIcon />
          </IconButton>

          <IconButton>
            <VerticalAlignBottomIcon />
          </IconButton>

          <IconButton>
            <FullscreenIcon />
          </IconButton>
        </div>
      </Toolbar>
    </Card>
  );
});
