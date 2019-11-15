import React from 'react';
import _ from 'lodash';
import firebase from 'firebase/app';

import { paths } from 'data';

import AuthContext from './AuthContext';

export default function ContextProvider({ children, ...props }) {
  const [isPending, setIsPending] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState();

  const isAuthenticated = !!currentUser;

  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged(async (firebaseUserInfo) => {
      try {
        const user = firebaseUserInfo && {
          uid: firebaseUserInfo.uid,
          displayName: firebaseUserInfo.displayName,
          email: firebaseUserInfo.email,
          emailVerified: firebaseUserInfo.emailVerified,
          photoUrl: firebaseUserInfo.photoURL,
          isAnonymous: firebaseUserInfo.isAnonymous,
        };

        if (user) {
          const userRef = await firebase
            .firestore()
            .collection(paths.USERS)
            .doc(user.uid);

          const userSnapshot = await userRef.get();

          if (userSnapshot.exists) {
            await userRef.update(_.omit(user, 'uid'));
          } else {
            await userRef.set(_.omit(user, 'uid'));
          }
        }

        await firebase.auth().getRedirectResult();

        setCurrentUser(user);
      } finally {
        setIsPending(false);
      }
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
      value={{
        isAuthenticated,
        isPending,
        user: currentUser,
        signInWithGoogle,
        signOut,
      }}
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
