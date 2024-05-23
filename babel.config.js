/* eslint-disable no-undef */
module.exports = (api) => {
  // cache the result of babel config execution funtion for dev builds
  api.cache.using(() => process.env.NODE_ENV === 'development');
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: {
            version: 3,
            proposals: true,
          },
        },
        '@babel/preset-typescript',
      ],
    ],
  };
};