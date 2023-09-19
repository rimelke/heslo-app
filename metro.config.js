// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver = defaultConfig.resolver || {};
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts || [];
defaultConfig.resolver.assetExts.push("wasm");

defaultConfig.resolver.unstable_enablePackageExports = true;
defaultConfig.resolver.unstable_conditionNames = [
  "browser",
  "require",
  "react-native",
  "import",
];

module.exports = defaultConfig;
