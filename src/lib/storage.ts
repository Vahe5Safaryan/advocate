import { S3Client } from '@aws-sdk/client-s3';

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return v;
}

export function getMinioBucket(): string {
  return requiredEnv('MINIO_BUCKET');
}

export function getS3Client(): S3Client {
  const endpoint = requiredEnv('MINIO_ENDPOINT');
  const region = process.env.MINIO_REGION ?? 'us-east-1';
  const forcePathStyle = (process.env.MINIO_FORCE_PATH_STYLE ?? 'true').toLowerCase() === 'true';

  return new S3Client({
    region,
    endpoint,
    forcePathStyle,
    credentials: {
      accessKeyId: requiredEnv('MINIO_ACCESS_KEY'),
      secretAccessKey: requiredEnv('MINIO_SECRET_KEY'),
    },
  });
}

