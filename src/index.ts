import { DefaultStackSynthesizer, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

/**
 * Bucket type constants. Use these values for the {@link SecureBucketProps.bucketType} property.
 */
export const SecureBucketType = {
  /**
   * Select when using this bucket as the CDK pipeline artifact bucket with a custom Qualifier
   * (single-region or multi-region deployment).
   */
  DEPLOYMENT_PIPELINE_ARTIFACT_BUCKET: 'DeploymentPipelineArtifactBucket',
  /**
   * Select when using this bucket as the CloudFront origin.
   */
  CLOUDFRONT_ORIGIN_BUCKET: 'CloudFrontOriginBucket',
  /**
   * Select for the default bucket when not using a custom Qualifier.
   */
  DEFAULT_BUCKET: 'DefaultBucket',
} as const;

/** Bucket type: one of the {@link SecureBucketType} constant values. */
export type SecureBucketType = typeof SecureBucketType[keyof typeof SecureBucketType];

/**
 * Props for {@link SecureBucket}. Extends `s3.BucketProps` with a bucket type for secure defaults.
 */
export interface SecureBucketProps extends s3.BucketProps {

  /**
   * The type of the bucket. Determines encryption and resource policy behavior.
   * @default SecureBucketType.DEFAULT_BUCKET
   */
  readonly bucketType?: SecureBucketType;
}

/**
 * An S3 bucket with secure defaults: private access, SSL enforced, public access blocked, and encryption required.
 */
export class SecureBucket extends s3.Bucket {
  constructor(scope: Construct, id: string, props?: SecureBucketProps) {
    const bucketType = props?.bucketType || SecureBucketType.DEFAULT_BUCKET;
    super(scope, id, {
      ...props,
      removalPolicy: RemovalPolicy.RETAIN,
      encryption: (() => {
        if (bucketType === SecureBucketType.CLOUDFRONT_ORIGIN_BUCKET) {
          return s3.BucketEncryption.S3_MANAGED;
        }
        return props?.encryption || s3.BucketEncryption.KMS_MANAGED;
      })(),
      accessControl: (() => {
        if (!props?.accessControl) {
          return s3.BucketAccessControl.PRIVATE;
        }
        return props.accessControl;
      })(),
      eventBridgeEnabled: undefined,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: props?.versioned !== undefined ? props.versioned : true,
      objectOwnership: (() => {
        if (props?.objectOwnership) {
          return props.objectOwnership;
        }
        return s3.ObjectOwnership.BUCKET_OWNER_ENFORCED;
      })(),
    });

    const cfnBucket = this.node.defaultChild as s3.CfnBucket;
    if (props?.eventBridgeEnabled === true) {
      cfnBucket.addPropertyOverride('NotificationConfiguration.EventBridgeConfiguration.EventBridgeEnabled', true);
    }

    const account = Stack.of(this).account;
    const region = Stack.of(this).region;

    if (bucketType === SecureBucketType.DEPLOYMENT_PIPELINE_ARTIFACT_BUCKET) {

      const qualifier = Stack.of(this).synthesizer.bootstrapQualifier;

      if (qualifier && (qualifier != DefaultStackSynthesizer.DEFAULT_QUALIFIER)) {
        this.addToResourcePolicy(new iam.PolicyStatement({
          actions: [
            's3:*',
          ],
          resources: [
            `${this.bucketArn}`,
            `${this.bucketArn}/*`,
          ],
          principals: [
            new iam.ArnPrincipal(`arn:aws:iam::${account}:role/cdk-${qualifier}-deploy-role-${account}-${region}`),
          ],
        }));
      }
    }
  }
}