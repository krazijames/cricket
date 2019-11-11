import React from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { AsyncContainer } from 'components';

export default withStyles((theme) => ({}))(function AsyncButton({
  loading,
  disabled,
  children,
  progressProps,
  ...props
}) {
  return (
    <Button disabled={loading || disabled} {...props}>
      <AsyncContainer
        loading={loading}
        progressProps={{ size: 22, ...progressProps }}
      >
        {children}
      </AsyncContainer>
    </Button>
  );
});
