import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';

import { AuthProvider } from 'auth';
import { AppContextProvider } from 'context';
import * as config from 'config';
import { Layout } from 'components';
import { Home, Playlist, Playlists, NeedSignIn, NotFound } from 'pages';
import theme from 'theme';

export default function App() {
  firebase.initializeApp(config.firebase);

  return (
    <Router>
      <AuthProvider>
        {({ isPending, isAuthenticated }) => (
          <AppContextProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Layout loading={isPending}>
                <Switch>
                  <Route path="/" exact>
                    <Home />
                  </Route>
                  <Route path="/playlist" exact>
                    {isAuthenticated ? <Playlists /> : <NeedSignIn />}
                  </Route>
                  <Route path="/playlist/:playlistId">
                    <Playlist />
                  </Route>
                  <Route path="*">
                    <NotFound />
                  </Route>
                </Switch>
              </Layout>
            </ThemeProvider>
          </AppContextProvider>
        )}
      </AuthProvider>
    </Router>
  );
}
