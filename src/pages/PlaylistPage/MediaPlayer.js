import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import YouTube from 'react-youtube';

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

export default withStyles((theme) => ({}))(function MediaPlayer({
  classes,
  type,
  mediaId,
  play,
  onStateChange,
  ...props
}) {
  const [player, setPlayer] = React.useState();

  const handleReady = React.useCallback((event) => {
    setPlayer(event.target);
  }, []);

  const handleStateChange = React.useCallback(
    (event) => {
      onStateChange(mapYouTubePlayerState(event.target.getPlayerState()));
    },
    [onStateChange],
  );

  React.useEffect(
    function forcePlayState() {
      if (!player) {
        return;
      }

      if (play) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    },
    [player, play],
  );

  return (
    <YouTube
      containerClassName={classes.youTube}
      videoId={mediaId}
      opts={youtubeOptions}
      onReady={handleReady}
      onStateChange={handleStateChange}
      {...props}
    />
  );
});
