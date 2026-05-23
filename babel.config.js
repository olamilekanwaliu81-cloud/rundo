module.exports = function (api) {
  api.cache(true);
  // Reanimated plugin only needed for native (iOS/Android), not web builds
  const isWeb = api.caller((caller) => caller && caller.name === 'babel-loader');
  return {
    presets: ['babel-preset-expo'],
    plugins: isWeb ? [] : ['react-native-reanimated/plugin'],
  };
};
