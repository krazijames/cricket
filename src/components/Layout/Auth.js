import React from 'react';
import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  SvgIcon,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/core/styles';
import { ReactComponent as GoogleIcon } from '@fortawesome/fontawesome-free/svgs/brands/google.svg';

import { useAuth } from 'auth';

const UserAvatar = withStyles((theme) => ({
  root: {
    color: 'inherit',
    backgroundColor: 'transparent',
  },
  defaultIcon: { width: '100%', height: '100%' },
}))(function UserAvatar({ classes, ...props }) {
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
}))(function UserButton({ classes, ...props }) {
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

export default withStyles((theme) => ({}))(function Auth({
  classes,
  children,
  onMenuButtonClick,
  ...props
}) {
  const { isAuthenticated, signInWithGoogle } = useAuth();

  return (
    <div {...props}>
      {isAuthenticated ? (
        <UserButton />
      ) : (
        <Button
          variant="outlined"
          size="small"
          startIcon={
            <SvgIcon>
              <GoogleIcon />
            </SvgIcon>
          }
          onClick={signInWithGoogle}
        >
          Sign In
        </Button>
      )}
    </div>
  );
});
