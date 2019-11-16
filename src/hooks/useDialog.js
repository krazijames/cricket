import React from 'react';
import { Dialog as MuiDialog } from '@material-ui/core';

export default (component = MuiDialog) => {
  const Component = component;
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const Dialog = React.useCallback(
    function ControlledDialog({ ...props }) {
      return <Component open={isOpen} onClose={close} {...props} />;
    },
    [isOpen, close],
  );

  return [Dialog, open, close];
};
