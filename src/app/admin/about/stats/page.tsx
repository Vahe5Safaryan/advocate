'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

interface Statistic {
  id: string;
  number: string;
  suffix: string;
  order: number;
  isActive: boolean;
  translations: { language: string; label: string }[];
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/statistics');
      const data = await res.json();
      setStats(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту статистику?')) return;
    await fetch(`/api/admin/statistics/${id}`, { method: 'DELETE' });
    setStats(stats.filter((s) => s.id !== id));
  };

  return (
    <SessionProvider>
      <AdminLayout title="Статистика">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Счётчики</h2>
            <Link href="/admin/about/stats/new" className="admin-btn admin-btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Добавить
            </Link>
          </div>
          {loading ? (
            <div className="admin-loading"><div className="admin-spinner"></div></div>
          ) : stats.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📊</div>
              <p>Статистики пока нет</p>
              <Link href="/admin/about/stats/new" className="admin-btn admin-btn-primary" style={{ marginTop: '16px' }}>
                Добавить первый счётчик
              </Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Число</th>
                  <th>Суффикс</th>
                  <th>Подпись (RU)</th>
                  <th>Порядок</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat) => {
                  const ruLabel = stat.translations.find((t) => t.language === 'ru')?.label || '-';
                  return (
                    <tr key={stat.id}>
                      <td><strong>{stat.number}{stat.suffix}</strong></td>
                      <td>{stat.suffix || '-'}</td>
                      <td>{ruLabel}</td>
                      <td>{stat.order}</td>
                      <td>
                        <span className={`admin-badge ${stat.isActive ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                          {stat.isActive ? 'Активен' : 'Скрыт'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <Link href={`/admin/about/stats/${stat.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                            Редактировать
                          </Link>
                          <button onClick={() => handleDelete(stat.id)} className="admin-btn admin-btn-danger admin-btn-sm">
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </AdminLayout>
    </SessionProvider>
  );
}
