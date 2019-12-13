import { useAuth } from '@cricket/auth';
import { Page } from '@cricket/components';
import { ReactComponent as GoogleIcon } from '@fortawesome/fontawesome-free/svgs/brands/google.svg';
import { Button, SvgIcon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';

export default withStyles((theme) => ({}))(function NeedSignInPage({
  classes,
}) {
  const { signInWithGoogle } = useAuth();

  return (
    <Page
      error={{
        name: 'Sign In Required',
        message: (
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
            Sign In with Google
          </Button>
        ),
      }}
    />
  );
});
