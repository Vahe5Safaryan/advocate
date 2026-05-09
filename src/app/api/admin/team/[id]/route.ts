import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/team/[id] - Get a single team member
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/team/[id] - Update a team member
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { slug, imageUrl, licenseNumber, order, isActive, translations } = body;

    // Check if slug already exists for another team member
    const existing = await prisma.teamMember.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Сотрудник с таким slug уже существует' },
        { status: 400 }
      );
    }

    // Delete existing translations
    await prisma.teamMemberTranslation.deleteMany({
      where: { teamMemberId: id },
    });

    // Update team member with new translations
    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        slug,
        imageUrl,
        licenseNumber: licenseNumber || null,
        order,
        isActive,
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

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/team/[id] - Partial update (e.g., toggle active)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: body,
      include: {
        translations: true,
      },
    });

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/team/[id] - Delete a team member
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
