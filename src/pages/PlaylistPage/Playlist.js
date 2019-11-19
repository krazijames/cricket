import React from 'react';
import _ from 'lodash';
import { List } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import { Element as ScrollElement, scroller } from 'react-scroll';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';

import { paths } from 'data';

import PlaylistItem from './PlaylistItem';

const scrollDuration = 300;

const SortablePlaylistItem = SortableElement(function SortablePlaylistItem({
  item,
  ...props
}) {
  return (
    <ScrollElement name={item.id}>
      <PlaylistItem ContainerComponent="div" item={item} {...props} />
    </ScrollElement>
  );
});

const SortablePlaylist = SortableContainer(function SortablePlaylist({
  index,
  playlistId,
  items,
  currentItem,
  onItemClick,
  ...props
}) {
  const handleItemClick = React.useCallback(
    (item) => {
      return () => onItemClick(item);
    },
    [onItemClick],
  );

  return (
    <List dense {...props}>
      {_.map(items, (item, index) => (
        <SortablePlaylistItem
          key={item.id}
          index={index}
          playlistId={playlistId}
          item={item}
          selected={currentItem && item.id === currentItem.id}
          onClick={handleItemClick(item)}
        />
      ))}
    </List>
  );
});

export default withStyles((theme) => ({}))(function Playlist({
  classes,
  playlistId,
  items,
  currentItem,
  keepScrollToCurrentItem,
  onItemClick,
  onItemSorted,
  ...props
}) {
  const handleSortEnd = React.useCallback(
    async ({ oldIndex, newIndex }) => {
      const sortedItems = _.map(
        arrayMove(items, oldIndex, newIndex),
        (item, index) => ({
          ...item,
          displayOrder: index,
        }),
      );

      onItemSorted(sortedItems);

      const db = firebase.firestore();
      const batch = db.batch();
      _.forEach(sortedItems, (item) => {
        batch.update(
          db
            .collection(`${paths.PLAYLISTS}/${playlistId}/${paths.ITEMS}`)
            .doc(item.id),
          {
            displayOrder: item.displayOrder,
          },
        );
      });
      await batch.commit();
    },
    [playlistId, items, onItemSorted],
  );

  React.useEffect(
    function scrollToCurrentItem() {
      if (!keepScrollToCurrentItem || !currentItem) {
        return;
      }

      scroller.scrollTo(currentItem.id, {
        duration: scrollDuration,
        smooth: true,
        offset: -100,
      });
    },
    [keepScrollToCurrentItem, currentItem],
  );

  return (
    <SortablePlaylist
      playlistId={playlistId}
      items={items}
      currentItem={currentItem}
      lockAxis="y"
      pressDelay={200}
      useWindowAsScrollContainer
      onItemClick={onItemClick}
      onSortEnd={handleSortEnd}
      {...props}
    />
  );
});
