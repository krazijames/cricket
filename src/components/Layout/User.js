import { useAuth } from '@cricket/auth';
import { usePopover } from '@cricket/hooks';
import { ReactComponent as GoogleIcon } from '@fortawesome/fontawesome-free/svgs/brands/google.svg';
import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import React from 'react';

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

  const [Details, openDetails, closeDetails] = usePopover();

  function handleSignOutButtonClick() {
    signOut();
    closeDetails();
  }

  return (
    <>
      <IconButton
        className={classes.root}
        color="inherit"
        onClick={openDetails}
        {...props}
      >
        <UserAvatar src={user.photoURL} />
      </IconButton>

      <Details
        keepMounted
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List>
          <ListItem>
            <ListItemAvatar>
              <UserAvatar src={user.photoURL} />
            </ListItemAvatar>
            <ListItemText primary={user.displayName} secondary={user.email} />
          </ListItem>
          <ListItem dense>
            <ListItemText
              primary={
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSignOutButtonClick}
                >
                  Sign Out
                </Button>
              }
              inset
            />
          </ListItem>
        </List>
      </Details>
    </>
  );
});

export default withStyles((theme) => ({}))(function User({
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
