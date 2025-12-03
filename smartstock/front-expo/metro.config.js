const path = require('path');

let config;
try {
  // Prefer Expo's metro-config so transforms (including Flow) are handled correctly
  const { getDefaultConfig } = require('expo/metro-config');
  config = getDefaultConfig(__dirname);
} catch (e) {
  // Fallback minimal config (will be used if expo/metro-config isn't available)
  config = { resolver: {} };
}

config.resolver = config.resolver || {};
config.resolver.extraNodeModules = Object.assign({}, config.resolver.extraNodeModules, {
  'expo-barcode-scanner': path.resolve(__dirname, 'src/mocks/expo-barcode-scanner.js'),
});

config.watchFolders = Array.from(new Set([...(config.watchFolders || []), path.resolve(__dirname, 'src')]));

module.exports = config;
