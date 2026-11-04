const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withAngularNative } = require('@ng-native/metro/config.cjs');

module.exports = withAngularNative(getDefaultConfig(__dirname), {
  workspaceRoot: path.resolve(__dirname, '../..'),
});
