'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';
import { toSlug } from '@/lib/slug';

interface Translation {
  language: string;
  name: string;
  position: string;
  bio: string[];
}

interface TeamMemberFormProps {
  initialData?: {
    id?: string;
    slug: string;
    imageUrl: string;
    licenseNumber: string | null;
    order: number;
    isActive: boolean;
    translations: {
      language: string;
      name: string;
      position: string;
      bio: string;
    }[];
  };
  isEditing?: boolean;
}

const languages = [
  { code: 'ru', name: 'Ру', flag: '🇷🇺' },
  { code: 'en', name: 'Eng', flag: '🇺🇸' },
  { code: 'hy', name: 'Հայ', flag: '🇦🇲' },
];

const defaultTranslation: Translation = {
  language: '',
  name: '',
  position: '',
  bio: [''],
};

export default function TeamMemberForm({ initialData, isEditing = false }: TeamMemberFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ru');

  const [slug, setSlug] = useState(initialData?.slug || '');
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [licenseNumber, setLicenseNumber] = useState(initialData?.licenseNumber || '');
  const [order, setOrder] = useState(initialData?.order || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive !== false);

  const [translations, setTranslations] = useState<Translation[]>(() => {
    if (initialData?.translations?.length) {
      return languages.map((lang) => {
        const existing = initialData.translations.find(
          (t) => t.language === lang.code
        );
        if (existing) {
          return {
            language: existing.language,
            name: existing.name,
            position: existing.position,
            bio: JSON.parse(existing.bio || '[]'),
          };
        }
        return { ...defaultTranslation, language: lang.code, bio: [''] };
      });
    }
    return languages.map((lang) => ({
      ...defaultTranslation,
      language: lang.code,
      bio: [''],
    }));
  });

  const handleTranslationChange = (
    langCode: string,
    field: keyof Translation,
    value: string | string[]
  ) => {
    setTranslations((prev) =>
      prev.map((t) =>
        t.language === langCode ? { ...t, [field]: value } : t
      )
    );
    if (langCode === 'ru' && field === 'name' && autoSlug) {
      setSlug(toSlug(value as string));
    }
  };

  // Bio array handlers
  const handleBioChange = (langCode: string, index: number, value: string) => {
    const trans = translations.find((t) => t.language === langCode);
    if (!trans) return;
    const newBio = [...trans.bio];
    newBio[index] = value;
    handleTranslationChange(langCode, 'bio', newBio);
  };

  const addBio = (langCode: string) => {
    const trans = translations.find((t) => t.language === langCode);
    if (!trans) return;
    handleTranslationChange(langCode, 'bio', [...trans.bio, '']);
  };

  const removeBio = (langCode: string, index: number) => {
    const trans = translations.find((t) => t.language === langCode);
    if (!trans || trans.bio.length <= 1) return;
    const newBio = trans.bio.filter((_, i) => i !== index);
    handleTranslationChange(langCode, 'bio', newBio);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/admin/team/${initialData?.id}`
        : '/api/admin/team';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          imageUrl,
          licenseNumber: licenseNumber || null,
          order,
          isActive,
          translations: translations.map((t) => ({
            ...t,
            bio: t.bio.filter((p) => p.trim() !== ''),
          })),
        }),
      });

      if (res.ok) {
        router.push('/admin/team');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Ошибка сохранения');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Ошибка сохранения сотрудника');
    } finally {
      setLoading(false);
    }
  };

  const currentTranslation = translations.find((t) => t.language === activeTab) || translations[0];

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Основные настройки</h2>
        </div>

        <div className="admin-grid admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Slug (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => { setAutoSlug(false); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')); }}
              className="admin-form-input"
              placeholder="ivan-ivanov"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Номер лицензии</label>
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              className="admin-form-input"
              placeholder="№ 1234"
            />
          </div>
        </div>

        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          label="Фотография сотрудника"
          previewWidth={240}
          previewHeight={300}
        />

        <div className="admin-grid admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Порядок</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="admin-form-input"
              min="0"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" style={{ paddingTop: '28px', display: 'block' }}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Активен
            </label>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Переводы</h2>
        </div>

        <div className="admin-lang-tabs">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`admin-lang-tab ${activeTab === lang.code ? 'active' : ''}`}
              onClick={() => setActiveTab(lang.code)}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>

        <div className="admin-grid admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Имя</label>
            <input
              type="text"
              value={currentTranslation.name}
              onChange={(e) =>
                handleTranslationChange(activeTab, 'name', e.target.value)
              }
              className="admin-form-input"
              placeholder="Иван Иванов"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Должность</label>
            <input
              type="text"
              value={currentTranslation.position}
              onChange={(e) =>
                handleTranslationChange(activeTab, 'position', e.target.value)
              }
              className="admin-form-input"
              placeholder="Адвокат"
              required
            />
          </div>
        </div>

        {/* Bio paragraphs */}
        <div className="admin-form-group">
          <label className="admin-form-label">Биография (параграфы)</label>
          {currentTranslation.bio.map((paragraph, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <textarea
                value={paragraph}
                onChange={(e) => handleBioChange(activeTab, index, e.target.value)}
                className="admin-form-textarea"
                placeholder="Параграф биографии..."
                rows={3}
              />
              <button
                type="button"
                onClick={() => removeBio(activeTab, index)}
                className="admin-btn admin-btn-danger admin-btn-sm"
                disabled={currentTranslation.bio.length <= 1}
                style={{ alignSelf: 'flex-start' }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addBio(activeTab)}
            className="admin-btn admin-btn-secondary admin-btn-sm"
          >
            + Добавить параграф
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => router.push('/admin/team')}
          className="admin-btn admin-btn-secondary"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={loading}
          className="admin-btn admin-btn-primary"
        >
          {loading ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  );
}
