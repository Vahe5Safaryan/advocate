'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';
import ImageUpload from '@/components/admin/ImageUpload';

const languages = [
  { code: 'ru', name: 'Ру', flag: '🇷🇺' },
  { code: 'en', name: 'Eng', flag: '🇺🇸' },
  { code: 'hy', name: 'Հայ', flag: '🇦🇲' },
];


interface Setting {
  id: string;
  key: string;
  value: string;
  translations: { language: string; value: string }[];
}

export default function AdminAboutHeroPage() {
  const [activeLang, setActiveLang] = useState('ru');
  const [image, setImage] = useState('');
  const [titles, setTitles] = useState<Record<string, string>>({ ru: '', en: '', hy: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data: Setting[] = await res.json();
      const map: Record<string, Setting> = {};
      data.forEach((s) => { map[s.key] = s; });

      setImage(map['about_hero_image']?.value || '');

      const t: Record<string, string> = { ru: '', en: '', hy: '' };
      map['about_hero_title']?.translations.forEach((tr) => { t[tr.language] = tr.value; });
      if (!t.ru && !t.en && !t.hy) t.ru = map['about_hero_title']?.value || '';
      setTitles(t);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'about_hero_image', value: image, translations: [] }),
        }),
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: 'about_hero_title',
            value: titles.ru,
            translations: languages.map((l) => ({ language: l.code, value: titles[l.code] || '' })),
          }),
        }),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SessionProvider>
      <AdminLayout title="Главный блок «О нас»">
        <div style={{ marginBottom: '16px' }}>
          <Link href="/admin/about" className="admin-btn admin-btn-secondary">
            ← О компании
          </Link>
        </div>

        {loading ? (
          <div className="admin-card"><div className="admin-loading"><div className="admin-spinner"></div></div></div>
        ) : (
          <>
            <div className="admin-card" style={{ marginBottom: '16px' }}>
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Фото команды</h3>
                  <p style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', marginTop: '2px' }}>
                    Изображение справа от заголовка на странице «О нас»
                  </p>
                </div>
              </div>
              <ImageUpload
                value={image}
                onChange={setImage}
                label="Фото"
              />
            </div>

            <div className="admin-card" style={{ marginBottom: '16px' }}>
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Заголовок блока</h3>
                  <p style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', marginTop: '2px' }}>
                    Например: «Наша команда юристов обеспечивает надежную защиту клиентов»
                  </p>
                </div>
              </div>

              <div className="admin-lang-tabs" style={{ marginBottom: '12px' }}>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className={`admin-lang-tab ${activeLang === l.code ? 'active' : ''}`}
                    onClick={() => setActiveLang(l.code)}
                  >
                    {l.flag} {l.name}
                  </button>
                ))}
              </div>

              <div className="admin-form-group">
                <input
                  type="text"
                  value={titles[activeLang] || ''}
                  onChange={(e) => setTitles((p) => ({ ...p, [activeLang]: e.target.value }))}
                  className="admin-form-input"
                  placeholder="Наша команда юристов..."
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
                {saving ? 'Сохранение...' : saved ? '✓ Сохранено' : 'Сохранить изменения'}
              </button>
            </div>
          </>
        )}
      </AdminLayout>
    </SessionProvider>
  );
}
