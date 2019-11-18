import React from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { withStyles, useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import { useAppContext } from 'context';
import { AsyncContainer } from 'components';

export default withStyles((theme) => ({
  root: {
    flex: 1,
  },
  contentContainer: {},
  progressContainer: {
    position: 'fixed',
  },
}))(function Page({
  classes,
  title,
  description,
  showHomeButton,
  appBarProps,
  ...props
}) {
  const theme = useTheme();
  const [, updateContext, defaultContext] = useAppContext();

  React.useEffect(() => {
    updateContext({
      title: title
        ? `${defaultContext.title} - ${title}`
        : defaultContext.title,
      description: description || defaultContext.description,

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
  }, [
    updateContext,
    defaultContext.title,
    defaultContext.description,
    defaultContext.appBarProps,
    title,
    description,
    showHomeButton,
    appBarProps,
  ]);

  return (
    <AsyncContainer
      classes={classes}
      progressProps={{ size: theme.app.progressSize }}
      {...props}
    />
  );
});
