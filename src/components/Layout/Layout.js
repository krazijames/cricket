import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import AppBar from './AppBar';
import Sidebar from './Sidebar';

export default withStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  appBarSpacer: theme.mixins.toolbar,
  main: {
    position: 'relative',
    flex: 1,
  },
}))(function Layout({ classes, children, ...props }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  function closeSideBar() {
    setIsSidebarOpen(false);
  }

  function toggleSideBar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div className={classes.root} {...props}>
      <AppBar onMenuButtonClick={toggleSideBar} />
      <Sidebar open={isSidebarOpen} onClose={closeSideBar} />
      <div className={classes.appBarSpacer} />
      <main className={classes.main}>{children}</main>
    </div>
  );
});
