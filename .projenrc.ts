import { awscdk, javascript, github } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  authorOrganization: true,
  cdkVersion: '2.189.1',
  jsiiVersion: '5.9.x',
  typescriptVersion: '5.9.x',
  defaultReleaseBranch: 'main',
  name: 'aws-secure-bucket',
  description: 'This is a Simple S3 Secure Bucket.',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarers-aws-cdk-resources/aws-secure-bucket.git',
  keywords: ['aws', 'cdk', 'aws-cdk', 's3', 'bucket', 'secure', 'kms'],
  majorVersion: 2,
  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '20.0.0',
  workflowNodeVersion: '22.x',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      // schedule: javascript.UpgradeDependenciesSchedule.WEEKLY,
    },
  },
  githubOptions: {
    projenCredentials: github.GithubCredentials.fromApp({
      permissions: {
        pullRequests: github.workflows.AppPermission.WRITE,
        contents: github.workflows.AppPermission.WRITE,
      },
    }),
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: [
      'gammarers-projen-upgrade-bot[bot]',
      'yicr',
    ],
  },
  // publishToPypi: {
  //   distName: 'gammarers.aws-secure-bucket',
  //   module: 'gammarers.aws_secure_bucket',
  // },
  // publishToNuget: {
  //   dotNetNamespace: 'Gammarers.CDK.AWS',
  //   packageId: 'Gammarers.CDK.AWS.SecureBucket',
  // },
});
project.synth();
