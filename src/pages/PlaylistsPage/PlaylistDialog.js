import { AsyncDialog } from '@cricket/components';
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';

export default withStyles((theme) => ({}))(function PlaylistDialog({
  classes,
  playlist: { id, name } = {},
  open,
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

  React.useEffect(
    function reset() {
      if (open) {
        setNewName(name || '');
      }
    },
    [open, name],
  );

  return (
    <AsyncDialog
      open={open}
      okButtonProps={{ color: 'secondary' }}
      onOk={handleOk}
      {...props}
    >
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
