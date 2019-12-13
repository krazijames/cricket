import { paths } from '@cricket/data';
import firebase from 'firebase/app';
import _ from 'lodash';
import React from 'react';

import AuthContext from './AuthContext';

export default function ContextProvider({ children, ...props }) {
  const [isPending, setIsPending] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState();
  const [error, setError] = React.useState();

  const isAuthenticated = !!currentUser;

  React.useEffect(function handleAuthStateChange() {
    return firebase.auth().onAuthStateChanged(async (user) => {
      try {
        await firebase.auth().getRedirectResult();

        setCurrentUser(user);

        if (!user) {
          return;
        }

        const userInfo = _.pick(user.toJSON(), [
          'displayName',
          'email',
          'emailVerified',
          'photoURL',
          'phoneNumber',
          'isAnonymous',
        ]);

        const userRef = await firebase
          .firestore()
          .collection(paths.USERS)
          .doc(user.uid);

        const userSnapshot = await userRef.get();

        if (userSnapshot.exists) {
          await userRef.update(userInfo);
        } else {
          await userRef.set(userInfo);
        }
      } catch (error) {
        setError(error);
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
        error,
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
