import { Page } from '@cricket/components';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';

export default withStyles((theme) => ({}))(function NotFoundPage({ classes }) {
  return (
    <Page
      title="Not Found"
      showHomeButton
      error={{ message: `The page you're looking for was not found.` }}
    />
  );
});
