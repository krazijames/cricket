import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/firestore';

import { AuthProvider } from 'auth';
import * as config from 'config';
import { Layout } from 'components';
import { Home, Playlists, NeedSignIn, NotFound } from 'pages';
import theme from 'theme';

firebase.initializeApp(config.firebase);

export default function App() {
  return (
    <Router>
      <AuthProvider>
        {({ isPending, isAuthenticated }) => (
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
                <Route path="*">
                  <NotFound />
                </Route>
              </Switch>
            </Layout>
          </ThemeProvider>
        )}
      </AuthProvider>
    </Router>
  );
}
