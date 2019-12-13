import { useAuth } from '@cricket/auth';
import { paths } from '@cricket/data';
import { useDialog } from '@cricket/hooks';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import React from 'react';

import PlaylistDialog from './PlaylistDialog';

const AddPlaylistDialog = withStyles((theme) => ({}))(
  function AddPlaylistDialog({ ...props }) {
    const { user } = useAuth();

    const handleOk = React.useCallback(
      async ({ name }) => {
        await firebase
          .firestore()
          .collection(paths.PLAYLISTS)
          .add({
            name,
            ownerUserUids: [user.uid],
            createdAt: new Date(),
          });
      },
      [user.uid],
    );

    return <PlaylistDialog title="New Playlist" onOk={handleOk} {...props} />;
  },
);

export const useAddPlaylistDialog = () => useDialog(AddPlaylistDialog);

export default AddPlaylistDialog;
