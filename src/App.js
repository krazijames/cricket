import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import { Router } from '@reach/router';
import firebase from 'firebase/app';
import 'firebase/firestore';

import { AuthProvider } from 'auth';
import * as config from 'config';
import { Layout } from 'components';
import { Home, Playlists, NotFound } from 'pages';
import theme from 'theme';

firebase.initializeApp(config.firebase);

export default function App() {
  return (
    <AuthProvider>
      {({ isPending }) => (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout loading={isPending}>
            <Router component={React.Fragment} primary={false}>
              <Home path="/" />
              <Playlists path="/playlist" />
              <NotFound default />
            </Router>
          </Layout>
        </ThemeProvider>
      )}
    </AuthProvider>
  );
}
