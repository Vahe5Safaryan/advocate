'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

const languages = [
  { code: 'ru', name: 'Ру', flag: '🇷🇺' },
  { code: 'en', name: 'Eng', flag: '🇺🇸' },
  { code: 'hy', name: 'Հայ', flag: '🇦🇲' },
];

export default function EditStatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState('ru');
  const [number, setNumber] = useState('');
  const [suffix, setSuffix] = useState('');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [labels, setLabels] = useState<Record<string, string>>({ ru: '', en: '', hy: '' });

  useEffect(() => {
    fetch(`/api/admin/statistics/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setNumber(d.number || '');
        setSuffix(d.suffix || '');
        setOrder(d.order || 0);
        setIsActive(d.isActive ?? true);
        const map: Record<string, string> = { ru: '', en: '', hy: '' };
        d.translations?.forEach((t: { language: string; label: string }) => { map[t.language] = t.label; });
        setLabels(map);
      })
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/statistics/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number, suffix, order, isActive,
          translations: languages.map((l) => ({ language: l.code, label: labels[l.code] || '' })),
        }),
      });
      if (res.ok) { router.push('/admin/about/stats'); router.refresh(); }
      else { const d = await res.json(); alert(d.error || 'Ошибка'); }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <SessionProvider><AdminLayout title="Загрузка..."><div className="admin-card"><div className="admin-loading"><div className="admin-spinner"></div></div></div></AdminLayout></SessionProvider>;

  return (
    <SessionProvider>
      <AdminLayout title="Редактировать счётчик">
        <form onSubmit={handleSubmit}>
          <div className="admin-card">
            <div className="admin-card-header"><h2 className="admin-card-title">Настройки</h2></div>
            <div className="admin-grid admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Число</label>
                <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} className="admin-form-input" required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Суффикс</label>
                <input type="text" value={suffix} onChange={(e) => setSuffix(e.target.value)} className="admin-form-input" />
              </div>
            </div>
            <div className="admin-grid admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Порядок</label>
                <input type="number" value={order} onChange={(e) => setOrder(+e.target.value)} className="admin-form-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ marginRight: '8px' }} />
                  Активен
                </label>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header"><h2 className="admin-card-title">Переводы подписи</h2></div>
            <div className="admin-lang-tabs">
              {languages.map((l) => (
                <button key={l.code} type="button" className={`admin-lang-tab ${activeTab === l.code ? 'active' : ''}`} onClick={() => setActiveTab(l.code)}>
                  {l.flag} {l.name}
                </button>
              ))}
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Подпись</label>
              <input
                type="text"
                value={labels[activeTab] || ''}
                onChange={(e) => setLabels((prev) => ({ ...prev, [activeTab]: e.target.value }))}
                className="admin-form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push('/admin/about/stats')} className="admin-btn admin-btn-secondary">Отмена</button>
            <button type="submit" disabled={loading} className="admin-btn admin-btn-primary">{loading ? 'Сохранение...' : 'Сохранить'}</button>
          </div>
        </form>
      </AdminLayout>
    </SessionProvider>
  );
}
