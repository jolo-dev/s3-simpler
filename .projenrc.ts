import { typescript } from 'projen';
import { NodePackageManager } from 'projen/lib/javascript';
const project = new typescript.TypeScriptProject({
  authorName: 'John Nguyen',
  authorEmail: 'johnyscrazy@gmail.com',
  projenrcTs: true,
  defaultReleaseBranch: 'main',
  packageManager: NodePackageManager.PNPM,
  name: 's3-simpler',
  deps: ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'], /* Runtime dependencies of this module. */
  description: "Let's be honest. What do you need when working with S3? Right, simply uploading, downloading, and sharing.", /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: ['aws-sdk-client-mock', '@tsconfig/recommended', 'ts-node', '@aws-sdk/types@^3.0.0', '@types/jest'], /* Build dependencies for this module. */
  testdir: 'tests',
  jestOptions: {
    configFilePath: './jest.config.json',
    jestConfig: {
      testTimeout: 90000,
      projects: ['<rootDir>/tests/*'],
    },
  },
  gitignore: ['coverage/'],
});

project.setScript('test:unit', 'npx jest --projects tests/unit');
project.setScript('test:integration', 'npx jest --projects tests/integration');
project.synth();