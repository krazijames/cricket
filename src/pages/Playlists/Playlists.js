import React from 'react';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';

import AddPlaylistDialog from './AddPlaylistDialog';

export default withStyles((theme) => ({
  addButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}))(function Playlists({ classes }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  function openAddDialog() {
    setIsAddDialogOpen(true);
  }

  function closeAddDialog() {
    setIsAddDialogOpen(false);
  }
  return (
    <div>
      Playlists
      <Fab
        className={classes.addButton}
        color="primary"
        onClick={openAddDialog}
      >
        <AddIcon />
      </Fab>
      <AddPlaylistDialog open={isAddDialogOpen} onClose={closeAddDialog} />
    </div>
  );
});
