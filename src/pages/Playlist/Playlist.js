import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';

import { Page } from 'components';
import { paths } from 'data';

export default withStyles((theme) => ({}))(function Playlist({ classes }) {
  const { playlistId } = useParams();

  const [playlist, setPlaylist] = React.useState();

  React.useEffect(() => {
    return firebase
      .firestore()
      .doc(`${paths.PLAYLISTS}/${playlistId}`)
      .onSnapshot((doc) => {
        setPlaylist({ id: doc.id, ...doc.data() });
      });
  }, [playlistId]);

  return (
    <Page title={playlist && playlist.name}>Playlist ID: {playlistId}</Page>
  );
});
