import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureBucket } from '../src';

describe('SecureBucket Versioning Testing', () => {

  describe('SecureBucket Versioning Enable Testing', () => {

    const app = new App();
    const stack = new Stack(app, 'TestingStack');
    const bucket = new SecureBucket(stack, 'SecureBucket', {
      bucketName: 'example-secure-bucket',
      encryption: s3.BucketEncryption.KMS_MANAGED,
      versioned: true,
    });

    const template = Template.fromStack(stack);

    it('Is Bucket', () => {
      expect(bucket).toBeInstanceOf(s3.Bucket);
    });

    it('Should versioning enabled', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        VersioningConfiguration: Match.objectEquals({
          Status: 'Enabled',
        }),
      });
    });

    it('Should match snapshot', () => {
      expect(template.toJSON()).toMatchSnapshot('versioning-enable');
    });
  });

  describe('SecureBucket Versioning Disable Testing', () => {

    const app = new App();
    const stack = new Stack(app, 'TestingStack');
    const bucket = new SecureBucket(stack, 'SecureBucket', {
      bucketName: 'example-secure-bucket',
      encryption: s3.BucketEncryption.KMS_MANAGED,
      versioned: false,
    });

    const template = Template.fromStack(stack);

    it('Is Bucket', () => {
      expect(bucket).toBeInstanceOf(s3.Bucket);
    });

    it('Should versioning disabled (no VersioningConfiguration)', () => {
      const resources = template.findResources('AWS::S3::Bucket');
      for (const resource of Object.values(resources)) {
        expect(resource.Properties).not.toHaveProperty('VersioningConfiguration');
      }
    });

    it('Should match snapshot', () => {
      expect(template.toJSON()).toMatchSnapshot('versioning-disable');
    });
  });
});