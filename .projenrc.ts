import { typescript } from 'projen';
const project = new typescript.TypeScriptProject({
  authorName: 'John Nguyen',
  authorEmail: 'johnyscrazy@gmail.com',
  projenrcTs: true,
  defaultReleaseBranch: 'main',
  name: 's3-simpler',
  deps: ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'], /* Runtime dependencies of this module. */
  description: "Let's be honest. What do you need when working with S3? Right, simply uploading, downloading, and sharing.", /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: ['aws-sdk-client-mock', '@tsconfig/recommended', 'ts-node'], /* Build dependencies for this module. */
  testdir: 'tests',
  jestOptions: {
    jestConfig: {
      testTimeout: 90000,
    },
  },
});
project.synth();