import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { getMinioBucket, getS3Client } from '@/lib/storage';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

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

  const s3 = getS3Client();
  const bucket = getMinioBucket();
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: buffer,
        ContentType: file.type,
        Metadata: {
          originalFilename: file.name,
        },
      }),
    );
  } catch {
    return NextResponse.json({ error: 'Upload storage error' }, { status: 500 });
  }

  const url = `/api/media/${encodeURIComponent(objectKey)}`;

  let media;
  try {
    media = await prisma.media.create({
      data: { url, filename: file.name, mimeType: file.type, size: file.size },
    });
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json(media);
}
