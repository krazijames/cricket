import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';

import { paths } from 'data';
import { useDialog } from 'hooks';

import PlaylistDialog from './PlaylistDialog';

const EditPlaylistDialog = withStyles((theme) => ({}))(
  function EditPlaylistDialog({ ...props }) {
    const handleOk = React.useCallback(async ({ id, name }) => {
      await firebase
        .firestore()
        .collection(paths.PLAYLISTS)
        .doc(id)
        .update({
          name,
        });
    }, []);

    return (
      <PlaylistDialog title="Rename Playlist" onOk={handleOk} {...props} />
    );
  },
);

export const useEditPlaylistDialog = () => useDialog(EditPlaylistDialog);

export default EditPlaylistDialog;
