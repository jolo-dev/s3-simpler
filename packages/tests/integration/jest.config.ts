import mainConfig from '../../jest.config.json';

module.exports = {
  ...mainConfig,
  name: 'integration',
  displayName: 'Integration Tests',

  // A list of paths to directories that
  // Jest should use to search for files in
  roots: [
    '<rootDir>',
  ],
};