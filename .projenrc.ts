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
  description: 'An AWS CDK construct that defines an S3 bucket with security-focused defaults. It wraps the standard s3.Bucket and applies settings that follow AWS best practices, so you can create buckets without accidentally leaving them open or unencrypted. You can still override any option or use it as a drop-in replacement where a regular s3.Bucket is expected. For CDK pipeline artifact buckets or CloudFront origins, use the bucketType option so encryption and resource policies are set appropriately.',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarers-aws-cdk-resources/aws-secure-bucket.git',
  keywords: ['aws', 'cdk', 'aws-cdk', 's3', 'bucket', 'secure', 'kms'],
  majorVersion: 3,
  releaseToNpm: true,
  npmTrustedPublishing: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '20.0.0',
  workflowNodeVersion: '24.x',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.WEEKLY,
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
