import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

export default withStyles((theme) => ({}))(function Playlist({ classes }) {
  const { playlistId } = useParams();
  return <div>Playlist ID: {playlistId}</div>;
});
