'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

const languages = [
  { code: 'ru', name: 'Ру', flag: '🇷🇺' },
  { code: 'en', name: 'Eng', flag: '🇺🇸' },
  { code: 'hy', name: 'Հայ', flag: '🇦🇲' },
];

interface MenuItem {
  id: string;
  href: string;
  order: number;
  isActive: boolean;
  parentId: string | null;
  translations: { language: string; title: string }[];
  children: MenuItem[];
}

const emptyForm: { href: string; order: number; isActive: boolean; titles: Record<string, string> } = {
  href: '', order: 0, isActive: true, titles: { ru: '', en: '', hy: '' },
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState('ru');
  const [form, setForm] = useState(emptyForm);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/menu');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setActiveLang('ru');
    setShowForm(true);
  };

  const openEdit = (item: MenuItem) => {
    const titles: Record<string, string> = { ru: '', en: '', hy: '' };
    item.translations.forEach((t) => { titles[t.language] = t.title; });
    setForm({ href: item.href, order: item.order, isActive: item.isActive, titles });
    setEditingId(item.id);
    setActiveLang('ru');
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        href: form.href,
        order: form.order,
        isActive: form.isActive,
        translations: languages.map((l) => ({ language: l.code, title: form.titles[l.code] || '' })),
      };
      const url = editingId ? `/api/admin/menu/${editingId}` : '/api/admin/menu';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); fetchItems(); }
      else { const d = await res.json(); alert(d.error || 'Ошибка'); }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот пункт меню?')) return;
    await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  // Returns flat list of <tr> elements — no <div> wrapper inside <tbody>
  const renderRows = (list: MenuItem[], depth = 0): React.ReactNode[] => {
    return list.flatMap((item) => [
      <tr key={item.id}>
        <td style={{ paddingLeft: `${16 + depth * 24}px` }}>
          {depth > 0 && <span style={{ color: 'var(--admin-text-secondary)', marginRight: '8px' }}>└</span>}
          {item.translations.find((t) => t.language === 'ru')?.title || '—'}
        </td>
        <td><code style={{ fontSize: '12px' }}>{item.href}</code></td>
        <td>{item.order}</td>
        <td>
          <span className={`admin-badge ${item.isActive ? 'admin-badge-success' : 'admin-badge-danger'}`}>
            {item.isActive ? 'Активен' : 'Скрыт'}
          </span>
        </td>
        <td>
          <div className="admin-actions">
            <button onClick={() => openEdit(item)} className="admin-btn admin-btn-secondary admin-btn-sm">Редактировать</button>
            <button onClick={() => handleDelete(item.id)} className="admin-btn admin-btn-danger admin-btn-sm">Удалить</button>
          </div>
        </td>
      </tr>,
      ...renderRows(item.children ?? [], depth + 1),
    ]);
  };

  // Modal rendered via portal → always covers full screen regardless of layout CSS
  const modal = mounted && showForm ? createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
    >
      <div style={{
        backgroundColor: '#fff', borderRadius: '12px', padding: '28px',
        width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontWeight: 600, fontSize: '18px', color: '#1a1a1a' }}>
            {editingId ? 'Редактировать пункт' : 'Новый пункт меню'}
          </h3>
          <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: '#666', lineHeight: 1 }}>✕</button>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Ссылка (href)</label>
          <input
            type="text"
            value={form.href}
            onChange={(e) => setForm((p) => ({ ...p, href: e.target.value }))}
            className="admin-form-input"
            placeholder="/services"
          />
        </div>

        <div className="admin-grid admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Порядок</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((p) => ({ ...p, order: +e.target.value }))}
              className="admin-form-input"
            />
          </div>
          <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '28px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#1a1a1a' }}>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              />
              Активен
            </label>
          </div>
        </div>

        <div className="admin-lang-tabs">
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
          <label className="admin-form-label">Название пункта</label>
          <input
            type="text"
            value={form.titles[activeLang] || ''}
            onChange={(e) => setForm((p) => ({ ...p, titles: { ...p.titles, [activeLang]: e.target.value } }))}
            className="admin-form-input"
            placeholder="Услуги"
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={() => setShowForm(false)} className="admin-btn admin-btn-secondary">Отмена</button>
          <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <SessionProvider>
      <AdminLayout title="Управление меню">
        <div style={{ marginBottom: '16px' }}>
          <Link href="/admin/settings" className="admin-btn admin-btn-secondary" style={{ marginRight: '12px' }}>
            ← Настройки
          </Link>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Пункты меню</h2>
            <button onClick={openNew} className="admin-btn admin-btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Добавить пункт
            </button>
          </div>

          {loading ? (
            <div className="admin-loading"><div className="admin-spinner"></div></div>
          ) : items.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">🗂️</div>
              <p>Пунктов меню пока нет</p>
              <button onClick={openNew} className="admin-btn admin-btn-primary" style={{ marginTop: '16px' }}>Добавить первый</button>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Ссылка</th>
                  <th>Порядок</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {renderRows(items)}
              </tbody>
            </table>
          )}
        </div>
      </AdminLayout>

      {modal}
    </SessionProvider>
  );
}
