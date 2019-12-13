import { youtube as youtubeApi } from '@cricket/api';
import { AsyncContainer } from '@cricket/components';
import { useDialog } from '@cricket/hooks';
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import _ from 'lodash';
import fp from 'lodash/fp';
import React from 'react';

import itemMapper from './itemMapper';

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

const AddItemDialog = withStyles((theme) => ({
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
  const inputRef = React.useRef();

  function handleQueryChange(event) {
    setQuery(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    inputRef.current && inputRef.current.blur();

    try {
      setIsPending(true);
      setErrorMessage();

      const youTubeVideos = await searchYouTubeVideos(query);

      setItems(
        fp.map((video) =>
          itemMapper({
            type: 'youtube',
            data: video,
          }),
        )(youTubeVideos),
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

  function handleItemClick({ type, data }) {
    return () => {
      onOk({ type, data });
    };
  }

  React.useEffect(
    function reset() {
      if (open) {
        setQuery('');
        setItems();
        setErrorMessage();
        setIsPending(false);
      }
    },
    [open],
  );

  return (
    <Dialog
      open={open}
      fullWidth
      fullScreen
      disableBackdropClick={isPending}
      disableEscapeKeyDown={isPending}
      onClose={onClose}
      {...props}
    >
      <DialogTitle>
        <div>Add Item</div>

        <form className={classes.searchField} onSubmit={handleSubmit}>
          <TextField
            className={classes.searchInput}
            inputRef={inputRef}
            autoFocus
            margin="dense"
            placeholder="Search from YouTube"
            fullWidth
            required
            disabled={isPending}
            value={query}
            onChange={handleQueryChange}
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
          <AsyncContainer loading={isPending}>
            {_.isEmpty(items) ? (
              <Typography variant="body2" color="textSecondary">
                No search result.
              </Typography>
            ) : (
              <List dense>
                {_.map(items, (item) => (
                  <ListItem
                    key={item.mediaId}
                    alignItems="flex-start"
                    button
                    disabled={isPending}
                    onClick={handleItemClick(item)}
                  >
                    <ListItemAvatar>
                      <Avatar src={item.thumbnailUrl} variant="rounded" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.title}
                      secondary={item.author}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </AsyncContainer>
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

export const useAddItemDialog = () => useDialog(AddItemDialog);

export default AddItemDialog;
