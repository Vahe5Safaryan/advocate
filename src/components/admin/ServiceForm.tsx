'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toSlug } from '@/lib/slug';

interface SectionParagraph {
  title: string;
  content: string;
}

interface Section {
  title: string;
  items: string[];
  paragraphs: SectionParagraph[];
}

interface Translation {
  language: string;
  title: string;
  heroTitle: string;
  introTitle: string;
  items: string[];
  intro: string[];
  sections: Section[];
}

interface ServiceFormProps {
  initialData?: {
    id?: string;
    slug: string;
    icon: string;
    order: number;
    isActive: boolean;
    translations: {
      language: string;
      title: string;
      heroTitle: string;
      introTitle?: string;
      items: string;
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
  heroTitle: '',
  introTitle: '',
  items: [''],
  intro: [''],
  sections: [{ title: '', items: [''], paragraphs: [] }],
};

function parseSection(raw: { title: string; items: string[]; paragraphs?: SectionParagraph[] }): Section {
  return { title: raw.title, items: raw.items, paragraphs: raw.paragraphs ?? [] };
}

export default function ServiceForm({ initialData, isEditing = false }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ru');

  const [slug, setSlug] = useState(initialData?.slug || '');
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [icon, setIcon] = useState(initialData?.icon || '⚖️');
  const [order, setOrder] = useState(initialData?.order || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive !== false);

  const [translations, setTranslations] = useState<Translation[]>(() => {
    if (initialData?.translations?.length) {
      return languages.map((lang) => {
        const existing = initialData.translations.find((t) => t.language === lang.code);
        if (existing) {
          return {
            language: existing.language,
            title: existing.title,
            heroTitle: existing.heroTitle,
            introTitle: existing.introTitle || '',
            items: JSON.parse(existing.items || '[]'),
            intro: JSON.parse(existing.intro || '[]'),
            sections: (JSON.parse(existing.sections || '[]') as { title: string; items: string[]; paragraphs?: SectionParagraph[] }[]).map(parseSection),
          };
        }
        return { ...defaultTranslation, language: lang.code };
      });
    }
    return languages.map((lang) => ({ ...defaultTranslation, language: lang.code, items: [''], intro: [''], sections: [{ title: '', items: [''], paragraphs: [] }] }));
  });

  const updateTrans = (langCode: string, field: keyof Translation, value: string | string[] | Section[]) => {
    setTranslations((prev) => prev.map((t) => t.language === langCode ? { ...t, [field]: value } : t));
    if (langCode === 'ru' && field === 'title' && autoSlug) {
      setSlug(toSlug(value as string));
    }
  };

  const trans = (langCode: string) => translations.find((t) => t.language === langCode)!;

  // Items
  const handleItemChange = (lc: string, i: number, v: string) => { const a = [...trans(lc).items]; a[i] = v; updateTrans(lc, 'items', a); };
  const addItem = (lc: string) => updateTrans(lc, 'items', [...trans(lc).items, '']);
  const removeItem = (lc: string, i: number) => { if (trans(lc).items.length <= 1) return; updateTrans(lc, 'items', trans(lc).items.filter((_, idx) => idx !== i)); };

  // Intro
  const handleIntroChange = (lc: string, i: number, v: string) => { const a = [...trans(lc).intro]; a[i] = v; updateTrans(lc, 'intro', a); };
  const addIntro = (lc: string) => updateTrans(lc, 'intro', [...trans(lc).intro, '']);
  const removeIntro = (lc: string, i: number) => { if (trans(lc).intro.length <= 1) return; updateTrans(lc, 'intro', trans(lc).intro.filter((_, idx) => idx !== i)); };

  // Sections — base
  const updateSections = (lc: string, sections: Section[]) => updateTrans(lc, 'sections', sections);
  const addSection = (lc: string) => updateSections(lc, [...trans(lc).sections, { title: '', items: [''], paragraphs: [] }]);
  const removeSection = (lc: string, si: number) => { if (trans(lc).sections.length <= 1) return; updateSections(lc, trans(lc).sections.filter((_, i) => i !== si)); };
  const setSectionTitle = (lc: string, si: number, v: string) => { const s = [...trans(lc).sections]; s[si] = { ...s[si], title: v }; updateSections(lc, s); };

  // Section items
  const setSectionItem = (lc: string, si: number, ii: number, v: string) => { const s = [...trans(lc).sections]; const items = [...s[si].items]; items[ii] = v; s[si] = { ...s[si], items }; updateSections(lc, s); };
  const addSectionItem = (lc: string, si: number) => { const s = [...trans(lc).sections]; s[si] = { ...s[si], items: [...s[si].items, ''] }; updateSections(lc, s); };
  const removeSectionItem = (lc: string, si: number, ii: number) => { if (trans(lc).sections[si].items.length <= 1) return; const s = [...trans(lc).sections]; s[si] = { ...s[si], items: s[si].items.filter((_, i) => i !== ii) }; updateSections(lc, s); };

  // Section paragraphs
  const addSectionParagraph = (lc: string, si: number) => { const s = [...trans(lc).sections]; s[si] = { ...s[si], paragraphs: [...s[si].paragraphs, { title: '', content: '' }] }; updateSections(lc, s); };
  const removeSectionParagraph = (lc: string, si: number, pi: number) => { const s = [...trans(lc).sections]; s[si] = { ...s[si], paragraphs: s[si].paragraphs.filter((_, i) => i !== pi) }; updateSections(lc, s); };
  const setSectionParagraph = (lc: string, si: number, pi: number, field: 'title' | 'content', v: string) => {
    const s = [...trans(lc).sections];
    const paragraphs = [...s[si].paragraphs];
    paragraphs[pi] = { ...paragraphs[pi], [field]: v };
    s[si] = { ...s[si], paragraphs };
    updateSections(lc, s);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEditing ? `/api/admin/services/${initialData?.id}` : '/api/admin/services';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug, icon, order, isActive,
          translations: translations.map((t) => ({
            ...t,
            items: t.items.filter((i) => i.trim() !== ''),
            intro: t.intro.filter((p) => p.trim() !== ''),
            sections: t.sections
              .filter((s) => s.title.trim() !== '' || s.items.some((i) => i.trim() !== '') || s.paragraphs.length > 0)
              .map((s) => ({
                title: s.title,
                items: s.items.filter((i) => i.trim() !== ''),
                paragraphs: s.paragraphs.filter((p) => p.title.trim() !== '' || p.content.trim() !== ''),
              })),
          })),
        }),
      });
      if (res.ok) { router.push('/admin/services'); router.refresh(); }
      else { const data = await res.json(); alert(data.error || 'Ошибка сохранения'); }
    } catch { alert('Ошибка сохранения услуги'); }
    finally { setLoading(false); }
  };

  const cur = translations.find((t) => t.language === activeTab) || translations[0];

  return (
    <form onSubmit={handleSubmit}>
      {/* Base settings */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Основные настройки</h2>
        </div>
        <div className="admin-grid admin-grid-3">
          <div className="admin-form-group">
            <label className="admin-form-label">Slug (URL)</label>
            <input type="text" value={slug} onChange={(e) => { setAutoSlug(false); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')); }} className="admin-form-input" placeholder="criminal" required />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Иконка (emoji)</label>
            <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} className="admin-form-input" placeholder="⚖️" />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Порядок</label>
            <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="admin-form-input" min="0" />
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ marginRight: '8px' }} />
            Активна
          </label>
        </div>
      </div>

      {/* Translations */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Переводы</h2>
        </div>

        <div className="admin-lang-tabs">
          {languages.map((lang) => (
            <button key={lang.code} type="button" className={`admin-lang-tab ${activeTab === lang.code ? 'active' : ''}`} onClick={() => setActiveTab(lang.code)}>
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>

        {/* Title / Hero Title */}
        <div className="admin-grid admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Название</label>
            <input type="text" value={cur.title} onChange={(e) => updateTrans(activeTab, 'title', e.target.value)} className="admin-form-input" placeholder="Уголовное право" required />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Заголовок на странице</label>
            <input type="text" value={cur.heroTitle} onChange={(e) => updateTrans(activeTab, 'heroTitle', e.target.value)} className="admin-form-input" placeholder="Уголовное Право" />
          </div>
        </div>

        {/* Card Items */}
        <div className="admin-form-group">
          <label className="admin-form-label">Пункты для карточки (на главной)</label>
          {cur.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input type="text" value={item} onChange={(e) => handleItemChange(activeTab, i, e.target.value)} className="admin-form-input" placeholder="Защита обвиняемых" />
              <button type="button" onClick={() => removeItem(activeTab, i)} className="admin-btn admin-btn-danger admin-btn-sm" disabled={cur.items.length <= 1}>×</button>
            </div>
          ))}
          <button type="button" onClick={() => addItem(activeTab)} className="admin-btn admin-btn-secondary admin-btn-sm">+ Добавить пункт</button>
        </div>

        {/* Intro Title */}
        <div className="admin-form-group">
          <label className="admin-form-label">Заголовок вступительной секции</label>
          <input
            type="text"
            value={cur.introTitle}
            onChange={(e) => updateTrans(activeTab, 'introTitle', e.target.value)}
            className="admin-form-input"
            placeholder="Например: О данной практике"
          />
        </div>

        {/* Intro paragraphs */}
        <div className="admin-form-group">
          <label className="admin-form-label">Вступительные параграфы</label>
          {cur.intro.map((paragraph, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <textarea value={paragraph} onChange={(e) => handleIntroChange(activeTab, i, e.target.value)} className="admin-form-textarea" placeholder="Вступительный текст..." rows={3} />
              <button type="button" onClick={() => removeIntro(activeTab, i)} className="admin-btn admin-btn-danger admin-btn-sm" disabled={cur.intro.length <= 1} style={{ alignSelf: 'flex-start' }}>×</button>
            </div>
          ))}
          <button type="button" onClick={() => addIntro(activeTab)} className="admin-btn admin-btn-secondary admin-btn-sm">+ Добавить параграф</button>
        </div>

        {/* Sections */}
        <div className="admin-form-group">
          <label className="admin-form-label">Секции</label>
          {cur.sections.map((section, si) => (
            <div key={si} style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '16px', marginBottom: '16px', backgroundColor: 'var(--admin-bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <strong>Секция {si + 1}</strong>
                <button type="button" onClick={() => removeSection(activeTab, si)} className="admin-btn admin-btn-danger admin-btn-sm" disabled={cur.sections.length <= 1}>Удалить секцию</button>
              </div>

              {/* Section title */}
              <div className="admin-form-group">
                <label className="admin-form-label">Заголовок секции</label>
                <input type="text" value={section.title} onChange={(e) => setSectionTitle(activeTab, si, e.target.value)} className="admin-form-input" placeholder="Наши услуги включают:" />
              </div>

              {/* Section items */}
              <div className="admin-form-group">
                <label className="admin-form-label">Пункты секции</label>
                {section.items.map((item, ii) => (
                  <div key={ii} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input type="text" value={item} onChange={(e) => setSectionItem(activeTab, si, ii, e.target.value)} className="admin-form-input" placeholder="Пункт услуги" />
                    <button type="button" onClick={() => removeSectionItem(activeTab, si, ii)} className="admin-btn admin-btn-danger admin-btn-sm" disabled={section.items.length <= 1}>×</button>
                  </div>
                ))}
                <button type="button" onClick={() => addSectionItem(activeTab, si)} className="admin-btn admin-btn-secondary admin-btn-sm">+ Добавить пункт</button>
              </div>

              {/* Section paragraphs */}
              <div className="admin-form-group" style={{ marginTop: '12px', borderTop: '1px solid var(--admin-border)', paddingTop: '12px' }}>
                <label className="admin-form-label">Параграфы с заголовками</label>
                {section.paragraphs.map((para, pi) => (
                  <div key={pi} style={{ border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '12px', marginBottom: '10px', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)' }}>Параграф {pi + 1}</span>
                      <button type="button" onClick={() => removeSectionParagraph(activeTab, si, pi)} className="admin-btn admin-btn-danger admin-btn-sm">×</button>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Заголовок параграфа</label>
                      <input type="text" value={para.title} onChange={(e) => setSectionParagraph(activeTab, si, pi, 'title', e.target.value)} className="admin-form-input" placeholder="Заголовок параграфа" />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Текст параграфа</label>
                      <textarea value={para.content} onChange={(e) => setSectionParagraph(activeTab, si, pi, 'content', e.target.value)} className="admin-form-textarea" placeholder="Текст параграфа..." rows={3} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addSectionParagraph(activeTab, si)} className="admin-btn admin-btn-secondary admin-btn-sm">+ Добавить параграф</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addSection(activeTab)} className="admin-btn admin-btn-secondary">+ Добавить секцию</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button type="button" onClick={() => router.push('/admin/services')} className="admin-btn admin-btn-secondary">Отмена</button>
        <button type="submit" disabled={loading} className="admin-btn admin-btn-primary">{loading ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Создать'}</button>
      </div>
    </form>
  );
}
