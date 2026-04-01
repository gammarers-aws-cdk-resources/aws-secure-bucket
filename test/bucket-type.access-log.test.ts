import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureBucket, SecureBucketType } from '../src';

describe('SecureBucket bucketType=ACCESS_LOG_BUCKET Testing', () => {

  const app = new App();
  const stack = new Stack(app, 'TestingStack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  const bucket = new SecureBucket(stack, 'SecureBucket', {
    bucketType: SecureBucketType.ACCESS_LOG_BUCKET,
  });

  it('Is Bucket', () => {
    expect(bucket).toBeInstanceOf(s3.Bucket);
  });

  const template = Template.fromStack(stack);

  it('Should have encryption (S3 managed / AES256)', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: Match.objectEquals({
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'AES256',
            },
          },
        ],
      }),
    });
  });

  it('Should allow minimal log delivery put to AWSLogs/account prefix', () => {
    const resourceForAccountPrefix = Match.objectLike({
      'Fn::Join': [
        '',
        Match.arrayWith([
          Match.objectLike({
            'Fn::GetAtt': [
              Match.stringLikeRegexp('SecureBucket'),
              'Arn',
            ],
          }),
          '/AWSLogs/123456789012/*',
        ]),
      ],
    });

    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Allow',
            Action: 's3:PutObject',
            Principal: { Service: 'logdelivery.elasticloadbalancing.amazonaws.com' },
            Resource: resourceForAccountPrefix,
          }),
          Match.objectLike({
            Effect: 'Allow',
            Action: 's3:PutObject',
            Principal: { Service: 'delivery.logs.amazonaws.com' },
            Resource: resourceForAccountPrefix,
          }),
          Match.objectLike({
            Effect: 'Allow',
            Action: 's3:PutObject',
            Principal: { Service: 'logging.s3.amazonaws.com' },
            Resource: resourceForAccountPrefix,
          }),
        ]),
      }),
    });
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });
});

