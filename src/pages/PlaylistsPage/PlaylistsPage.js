import { useAuth } from '@cricket/auth';
import { Page } from '@cricket/components';
import { paths } from '@cricket/data';
import { Fab, List, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import firebase from 'firebase/app';
import _ from 'lodash';
import fp from 'lodash/fp';
import React from 'react';

import { useAddPlaylistDialog } from './AddPlaylistDialog';
import Playlist from './Playlist';

export default withStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(10),
  },
  emptyMessageContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',

    padding: theme.spacing(4),
    textAlign: 'center',
  },
  addButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}))(function PlaylistsPage({ classes }) {
  const { isPending: isPendingAuth, user } = useAuth();
  const [playlists, setPlaylists] = React.useState();
  const [error, setError] = React.useState();

  const [AddPlaylistDialog, openAddPlaylistDialog] = useAddPlaylistDialog();

  React.useEffect(
    function subscribePlaylists() {
      if (isPendingAuth) {
        return;
      }

      return firebase
        .firestore()
        .collection(paths.PLAYLISTS)
        .where('ownerUserUids', 'array-contains', user.uid)
        .onSnapshot((querySnapshot) => {
          setPlaylists(
            fp.flow(
              fp.map((doc) => ({ id: doc.id, ...doc.data() })),
              fp.orderBy('createdAt', 'desc'),
            )(querySnapshot.docs),
          );
        }, setError);
    },
    [isPendingAuth, user],
  );

  return (
    <Page className={classes.root} loading={!playlists} error={error}>
      {playlists &&
        (_.isEmpty(playlists) ? (
          <div className={classes.emptyMessageContainer}>
            <Typography variant="h5" color="textSecondary">
              Create New Playlist!
            </Typography>
          </div>
        ) : (
          <List>
            {_.map(playlists, (playlist) => (
              <Playlist key={playlist.id} playlist={playlist} />
            ))}
          </List>
        ))}

      <Fab
        classes={{ root: classes.addButton }}
        color="primary"
        onClick={openAddPlaylistDialog}
      >
        <AddIcon />
      </Fab>

      <AddPlaylistDialog />
    </Page>
  );
});
