import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

export default withStyles((theme) => ({
  root: {
    flex: 1,

    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',

    padding: theme.spacing(4),
    textAlign: 'center',
  },
}))(function NotFound({ classes }) {
  return (
    <div className={classes.root}>
      <Typography variant="h3" gutterBottom>
        Sorry!
      </Typography>
      <Typography gutterBottom>
        The page you're looking for was not found
      </Typography>
    </div>
  );
});
