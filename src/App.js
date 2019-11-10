import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import { Router } from '@reach/router';
import firebase from 'firebase/app';

import { AuthProvider } from 'auth';
import * as config from 'config';
import { Home } from 'pages';
import theme from 'theme';

firebase.initializeApp(config.firebase);

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Home path="/" />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}
