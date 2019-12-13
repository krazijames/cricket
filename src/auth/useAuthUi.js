import 'firebaseui/dist/firebaseui.css';

import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import React from 'react';

export default (authUiContainerSelector) => {
  React.useEffect(
    function renderAuthUi() {
      return firebase.auth().onAuthStateChanged((firebaseUser) => {
        const ui =
          firebaseui.auth.AuthUI.getInstance() ||
          new firebaseui.auth.AuthUI(firebase.auth());

        if (!firebaseUser) {
          ui.start(authUiContainerSelector, {
            signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
            callbacks: {
              signInSuccessWithAuthResult: () => false,
              signInFailure: console.error,
            },
          });
        }
      });
    },
    [authUiContainerSelector],
  );
};
