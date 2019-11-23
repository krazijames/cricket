import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/firestore';
import 'firebase/functions';

import { AuthProvider } from 'auth';
import { AppContextProvider } from 'context';
import * as config from 'config';
import { Layout, Page } from 'components';
import {
  PlaylistPage,
  PlaylistsPage,
  NeedSignInPage,
  NotFoundPage,
} from 'pages';
import theme from 'theme';

export default function App() {
  firebase.initializeApp(config.firebase);
  firebase.analytics();

  return (
    <Router>
      <AuthProvider>
        {({ isPending, isAuthenticated, error }) => (
          <AppContextProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Layout loading={isPending}>
                {error ? (
                  <Page error={error} />
                ) : (
                  <Switch>
                    <Route path="/" exact>
                      {isAuthenticated ? <PlaylistsPage /> : <NeedSignInPage />}
                    </Route>
                    <Route path="/playlist/:playlistId" exact>
                      <PlaylistPage />
                    </Route>
                    <Route path="*">
                      <NotFoundPage />
                    </Route>
                  </Switch>
                )}
              </Layout>
            </ThemeProvider>
          </AppContextProvider>
        )}
      </AuthProvider>
    </Router>
  );
}
