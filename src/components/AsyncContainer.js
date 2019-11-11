import React from 'react';
import _ from 'lodash';
import { Box, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const transitionDuration = '0.25s';

const defaultProgressProps = {
  size: 40,
};

export default withStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'block',
    minWidth: ({
      loading,
      progressProps: { size = defaultProgressProps.size } = {},
    }) => (loading ? size : 'inherit'),
    minHeight: ({
      loading,
      progressProps: { size = defaultProgressProps.size } = {},
    }) => (loading ? size : 'inherit'),
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    opacity: ({ loading }) => (loading ? 0.1 : 1),
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
}))(function AsyncContainer({
  classes,
  loading,
  children,
  progressProps,
  ...props
}) {
  const mergedProgressProps = _.merge({}, defaultProgressProps, progressProps);

  return (
    <Box classes={{ root: classes.root }} {...props}>
      <Box classes={{ root: classes.contentContainer }}>{children}</Box>
      <Box classes={{ root: classes.progressContainer }}>
        <CircularProgress {...mergedProgressProps} />
      </Box>
    </Box>
  );
});
