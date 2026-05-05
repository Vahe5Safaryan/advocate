'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';

interface Translation {
  language: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
}

interface SlideFormProps {
  initialData?: {
    id?: string;
    imageUrl: string;
    order: number;
    isActive: boolean;
    translations: Translation[];
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
  subtitle: '',
  description: '',
  buttonText: 'Позвонить',
};

export default function SlideForm({ initialData, isEditing = false }: SlideFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ru');

  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [order, setOrder] = useState(initialData?.order || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive !== false);

  const [translations, setTranslations] = useState<Translation[]>(() => {
    if (initialData?.translations?.length) {
      return languages.map((lang) => {
        const existing = initialData.translations.find(
          (t) => t.language === lang.code
        );
        return existing || { ...defaultTranslation, language: lang.code };
      });
    }
    return languages.map((lang) => ({
      ...defaultTranslation,
      language: lang.code,
    }));
  });

  const handleTranslationChange = (
    langCode: string,
    field: keyof Translation,
    value: string
  ) => {
    setTranslations((prev) =>
      prev.map((t) =>
        t.language === langCode ? { ...t, [field]: value } : t
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/admin/slides/${initialData?.id}`
        : '/api/admin/slides';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          order,
          isActive,
          translations,
        }),
      });

      if (res.ok) {
        router.push('/admin/slides');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Ошибка сохранения');
      }
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('Ошибка сохранения слайда');
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

        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          label="Изображение слайда"
          previewWidth={600}
          previewHeight={338}
        />

        <div className="admin-grid admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Порядок отображения</label>
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

        <div className="admin-form-group">
          <label className="admin-form-label">Подзаголовок</label>
          <input
            type="text"
            value={currentTranslation.subtitle}
            onChange={(e) =>
              handleTranslationChange(activeTab, 'subtitle', e.target.value)
            }
            className="admin-form-input"
            placeholder="Ваш путь к справедливости начинается здесь"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Заголовок</label>
          <input
            type="text"
            value={currentTranslation.title}
            onChange={(e) =>
              handleTranslationChange(activeTab, 'title', e.target.value)
            }
            className="admin-form-input"
            placeholder="Добро пожаловать в NEW LEX Law Firm"
            required
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Описание</label>
          <textarea
            value={currentTranslation.description}
            onChange={(e) =>
              handleTranslationChange(activeTab, 'description', e.target.value)
            }
            className="admin-form-textarea"
            placeholder="Описание слайда..."
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Текст кнопки</label>
          <input
            type="text"
            value={currentTranslation.buttonText}
            onChange={(e) =>
              handleTranslationChange(activeTab, 'buttonText', e.target.value)
            }
            className="admin-form-input"
            placeholder="Позвонить"
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => router.push('/admin/slides')}
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
