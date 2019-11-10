import React from 'react';
import { Button, CircularProgress, Dialog } from '@material-ui/core';
import { withStyles, useTheme } from '@material-ui/core/styles';

import { useAuth, useAuthUi } from 'auth';

const AuthButton = withStyles((theme) => ({
  authContainer: {
    overflow: 'hidden',
  },
}))(({ classes, children, onMenuButtonClick, ...props }) => {
  const theme = useTheme();

  const { isAuthenticated, signOut } = useAuth();
  const pendingAuth = useAuthUi('#firebaseui-auth-container');

  const [signInUiOpened, setSignInUiOpened] = React.useState(false);

  function onSignInButtonClick() {
    setSignInUiOpened(true);
  }

  function closeSignInUi() {
    setSignInUiOpened(false);
  }

  return (
    <div {...props}>
      {pendingAuth ? (
        <CircularProgress color="inherit" size={theme.spacing(3)} />
      ) : isAuthenticated ? (
        <Button variant="outlined" onClick={signOut}>
          Sign Out
        </Button>
      ) : (
        <Button variant="outlined" onClick={onSignInButtonClick}>
          Sign In
        </Button>
      )}

      <Dialog open={signInUiOpened} keepMounted onClose={closeSignInUi}>
        <div id="firebaseui-auth-container" className={classes.authContainer} />
      </Dialog>
    </div>
  );
});

export default AuthButton;
