import 'firebase/analytics';
import 'firebase/firestore';
import 'firebase/functions';

import { AuthProvider } from '@cricket/auth';
import { Layout, Page } from '@cricket/components';
import * as config from '@cricket/config';
import { AppContextProvider } from '@cricket/context';
import {
  NeedSignInPage,
  NotFoundPage,
  PlaylistPage,
  PlaylistsPage,
} from '@cricket/pages';
import theme from '@cricket/theme';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import firebase from 'firebase/app';
import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

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
