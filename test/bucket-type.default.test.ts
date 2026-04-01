import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureBucket } from '../src';

describe('SecureBucket bucketType=DEFAULT_BUCKET (implicit) Testing', () => {

  describe('Defaults', () => {
    const app = new App();
    const stack = new Stack(app, 'TestingStack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    const bucket = new SecureBucket(stack, 'SecureBucket');
    const template = Template.fromStack(stack);

    it('Is Bucket', () => {
      expect(bucket).toBeInstanceOf(s3.Bucket);
    });

    it('Should have encryption (KMS managed)', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: Match.objectEquals({
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'aws:kms',
              },
            },
          ],
        }),
      });
    });

    it('Should block public access', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        PublicAccessBlockConfiguration: Match.objectEquals({
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        }),
      });
    });

    it('Should versioning enabled', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        VersioningConfiguration: Match.objectEquals({
          Status: 'Enabled',
        }),
      });
    });

    it('Should enforce SSL', () => {
      template.hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 's3:*',
              Condition: {
                Bool: {
                  'aws:SecureTransport': 'false',
                },
              },
              Effect: 'Deny',
              Principal: {
                AWS: '*',
              },
            }),
          ]),
        },
      });
    });

    it('Should match ownership', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        OwnershipControls: Match.objectEquals({
          Rules: [
            {
              ObjectOwnership: 'BucketOwnerEnforced',
            },
          ],
        }),
      });
    });

    it('Should match AccessControl is private', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        AccessControl: 'Private',
      });
    });

    it('Should match snapshot', () => {
      expect(template.toJSON()).toMatchSnapshot('default-secure-bucket');
    });
  });

  describe('Props overrides (still DEFAULT bucketType)', () => {
    it('Should support encryption S3 managed (AES256)', () => {
      const stack = new Stack(new App(), 'TestingStack');
      const bucket = new SecureBucket(stack, 'SecureBucket', {
        bucketName: 'example-secure-bucket',
        encryption: s3.BucketEncryption.S3_MANAGED,
      });
      expect(bucket).toBeInstanceOf(s3.Bucket);

      const template = Template.fromStack(stack);
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
      expect(template.toJSON()).toMatchSnapshot('encryption-s3-managed');
    });

    it('Should support encryption KMS managed (aws:kms)', () => {
      const stack = new Stack(new App(), 'TestingStack');
      const bucket = new SecureBucket(stack, 'SecureBucket', {
        bucketName: 'example-secure-bucket',
        encryption: s3.BucketEncryption.KMS_MANAGED,
        versioned: true,
      });
      expect(bucket).toBeInstanceOf(s3.Bucket);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: Match.objectEquals({
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'aws:kms',
              },
            },
          ],
        }),
      });
      expect(template.toJSON()).toMatchSnapshot('encryption-kms-managed');
    });

    it('Should support AccessControl override', () => {
      const stack = new Stack(new App(), 'TestingStack');
      const bucket = new SecureBucket(stack, 'SecureBucket', {
        bucketName: 'example-secure-bucket',
        accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      });
      expect(bucket).toBeInstanceOf(s3.Bucket);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::Bucket', {
        AccessControl: 'BucketOwnerFullControl',
      });
      expect(template.toJSON()).toMatchSnapshot('access-control-override');
    });

    it('Should support ObjectOwnership override', () => {
      const stack = new Stack(new App(), 'TestingStack');
      const bucket = new SecureBucket(stack, 'SecureBucket', {
        bucketName: 'example-secure-bucket',
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
      });
      expect(bucket).toBeInstanceOf(s3.Bucket);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::Bucket', {
        OwnershipControls: Match.objectEquals({
          Rules: [
            {
              ObjectOwnership: 'BucketOwnerPreferred',
            },
          ],
        }),
      });
      expect(template.toJSON()).toMatchSnapshot('object-ownership-override');
    });

    it('Should support versioning enabled', () => {
      const stack = new Stack(new App(), 'TestingStack');
      const bucket = new SecureBucket(stack, 'SecureBucket', {
        bucketName: 'example-secure-bucket',
        encryption: s3.BucketEncryption.KMS_MANAGED,
        versioned: true,
      });
      expect(bucket).toBeInstanceOf(s3.Bucket);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::Bucket', {
        VersioningConfiguration: Match.objectEquals({
          Status: 'Enabled',
        }),
      });
      expect(template.toJSON()).toMatchSnapshot('versioning-enable');
    });

    it('Should support versioning disabled (no VersioningConfiguration)', () => {
      const stack = new Stack(new App(), 'TestingStack');
      const bucket = new SecureBucket(stack, 'SecureBucket', {
        bucketName: 'example-secure-bucket',
        encryption: s3.BucketEncryption.KMS_MANAGED,
        versioned: false,
      });
      expect(bucket).toBeInstanceOf(s3.Bucket);

      const template = Template.fromStack(stack);
      const resources = template.findResources('AWS::S3::Bucket');
      for (const resource of Object.values(resources)) {
        expect(resource.Properties).not.toHaveProperty('VersioningConfiguration');
      }
      expect(template.toJSON()).toMatchSnapshot('versioning-disable');
    });

    it('Should support EventBridge enabled', () => {
      const stack = new Stack(new App(), 'TestingStack');
      const bucket = new SecureBucket(stack, 'SecureBucket', {
        bucketName: 'example-secure-bucket',
        eventBridgeEnabled: true,
      });
      expect(bucket).toBeInstanceOf(s3.Bucket);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::Bucket', {
        NotificationConfiguration: Match.objectEquals({
          EventBridgeConfiguration: {
            EventBridgeEnabled: true,
          },
        }),
      });
      expect(template.toJSON()).toMatchSnapshot('event-bridge-enabled');
    });
  });
});

