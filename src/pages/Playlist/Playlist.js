import React from 'react';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';

import { Page } from 'components';
import { paths } from 'data';

import AddItemDialog from './AddItemDialog';

export default withStyles((theme) => ({
  addItemButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}))(function Playlist({ classes }) {
  const { playlistId } = useParams();

  const [playlist, setPlaylist] = React.useState();
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = React.useState(true);

  function openAddItemDalog() {
    setIsAddItemDialogOpen(true);
  }

  function closeAddItemDialog() {
    setIsAddItemDialogOpen(false);
  }

  React.useEffect(() => {
    return firebase
      .firestore()
      .doc(`${paths.PLAYLISTS}/${playlistId}`)
      .onSnapshot((doc) => {
        setPlaylist({ id: doc.id, ...doc.data() });
      });
  }, [playlistId]);

  return (
    <Page title={playlist && playlist.name}>
      <Fab
        classes={{ root: classes.addItemButton }}
        color="primary"
        onClick={openAddItemDalog}
      >
        <AddIcon />
      </Fab>

      <AddItemDialog open={isAddItemDialogOpen} onClose={closeAddItemDialog} />
    </Page>
  );
});
