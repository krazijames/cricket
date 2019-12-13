const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@cricket': path.resolve(__dirname, 'src'),
    },
  },
};
