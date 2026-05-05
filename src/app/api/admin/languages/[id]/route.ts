import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const body = await request.json();

    if (body.isDefault === true) {
      await prisma.language.updateMany({ data: { isDefault: false } });
    }

    const lang = await prisma.language.update({ where: { id }, data: body });
    return NextResponse.json(lang);
  } catch (error) {
    console.error('Error updating language:', error);
    return NextResponse.json({ error: 'Failed to update language' }, { status: 500 });
  }
}
