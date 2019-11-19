import ytDurationFormat from 'youtube-duration-format';

export default (item) => {
  const { id, type, displayOrder, createdAt, data } = item;

  switch (type) {
    case 'youtube':
      return {
        id,
        type,
        displayOrder,
        createdAt,
        data,

        mediaId: data.id,
        title: data.snippet.title,
        author: data.snippet.channelTitle,
        thumbnailUrl: data.snippet.thumbnails.high.url,
        duration: ytDurationFormat(data.contentDetails.duration),
      };
    default:
      return item;
  }
};
