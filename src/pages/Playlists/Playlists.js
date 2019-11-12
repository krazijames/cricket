import React from 'react';
import _ from 'lodash';
import {
  Fab,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withStyles, useTheme } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import { formatDistanceWithOptions } from 'date-fns/fp';
import { Link } from 'react-router-dom';

import { paths } from 'data';
import { useAuth } from 'auth';
import { AsyncContainer } from 'components';

import AddPlaylistDialog from './AddPlaylistDialog';

export default withStyles((theme) => ({
  root: {
    flex: 1,
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
      {!playlists ? null : _.isEmpty(playlists) ? (
        <div className={classes.emptyMessageContainer}>
          <Typography variant="h5" color="textSecondary">
            Create New Playlist!
          </Typography>
        </div>
      ) : (
        <List>
          {_.map(playlists, (playlist) => (
            <ListItem
              key={playlist.id}
              component={Link}
              button
              to={`/playlist/${playlist.id}`}
            >
              <ListItemText
                primary={playlist.name}
                secondary={formatDistanceWithOptions(
                  { addSuffix: true },
                  new Date(),
                )(playlist.createdAt.toDate())}
              />
            </ListItem>
          ))}
        </List>
      )}

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
