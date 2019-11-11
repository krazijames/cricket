import React from 'react';
import firebase from 'firebase/app';

import AuthContext from './AuthContext';

export default function ContextProvider({ children, ...props }) {
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
    });
  }, []);

  async function signOut() {
    await firebase.auth().signOut();
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signOut }} {...props}>
      {children instanceof Function ? (
        <AuthContext.Consumer>{children}</AuthContext.Consumer>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
