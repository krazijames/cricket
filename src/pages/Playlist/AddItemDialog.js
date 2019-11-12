import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
  TextField,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

export default withStyles((theme) => ({
  searchField: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))(function AddItemDialog({ classes, open, title, onOk, onClose, ...props }) {
  const [isPending, setIsPending] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState();

  function onQueryChange(event) {
    setQuery(event.target.value);
  }

  function onSubmit(event) {
    event.preventDefault();

    if (!query) {
      return;
    }
  }

  React.useEffect(() => {
    if (open) {
      setIsPending(false);
      setQuery('');
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
      <form onSubmit={onSubmit}>
        <DialogContent>
          {errorMessage && (
            <DialogContentText variant="body2" color="error">
              {errorMessage}
            </DialogContentText>
          )}

          <div className={classes.searchField}>
            <TextField
              className={classes.searchInput}
              autoFocus
              margin="dense"
              placeholder="Search from YouTube"
              fullWidth
              required
              disabled={isPending}
              value={query}
              onChange={onQueryChange}
            />

            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </div>
        </DialogContent>

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
