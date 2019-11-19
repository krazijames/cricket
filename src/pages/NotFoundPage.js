import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { Page } from 'components';

export default withStyles((theme) => ({
  contentContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',

    padding: theme.spacing(4),
    textAlign: 'center',
  },
}))(function NotFoundPage({ classes }) {
  return (
    <Page
      classes={{ contentContainer: classes.contentContainer }}
      title="Not Found"
      showHomeButton
    >
      <Typography variant="h3" gutterBottom>
        Sorry!
      </Typography>
      <Typography gutterBottom>
        The page you're looking for was not found.
      </Typography>
    </Page>
  );
});
