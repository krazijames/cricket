import React from 'react';
import { Button, SvgIcon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ReactComponent as GoogleIcon } from '@fortawesome/fontawesome-free/svgs/brands/google.svg';

import { useAuth } from 'auth';
import { Page } from 'components';

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
