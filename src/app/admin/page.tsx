'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';
import Link from 'next/link';

interface Stats {
  services: number;
  team: number;
  blog: number;
  cases: number;
  media: number;
  requests: number;
  unreadRequests: number;
}

interface ContactRequest {
  isRead: boolean;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [services, team, blog, cases, media, requests] = await Promise.all([
          fetch('/api/admin/services').then(r => r.json()),
          fetch('/api/admin/team').then(r => r.json()),
          fetch('/api/admin/blog').then(r => r.json()),
          fetch('/api/admin/cases').then(r => r.json()),
          fetch('/api/admin/media').then(r => r.json()),
          fetch('/api/admin/requests').then(r => r.json()),
        ]);

        const requestsArr: ContactRequest[] = Array.isArray(requests) ? requests : [];
        setStats({
          services: Array.isArray(services) ? services.length : 0,
          team: Array.isArray(team) ? team.length : 0,
          blog: Array.isArray(blog) ? blog.length : 0,
          cases: Array.isArray(cases) ? cases.length : 0,
          media: Array.isArray(media) ? media.length : 0,
          requests: requestsArr.length,
          unreadRequests: requestsArr.filter((r: ContactRequest) => !r.isRead).length,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <SessionProvider>
      <AdminLayout title="Панель управления">

        {/* Stats grid */}
        <div className="admin-grid admin-grid-4" style={{ marginBottom: '24px' }}>

          {/* Requests card — highlighted if unread */}
          <Link href="/admin/requests" style={{ textDecoration: 'none' }}>
            <div className="admin-stat-card" style={{
              border: stats?.unreadRequests ? '2px solid #A38B4D' : undefined,
              cursor: 'pointer',
              position: 'relative',
            }}>
              {stats?.unreadRequests ? (
                <span style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: '#A38B4D', color: '#fff',
                  borderRadius: '99px', fontSize: '11px', fontWeight: 700,
                  padding: '2px 8px',
                }}>
                  {stats.unreadRequests} новых
                </span>
              ) : null}
              <div className="admin-stat-icon" style={{ backgroundColor: 'rgba(212,175,55,0.15)', color: '#A38B4D' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div className="admin-stat-value">{loading ? '—' : stats?.requests ?? 0}</div>
              <div className="admin-stat-label">Заявок с сайта</div>
            </div>
          </Link>

          <div className="admin-stat-card">
            <div className="admin-stat-icon success">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <div className="admin-stat-value">{loading ? '—' : stats?.team ?? 0}</div>
            <div className="admin-stat-label">Сотрудников</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div className="admin-stat-value">{loading ? '—' : stats?.services ?? 0}</div>
            <div className="admin-stat-label">Услуг</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon info">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
            </div>
            <div className="admin-stat-value">{loading ? '—' : (stats?.blog ?? 0) + (stats?.cases ?? 0)}</div>
            <div className="admin-stat-label">Статей и дел</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Быстрые действия</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/admin/requests" className="admin-btn admin-btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Заявки с сайта
            </Link>
            <Link href="/admin/team" className="admin-btn admin-btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Команда
            </Link>
            <Link href="/admin/blog/new" className="admin-btn admin-btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Новая статья
            </Link>
            <Link href="/" target="_blank" className="admin-btn admin-btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Открыть сайт
            </Link>
          </div>
        </div>

      </AdminLayout>
    </SessionProvider>
  );
}
