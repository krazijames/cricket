import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';

import theme from 'theme';
import { Layout } from 'components';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>Cricket</Layout>
    </ThemeProvider>
  );
}
