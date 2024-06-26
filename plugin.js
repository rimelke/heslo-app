const { withAppBuildGradle } = require("expo/config-plugins");

const withFixBuild = (rawConfig) =>
  withAppBuildGradle(rawConfig, async (config) => {
    const newContents = config.modResults.contents.replace(
      "android {",
      `android {
    packagingOptions {
        pickFirst 'lib/arm64-v8a/libreact_nativemodule_core.so'
        pickFirst 'lib/armeabi-v7a/libreact_nativemodule_core.so'
        pickFirst 'lib/x86/libreact_nativemodule_core.so'
        pickFirst 'lib/x86_64/libreact_nativemodule_core.so'

        pickFirst 'lib/arm64-v8a/libturbomodulejsijni.so'
        pickFirst 'lib/armeabi-v7a/libturbomodulejsijni.so'
        pickFirst 'lib/x86/libturbomodulejsijni.so'
        pickFirst 'lib/x86_64/libturbomodulejsijni.so'

        pickFirst 'lib/arm64-v8a/libcrypto.so'
        pickFirst 'lib/armeabi-v7a/libcrypto.so'
        pickFirst 'lib/x86/libcrypto.so'
        pickFirst 'lib/x86_64/libcrypto.so'

        pickFirst 'lib/arm64-v8a/libjsi.so'
        pickFirst 'lib/armeabi-v7a/libjsi.so'
        pickFirst 'lib/x86/libjsi.so'
        pickFirst 'lib/x86_64/libjsi.so'
    }
    `
    );

    config.modResults.contents = newContents;

    return config;
  });

module.exports = withFixBuild;
