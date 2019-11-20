import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Page } from 'components';

export default withStyles((theme) => ({}))(function NotFoundPage({ classes }) {
  return (
    <Page
      title="Not Found"
      showHomeButton
      error={{ message: `The page you're looking for was not found.` }}
    />
  );
});
