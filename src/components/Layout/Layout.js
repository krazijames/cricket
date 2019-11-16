import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { useAppContext } from 'context';
import { AsyncContainer } from 'components';

import AppBar from './AppBar';
import Sidebar from './Sidebar';

export default withStyles((theme) => ({
  root: {
    minHeight: '100vh',
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
  const [{ appBarProps, isSidebarOpen }, updateContext] = useAppContext();

  const closeSideBar = React.useCallback(() => {
    updateContext({ isSidebarOpen: false });
  }, [updateContext]);

  return (
    <AsyncContainer
      classes={{
        root: classes.root,
        contentContainer: classes.contentContainer,
        progressContainer: classes.progressContainer,
      }}
      progressProps={{ size: '25vmin' }}
      loadingContentOpacity={0}
      {...props}
    >
      <AppBar {...appBarProps} />
      <Sidebar open={isSidebarOpen} onClose={closeSideBar} />
      <div className={classes.appBarSpacer} />
      <main className={classes.main}>{children}</main>
    </AsyncContainer>
  );
});
