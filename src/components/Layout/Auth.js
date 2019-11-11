import React from 'react';
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { withStyles, useTheme } from '@material-ui/core/styles';

import { useAuth, useAuthUi } from 'auth';

const UserAvatar = withStyles((theme) => ({
  root: {
    color: 'inherit',
    backgroundColor: 'transparent',
  },
  defaultIcon: { width: '100%', height: '100%' },
}))(({ classes, ...props }) => {
  return (
    <Avatar className={classes.root} {...props}>
      <AccountCircleIcon className={classes.defaultIcon} />
    </Avatar>
  );
});

const UserButton = withStyles((theme) => ({
  root: {
    padding: 0,
  },
}))(({ classes, ...props }) => {
  const { user, signOut } = useAuth();

  const [detailsAnchorEl, setDetailsAnchorEl] = React.useState(null);
  const isDetailsOpen = Boolean(detailsAnchorEl);

  function onUserButtonClick(event) {
    setDetailsAnchorEl(event.currentTarget);
  }

  function closeDetails() {
    setDetailsAnchorEl(null);
  }

  function onSignOutButtonClick() {
    signOut();
    closeDetails();
  }

  return (
    <>
      <IconButton
        className={classes.root}
        color="inherit"
        onClick={onUserButtonClick}
        {...props}
      >
        <UserAvatar src={user.photoUrl} />
      </IconButton>

      <Popover
        open={isDetailsOpen}
        anchorEl={detailsAnchorEl}
        keepMounted
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={closeDetails}
      >
        <List>
          <ListItem>
            <ListItemAvatar>
              <UserAvatar src={user.photoUrl} />
            </ListItemAvatar>
            <ListItemText primary={user.displayName} secondary={user.email} />
          </ListItem>
          <ListItem dense>
            <ListItemText
              primary={
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onSignOutButtonClick}
                >
                  Sign Out
                </Button>
              }
              inset
            />
          </ListItem>
        </List>
      </Popover>
    </>
  );
});

const Auth = withStyles((theme) => ({
  authContainer: {
    '& .mdl-spinner.firebaseui-busy-indicator': {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
  },
}))(({ classes, children, onMenuButtonClick, ...props }) => {
  const theme = useTheme();

  const { isAuthenticated } = useAuth();
  const isPendingAuth = useAuthUi('#firebaseui-auth-container');

  const [isSignInDialogOpen, setIsSignInDialogOpen] = React.useState(false);

  function onSignInButtonClick() {
    setIsSignInDialogOpen(true);
  }

  function closeSignInDialog() {
    setIsSignInDialogOpen(false);
  }

  return (
    <div {...props}>
      {isPendingAuth ? (
        <CircularProgress color="inherit" size={theme.spacing(5)} />
      ) : isAuthenticated ? (
        <UserButton />
      ) : (
        <Button variant="outlined" onClick={onSignInButtonClick}>
          Sign In
        </Button>
      )}

      <Dialog
        open={isSignInDialogOpen}
        keepMounted
        PaperComponent="div"
        onClose={closeSignInDialog}
      >
        <div id="firebaseui-auth-container" className={classes.authContainer} />
      </Dialog>
    </div>
  );
});

export default Auth;
