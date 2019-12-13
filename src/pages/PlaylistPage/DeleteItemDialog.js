import { AsyncDialog } from '@cricket/components';
import { paths } from '@cricket/data';
import { useDialog } from '@cricket/hooks';
import { DialogContentText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import React from 'react';

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
        db.doc(`${paths.PLAYLISTS}/${playlistId}/${paths.ITEMS}/${id}`),
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
