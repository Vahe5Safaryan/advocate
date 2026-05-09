'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

const languages = [
  { code: 'ru', name: 'Ру', flag: '🇷🇺' },
  { code: 'en', name: 'Eng', flag: '🇺🇸' },
  { code: 'hy', name: 'Հայ', flag: '🇦🇲' },
];

type LangMap = Record<string, string>;
type Setting = { key: string; value: string; translations: { language: string; value: string }[] };

function emptyLangs(): LangMap { return { ru: '', en: '', hy: '' }; }

function pickTranslations(data: Setting[], key: string): LangMap {
  const s = data.find((x) => x.key === key);
  const t = emptyLangs();
  s?.translations.forEach((tr) => { t[tr.language] = tr.value; });
  if (!t.ru && !t.en && !t.hy) t.ru = s?.value || '';
  return t;
}

function pickValue(data: Setting[], key: string): string {
  return data.find((x) => x.key === key)?.value || '';
}

export default function AdminAboutHomePage() {
  const [activeLang, setActiveLang] = useState('ru');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Main texts
  const [title, setTitle] = useState<LangMap>(emptyLangs());
  const [description, setDescription] = useState<LangMap>(emptyLangs());

  // Stats + YouTube
  const [statsNumber, setStatsNumber] = useState('10+');
  const [statsLabel, setStatsLabel] = useState<LangMap>(emptyLangs());
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // Features
  const [features, setFeatures] = useState([
    { icon: '📚', title: emptyLangs(), desc: emptyLangs() },
    { icon: '⚖️', title: emptyLangs(), desc: emptyLangs() },
    { icon: '💼', title: emptyLangs(), desc: emptyLangs() },
  ]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data: Setting[] = await res.json();

      setTitle(pickTranslations(data, 'home_about_title'));
      setDescription(pickTranslations(data, 'home_about_description'));
      setStatsNumber(pickValue(data, 'home_about_stats_number') || '10+');
      setStatsLabel(pickTranslations(data, 'home_about_stats_label'));
      setYoutubeUrl(pickValue(data, 'home_about_youtube'));

      setFeatures([
        { icon: pickValue(data, 'home_about_f1_icon') || '📚', title: pickTranslations(data, 'home_about_f1_title'), desc: pickTranslations(data, 'home_about_f1_desc') },
        { icon: pickValue(data, 'home_about_f2_icon') || '⚖️', title: pickTranslations(data, 'home_about_f2_title'), desc: pickTranslations(data, 'home_about_f2_desc') },
        { icon: pickValue(data, 'home_about_f3_icon') || '💼', title: pickTranslations(data, 'home_about_f3_title'), desc: pickTranslations(data, 'home_about_f3_desc') },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const save = async (key: string, value: string, translations: LangMap | null) => {
    return fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        value,
        translations: translations
          ? languages.map((l) => ({ language: l.code, value: translations[l.code] || '' }))
          : [],
      }),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        save('home_about_title', title.ru, title),
        save('home_about_description', description.ru, description),
        save('home_about_stats_number', statsNumber, null),
        save('home_about_stats_label', statsLabel.ru, statsLabel),
        save('home_about_youtube', youtubeUrl, null),
        save('home_about_f1_icon', features[0].icon, null),
        save('home_about_f1_title', features[0].title.ru, features[0].title),
        save('home_about_f1_desc', features[0].desc.ru, features[0].desc),
        save('home_about_f2_icon', features[1].icon, null),
        save('home_about_f2_title', features[1].title.ru, features[1].title),
        save('home_about_f2_desc', features[1].desc.ru, features[1].desc),
        save('home_about_f3_icon', features[2].icon, null),
        save('home_about_f3_title', features[2].title.ru, features[2].title),
        save('home_about_f3_desc', features[2].desc.ru, features[2].desc),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const updateFeature = (idx: number, field: 'icon' | 'title' | 'desc', lang: string | null, value: string) => {
    setFeatures((prev) => prev.map((f, i) => {
      if (i !== idx) return f;
      if (field === 'icon') return { ...f, icon: value };
      return { ...f, [field]: { ...f[field], [lang!]: value } };
    }));
  };

  const langTabs = (
    <div className="admin-lang-tabs" style={{ marginBottom: '8px' }}>
      {languages.map((l) => (
        <button key={l.code} type="button"
          className={`admin-lang-tab ${activeLang === l.code ? 'active' : ''}`}
          onClick={() => setActiveLang(l.code)}
        >
          {l.flag} {l.name}
        </button>
      ))}
    </div>
  );

  return (
    <SessionProvider>
      <AdminLayout title="Секция «О нас» (главная)">
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/admin/about" className="admin-btn admin-btn-secondary">← О компании</Link>
          <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? 'Сохранение...' : saved ? '✓ Сохранено' : 'Сохранить всё'}
          </button>
        </div>

        {loading ? (
          <div className="admin-card"><div className="admin-loading"><div className="admin-spinner"></div></div></div>
        ) : (
          <>
            {/* Main texts */}
            <div className="admin-card" style={{ marginBottom: '16px' }}>
              <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>Основной текст</h3>
              {langTabs}
              <div className="admin-form-group">
                <label className="admin-form-label">Заголовок</label>
                <input type="text" className="admin-form-input"
                  value={title[activeLang] || ''}
                  onChange={(e) => setTitle((p) => ({ ...p, [activeLang]: e.target.value }))}
                  placeholder="Высококачественные юридические и бухгалтерские услуги в Армении"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Описание</label>
                <textarea className="admin-form-input" rows={3}
                  value={description[activeLang] || ''}
                  onChange={(e) => setDescription((p) => ({ ...p, [activeLang]: e.target.value }))}
                  placeholder="Адвокатская контора «NEW LEX» уже более 10 лет..."
                />
              </div>
            </div>

            {/* Stats + YouTube */}
            <div className="admin-card" style={{ marginBottom: '16px' }}>
              <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>Статистика и видео</h3>
              {langTabs}
              <div className="admin-grid admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">Число (например: 10+)</label>
                  <input type="text" className="admin-form-input"
                    value={statsNumber}
                    onChange={(e) => setStatsNumber(e.target.value)}
                    placeholder="10+"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Подпись под числом</label>
                  <input type="text" className="admin-form-input"
                    value={statsLabel[activeLang] || ''}
                    onChange={(e) => setStatsLabel((p) => ({ ...p, [activeLang]: e.target.value }))}
                    placeholder="Лет опыта"
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Ссылка на YouTube</label>
                <input type="text" className="admin-form-input"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>

            {/* Features */}
            <div className="admin-card" style={{ marginBottom: '16px' }}>
              <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>3 преимущества</h3>
              {langTabs}
              {features.map((f, idx) => (
                <div key={idx} style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '16px', marginTop: '16px' }}>
                  <p style={{ fontWeight: 600, marginBottom: '12px', color: 'var(--admin-text)' }}>Преимущество {idx + 1}</p>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Иконка (эмодзи)</label>
                    <input type="text" className="admin-form-input"
                      value={f.icon}
                      onChange={(e) => updateFeature(idx, 'icon', null, e.target.value)}
                      placeholder="📚"
                      style={{ maxWidth: '120px' }}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Заголовок</label>
                    <input type="text" className="admin-form-input"
                      value={f.title[activeLang] || ''}
                      onChange={(e) => updateFeature(idx, 'title', activeLang, e.target.value)}
                      placeholder="Множество успешных дел"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Описание</label>
                    <input type="text" className="admin-form-input"
                      value={f.desc[activeLang] || ''}
                      onChange={(e) => updateFeature(idx, 'desc', activeLang, e.target.value)}
                      placeholder="Наша команда успешно завершила..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </AdminLayout>
    </SessionProvider>
  );
}
