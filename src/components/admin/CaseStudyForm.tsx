'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';
import { toSlug } from '@/lib/slug';

interface Section {
  title: string;
  content: string;
}

interface Translation {
  language: string;
  title: string;
  introTitle: string;
  intro: string;
  sections: Section[];
}

interface Category {
  id: string;
  slug: string;
  translations: { language: string; name: string }[];
}

interface CaseStudyFormProps {
  initialData?: {
    id?: string;
    slug: string;
    imageUrl: string | null;
    categoryId: string | null;
    publishedAt: string | null;
    isPublished: boolean;
    translations: {
      language: string;
      title: string;
      introTitle?: string;
      intro: string;
      sections: string;
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
  title: '',
  introTitle: '',
  intro: '',
  sections: [{ title: '', content: '' }],
};

export default function CaseStudyForm({ initialData, isEditing = false }: CaseStudyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ru');
  const [categories, setCategories] = useState<Category[]>([]);

  const [slug, setSlug] = useState(initialData?.slug || '');
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt ? initialData.publishedAt.slice(0, 10) : ''
  );
  const [isPublished, setIsPublished] = useState(initialData?.isPublished || false);

  const [translations, setTranslations] = useState<Translation[]>(() => {
    if (initialData?.translations?.length) {
      return languages.map((lang) => {
        const existing = initialData.translations.find((t) => t.language === lang.code);
        if (existing) {
          return {
            language: existing.language,
            title: existing.title,
            introTitle: existing.introTitle || '',
            intro: existing.intro,
            sections: JSON.parse(existing.sections || '[]'),
          };
        }
        return { ...defaultTranslation, language: lang.code, sections: [{ title: '', content: '' }] };
      });
    }
    return languages.map((lang) => ({
      ...defaultTranslation,
      language: lang.code,
      sections: [{ title: '', content: '' }],
    }));
  });

  useEffect(() => {
    fetch('/api/admin/categories?type=case')
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const handleTranslationChange = (langCode: string, field: keyof Translation, value: string | Section[]) => {
    setTranslations((prev) =>
      prev.map((t) => (t.language === langCode ? { ...t, [field]: value } : t))
    );
    if (langCode === 'ru' && field === 'title' && autoSlug) {
      setSlug(toSlug(value as string));
    }
  };

  const handleSectionChange = (langCode: string, index: number, field: 'title' | 'content', value: string) => {
    const trans = translations.find((t) => t.language === langCode);
    if (!trans) return;
    const newSections = [...trans.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    handleTranslationChange(langCode, 'sections', newSections);
  };

  const addSection = (langCode: string) => {
    const trans = translations.find((t) => t.language === langCode);
    if (!trans) return;
    handleTranslationChange(langCode, 'sections', [...trans.sections, { title: '', content: '' }]);
  };

  const removeSection = (langCode: string, index: number) => {
    const trans = translations.find((t) => t.language === langCode);
    if (!trans || trans.sections.length <= 1) return;
    handleTranslationChange(langCode, 'sections', trans.sections.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/admin/cases/${initialData?.id}` : '/api/admin/cases';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          imageUrl: imageUrl || null,
          categoryId: categoryId || null,
          publishedAt: publishedAt || null,
          isPublished,
          translations: translations.map((t) => ({
            ...t,
            sections: t.sections.filter((s) => s.title.trim() || s.content.trim()),
          })),
        }),
      });

      if (res.ok) {
        router.push('/admin/cases');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Ошибка сохранения');
      }
    } catch (error) {
      console.error('Error saving case:', error);
      alert('Ошибка сохранения дела');
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
              placeholder="nalogovyi-spor-2024"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Категория</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="admin-form-input"
            >
              <option value="">Без категории</option>
              {categories.map((cat) => {
                const ruName = cat.translations.find((t) => t.language === 'ru')?.name || cat.slug;
                return (
                  <option key={cat.id} value={cat.id}>
                    {ruName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          label="Обложка дела"
          previewWidth={400}
          previewHeight={225}
        />

        <div className="admin-grid admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Дата публикации</label>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" style={{ paddingTop: '28px', display: 'block' }}>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Опубликовано
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

        <div className="admin-form-group">
          <label className="admin-form-label">Заголовок</label>
          <input
            type="text"
            value={currentTranslation.title}
            onChange={(e) => handleTranslationChange(activeTab, 'title', e.target.value)}
            className="admin-form-input"
            placeholder="Налоговый спор — успешное разрешение"
            required
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Заголовок вступления</label>
          <input
            type="text"
            value={currentTranslation.introTitle}
            onChange={(e) => handleTranslationChange(activeTab, 'introTitle', e.target.value)}
            className="admin-form-input"
            placeholder="Например: О деле"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">
            Вступление
            <span style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', fontWeight: 400, marginLeft: '8px' }}>
              (первые 200 символов автоматически станут описанием карточки)
            </span>
          </label>
          <textarea
            value={currentTranslation.intro}
            onChange={(e) => handleTranslationChange(activeTab, 'intro', e.target.value)}
            className="admin-form-textarea"
            placeholder="Описание дела и его контекст..."
            rows={4}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Секции дела</label>
          {currentTranslation.sections.map((section, index) => (
            <div
              key={index}
              style={{
                border: '1px solid var(--admin-border)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                backgroundColor: 'var(--admin-bg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <strong>Секция {index + 1}</strong>
                <button
                  type="button"
                  onClick={() => removeSection(activeTab, index)}
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  disabled={currentTranslation.sections.length <= 1}
                >
                  Удалить
                </button>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Заголовок секции</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleSectionChange(activeTab, index, 'title', e.target.value)}
                  className="admin-form-input"
                  placeholder="Заголовок секции"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Содержание</label>
                <textarea
                  value={section.content}
                  onChange={(e) => handleSectionChange(activeTab, index, 'content', e.target.value)}
                  className="admin-form-textarea"
                  placeholder="Текст секции..."
                  rows={4}
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addSection(activeTab)} className="admin-btn admin-btn-secondary">
            + Добавить секцию
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button type="button" onClick={() => router.push('/admin/cases')} className="admin-btn admin-btn-secondary">
          Отмена
        </button>
        <button type="submit" disabled={loading} className="admin-btn admin-btn-primary">
          {loading ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  );
}
