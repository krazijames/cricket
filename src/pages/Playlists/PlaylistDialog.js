import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

export default withStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))(function PlaylistDialog({ classes, title, onClose, ...props }) {
  const [name, setName] = React.useState('');

  function onNameChange(event) {
    setName(event.target.value);
  }

  function onSubmit(event) {
    event.preventDefault();

    if (!name) {
      return;
    }

    onClose();
  }

  return (
    <Dialog onClose={onClose} {...props}>
      <form onSubmit={onSubmit}>
        <DialogTitle>{title}</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Playlist Name"
            fullWidth
            color="secondary"
            required
            value={name}
            onChange={onNameChange}
          />
        </DialogContent>

        <DialogActions>
          <Button type="submit" color="secondary">
            OK
          </Button>
        </DialogActions>

        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </form>
    </Dialog>
  );
});
