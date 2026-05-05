'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

interface AboutTab {
  id: string;
  tabKey: string;
  order: number;
  translations: { language: string; label: string; content: string }[];
}

const tabKeyLabels: Record<string, string> = {
  mission: '🎯 Миссия',
  vision: '👁️ Видение',
  values: '💎 Ценности',
};

export default function AdminAboutTabsPage() {
  const [tabs, setTabs] = useState<AboutTab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTabs(); }, []);

  const fetchTabs = async () => {
    try {
      const res = await fetch('/api/admin/about/tabs');
      const data = await res.json();
      setTabs(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот таб?')) return;
    await fetch(`/api/admin/about/tabs/${id}`, { method: 'DELETE' });
    setTabs(tabs.filter((t) => t.id !== id));
  };

  return (
    <SessionProvider>
      <AdminLayout title="Табы «О нас»">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Миссия / Видение / Ценности</h2>
            <Link href="/admin/about/tabs/new" className="admin-btn admin-btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Добавить таб
            </Link>
          </div>

          {loading ? (
            <div className="admin-loading"><div className="admin-spinner"></div></div>
          ) : tabs.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📑</div>
              <p>Табов пока нет. Добавьте миссию, видение и ценности.</p>
              <Link href="/admin/about/tabs/new" className="admin-btn admin-btn-primary" style={{ marginTop: '16px' }}>
                Добавить первый таб
              </Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Тип</th>
                  <th>Кнопка (RU)</th>
                  <th>Содержание (RU, фрагмент)</th>
                  <th>Порядок</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {tabs.map((tab) => {
                  const ru = tab.translations.find((t) => t.language === 'ru');
                  return (
                    <tr key={tab.id}>
                      <td>{tabKeyLabels[tab.tabKey] || tab.tabKey}</td>
                      <td>{ru?.label || '-'}</td>
                      <td style={{ maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ru?.content?.slice(0, 80) || '-'}
                      </td>
                      <td>{tab.order}</td>
                      <td>
                        <div className="admin-actions">
                          <Link href={`/admin/about/tabs/${tab.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                            Редактировать
                          </Link>
                          <button onClick={() => handleDelete(tab.id)} className="admin-btn admin-btn-danger admin-btn-sm">
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
