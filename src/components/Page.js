import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { useAppContext } from 'context';
import { AsyncContainer } from 'components';

export default withStyles((theme) => ({
  root: {
    flex: 1,
  },
  contentContainer: {},
  progressContainer: {
    position: 'fixed',
  },
}))(function Page({ classes, title = 'Cricket', ...props }) {
  const [, updateContext] = useAppContext();

  React.useEffect(() => {
    updateContext({ title });
  }, [title, updateContext]);

  return (
    <AsyncContainer
      classes={classes}
      progressProps={{ size: '25vmin' }}
      {...props}
    />
  );
});
