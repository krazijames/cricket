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
      const functions = firebase.functions();

      if (process.env.NODE_ENV === 'development') {
        functions.useFunctionsEmulator('http://localhost:5000');
      }

      await functions.httpsCallable('recursiveDelete')({
        path: `${paths.PLAYLISTS}/${id}`,
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
