import React from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { AsyncContainer } from 'components';

export default withStyles((theme) => ({}))(function AsyncButton({
  loading,
  disabled,
  color,
  children,
  progressProps,
  ...props
}) {
  return (
    <Button disabled={loading || disabled} color={color} {...props}>
      <AsyncContainer
        loading={loading}
        progressProps={{ size: 16, color, ...progressProps }}
      >
        {children}
      </AsyncContainer>
    </Button>
  );
});
