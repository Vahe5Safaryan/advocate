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

const PREDEFINED_SETTINGS = [
  { key: 'site_name', label: 'Название сайта', description: 'Отображается в заголовке браузера и шапке', hasTranslations: true, type: 'text' },
  { key: 'site_description', label: 'Описание сайта', description: 'Meta description для SEO', hasTranslations: true, type: 'text' },
  { key: 'phone', label: 'Телефон 1', description: 'Отображается в шапке сайта (Header)', hasTranslations: false, type: 'text' },
  { key: 'phone2', label: 'Телефон 2', description: 'Второй телефон в шапке сайта (Header)', hasTranslations: false, type: 'text' },
  { key: 'email', label: 'Email', description: 'Отображается в шапке сайта (Header)', hasTranslations: false, type: 'text' },
  { key: 'address', label: 'Адрес', description: 'Физический адрес офиса', hasTranslations: true, type: 'text' },
  { key: 'copyright', label: 'Copyright', description: 'Текст копирайта в футере', hasTranslations: true, type: 'text' },
  { key: 'footer_description', label: 'Описание в футере', description: 'Текст под логотипом в подвале сайта', hasTranslations: true, type: 'text' },
  { key: 'footer_title_services', label: 'Футер: заголовок «Услуги»', description: 'Заголовок колонки услуг в футере', hasTranslations: true, type: 'text' },
  { key: 'footer_title_company', label: 'Футер: заголовок «Компания»', description: 'Заголовок колонки навигации в футере', hasTranslations: true, type: 'text' },
  { key: 'footer_title_contacts', label: 'Футер: заголовок «Контакты»', description: 'Заголовок колонки контактов в футере', hasTranslations: true, type: 'text' },
  { key: 'social_facebook', label: 'Facebook', description: 'Ссылка на страницу Facebook (оставьте пустым, чтобы скрыть)', hasTranslations: false, type: 'text' },
  { key: 'social_instagram', label: 'Instagram', description: 'Ссылка на страницу Instagram', hasTranslations: false, type: 'text' },
  { key: 'social_linkedin', label: 'LinkedIn', description: 'Ссылка на страницу LinkedIn', hasTranslations: false, type: 'text' },
  { key: 'social_youtube', label: 'YouTube', description: 'Ссылка на канал YouTube', hasTranslations: false, type: 'text' },
  { key: 'home_about_stats_number', label: 'О нас: цифра (напр. 240+)', description: 'Большая цифра на картинке в блоке «О нас» на главной', hasTranslations: false, type: 'text' },
  { key: 'home_about_stats_label', label: 'О нас: подпись к цифре', description: 'Текст под цифрой в блоке «О нас» на главной (напр. Успешных дел)', hasTranslations: true, type: 'text' },
  { key: 'about_stats_number', label: 'О компании: цифра (напр. 240+)', description: 'Большая цифра на картинке в разделе «О компании»', hasTranslations: false, type: 'text' },
  { key: 'about_stats_label', label: 'О компании: подпись к цифре', description: 'Текст под цифрой в разделе «О компании» (напр. Успешных дел)', hasTranslations: true, type: 'text' },
];

interface Setting {
  id: string;
  key: string;
  value: string;
  translations: { language: string; value: string }[];
}

export default function AdminSettingsPage() {
  const [, setSettings] = useState<Record<string, Setting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState('ru');

  const [formValues, setFormValues] = useState<Record<string, { value: string; translations: Record<string, string> }>>({});

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data: Setting[] = await res.json();
      const map: Record<string, Setting> = {};
      data.forEach((s) => { map[s.key] = s; });
      setSettings(map);

      const fv: Record<string, { value: string; translations: Record<string, string> }> = {};
      PREDEFINED_SETTINGS.forEach(({ key }) => {
        const existing = map[key];
        const langMap: Record<string, string> = { ru: '', en: '', hy: '' };
        existing?.translations.forEach((t) => { langMap[t.language] = t.value; });
        fv[key] = { value: existing?.value || '', translations: langMap };
      });
      setFormValues(fv);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, hasTranslations: boolean) => {
    setSaving(key);
    try {
      const form = formValues[key];
      const translations = hasTranslations
        ? languages.map((l) => ({ language: l.code, value: form.translations[l.code] || '' }))
        : [];

      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: form.value, translations }),
      });
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } finally {
      setSaving(null);
    }
  };

  const updateValue = (key: string, value: string) => {
    setFormValues((p) => ({ ...p, [key]: { ...p[key], value } }));
  };

  const updateTranslation = (key: string, lang: string, value: string) => {
    setFormValues((p) => ({
      ...p,
      [key]: { ...p[key], translations: { ...p[key]?.translations, [lang]: value } },
    }));
  };

  return (
    <SessionProvider>
      <AdminLayout title="Настройки сайта">
        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
          <Link href="/admin/settings/menu" className="admin-btn admin-btn-secondary">
            🗂️ Управление меню
          </Link>
        </div>

        {loading ? (
          <div className="admin-card"><div className="admin-loading"><div className="admin-spinner"></div></div></div>
        ) : (
          <>
            <div className="admin-lang-tabs" style={{ marginBottom: '16px' }}>
              {languages.map((l) => (
                <button key={l.code} type="button" className={`admin-lang-tab ${activeLang === l.code ? 'active' : ''}`} onClick={() => setActiveLang(l.code)}>
                  {l.flag} {l.name}
                </button>
              ))}
            </div>

            {PREDEFINED_SETTINGS.map(({ key, label, description, hasTranslations, type }) => (
              <div key={key} className="admin-card" style={{ marginBottom: '16px' }}>
                <div className="admin-card-header">
                  <div>
                    <h3 className="admin-card-title" style={{ fontSize: '15px' }}>{label}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', marginTop: '2px' }}>{description}</p>
                  </div>
                  <button
                    onClick={() => handleSave(key, hasTranslations)}
                    disabled={saving === key}
                    className="admin-btn admin-btn-primary"
                  >
                    {saving === key ? 'Сохранение...' : saved === key ? '✓ Сохранено' : 'Сохранить'}
                  </button>
                </div>

                {type === 'image' ? (
                  <ImageUpload
                    value={formValues[key]?.value || ''}
                    onChange={(url) => updateValue(key, url)}
                    label="Изображение"
                  />
                ) : hasTranslations ? (
                  <div className="admin-form-group">
                    <label className="admin-form-label">Значение ({languages.find((l) => l.code === activeLang)?.name})</label>
                    <input
                      type="text"
                      value={formValues[key]?.translations[activeLang] || ''}
                      onChange={(e) => updateTranslation(key, activeLang, e.target.value)}
                      className="admin-form-input"
                      placeholder={`${label} на ${languages.find((l) => l.code === activeLang)?.name}`}
                    />
                    <p style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                      Базовое значение (резерв):
                      <input
                        type="text"
                        value={formValues[key]?.value || ''}
                        onChange={(e) => updateValue(key, e.target.value)}
                        style={{ marginLeft: '8px', padding: '2px 8px', border: '1px solid var(--admin-border)', borderRadius: '4px', fontSize: '12px' }}
                        placeholder="резерв"
                      />
                    </p>
                  </div>
                ) : (
                  <div className="admin-form-group">
                    <label className="admin-form-label">Значение</label>
                    <input
                      type="text"
                      value={formValues[key]?.value || ''}
                      onChange={(e) => updateValue(key, e.target.value)}
                      className="admin-form-input"
                      placeholder={label}
                    />
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </AdminLayout>
    </SessionProvider>
  );
}
