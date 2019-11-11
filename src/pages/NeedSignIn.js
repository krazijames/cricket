import React from 'react';
import { Button, SvgIcon, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ReactComponent as GoogleIcon } from '@fortawesome/fontawesome-free/svgs/brands/google.svg';

import { useAuth } from 'auth';

export default withStyles((theme) => ({
  root: {
    flex: 1,

    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',

    padding: theme.spacing(4),
    textAlign: 'center',
  },
}))(function NeedSignIn({ classes }) {
  const { signInWithGoogle } = useAuth();

  return (
    <div className={classes.root}>
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
    </div>
  );
});
