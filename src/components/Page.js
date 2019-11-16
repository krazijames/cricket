import React from 'react';
import { withStyles, useTheme } from '@material-ui/core/styles';

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
}))(function Page({ classes, appBarProps, ...props }) {
  const theme = useTheme();
  const [, updateContext, defaultContext] = useAppContext();

  React.useEffect(() => {
    updateContext({
      appBarProps: appBarProps ? appBarProps : defaultContext.appBarProps,
    });
  }, [appBarProps, updateContext, defaultContext.appBarProps]);

  return (
    <AsyncContainer
      classes={classes}
      progressProps={{ size: theme.app.progressSize }}
      {...props}
    />
  );
});
