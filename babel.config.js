module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
<<<<<<< HEAD
=======
      'react-native-reanimated/plugin',
>>>>>>> def79ad25966723396227af1aac03b42a879d524
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
<<<<<<< HEAD
      ],
      'react-native-reanimated/plugin'
=======
      ]
>>>>>>> def79ad25966723396227af1aac03b42a879d524
    ]
  };
};
