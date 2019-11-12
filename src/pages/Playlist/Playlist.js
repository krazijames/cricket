import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import { Page } from 'components';

export default withStyles((theme) => ({}))(function Playlist({ classes }) {
  const { playlistId } = useParams();
  return <Page>Playlist ID: {playlistId}</Page>;
});
