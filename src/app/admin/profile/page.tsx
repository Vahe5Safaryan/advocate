'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

export default function AdminProfilePage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, newEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Ошибка обновления');
      } else {
        setSuccess('Данные успешно обновлены');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setNewEmail('');
      }
    } catch {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SessionProvider>
      <AdminLayout title="Профиль и безопасность">
        <div className="admin-card" style={{ maxWidth: '520px' }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Изменить логин / пароль</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label className="admin-form-label">Новый Email (оставьте пустым чтобы не менять)</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="admin-form-input"
                placeholder="новый@email.com"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Новый пароль (оставьте пустым чтобы не менять)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="admin-form-input"
                placeholder="Минимум 8 символов"
              />
            </div>

            {newPassword && (
              <div className="admin-form-group">
                <label className="admin-form-label">Повторите новый пароль</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="admin-form-input"
                  placeholder="Повторите пароль"
                />
              </div>
            )}

            <div className="admin-form-group">
              <label className="admin-form-label">Текущий пароль <span style={{ color: 'var(--admin-danger)' }}>*</span></label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="admin-form-input"
                placeholder="Введите текущий пароль для подтверждения"
                required
              />
            </div>

            {error && (
              <div style={{ color: 'var(--admin-danger)', fontSize: '14px', padding: '10px 14px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '12px' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ color: '#16a34a', fontSize: '14px', padding: '10px 14px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '12px' }}>
                {success}
              </div>
            )}

            <button type="submit" disabled={loading} className="admin-btn admin-btn-primary">
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </form>
        </div>
      </AdminLayout>
    </SessionProvider>
  );
}
