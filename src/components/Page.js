import React from 'react';

import { useAppContext } from 'context';

export default function Page({
  component: Component = 'div',
  title = 'Cricket',
  ...props
}) {
  const [, updateContext] = useAppContext();

  React.useEffect(() => {
    updateContext({ title });
  }, [title, updateContext]);

  return <Component {...props} />;
}
