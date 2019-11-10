import React from 'react';
import firebase from 'firebase/app';

export default () => {
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
          photoURL: firebaseUser.photoURL,
          isAnonymous: firebaseUser.isAnonymous,
        },
      );
    });
  }, []);

  async function signOut() {
    await firebase.auth().signOut();
  }

  return {
    isAuthenticated,
    user,
    signOut,
  };
};
