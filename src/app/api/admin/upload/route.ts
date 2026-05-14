import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { getMinioBucket, getS3Client } from '@/lib/storage';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Недопустимый тип файла. Разрешены: JPG, PNG, WebP, GIF, SVG' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Файл слишком большой. Максимум 10 МБ' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name).toLowerCase() || '.jpg';
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const objectKey = `images/${uniqueName}`;

  // #region agent log
  let s3: ReturnType<typeof getS3Client>;
  let bucket: string;
  try {
    s3 = getS3Client();
    bucket = getMinioBucket();
  } catch (setupErr) {
    agentLog('C', 'upload/route.ts:setup', 'getS3Client_or_bucket_threw', {
      errName: setupErr instanceof Error ? setupErr.name : 'unknown',
      errMessage: setupErr instanceof Error ? setupErr.message : String(setupErr),
      hasEndpoint: Boolean(process.env.MINIO_ENDPOINT),
      hasBucketEnv: Boolean(process.env.MINIO_BUCKET),
      hasAccessKey: Boolean(process.env.MINIO_ACCESS_KEY || process.env.MINIO_ROOT_USER),
      hasSecretKey: Boolean(process.env.MINIO_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD),
    });
    throw setupErr;
  }
  agentLog('D', 'upload/route.ts:before_put', 's3_put_attempt', {
    endpoint: process.env.MINIO_ENDPOINT ?? '(unset)',
    bucket,
    objectKeyPrefix: objectKey.split('/')[0],
    bufferLength: buffer.length,
    contentType: file.type,
  });
  // #endregion
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: buffer,
        ContentType: file.type,
      }),
    );
    // #region agent log
    agentLog('A', 'upload/route.ts:after_put', 'putobject_ok', { bucket, keyLen: objectKey.length });
    // #endregion
  } catch (err) {
    // #region agent log
    const meta =
      err && typeof err === 'object' && '$metadata' in err
        ? (err as { $metadata?: { httpStatusCode?: number; requestId?: string } }).$metadata
        : undefined;
    agentLog('A', 'upload/route.ts:put_catch', 'putobject_failed', {
      errName: err instanceof Error ? err.name : typeof err,
      errMessage: err instanceof Error ? err.message : String(err),
      httpStatusCode: meta?.httpStatusCode,
    });
    // #endregion
    console.error('[upload] MinIO PutObject failed:', err);
    return NextResponse.json({ error: 'Upload storage error' }, { status: 500 });
  }

  const url = `/api/media/${encodeURIComponent(objectKey)}`;

  let media;
  try {
    media = await prisma.media.create({
      data: { url, filename: file.name, mimeType: file.type, size: file.size },
    });
  } catch (dbErr) {
    // #region agent log
    agentLog('B', 'upload/route.ts:prisma_catch', 'media_create_failed', {
      errName: dbErr instanceof Error ? dbErr.name : typeof dbErr,
      errMessage: dbErr instanceof Error ? dbErr.message : String(dbErr),
    });
    // #endregion
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // #region agent log
  agentLog('B', 'upload/route.ts:success', 'upload_complete', { mediaId: media.id });
  // #endregion
  return NextResponse.json(media);
}
