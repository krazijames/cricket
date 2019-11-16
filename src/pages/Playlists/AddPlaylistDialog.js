import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';

import { useAuth } from 'auth';
import { paths } from 'data';

import PlaylistDialog from './PlaylistDialog';

export default withStyles((theme) => ({}))(function AddPlaylistDialog({
  ...props
}) {
  const { user } = useAuth();

  const handleOk = React.useCallback(
    async ({ name }) => {
      await firebase
        .firestore()
        .collection(paths.PLAYLISTS)
        .add({
          name,
          ownerUserUids: [user.uid],
          createdAt: new Date(),
        });
    },
    [user.uid],
  );

  return <PlaylistDialog title="New Playlist" onOk={handleOk} {...props} />;
});
