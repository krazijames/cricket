import React from 'react';
import { withStyles, useTheme } from '@material-ui/core/styles';

import { useAppContext } from 'context';
import { AsyncContainer } from 'components';

export default withStyles((theme) => ({
  root: {
    flex: 1,
    paddingBottom: theme.spacing(10),
  },
  contentContainer: {},
  progressContainer: {
    position: 'fixed',
  },
}))(function Page({ classes, title = 'Cricket', ...props }) {
  const theme = useTheme();
  const [, updateContext] = useAppContext();

  React.useEffect(() => {
    updateContext({ title });
  }, [title, updateContext]);

  return (
    <AsyncContainer
      classes={classes}
      progressProps={{ size: theme.spacing(10) }}
      {...props}
    />
  );
});
