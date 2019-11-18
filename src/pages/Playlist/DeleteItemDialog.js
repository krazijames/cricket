import React from 'react';
import { DialogContentText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';

import { paths } from 'data';
import { AsyncDialog } from 'components';
import { useDialog } from 'hooks';

const DeleteItemDialog = withStyles((theme) => ({}))(function DeleteItemDialog({
  classes,
  playlistId,
  item: { id, title },
  ...props
}) {
  const handleOk = React.useCallback(async () => {
    const db = firebase.firestore();

    await db.runTransaction(async (transaction) => {
      return await transaction.delete(
        db.doc(
          `${paths.PLAYLISTS}/${playlistId}/${paths.PLAYLIST_ITEMS}/${id}`,
        ),
      );
    });
  }, [playlistId, id]);

  return (
    <AsyncDialog
      title="Delete Item"
      okButtonProps={{ color: 'primary', children: 'Delete' }}
      onOk={handleOk}
      {...props}
    >
      <DialogContentText>
        Are you sure to delete <strong>{title}</strong>?
      </DialogContentText>
    </AsyncDialog>
  );
});

export const useDeleteItemDialog = () => useDialog(DeleteItemDialog);

export default DeleteItemDialog;
