import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';

import theme from 'theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <h1>Cricket</h1>
    </ThemeProvider>
  );
}
