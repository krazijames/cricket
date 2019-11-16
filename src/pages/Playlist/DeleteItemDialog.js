import React from 'react';
import { DialogContentText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';

import { paths } from 'data';

import { AsyncDialog } from 'components';

export default withStyles((theme) => ({}))(function DeleteItemDialog({
  classes,
  playlistId,
  item: { id, title },
  ...props
}) {
  const handleOk = React.useCallback(async () => {
    await firebase
      .firestore()
      .doc(`${paths.PLAYLISTS}/${playlistId}/${paths.PLAYLIST_ITEMS}/${id}`)
      .delete();
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
