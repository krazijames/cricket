import React from 'react';
import { Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { withStyles, useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import { useAppContext } from 'context';
import { AsyncContainer } from 'components';

export default withStyles((theme) => ({
  root: {
    flex: 1,
  },
  contentContainer: ({ error }) =>
    error
      ? {
          display: 'flex',
          flexFlow: 'column nowrap',
          justifyContent: 'center',

          padding: theme.spacing(4),
          textAlign: 'center',
        }
      : {},
  progressContainer: {
    position: 'fixed',
  },
}))(function Page({
  classes,
  title,
  description,
  showHomeButton,
  appBarProps,
  loading,
  error,
  children,
  ...props
}) {
  const theme = useTheme();
  const [, updateContext, defaultContext] = useAppContext();

  React.useEffect(
    function updateAppContext() {
      updateContext({
        title,
        description,

        appBarProps: {
          ...defaultContext.appBarProps,

          title: title || defaultContext.appBarProps.title,

          ...(showHomeButton && {
            primaryButtonProps: {
              component: Link,
              to: '/',
              children: <ArrowBackIcon />,
            },
          }),

          ...appBarProps,
        },
      });
    },
    [
      updateContext,
      defaultContext.appBarProps,
      title,
      description,
      showHomeButton,
      appBarProps,
    ],
  );

  return (
    <AsyncContainer
      classes={classes}
      progressProps={{ size: theme.app.progressSize }}
      loading={!error && loading}
      {...props}
    >
      {error ? (
        <>
          <Typography variant="h3" gutterBottom>
            Sorry!
          </Typography>

          {error.name && (
            <Typography variant="h6" gutterBottom>
              {error.name}
            </Typography>
          )}

          <Typography variant="body2" color="textSecondary" gutterBottom>
            {error.message}
          </Typography>
        </>
      ) : (
        children
      )}
    </AsyncContainer>
  );
});
