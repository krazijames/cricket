import React from 'react';
import { Card, IconButton, Toolbar } from '@material-ui/core';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
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
    controls: 1,
    modestbranding: 1,
  },
};

export default withStyles((theme) => ({
  root: {
    overflow: 'visible',
  },
  toolbar: {
    position: 'relative',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  youTubeContainer: {
    position: 'absolute',
    top: '-56vw',
    right: 0,
    left: 0,

    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity .3s',
  },
  youTubeContainerShow: {
    opacity: 1,
    pointerEvents: 'auto',
  },
  youTube: {
    height: '56vw',
  },
  controls: {
    flex: 1,
  },
  secondaryControls: {},
}))(function MediaPlayer({
  classes,
  type,
  mediaId,
  fullscreen,
  toolbarProps,
  prevButtonProps,
  playPauseButtonProps,
  nextButtonProps,
  toggleVideoButtonProps,
  scrollToCurrentItemButtonProps,
  scrollToBottomButtonProps,
  onStateChange = () => {},
  ...props
}) {
  const [playerState, setPlayerState] = React.useState();
  const [showVideo, setShowVideo] = React.useState(false);

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

  const togglePlay = React.useCallback(() => {
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

  const toggleVideo = React.useCallback(() => {
    setShowVideo(!showVideo);
  }, [showVideo]);

  return (
    <Card classes={{ root: classes.root }} square {...props}>
      <Toolbar classes={{ root: classes.toolbar }} {...toolbarProps}>
        <div
          className={`${classes.youTubeContainer} ${showVideo &&
            classes.youTubeContainerShow}`}
        >
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
            <IconButton {...playPauseButtonProps} onClick={togglePlay}>
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

          <IconButton
            size="small"
            color={showVideo ? 'primary' : 'default'}
            {...toggleVideoButtonProps}
            onClick={toggleVideo}
          >
            <VideoLabelIcon />
          </IconButton>
        </div>

        <div className={classes.secondaryControls}>
          <IconButton size="small" {...scrollToCurrentItemButtonProps}>
            <MyLocationIcon />
          </IconButton>

          <IconButton size="small" {...scrollToBottomButtonProps}>
            <VerticalAlignBottomIcon />
          </IconButton>
        </div>
      </Toolbar>
    </Card>
  );
});
