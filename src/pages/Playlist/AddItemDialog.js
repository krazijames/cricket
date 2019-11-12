import React from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  TextField,
  Typography,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import ytDurationFormat from 'youtube-duration-format';

import { youtube as youtubeApi } from 'api';
import { AsyncContainer } from 'components';

async function searchYouTubeVideos(query) {
  const {
    data: { items },
  } = await youtubeApi.get('search', {
    part: 'id',
    q: query,
    type: 'video',
    videoEmbeddable: 'true',
    videoSyndicated: 'true',
    maxResults: 50,
  });

  const videoIds = fp.flow(
    fp.map((item) => item.id.videoId),
    fp.join(','),
  )(items);

  const {
    data: { items: videos },
  } = await youtubeApi.get('videos', {
    part: 'snippet, contentDetails',
    id: videoIds,
  });

  return videos;
}

export default withStyles((theme) => ({
  searchField: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))(function AddItemDialog({ classes, open, title, onOk, onClose, ...props }) {
  const [items, setItems] = React.useState();
  const [isPending, setIsPending] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState();

  function onQueryChange(event) {
    setQuery(event.target.value);
  }

  async function onSubmit(event) {
    event.preventDefault();

    try {
      setIsPending(true);
      setErrorMessage();

      const youTubeVideos = await searchYouTubeVideos(query);

      setItems(
        fp.map((video) => ({
          id: video.id,
          title: video.snippet.title,
          author: video.snippet.channelTitle,
          thumbnailUrl: video.snippet.thumbnails.high.url,
          duration: ytDurationFormat(video.contentDetails.duration),
        }))(youTubeVideos),
      );
    } catch (error) {
      setErrorMessage(
        (error &&
          error.data &&
          ((error.data.error && error.data.error.message) ||
            error.data.message)) ||
          error.message,
      );
    } finally {
      setIsPending(false);
    }
  }

  React.useEffect(() => {
    if (open) {
      setQuery('');
      setItems();
      setErrorMessage();
      setIsPending(false);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      fullWidth
      disableBackdropClick={isPending}
      disableEscapeKeyDown={isPending}
      onClose={onClose}
      {...props}
    >
      <DialogTitle>
        <div>Add Item</div>

        <form className={classes.searchField} onSubmit={onSubmit}>
          <TextField
            className={classes.searchInput}
            autoFocus
            margin="dense"
            placeholder="Search from YouTube"
            fullWidth
            required
            disabled={isPending}
            value={query}
            onChange={onQueryChange}
          />

          <AsyncContainer loading={isPending} loadingContentOpacity={0}>
            <IconButton type="submit" disabled={isPending}>
              <SearchIcon />
            </IconButton>
          </AsyncContainer>
        </form>

        {errorMessage && (
          <DialogContentText variant="body2" color="error">
            {errorMessage}
          </DialogContentText>
        )}
      </DialogTitle>

      {items && (
        <DialogContent>
          {_.isEmpty(items) ? (
            <Typography variant="body2" color="textSecondary">
              No search result.
            </Typography>
          ) : (
            <List dense>
              {_.map(items, (item) => (
                <ListItem key={item.id} alignItems="flex-start" button>
                  <ListItemAvatar>
                    <Avatar src={item.thumbnailUrl} variant="rounded" />
                  </ListItemAvatar>
                  <ListItemText primary={item.title} secondary={item.author} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      )}

      <IconButton
        className={classes.closeButton}
        size="small"
        disabled={isPending}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </Dialog>
  );
});