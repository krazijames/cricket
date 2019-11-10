import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import { Router } from '@reach/router';

import theme from 'theme';
import { Home, SignIn } from 'pages';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Home path="/" />
        <SignIn path="signin" />
      </Router>
    </ThemeProvider>
  );
}
