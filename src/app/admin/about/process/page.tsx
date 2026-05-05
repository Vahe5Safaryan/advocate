'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';
import ImageUpload from '@/components/admin/ImageUpload';

const languages = [
  { code: 'ru', name: 'Ру', flag: '🇷🇺' },
  { code: 'en', name: 'Eng', flag: '🇺🇸' },
  { code: 'hy', name: 'Հայ', flag: '🇦🇲' },
];

interface ProcessStep {
  id: string;
  stepNumber: number;
  order: number;
  translations: { language: string; title: string; description: string }[];
}

export default function AdminProcessPage() {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [processImage, setProcessImage] = useState('');
  const [processTitles, setProcessTitles] = useState<Record<string, string>>({ ru: '', en: '', hy: '' });
  const [activeLang, setActiveLang] = useState('ru');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchSteps(); fetchSettings(); }, []);

  const fetchSteps = async () => {
    try {
      const res = await fetch('/api/admin/about/process');
      const data = await res.json();
      setSteps(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    const res = await fetch('/api/admin/settings');
    const data: { key: string; value: string; translations: { language: string; value: string }[] }[] = await res.json();
    const imgSetting = data.find((s) => s.key === 'about_process_image');
    setProcessImage(imgSetting?.value || '');
    const titleSetting = data.find((s) => s.key === 'about_process_title');
    const t: Record<string, string> = { ru: '', en: '', hy: '' };
    titleSetting?.translations.forEach((tr) => { t[tr.language] = tr.value; });
    if (!t.ru && !t.en && !t.hy) t.ru = titleSetting?.value || '';
    setProcessTitles(t);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'about_process_image', value: processImage, translations: [] }),
        }),
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: 'about_process_title',
            value: processTitles.ru,
            translations: languages.map((l) => ({ language: l.code, value: processTitles[l.code] || '' })),
          }),
        }),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот шаг?')) return;
    await fetch(`/api/admin/about/process/${id}`, { method: 'DELETE' });
    setSteps(steps.filter((s) => s.id !== id));
  };

  return (
    <SessionProvider>
      <AdminLayout title="Процесс работы">
        <div className="admin-card" style={{ marginBottom: '16px' }}>
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Блок секции</h3>
              <p style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', marginTop: '2px' }}>
                Заголовок и фото слева от шагов процесса
              </p>
            </div>
            <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
              {saving ? 'Сохранение...' : saved ? '✓ Сохранено' : 'Сохранить'}
            </button>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Заголовок секции</label>
            <div className="admin-lang-tabs" style={{ marginBottom: '8px' }}>
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
            <input
              type="text"
              value={processTitles[activeLang] || ''}
              onChange={(e) => setProcessTitles((p) => ({ ...p, [activeLang]: e.target.value }))}
              className="admin-form-input"
              placeholder="Надежные юридические решения для вашего спокойствия"
            />
          </div>

          <ImageUpload value={processImage} onChange={setProcessImage} label="Фото секции" />
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Шаги процесса</h2>
            <Link href="/admin/about/process/new" className="admin-btn admin-btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Добавить шаг
            </Link>
          </div>

          {loading ? (
            <div className="admin-loading"><div className="admin-spinner"></div></div>
          ) : steps.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">🔄</div>
              <p>Шагов пока нет</p>
              <Link href="/admin/about/process/new" className="admin-btn admin-btn-primary" style={{ marginTop: '16px' }}>
                Добавить первый шаг
              </Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Заголовок (RU)</th>
                  <th>Описание (RU)</th>
                  <th>Порядок</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step) => {
                  const ru = step.translations.find((t) => t.language === 'ru');
                  return (
                    <tr key={step.id}>
                      <td><strong>{step.stepNumber}</strong></td>
                      <td>{ru?.title || '-'}</td>
                      <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ru?.description || '-'}
                      </td>
                      <td>{step.order}</td>
                      <td>
                        <div className="admin-actions">
                          <Link href={`/admin/about/process/${step.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                            Редактировать
                          </Link>
                          <button onClick={() => handleDelete(step.id)} className="admin-btn admin-btn-danger admin-btn-sm">
                            Удалить
                          </button>
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
