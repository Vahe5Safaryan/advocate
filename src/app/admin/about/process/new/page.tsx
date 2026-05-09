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

export default function NewProcessStepPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState('ru');
  const [stepNumber, setStepNumber] = useState(1);
  const [order, setOrder] = useState(0);
  const [titles, setTitles] = useState<Record<string, string>>({ ru: '', en: '', hy: '' });
  const [descriptions, setDescriptions] = useState<Record<string, string>>({ ru: '', en: '', hy: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/about/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepNumber, order,
          translations: languages.map((l) => ({
            language: l.code,
            title: titles[l.code] || '',
            description: descriptions[l.code] || '',
          })),
        }),
      });
      if (res.ok) { router.push('/admin/about/process'); router.refresh(); }
      else { const d = await res.json(); alert(d.error || 'Ошибка'); }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SessionProvider>
      <AdminLayout title="Новый шаг процесса">
        <form onSubmit={handleSubmit}>
          <div className="admin-card">
            <div className="admin-card-header"><h2 className="admin-card-title">Настройки</h2></div>
            <div className="admin-grid admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Номер шага</label>
                <input type="number" min={1} value={stepNumber} onChange={(e) => setStepNumber(+e.target.value)} className="admin-form-input" required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Порядок отображения</label>
                <input type="number" value={order} onChange={(e) => setOrder(+e.target.value)} className="admin-form-input" />
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header"><h2 className="admin-card-title">Переводы</h2></div>
            <div className="admin-lang-tabs">
              {languages.map((l) => (
                <button key={l.code} type="button" className={`admin-lang-tab ${activeLang === l.code ? 'active' : ''}`} onClick={() => setActiveLang(l.code)}>
                  {l.flag} {l.name}
                </button>
              ))}
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Заголовок</label>
              <input
                type="text"
                value={titles[activeLang] || ''}
                onChange={(e) => setTitles((p) => ({ ...p, [activeLang]: e.target.value }))}
                className="admin-form-input"
                placeholder="Консультация"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Описание</label>
              <textarea
                value={descriptions[activeLang] || ''}
                onChange={(e) => setDescriptions((p) => ({ ...p, [activeLang]: e.target.value }))}
                className="admin-form-textarea"
                rows={4}
                placeholder="Мы выслушаем вашу ситуацию и предложим оптимальное решение..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push('/admin/about/process')} className="admin-btn admin-btn-secondary">Отмена</button>
            <button type="submit" disabled={loading} className="admin-btn admin-btn-primary">{loading ? 'Сохранение...' : 'Создать'}</button>
          </div>
        </form>
      </AdminLayout>
    </SessionProvider>
  );
}
