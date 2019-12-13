import { Box, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import React from 'react';

const transitionDuration = '0.25s';

export default withStyles((theme) => ({
  root: {
    position: 'relative',
    display: ({ display }) => (display ? display : 'flex'),
    flexFlow: 'column nowrap',
  },
  contentContainer: {
    flex: 1,
    opacity: ({ loading, loadingContentOpacity }) =>
      loading
        ? !_.isNil(loadingContentOpacity)
          ? loadingContentOpacity
          : 0.1
        : 1,
    transition: `opacity ${transitionDuration}`,
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    display: 'flex',
    justifyContent: 'center',
    alignItems: ' center',

    pointerEvents: ({ loading }) => (loading ? 'auto' : 'none'),
    opacity: ({ loading }) => (loading ? 1 : 0),
    transition: `opacity ${transitionDuration}`,
  },
  progress: {},
}))(function AsyncContainer({
  classes,
  loading,
  loadingContentOpacity,
  display,
  children,
  contentContainerProps,
  progressContainerProps,
  progressProps,
  ...props
}) {
  return (
    <Box classes={{ root: classes.root }} display={display} {...props}>
      <Box
        classes={{ root: classes.contentContainer }}
        {...contentContainerProps}
      >
        {children}
      </Box>
      <Box
        classes={{ root: classes.progressContainer }}
        {...progressContainerProps}
      >
        <CircularProgress
          classes={{ root: classes.progress }}
          {...progressProps}
        />
      </Box>
    </Box>
  );
});
