const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Prevent Metro from resolving modules from the parent directory's node_modules.
// This fixes the "Invalid hook call" error caused by duplicate React copies
// (React 18 in frontend/node_modules vs React 19 in frontend/app/node_modules).
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

// Ensure the project root is scoped to just the app directory
config.watchFolders = [];

module.exports = config;
