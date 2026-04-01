# AWS Secure Bucket

[![GitHub](https://img.shields.io/github/license/gammarers-aws-cdk-resources/aws-secure-bucket?style=flat-square)](https://github.com/gammarers-aws-cdk-resources/aws-secure-bucket/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/aws-secure-bucket?style=flat-square)](https://www.npmjs.com/package/aws-secure-bucket)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/gammarers-aws-cdk-resources/aws-secure-bucket/build.yml?branch=main&label=build&style=flat-square)](https://github.com/gammarers-aws-cdk-resources/aws-secure-bucket/actions/workflows/build.yml)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/gammarers-aws-cdk-resources/aws-secure-bucket/release.yml?branch=main&label=release&style=flat-square)](https://github.com/gammarers-aws-cdk-resources/aws-secure-bucket/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/gammarers-aws-cdk-resources/aws-secure-bucket?sort=semver&style=flat-square)](https://github.com/gammarers-aws-cdk-resources/aws-secure-bucket/releases)

An [AWS CDK](https://aws.amazon.com/cdk/) construct that defines an S3 bucket with security-focused defaults. It wraps the standard `s3.Bucket` and applies settings that follow AWS best practices, so you can create buckets without accidentally leaving them open or unencrypted. You can still override any option or use it as a drop-in replacement where a regular `s3.Bucket` is expected. For CDK pipeline artifact buckets or CloudFront origins, use the `bucketType` option so encryption and resource policies are set appropriately.

## Features

- Security-focused defaults for S3 buckets (private, block public access, enforce SSL)
- Encryption enabled by default
- Versioning enabled by default
- Object ownership enforced by default (`BucketOwnerEnforced`)
- `RemovalPolicy.RETAIN` by default (prevent accidental deletion)
- Bucket-type presets via `bucketType` for common production use cases
  - `DEPLOYMENT_PIPELINE_ARTIFACT_BUCKET`: CDK pipeline artifact buckets with custom qualifier support
  - `CLOUDFRONT_ORIGIN_BUCKET`: CloudFront origin buckets using S3-managed encryption
  - `ACCESS_LOG_BUCKET`: Centralized access log buckets with minimal log-delivery permissions

## Installation

**npm**

```shell
npm install aws-secure-bucket
```

**yarn**

```shell
yarn add aws-secure-bucket
```

## Usage

### Default secure bucket

```typescript
import { SecureBucket } from 'aws-secure-bucket';

const bucket = new SecureBucket(stack, 'SecureBucket', {
  bucketName: 'example-secure-bucket',
});
```

### Centralized access log bucket (ALB / CloudFront / S3)

```typescript
import { SecureBucket, SecureBucketType } from 'aws-secure-bucket';

const accessLogBucket = new SecureBucket(stack, 'AccessLogBucket', {
  bucketType: SecureBucketType.ACCESS_LOG_BUCKET,
});
```

## Options

The `SecureBucket` constructor accepts `SecureBucketProps`. Since it extends `s3.BucketProps`, you can also use standard S3 bucket options such as `bucketName`, `versioned`, and `encryption`.

### SecureBucket-specific options

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `bucketType` | `SecureBucketType` | `SecureBucketType.DEFAULT_BUCKET` | Determines encryption and resource policy behavior. |

### SecureBucketType values

| Constant | Use case |
| --- | --- |
| `SecureBucketType.DEFAULT_BUCKET` | Default bucket when not using a custom qualifier |
| `SecureBucketType.ACCESS_LOG_BUCKET` | Centralized access log bucket for ALB / CloudFront / S3 (RETAIN + minimal log-delivery permissions) |
| `SecureBucketType.DEPLOYMENT_PIPELINE_ARTIFACT_BUCKET` | CDK pipeline artifact bucket (when using a custom qualifier) |
| `SecureBucketType.CLOUDFRONT_ORIGIN_BUCKET` | CloudFront origin bucket |

See [API.md](./API.md) for the full API reference.

## Requirements

- Node.js >= 20
- AWS CDK v2 (`aws-cdk-lib`)

## License

This project is licensed under the Apache-2.0 License.
