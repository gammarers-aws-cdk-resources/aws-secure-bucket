import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureBucket, SecureBucketType } from '../src';

describe('SecureBucket is CloudFront origin Bucket Testing', () => {

  const app = new App();
  const stack = new Stack(app, 'TestingStack');

  const bucket = new SecureBucket(stack, 'SecureBucket', {
    bucketType: SecureBucketType.CLOUDFRONT_ORIGIN_BUCKET,
  });

  it('Is Bucket', () => {
    expect(bucket).toBeInstanceOf(s3.Bucket);
  });

  const template = Template.fromStack(stack);

  it('Should have encryption', () => {
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

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });
});
