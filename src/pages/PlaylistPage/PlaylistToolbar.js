import { AsyncContainer } from '@cricket/components';
import { Fab, IconButton, Paper, Toolbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import React from 'react';

import { PlayerState } from './MediaPlayer';

export default withStyles((theme) => ({
  root: {
    position: 'relative',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    overflow: 'visible',
  },
  controls: {
    flex: 1,
  },
  secondaryControls: {
    marginRight: theme.spacing(1),
  },
}))(function PlaylistToolbar({
  classes,
  mediaPlayerState,
  toolbarProps,
  prevButtonProps,
  playPauseButtonProps,
  nextButtonProps,
  toggleVideoButtonProps,
  scrollToCurrentItemButtonProps,
  scrollToBottomButtonProps,
  addItemButtonProps,
  ...props
}) {
  return (
    <Toolbar
      component={Paper}
      classes={{ root: classes.root }}
      square
      {...props}
    >
      <div className={classes.controls}>
        <IconButton {...prevButtonProps}>
          <SkipPreviousIcon />
        </IconButton>

        <AsyncContainer
          display="inline-flex"
          loading={mediaPlayerState === PlayerState.BUFFERING}
          loadingContentOpacity={0}
        >
          <IconButton {...playPauseButtonProps}>
            {mediaPlayerState === PlayerState.PLAYING ? (
              <PauseIcon />
            ) : (
              <PlayArrowIcon />
            )}
          </IconButton>
        </AsyncContainer>

        <IconButton {...nextButtonProps}>
          <SkipNextIcon />
        </IconButton>

        <IconButton {...toggleVideoButtonProps}>
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

      <Fab size="small" color="primary" {...addItemButtonProps}>
        <AddIcon />
      </Fab>
    </Toolbar>
  );
});
