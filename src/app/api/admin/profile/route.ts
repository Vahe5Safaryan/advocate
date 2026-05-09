import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { compare, hash } from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { currentPassword, newPassword, newEmail } = await req.json();

  if (!currentPassword) {
    return NextResponse.json({ error: 'Введите текущий пароль' }, { status: 400 });
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
  if (!admin) {
    return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
  }

  const isValid = await compare(currentPassword, admin.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Текущий пароль неверный' }, { status: 400 });
  }

  const updateData: { password?: string; email?: string } = {};

  if (newPassword) {
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Новый пароль должен быть не менее 8 символов' }, { status: 400 });
    }
    updateData.password = await hash(newPassword, 12);
  }

  if (newEmail && newEmail !== admin.email) {
    const exists = await prisma.admin.findUnique({ where: { email: newEmail } });
    if (exists) {
      return NextResponse.json({ error: 'Этот email уже используется' }, { status: 400 });
    }
    updateData.email = newEmail;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'Нечего обновлять' }, { status: 400 });
  }

  await prisma.admin.update({ where: { id: admin.id }, data: updateData });

  return NextResponse.json({ ok: true });
}
