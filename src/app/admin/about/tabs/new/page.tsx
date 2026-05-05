'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

const languages = [
  { code: 'ru', name: 'Ру', flag: '🇷🇺' },
  { code: 'en', name: 'Eng', flag: '🇺🇸' },
  { code: 'hy', name: 'Հայ', flag: '🇦🇲' },
];

export default function NewAboutTabPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ru');
  const [tabKey, setTabKey] = useState('mission');
  const [order, setOrder] = useState(0);
  const [labels, setLabels] = useState<Record<string, string>>({ ru: '', en: '', hy: '' });
  const [contents, setContents] = useState<Record<string, string>>({ ru: '', en: '', hy: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/about/tabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tabKey, order,
          translations: languages.map((l) => ({
            language: l.code,
            label: labels[l.code] || '',
            content: contents[l.code] || '',
          })),
        }),
      });
      if (res.ok) { router.push('/admin/about/tabs'); router.refresh(); }
      else { const d = await res.json(); alert(d.error || 'Ошибка'); }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SessionProvider>
      <AdminLayout title="Новый таб">
        <form onSubmit={handleSubmit}>
          <div className="admin-card">
            <div className="admin-card-header"><h2 className="admin-card-title">Настройки</h2></div>
            <div className="admin-grid admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Тип таба</label>
                <select value={tabKey} onChange={(e) => setTabKey(e.target.value)} className="admin-form-input">
                  <option value="mission">🎯 Миссия</option>
                  <option value="vision">👁️ Видение</option>
                  <option value="values">💎 Ценности</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Порядок</label>
                <input type="number" value={order} onChange={(e) => setOrder(+e.target.value)} className="admin-form-input" />
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header"><h2 className="admin-card-title">Переводы</h2></div>
            <div className="admin-lang-tabs">
              {languages.map((l) => (
                <button key={l.code} type="button" className={`admin-lang-tab ${activeTab === l.code ? 'active' : ''}`} onClick={() => setActiveTab(l.code)}>
                  {l.flag} {l.name}
                </button>
              ))}
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Кнопка таба (текст)</label>
              <input
                type="text"
                value={labels[activeTab] || ''}
                onChange={(e) => setLabels((p) => ({ ...p, [activeTab]: e.target.value }))}
                className="admin-form-input"
                placeholder="Наша миссия"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Содержание</label>
              <textarea
                value={contents[activeTab] || ''}
                onChange={(e) => setContents((p) => ({ ...p, [activeTab]: e.target.value }))}
                className="admin-form-textarea"
                rows={8}
                placeholder="Текст содержания таба..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push('/admin/about/tabs')} className="admin-btn admin-btn-secondary">Отмена</button>
            <button type="submit" disabled={loading} className="admin-btn admin-btn-primary">{loading ? 'Сохранение...' : 'Создать'}</button>
          </div>
        </form>
      </AdminLayout>
    </SessionProvider>
  );
}
