module.exports = function (api) {
  // api.caller() auto-handles caching — do not also call api.cache()
  const isWeb = api.caller((caller) => caller && caller.name === 'babel-loader');
  return {
    presets: ['babel-preset-expo'],
    plugins: isWeb ? [] : ['react-native-reanimated/plugin'],
  };
};
