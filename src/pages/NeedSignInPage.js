import React from 'react';
import { Button, SvgIcon, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ReactComponent as GoogleIcon } from '@fortawesome/fontawesome-free/svgs/brands/google.svg';

import { useAuth } from 'auth';
import { Page } from 'components';

export default withStyles((theme) => ({
  contentContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',

    padding: theme.spacing(4),
    textAlign: 'center',
  },
}))(function NeedSignInPage({ classes }) {
  const { signInWithGoogle } = useAuth();

  return (
    <Page classes={{ contentContainer: classes.contentContainer }}>
      <div>
        <Typography variant="h4" gutterBottom>
          Sign In Required
        </Typography>

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
      </div>
    </Page>
  );
});
