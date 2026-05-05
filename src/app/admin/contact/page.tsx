'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

interface ContactItem {
  id: string;
  type: string;
  value: string;
  icon: string;
  link: string | null;
  order: number;
  isActive: boolean;
  translations: { language: string; label: string }[];
}

const typeLabels: Record<string, string> = {
  phone: '📞 Телефон',
  email: '📧 Email',
  address: '📍 Адрес',
  social: '🔗 Соцсеть',
  phone2: '📞 Второй телефон',
};

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/admin/contact');
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот контакт?')) return;
    await fetch(`/api/admin/contact/${id}`, { method: 'DELETE' });
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/contact/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setContacts(contacts.map((c) => (c.id === id ? { ...c, isActive: !isActive } : c)));
  };

  return (
    <SessionProvider>
      <AdminLayout title="Контактная информация">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Контакты</h2>
            <Link href="/admin/contact/new" className="admin-btn admin-btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Добавить
            </Link>
          </div>
          {loading ? (
            <div className="admin-loading"><div className="admin-spinner"></div></div>
          ) : contacts.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📞</div>
              <p>Контактов пока нет</p>
              <Link href="/admin/contact/new" className="admin-btn admin-btn-primary" style={{ marginTop: '16px' }}>Добавить контакт</Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Тип</th>
                  <th>Значение</th>
                  <th>Подпись (RU)</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((item) => {
                  const ruLabel = item.translations.find((t) => t.language === 'ru')?.label || '-';
                  return (
                    <tr key={item.id}>
                      <td>{typeLabels[item.type] || item.type}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</td>
                      <td>{ruLabel}</td>
                      <td>
                        <span className={`admin-badge ${item.isActive ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                          {item.isActive ? 'Активен' : 'Скрыт'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <Link href={`/admin/contact/${item.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">Редактировать</Link>
                          <button onClick={() => handleToggleActive(item.id, item.isActive)} className="admin-btn admin-btn-secondary admin-btn-sm">
                            {item.isActive ? 'Скрыть' : 'Показать'}
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="admin-btn admin-btn-danger admin-btn-sm">Удалить</button>
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
