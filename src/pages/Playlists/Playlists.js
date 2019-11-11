import React from 'react';
import _ from 'lodash';
import { Fab, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withStyles, useTheme } from '@material-ui/core/styles';
import firebase from 'firebase/app';

import { paths } from 'data';
import { useAuth } from 'auth';
import { AsyncContainer } from 'components';

import AddPlaylistDialog from './AddPlaylistDialog';
import Playlist from './Playlist';

export default withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(11),
  },
  progressContainer: {
    position: 'fixed',
  },
  addButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}))(function Playlists({ classes }) {
  const theme = useTheme();
  const { isPending: isPendingAuth, user } = useAuth();
  const [playlists, setPlaylists] = React.useState();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  function openAddDialog() {
    setIsAddDialogOpen(true);
  }

  function closeAddDialog() {
    setIsAddDialogOpen(false);
  }

  React.useEffect(() => {
    if (isPendingAuth) {
      return;
    }

    if (!user) {
      setPlaylists([]);
      return;
    }

    const db = firebase.firestore();

    return db
      .collection(paths.PLAYLISTS)
      .where('ownerUserUids', 'array-contains', user.uid)
      .onSnapshot((querySnapshot) => {
        const newPlaylists = [];
        querySnapshot.forEach((doc) => {
          newPlaylists.push({ id: doc.id, ...doc.data() });
        });
        setPlaylists(newPlaylists);
      });
  }, [isPendingAuth, user]);

  return (
    <AsyncContainer
      classes={{
        root: classes.root,
        progressContainer: classes.progressContainer,
      }}
      progressProps={{ size: theme.spacing(10) }}
      loading={!playlists}
    >
      <Grid container spacing={1}>
        {_.map(playlists, (playlist) => (
          <Grid key={playlist.id} item xs={12}>
            <Playlist playlist={playlist} />
          </Grid>
        ))}
      </Grid>

      <Fab
        classes={{ root: classes.addButton }}
        color="primary"
        onClick={openAddDialog}
      >
        <AddIcon />
      </Fab>

      <AddPlaylistDialog open={isAddDialogOpen} onClose={closeAddDialog} />
    </AsyncContainer>
  );
});
