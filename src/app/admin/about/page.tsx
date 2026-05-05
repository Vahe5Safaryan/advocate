'use client';

import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

const sections = [
  {
    href: '/admin/about/home',
    title: 'Секция «О нас» (главная)',
    description: 'Заголовок, описание, преимущества, видео',
    icon: '🏠',
  },
  {
    href: '/admin/about/hero',
    title: 'Главный блок страницы О нас',
    description: 'Заголовок и фото команды',
    icon: '🖼️',
  },
  {
    href: '/admin/about/tabs',
    title: 'Табы «О нас»',
    description: 'Миссия, видение, ценности',
    icon: '📑',
  },
  {
    href: '/admin/about/process',
    title: 'Процесс работы',
    description: '3 шага: консультация, стратегия, результат',
    icon: '🔄',
  },
  {
    href: '/admin/about/practice',
    title: 'Сферы практики',
    description: '6 направлений деятельности',
    icon: '⚖️',
  },
  {
    href: '/admin/about/stats',
    title: 'Статистика',
    description: 'Счётчики достижений компании',
    icon: '📊',
  },
];

export default function AdminAboutPage() {
  return (
    <SessionProvider>
      <AdminLayout title="О компании">
        <div className="admin-grid admin-grid-2">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="admin-card"
              style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '32px' }}>{section.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--admin-text)' }}>
                    {section.title}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                    {section.description}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </AdminLayout>
    </SessionProvider>
  );
}
