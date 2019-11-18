import React from 'react';
import MenuIcon from '@material-ui/icons/Menu';

import AppContext from './AppContext';

export default function AppContextProvider({ children, ...props }) {
  const [context, setContext] = React.useState();

  const updateContext = React.useCallback((newContext) => {
    setContext((prevContext) => ({
      ...prevContext,
      ...(newContext instanceof Function
        ? newContext(prevContext)
        : newContext),
    }));
  }, []);

  const defaultContext = React.useMemo(
    () => ({
      title: 'Cricket',
      description: 'Share your playlists!',
      appBarProps: {
        title: 'Cricket',
        primaryButtonProps: {
          style: { display: 'none' },
          children: <MenuIcon />,
          onClick: () => {
            updateContext(({ isSidebarOpen }) => ({
              isSidebarOpen: !isSidebarOpen,
            }));
          },
        },
      },
      isSidebarOpen: false,
    }),
    [updateContext],
  );

  React.useEffect(() => {
    setContext(defaultContext);
  }, [defaultContext]);

  return (
    <AppContext.Provider
      value={[context, updateContext, defaultContext]}
      {...props}
    >
      {context &&
        (children instanceof Function ? (
          <AppContext.Consumer>{children}</AppContext.Consumer>
        ) : (
          children
        ))}
    </AppContext.Provider>
  );
}
