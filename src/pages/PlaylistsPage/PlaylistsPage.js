import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import { Fab, List, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';

import { paths } from 'data';
import { useAuth } from 'auth';
import { Page } from 'components';

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
        });
    },
    [isPendingAuth, user],
  );

  return (
    <Page className={classes.root} loading={!playlists}>
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
