import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/team - List all team members
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teamMembers = await prisma.teamMember.findMany({
      include: {
        translations: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST /api/admin/team - Create a new team member
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, imageUrl, licenseNumber, order, isActive, translations } = body;

    // Check if slug already exists
    const existing = await prisma.teamMember.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Сотрудник с таким slug уже существует' },
        { status: 400 }
      );
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        slug,
        imageUrl,
        licenseNumber: licenseNumber || null,
        order: order || 0,
        isActive: isActive !== false,
        translations: {
          create: translations.map((t: {
            language: string;
            name: string;
            position: string;
            bio: string[];
          }) => ({
            language: t.language,
            name: t.name,
            position: t.position,
            bio: JSON.stringify(t.bio || []),
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}
