import React from 'react';
import { withStyles, useTheme } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';

import { useAppContext } from 'context';
import { AsyncContainer } from 'components';

import AppBar from './AppBar';
import Sidebar from './Sidebar';

export default withStyles((theme) => ({
  '@global': {
    'html, body, #root': {
      height: '100%',
    },
  },
  root: {
    height: '100%',
  },
  contentContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  appBarSpacer: theme.mixins.toolbar,
  main: {
    flex: 1,
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  progressContainer: {
    position: 'fixed',
  },
}))(function Layout({ classes, children, ...props }) {
  const theme = useTheme();
  const [
    { title, description, appBarProps, isSidebarOpen },
    updateContext,
    defaultContext,
  ] = useAppContext();

  const closeSideBar = React.useCallback(() => {
    updateContext({ isSidebarOpen: false });
  }, [updateContext]);

  return (
    <>
      <Helmet
        title={title}
        titleTemplate={`${defaultContext.title} - %s`}
        defaultTitle={defaultContext.title}
        meta={[
          {
            name: 'description',
            content: description,
          },
          {
            property: 'og:title',
            content: title,
          },
          {
            property: 'og:description',
            content: description,
          },
          {
            property: 'og:type',
            content: 'website',
          },
        ]}
      />

      <AsyncContainer
        classes={{
          root: classes.root,
          contentContainer: classes.contentContainer,
          progressContainer: classes.progressContainer,
        }}
        progressProps={{ size: theme.app.progressSize }}
        loadingContentOpacity={0}
        {...props}
      >
        <AppBar {...appBarProps} />
        <Sidebar open={isSidebarOpen} onClose={closeSideBar} />
        <div className={classes.appBarSpacer} />
        <main className={classes.main}>{children}</main>
      </AsyncContainer>
    </>
  );
});
