import { createMuiTheme } from '@material-ui/core';

import app from './app';
import palette from './palette';

const muiTheme = createMuiTheme({
  palette,
});

export default {
  ...muiTheme,
  app,
};
