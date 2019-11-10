import _ from 'lodash';

const type = 'dark';

export default _.merge(
  {
    type,

    primary: { main: '#e10010' },
    secondary: { main: '#065fd4' },
    error: { main: '#e10010' },
  },
  type === 'light' && {},
  type === 'dark' && {
    background: {
      paper: '#282828',
      default: '#1f1f1f',
    },
  },
);
