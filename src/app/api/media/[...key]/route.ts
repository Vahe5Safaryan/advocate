import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import { getMinioBucket, getS3Client } from '@/lib/storage';

// #region agent log
function agentLog(
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown>,
  runId = 'pre-fix',
) {
  fetch('http://127.0.0.1:7526/ingest/59d47303-fa84-473a-b633-7ae7bcfef4ec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '7cca3b' },
    body: JSON.stringify({
      sessionId: '7cca3b',
      runId,
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}
// #endregion

type Params = { key: string[] };

function isValidKey(key: string): boolean {
  if (!key) return false;
  if (key.includes('..')) return false;
  if (key.startsWith('/')) return false;
  if (key.includes('\\')) return false;
  return true;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<Params> }) {
  const { key } = await params;
  const objectKey = key.join('/');

  if (!isValidKey(objectKey)) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
  }

  // #region agent log
  let s3: ReturnType<typeof getS3Client>;
  let bucket: string;
  try {
    s3 = getS3Client();
    bucket = getMinioBucket();
  } catch (setupErr) {
    agentLog('C', 'media/[...key]/route.ts:setup', 'getS3Client_or_bucket_threw', {
      errName: setupErr instanceof Error ? setupErr.name : 'unknown',
      errMessage: setupErr instanceof Error ? setupErr.message : String(setupErr),
      hasEndpoint: Boolean(process.env.MINIO_ENDPOINT),
      hasBucketEnv: Boolean(process.env.MINIO_BUCKET),
      hasAccessKey: Boolean(process.env.MINIO_ACCESS_KEY || process.env.MINIO_ROOT_USER),
      hasSecretKey: Boolean(process.env.MINIO_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD),
    });
    throw setupErr;
  }
  agentLog('D', 'media/[...key]/route.ts:before_get', 'getobject_attempt', {
    endpoint: process.env.MINIO_ENDPOINT ?? '(unset)',
    bucket,
    keyPrefix: objectKey.split('/')[0],
    keyLen: objectKey.length,
  });
  // #endregion

  try {
    const obj = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: objectKey,
      }),
    );

    if (!obj.Body) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', obj.ContentType ?? 'application/octet-stream');
    headers.set('Cache-Control', 'private, max-age=300');

    if (obj.ETag) headers.set('ETag', obj.ETag);

    // AWS SDK v3 returns a Node.js Readable stream in Node runtimes.
    const stream = obj.Body as unknown as Readable;
    // #region agent log
    agentLog('A', 'media/[...key]/route.ts:after_get', 'getobject_ok', { bucket, keyLen: objectKey.length });
    // #endregion
    return new NextResponse(stream as unknown as BodyInit, { status: 200, headers });
  } catch (err: unknown) {
    const meta =
      err && typeof err === 'object' && '$metadata' in err
        ? (err as { $metadata?: { httpStatusCode?: number; requestId?: string } }).$metadata
        : undefined;
    // #region agent log
    agentLog('A', 'media/[...key]/route.ts:get_catch', 'getobject_failed', {
      errName: err instanceof Error ? err.name : typeof err,
      errMessage: err instanceof Error ? err.message : String(err),
      httpStatusCode: meta?.httpStatusCode,
    });
    // #endregion
    console.error('[media] MinIO GetObject failed:', err);
    const code =
      typeof err === 'object' && err !== null && '$metadata' in err
        ? (err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode
        : undefined;
    if (code === 404) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

