'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

interface Language {
  id: string;
  code: string;
  name: string;
  flag: string;
  isDefault: boolean;
  isActive: boolean;
}

export default function AdminLanguagesPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => { fetchLanguages(); }, []);

  const fetchLanguages = async () => {
    try {
      const res = await fetch('/api/admin/languages');
      const data = await res.json();
      setLanguages(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    setSaving(id);
    try {
      await fetch(`/api/admin/languages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      setLanguages(languages.map((l) => (l.id === id ? { ...l, isActive: !isActive } : l)));
    } finally {
      setSaving(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setSaving(id);
    try {
      await fetch(`/api/admin/languages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      });
      setLanguages(languages.map((l) => ({ ...l, isDefault: l.id === id })));
    } finally {
      setSaving(null);
    }
  };

  return (
    <SessionProvider>
      <AdminLayout title="Управление языками">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Языки сайта</h2>
          </div>
          <p style={{ color: 'var(--admin-text-secondary)', marginBottom: '16px', fontSize: '14px' }}>
            Языки заданы в системе (RU, EN, HY). Здесь можно включить/выключить язык и установить язык по умолчанию.
          </p>
          {loading ? (
            <div className="admin-loading"><div className="admin-spinner"></div></div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Флаг</th>
                  <th>Код</th>
                  <th>Название</th>
                  <th>По умолчанию</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {languages.map((lang) => (
                  <tr key={lang.id}>
                    <td style={{ fontSize: '24px' }}>{lang.flag}</td>
                    <td><code>{lang.code}</code></td>
                    <td>{lang.name}</td>
                    <td>
                      {lang.isDefault ? (
                        <span className="admin-badge admin-badge-success">Основной</span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(lang.id)}
                          disabled={saving === lang.id}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                        >
                          Сделать основным
                        </button>
                      )}
                    </td>
                    <td>
                      <span className={`admin-badge ${lang.isActive ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                        {lang.isActive ? 'Активен' : 'Отключён'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(lang.id, lang.isActive)}
                        disabled={saving === lang.id || lang.isDefault}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        title={lang.isDefault ? 'Нельзя отключить язык по умолчанию' : ''}
                      >
                        {lang.isActive ? 'Отключить' : 'Включить'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AdminLayout>
    </SessionProvider>
  );
}
