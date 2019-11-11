import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';

import { paths } from 'data';

import PlaylistDialog from './PlaylistDialog';

export default withStyles((theme) => ({}))(function EditPlaylistDialog({
  onClose,
  ...props
}) {
  async function onOk({ id, name }) {
    const db = firebase.firestore();

    await db
      .collection(paths.PLAYLISTS)
      .doc(id)
      .update({
        name,
      });

    onClose();
  }

  return (
    <PlaylistDialog
      title="Rename Playlist"
      onOk={onOk}
      onClose={onClose}
      {...props}
    />
  );
});
