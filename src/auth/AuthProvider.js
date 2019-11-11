import React from 'react';
import firebase from 'firebase/app';

import AuthContext from './AuthContext';

export default function ContextProvider({ children, ...props }) {
  const [isPending, setIsPending] = React.useState(true);
  const [user, setUser] = React.useState();

  const isAuthenticated = !!user;

  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged((firebaseUser) => {
      setUser(
        firebaseUser && {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
          photoUrl: firebaseUser.photoURL,
          isAnonymous: firebaseUser.isAnonymous,
        },
      );

      (async () => {
        try {
          await firebase.auth().getRedirectResult();
        } finally {
          setIsPending(false);
        }
      })();
    });
  }, []);

  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: 'select_account',
    });

    firebase.auth().signInWithRedirect(provider);
  }

  async function signOut() {
    await firebase.auth().signOut();
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isPending, user, signInWithGoogle, signOut }}
      {...props}
    >
      {children instanceof Function ? (
        <AuthContext.Consumer>{children}</AuthContext.Consumer>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
