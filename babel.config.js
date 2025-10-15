module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@context': './src/context',
            '@theme': './src/theme',
            '@types': './src/types',
            '@utils': './src/utils',
            '@services': './src/services'
          }
        }
      ]
    ]
  };
};
