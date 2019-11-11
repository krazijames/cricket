import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
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
}))(function PlaylistDialog({ classes, title, onOk, onClose, ...props }) {
  const [isPending, setIsPending] = React.useState(false);
  const [name, setName] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState();

  function onNameChange(event) {
    setName(event.target.value);
  }

  function onSubmit(event) {
    event.preventDefault();

    if (!name) {
      return;
    }

    (async () => {
      try {
        setIsPending(true);
        setErrorMessage();
        await onOk({ name });
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsPending(false);
      }
    })();
  }

  return (
    <Dialog
      fullWidth
      disableBackdropClick={isPending}
      disableEscapeKeyDown={isPending}
      onClose={onClose}
      {...props}
    >
      <form onSubmit={onSubmit}>
        <DialogTitle>{title}</DialogTitle>

        <DialogContent>
          {errorMessage && (
            <DialogContentText variant="body2" color="error">
              {errorMessage}
            </DialogContentText>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Playlist Name"
            fullWidth
            color="secondary"
            required
            disabled={isPending}
            value={name}
            onChange={onNameChange}
          />
        </DialogContent>

        <DialogActions>
          <AsyncButton type="submit" color="secondary" loading={isPending}>
            OK
          </AsyncButton>
        </DialogActions>

        <IconButton
          className={classes.closeButton}
          disabled={isPending}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </form>
    </Dialog>
  );
});
