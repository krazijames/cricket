import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import AppBar from './AppBar';
import Sidebar from './Sidebar';

const Layout = withStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
}))(({ classes, children, ...props }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  function closeSideBar() {
    setIsSidebarOpen(false);
  }

  function toggleSideBar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div {...props}>
      <AppBar onMenuButtonClick={toggleSideBar} />
      <Sidebar open={isSidebarOpen} onClose={closeSideBar} />
      <div className={classes.appBarSpacer} />
      {children}
    </div>
  );
});

export default Layout;
