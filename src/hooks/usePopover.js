import { Popover as MuiPopover } from '@material-ui/core';
import React from 'react';

export default (component = MuiPopover) => {
  const Component = component;
  const [anchorEl, setAnchorEl] = React.useState();

  const open = React.useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const close = React.useCallback(() => {
    setAnchorEl();
  }, []);

  const Popover = React.useCallback(
    function ControlledPopover({ ...props }) {
      return (
        <Component
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={close}
          {...props}
        />
      );
    },
    [anchorEl, close],
  );

  return [Popover, open, close];
};
