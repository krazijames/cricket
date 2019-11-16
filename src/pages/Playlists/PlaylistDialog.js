import React from 'react';
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { AsyncDialog } from 'components';

export default withStyles((theme) => ({}))(function PlaylistDialog({
  classes,
  playlist: { id, name } = {},
  open,
  title,
  onOk,
  ...props
}) {
  const [newName, setNewName] = React.useState('');

  const handleNameChange = React.useCallback((event) => {
    setNewName(event.target.value);
  }, []);

  const handleOk = React.useCallback(async () => {
    await onOk({ id, name: newName });
  }, [onOk, id, newName]);

  React.useEffect(() => {
    if (open) {
      setNewName(name || '');
    }
  }, [open, name]);

  return (
    <AsyncDialog open={open} title={title} onOk={handleOk} {...props}>
      {({ isPending }) => (
        <TextField
          autoFocus
          margin="dense"
          label="Playlist Name"
          fullWidth
          color="secondary"
          required
          disabled={isPending}
          value={newName}
          onChange={handleNameChange}
        />
      )}
    </AsyncDialog>
  );
});
