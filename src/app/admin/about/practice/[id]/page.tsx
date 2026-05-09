'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';
import EmojiPicker from '@/components/admin/EmojiPicker';

const languages = [
  { code: 'ru', name: 'Ру', flag: '🇷🇺' },
  { code: 'en', name: 'Eng', flag: '🇺🇸' },
  { code: 'hy', name: 'Հայ', flag: '🇦🇲' },
];

export default function EditPracticeAreaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeLang, setActiveLang] = useState('ru');
  const [icon, setIcon] = useState('⚖️');
  const [order, setOrder] = useState(0);
  const [titles, setTitles] = useState<Record<string, string>>({ ru: '', en: '', hy: '' });
  const [descriptions, setDescriptions] = useState<Record<string, string>>({ ru: '', en: '', hy: '' });

  useEffect(() => {
    fetch(`/api/admin/about/practice/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setIcon(d.icon || '⚖️');
        setOrder(d.order || 0);
        const tMap: Record<string, string> = { ru: '', en: '', hy: '' };
        const dMap: Record<string, string> = { ru: '', en: '', hy: '' };
        d.translations?.forEach((t: { language: string; title: string; description: string }) => {
          tMap[t.language] = t.title;
          dMap[t.language] = t.description;
        });
        setTitles(tMap);
        setDescriptions(dMap);
      })
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/about/practice/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          icon, order,
          translations: languages.map((l) => ({
            language: l.code,
            title: titles[l.code] || '',
            description: descriptions[l.code] || '',
          })),
        }),
      });
      if (res.ok) { router.push('/admin/about/practice'); router.refresh(); }
      else { const d = await res.json(); alert(d.error || 'Ошибка'); }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <SessionProvider><AdminLayout title="Загрузка..."><div className="admin-card"><div className="admin-loading"><div className="admin-spinner"></div></div></div></AdminLayout></SessionProvider>;

  return (
    <SessionProvider>
      <AdminLayout title="Редактировать сферу практики">
        <form onSubmit={handleSubmit}>
          <div className="admin-card">
            <div className="admin-card-header"><h2 className="admin-card-title">Настройки</h2></div>
            <EmojiPicker value={icon} onChange={setIcon} />
            <div className="admin-form-group">
              <label className="admin-form-label">Порядок</label>
              <input type="number" value={order} onChange={(e) => setOrder(+e.target.value)} className="admin-form-input" style={{ maxWidth: '120px' }} />
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
              <label className="admin-form-label">Название</label>
              <input
                type="text"
                value={titles[activeLang] || ''}
                onChange={(e) => setTitles((p) => ({ ...p, [activeLang]: e.target.value }))}
                className="admin-form-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Описание</label>
              <textarea
                value={descriptions[activeLang] || ''}
                onChange={(e) => setDescriptions((p) => ({ ...p, [activeLang]: e.target.value }))}
                className="admin-form-textarea"
                rows={4}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push('/admin/about/practice')} className="admin-btn admin-btn-secondary">Отмена</button>
            <button type="submit" disabled={loading} className="admin-btn admin-btn-primary">{loading ? 'Сохранение...' : 'Сохранить'}</button>
          </div>
        </form>
      </AdminLayout>
    </SessionProvider>
  );
}
