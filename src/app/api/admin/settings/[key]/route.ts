import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams { params: Promise<{ key: string }> }

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { key } = await params;
    const { value, translations } = await request.json();

    await prisma.siteSettingTranslation.deleteMany({
      where: { setting: { key } },
    });

    const setting = await prisma.siteSetting.update({
      where: { key },
      data: {
        value,
        translations: {
          create: translations?.map((t: { language: string; value: string }) => ({
            language: t.language, value: t.value,
          })) ?? [],
        },
      },
      include: { translations: true },
    });
    return NextResponse.json(setting);
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
