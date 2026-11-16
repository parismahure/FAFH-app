// Extends Expo's default Metro config. The previous version replaced
// `resolver` outright, which dropped platform resolution (.ios.js / .android.js)
// and broke imports such as react-native's DatePickerIOS.
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
