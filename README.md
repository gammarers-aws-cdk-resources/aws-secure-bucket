# AWS Secure Bucket

[![GitHub](https://img.shields.io/github/license/gammarers/aws-secure-bucket?style=flat-square)](https://github.com/gammarers/aws-secure-bucket/blob/main/LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@gammarers/aws-secure-bucket?style=flat-square)](https://www.npmjs.com/package/@gammarers/aws-secure-bucket)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/gammarers/aws-secure-bucket/release.yml?branch=main&label=release&style=flat-square)](https://github.com/gammarers/aws-secure-bucket/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/gammarers/aws-secure-bucket?sort=semver&style=flat-square)](https://github.com/gammarers/aws-secure-bucket/releases)


This is a Simple S3 Secure Bucket.

- Bucket Access Control is Private
- Public Read Access is false
- Enforce SSL
- All Block public access
- Require encryption

## Additional Properties

| **Name** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| bucketType | SecureBucketType | SecureBucketType.DEFAULT_BUCKET | The type of the bucket. Available types: DEFAULT_BUCKET, DEPLOYMENT_PIPELINE_ARTIFACT_BUCKET, CLOUDFRONT_ORIGIN_BUCKET |

## Install

### TypeScript

**npm:**

```shell
npm install @gammarers/aws-secure-bucket
```

**yarn:**

```shell
yarn add @gammarers/aws-secure-bucket
```

## Example

```typescript
import { SecureBucket } from '@gammarers/aws-secure-bucket';

const bucket = new SecureBucket(stack, 'SecureBucket', {
  bucketName: 'example-secure-bucket',
});

```
