import React from 'react';
import { withStyles, useTheme } from '@material-ui/core/styles';

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
  const theme = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  function closeSideBar() {
    setIsSidebarOpen(false);
  }

  function toggleSideBar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

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
      <AppBar onMenuButtonClick={toggleSideBar} />
      <Sidebar open={isSidebarOpen} onClose={closeSideBar} />
      <div className={classes.appBarSpacer} />
      <main className={classes.main}>{children}</main>
    </AsyncContainer>
  );
});
