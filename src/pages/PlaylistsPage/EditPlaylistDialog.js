import { paths } from '@cricket/data';
import { useDialog } from '@cricket/hooks';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import React from 'react';

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
