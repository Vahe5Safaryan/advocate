'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/requests');
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string, isRead: boolean) => {
    await fetch(`/api/admin/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead }),
    });
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, isRead } : r));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту заявку?')) return;
    await fetch(`/api/admin/requests/${id}`, { method: 'DELETE' });
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const unreadCount = requests.filter((r) => !r.isRead).length;

  return (
    <SessionProvider>
      <AdminLayout title="Заявки с сайта">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              Входящие заявки
              {unreadCount > 0 && (
                <span className="admin-badge admin-badge-danger" style={{ marginLeft: '10px', fontSize: '13px' }}>
                  {unreadCount} новых
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="admin-loading"><div className="admin-spinner"></div></div>
          ) : requests.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📬</div>
              <p>Заявок пока нет</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0' }}>
              {requests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    border: `1px solid ${req.isRead ? 'var(--admin-border)' : '#A38B4D'}`,
                    borderRadius: '10px',
                    padding: '16px 20px',
                    backgroundColor: req.isRead ? 'var(--admin-bg)' : 'rgba(212,175,55,0.05)',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {!req.isRead && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#A38B4D', flexShrink: 0, display: 'inline-block' }} />
                    )}
                    <span style={{ fontWeight: 600, fontSize: '15px' }}>{req.name}</span>
                    <a href={`mailto:${req.email}`} style={{ color: 'var(--admin-primary)', fontSize: '14px' }}>{req.email}</a>
                    {req.phone && <a href={`tel:${req.phone}`} style={{ color: 'var(--admin-text-secondary)', fontSize: '14px' }}>{req.phone}</a>}
                    <span style={{ marginLeft: 'auto', color: 'var(--admin-text-secondary)', fontSize: '13px' }}>{formatDate(req.createdAt)}</span>
                  </div>

                  {/* Message preview */}
                  <div
                    style={{ marginTop: '10px', fontSize: '14px', color: 'var(--admin-text-secondary)', cursor: 'pointer', lineHeight: '1.5' }}
                    onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                  >
                    {expanded === req.id ? (
                      <span style={{ whiteSpace: 'pre-wrap', color: 'var(--admin-text)' }}>{req.message}</span>
                    ) : (
                      <span>{req.message.length > 120 ? req.message.slice(0, 120) + '...' : req.message}</span>
                    )}
                    {req.message.length > 120 && (
                      <span style={{ color: 'var(--admin-primary)', marginLeft: '6px', fontSize: '13px' }}>
                        {expanded === req.id ? 'Свернуть' : 'Читать полностью'}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button
                      onClick={() => markRead(req.id, !req.isRead)}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                    >
                      {req.isRead ? 'Пометить непрочитанным' : '✓ Отметить прочитанным'}
                    </button>
                    <a
                      href={`mailto:${req.email}?subject=Ответ на вашу заявку`}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                    >
                      Ответить по email
                    </a>
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      style={{ marginLeft: 'auto' }}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </SessionProvider>
  );
}
