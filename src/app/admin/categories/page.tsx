'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

interface Category {
  id: string;
  slug: string;
  type: string;
  order: number;
  isActive: boolean;
  translations: { language: string; name: string }[];
}

const languages = [
  { code: 'ru', name: 'Ру', flag: '🇷🇺' },
  { code: 'en', name: 'Eng', flag: '🇺🇸' },
  { code: 'hy', name: 'Հայ', flag: '🇦🇲' },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    type: 'blog',
    order: 0,
    translations: languages.map((l) => ({ language: l.code, name: '' })),
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchCategories();
        resetForm();
      } else {
        const data = await res.json();
        alert(data.error || 'Ошибка сохранения');
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({
      slug: cat.slug,
      type: cat.type,
      order: cat.order,
      translations: languages.map((l) => ({
        language: l.code,
        name: cat.translations.find((t) => t.language === l.code)?.name || '',
      })),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить категорию?')) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      slug: '',
      type: 'blog',
      order: 0,
      translations: languages.map((l) => ({ language: l.code, name: '' })),
    });
  };

  const updateTranslation = (langCode: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((t) =>
        t.language === langCode ? { ...t, name } : t
      ),
    }));
  };

  return (
    <SessionProvider>
      <AdminLayout title="Категории">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Категории</h2>
            <button onClick={() => setShowForm(true)} className="admin-btn admin-btn-primary">
              + Добавить
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginBottom: '24px', padding: '16px', border: '1px solid var(--admin-border)', borderRadius: '8px' }}>
              <div className="admin-grid admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-form-label">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    className="admin-form-input"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Тип</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="admin-form-input">
                    <option value="blog">Блог</option>
                    <option value="case">Дела</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Порядок</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="admin-form-input" />
                </div>
              </div>

              {languages.map((lang) => (
                <div key={lang.code} className="admin-form-group">
                  <label className="admin-form-label">{lang.flag} Название ({lang.name})</label>
                  <input
                    type="text"
                    value={formData.translations.find((t) => t.language === lang.code)?.name || ''}
                    onChange={(e) => updateTranslation(lang.code, e.target.value)}
                    className="admin-form-input"
                    required={lang.code === 'ru'}
                  />
                </div>
              ))}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingId ? 'Сохранить' : 'Создать'}
                </button>
                <button type="button" onClick={resetForm} className="admin-btn admin-btn-secondary">
                  Отмена
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="admin-loading"><div className="admin-spinner"></div></div>
          ) : categories.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">🏷️</div>
              <p>Категорий пока нет</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Название (RU)</th>
                  <th>Slug</th>
                  <th>Тип</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.translations.find((t) => t.language === 'ru')?.name || '-'}</td>
                    <td><code>{cat.slug}</code></td>
                    <td>{cat.type === 'blog' ? 'Блог' : 'Дела'}</td>
                    <td>
                      <div className="admin-actions">
                        <button onClick={() => handleEdit(cat)} className="admin-btn admin-btn-secondary admin-btn-sm">Редактировать</button>
                        <button onClick={() => handleDelete(cat.id)} className="admin-btn admin-btn-danger admin-btn-sm">Удалить</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AdminLayout>
    </SessionProvider>
  );
}
