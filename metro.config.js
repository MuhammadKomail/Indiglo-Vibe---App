const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

// Default Metro configuration
const defaultConfig = getDefaultConfig(__dirname);

// Custom Metro configuration
const customConfig = {
  resolver: {
    // Ensure Metro resolves WebSocket-related modules
    extraNodeModules: {
      ...require('node-libs-react-native'),
      ws: require.resolve('react-native-websocket'),
    },
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
  transformer: {
    // Optional: Enable inline requires for better performance
    inlineRequires: true,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
};

// Merge the default and custom configuration
const mergedConfig = mergeConfig(defaultConfig, customConfig);

// Wrap with Reanimated Metro configuration
module.exports = wrapWithReanimatedMetroConfig(mergedConfig);
