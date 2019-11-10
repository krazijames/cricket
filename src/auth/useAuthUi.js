import React from 'react';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

export default (authUiContainerSelector) => {
  const [isPending, setIsPending] = React.useState(true);

  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged((firebaseUser) => {
      const ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(firebase.auth());

      setIsPending(ui.isPendingRedirect());

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
  }, [authUiContainerSelector]);

  return isPending;
};
