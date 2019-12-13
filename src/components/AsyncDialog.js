import { AsyncButton } from '@cricket/components';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

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
  okButtonProps,
  onOk,
  onClose,
  ...props
}) {
  const isMounted = React.useRef();
  const [isPending, setIsPending] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState();

  const handleSubmit = React.useCallback(
    async (event) => {
      event.preventDefault();

      try {
        setIsPending(true);
        setErrorMessage();
        await onOk();
        if (isMounted.current) {
          onClose();
        }
      } catch (error) {
        if (isMounted.current) {
          setErrorMessage(error.message);
        }
      } finally {
        if (isMounted.current) {
          setIsPending(false);
        }
      }
    },
    [onOk, onClose],
  );

  React.useEffect(
    function reset() {
      if (open) {
        setIsPending(false);
        setErrorMessage();
      }
    },
    [open],
  );

  React.useEffect(function updateIsMounted() {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="xs"
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
          <AsyncButton
            type="submit"
            loading={isPending}
            children="OK"
            {...okButtonProps}
          />
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
