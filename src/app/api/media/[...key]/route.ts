import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import { getMinioBucket, getS3Client } from '@/lib/storage';

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

  const s3 = getS3Client();
  const bucket = getMinioBucket();

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
    return new NextResponse(stream as unknown as BodyInit, { status: 200, headers });
  } catch (err: unknown) {
    const code =
      typeof err === 'object' && err !== null && '$metadata' in err
        ? (err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode
        : undefined;
    if (code === 404) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

