import React from 'react';

import AppContext from './AppContext';

export default function AppContextProvider({ children, ...props }) {
  const [context, setContext] = React.useState({
    title: 'Cricket',
  });

  const updateContext = React.useCallback((newContext) => {
    setContext((prevContext) => ({ ...prevContext, ...newContext }));
  }, []);

  return (
    <AppContext.Provider value={[context, updateContext]} {...props}>
      {children instanceof Function ? (
        <AppContext.Consumer>{children}</AppContext.Consumer>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
}
