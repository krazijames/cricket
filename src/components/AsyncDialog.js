import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

import { AsyncButton } from 'components';

export default withStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))(function PlaylistDialog({
  classes,
  open,
  title,
  children,
  onOk,
  onClose,
  ...props
}) {
  const [isPending, setIsPending] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState();

  const handleSubmit = React.useCallback(
    async (event) => {
      event.preventDefault();

      try {
        setIsPending(true);
        setErrorMessage();
        await onOk();
        onClose();
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsPending(false);
      }
    },
    [onOk, onClose],
  );

  React.useEffect(() => {
    if (open) {
      setIsPending(false);
      setErrorMessage();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      fullWidth
      disableBackdropClick={isPending}
      disableEscapeKeyDown={isPending}
      onClose={onClose}
      {...props}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>

        <DialogContent>
          {errorMessage && (
            <DialogContentText variant="body2" color="error">
              {errorMessage}
            </DialogContentText>
          )}
          {children instanceof Function ? children({ isPending }) : children}
        </DialogContent>

        <DialogActions>
          <AsyncButton type="submit" color="secondary" loading={isPending}>
            OK
          </AsyncButton>
        </DialogActions>

        <IconButton
          className={classes.closeButton}
          size="small"
          disabled={isPending}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </form>
    </Dialog>
  );
});
