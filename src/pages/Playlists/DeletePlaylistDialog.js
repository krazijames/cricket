import React from 'react';
import { DialogContentText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';

import { paths } from 'data';

import { AsyncDialog } from 'components';
import { useDialog } from 'hooks';

const DeletePlaylistDialog = withStyles((theme) => ({}))(
  function DeletePlaylistDialog({ classes, playlist: { id, name }, ...props }) {
    const handleOk = React.useCallback(async () => {
      await firebase
        .firestore()
        .doc(`${paths.PLAYLISTS}/${id}`)
        .delete();
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
