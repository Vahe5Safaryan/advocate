'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

interface PracticeArea {
  id: string;
  icon: string;
  order: number;
  translations: { language: string; title: string; description: string }[];
}

export default function AdminPracticePage() {
  const [areas, setAreas] = useState<PracticeArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAreas(); }, []);

  const fetchAreas = async () => {
    try {
      const res = await fetch('/api/admin/about/practice');
      const data = await res.json();
      setAreas(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту сферу практики?')) return;
    await fetch(`/api/admin/about/practice/${id}`, { method: 'DELETE' });
    setAreas(areas.filter((a) => a.id !== id));
  };

  return (
    <SessionProvider>
      <AdminLayout title="Сферы практики">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Сферы практики</h2>
            <Link href="/admin/about/practice/new" className="admin-btn admin-btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Добавить
            </Link>
          </div>

          {loading ? (
            <div className="admin-loading"><div className="admin-spinner"></div></div>
          ) : areas.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">⚖️</div>
              <p>Сфер практики пока нет</p>
              <Link href="/admin/about/practice/new" className="admin-btn admin-btn-primary" style={{ marginTop: '16px' }}>
                Добавить первую
              </Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Иконка</th>
                  <th>Название (RU)</th>
                  <th>Описание (RU)</th>
                  <th>Порядок</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((area) => {
                  const ru = area.translations.find((t) => t.language === 'ru');
                  return (
                    <tr key={area.id}>
                      <td style={{ fontSize: '24px' }}>{area.icon}</td>
                      <td>{ru?.title || '-'}</td>
                      <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ru?.description || '-'}
                      </td>
                      <td>{area.order}</td>
                      <td>
                        <div className="admin-actions">
                          <Link href={`/admin/about/practice/${area.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                            Редактировать
                          </Link>
                          <button onClick={() => handleDelete(area.id)} className="admin-btn admin-btn-danger admin-btn-sm">
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
