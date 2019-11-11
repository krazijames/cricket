import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';

import { useAuth } from 'auth';
import { paths } from 'data';

import PlaylistDialog from './PlaylistDialog';

export default withStyles((theme) => ({}))(function AddPlaylistDialog({
  onClose,
  ...props
}) {
  const { user } = useAuth();

  async function onOk({ name }) {
    const db = firebase.firestore();

    await db.collection(paths.PLAYLISTS).add({
      name,
      ownerUserUids: [user.uid],
    });

    onClose();
  }

  return (
    <PlaylistDialog
      title="Add Playlist"
      onOk={onOk}
      onClose={onClose}
      {...props}
    />
  );
});
