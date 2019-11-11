import React from 'react';
import _ from 'lodash';
import { Card, CardHeader, Container, Fab, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';

import { paths } from 'data';
import { useAuth } from 'auth';

import AddPlaylistDialog from './AddPlaylistDialog';

export default withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(11),
  },
  addButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}))(function Playlists({ classes }) {
  const { isAuthenticated, user } = useAuth();
  const [playlists, setPlaylists] = React.useState();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  function openAddDialog() {
    setIsAddDialogOpen(true);
  }

  function closeAddDialog() {
    setIsAddDialogOpen(false);
  }

  React.useEffect(() => {
    if (!user) {
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
  }, [user]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      setPlaylists();
    }
  }, [isAuthenticated]);

  return (
    <Container classes={{ root: classes.root }} maxWidth={false}>
      <Grid container spacing={1}>
        {_.map(playlists, (playlist) => (
          <Grid key={playlist.id} item xs={12}>
            <Card>
              <CardHeader title={playlist.name} />
            </Card>
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
    </Container>
  );
});
