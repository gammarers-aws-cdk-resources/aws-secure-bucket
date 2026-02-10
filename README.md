# AWS Secure Bucket

[![GitHub](https://img.shields.io/github/license/gammarers-aws-cdk-resources/aws-secure-bucket?style=flat-square)](https://github.com/gammarers-aws-cdk-resources/aws-secure-bucket/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/aws-secure-bucket?style=flat-square)](https://www.npmjs.com/package/aws-secure-bucket)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/gammarers-aws-cdk-resources/aws-secure-bucket/build.yml?branch=main&label=build&style=flat-square)](https://github.com/gammarers-aws-cdk-resources/aws-secure-bucket/actions/workflows/build.yml)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/gammarers-aws-cdk-resources/aws-secure-bucket/release.yml?branch=main&label=release&style=flat-square)](https://github.com/gammarers-aws-cdk-resources/aws-secure-bucket/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/gammarers-aws-cdk-resources/aws-secure-bucket?sort=semver&style=flat-square)](https://github.com/gammarers-aws-cdk-resources/aws-secure-bucket/releases)

An [AWS CDK](https://aws.amazon.com/cdk/) construct that defines an S3 bucket with security-focused defaults. It wraps the standard `s3.Bucket` and applies settings that follow AWS best practices, so you can create buckets without accidentally leaving them open or unencrypted. You can still override any option or use it as a drop-in replacement where a regular `s3.Bucket` is expected. For CDK pipeline artifact buckets or CloudFront origins, use the `bucketType` option so encryption and resource policies are set appropriately.

**Default behavior:**

- Bucket Access Control is Private
- Public Read Access is false
- Enforce SSL
- All Block public access
- Require encryption
- Versioned (default: true)
- Object ownership: BucketOwnerEnforced

## Constructor Options

The `SecureBucket` constructor accepts `SecureBucketProps`. Since it extends `s3.BucketProps`, you can also use standard S3 Bucket options such as `bucketName` and `versioned`.

### SecureBucket-specific options

| **Property** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| bucketType | SecureBucketType | SecureBucketType.DEFAULT_BUCKET | The bucket type. Determines encryption and resource policy behavior. |

**SecureBucketType values:**

| **Constant** | **Use case** |
| --- | --- |
| `SecureBucketType.DEFAULT_BUCKET` | Default bucket when not using a custom Qualifier |
| `SecureBucketType.DEPLOYMENT_PIPELINE_ARTIFACT_BUCKET` | CDK pipeline artifact bucket (when using a custom Qualifier) |
| `SecureBucketType.CLOUDFRONT_ORIGIN_BUCKET` | CloudFront origin bucket |

See [API.md](./API.md) for the full API reference.

## Install

### TypeScript

**npm:**

```shell
npm install aws-secure-bucket
```

**yarn:**

```shell
yarn add aws-secure-bucket
```

## Example

```typescript
import { SecureBucket } from 'aws-secure-bucket';

const bucket = new SecureBucket(stack, 'SecureBucket', {
  bucketName: 'example-secure-bucket',
});

```

## License

This project is licensed under the Apache-2.0 License.
