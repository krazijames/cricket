import { AsyncDialog } from '@cricket/components';
import { paths } from '@cricket/data';
import { useDialog } from '@cricket/hooks';
import { DialogContentText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import React from 'react';

const DeletePlaylistDialog = withStyles((theme) => ({}))(
  function DeletePlaylistDialog({ classes, playlist: { id, name }, ...props }) {
    const handleOk = React.useCallback(async () => {
      const db = firebase.firestore();

      await db.runTransaction(async (transaction) => {
        return await transaction.delete(db.doc(`${paths.PLAYLISTS}/${id}`));
      });
    }, [id]);

    return (
      <AsyncDialog
        title="Delete Playlist"
        okButtonProps={{ color: 'primary', children: 'Delete' }}
        onOk={handleOk}
        {...props}
      >
        <DialogContentText>
          Are you sure to delete <strong>{name}</strong>?
        </DialogContentText>
      </AsyncDialog>
    );
  },
);

export const useDeletePlaylistDialog = () => useDialog(DeletePlaylistDialog);

export default DeletePlaylistDialog;
