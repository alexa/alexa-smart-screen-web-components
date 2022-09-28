module.exports = function babelConfig(api) {
  api.cache.forever();
  return {
    babelrcRoots: [
      '.'
    ],
    presets: [
      [
        '@babel/env',
        {
          corejs: "3.19.1",
          modules: false,
          useBuiltIns: 'usage',
          targets: {
            browsers: ['> 1%'],
          },
        },
      ],
      '@babel/typescript'
    ],
    plugins: [
      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      require.resolve('@babel/plugin-transform-runtime'),
      require.resolve('@babel/plugin-proposal-class-properties'),
      require.resolve('@babel/plugin-syntax-dynamic-import')
    ],
    env: {
      test: {
        presets: [
          [
            '@babel/env',
            {
              corejs: "3.19.1",
              useBuiltIns: 'usage',
              targets: {
                browsers: ['> 1%'],
              },
            },
          ],
          '@babel/typescript'
        ],
      },
    },
  };
};
