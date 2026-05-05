'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import SessionProvider from '@/components/admin/SessionProvider';

const languages = [
  { code: 'ru', name: 'Ру', flag: '🇷🇺' },
  { code: 'en', name: 'Eng', flag: '🇺🇸' },
  { code: 'hy', name: 'Հայ', flag: '🇦🇲' },
];

export default function NewContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ru');
  const [type, setType] = useState('phone');
  const [value, setValue] = useState('');
  const [icon, setIcon] = useState('');
  const [link, setLink] = useState('');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [labels, setLabels] = useState<Record<string, string>>({ ru: '', en: '', hy: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type, value, icon, link: link || null, order, isActive,
          translations: languages.map((l) => ({ language: l.code, label: labels[l.code] || '' })),
        }),
      });
      if (res.ok) { router.push('/admin/contact'); router.refresh(); }
      else { const d = await res.json(); alert(d.error || 'Ошибка'); }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SessionProvider>
      <AdminLayout title="Новый контакт">
        <form onSubmit={handleSubmit}>
          <div className="admin-card">
            <div className="admin-card-header"><h2 className="admin-card-title">Настройки</h2></div>
            <div className="admin-grid admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Тип</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="admin-form-input">
                  <option value="phone">📞 Телефон</option>
                  <option value="email">📧 Email</option>
                  <option value="address">📍 Адрес</option>
                  <option value="social">🔗 Соцсеть</option>
                  <option value="phone2">📞 Второй телефон</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Иконка (emoji)</label>
                <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} className="admin-form-input" placeholder="📞" />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Значение</label>
              <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="admin-form-input" placeholder="+7 (495) 123-45-67" required />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Ссылка (URL, необязательно)</label>
              <input type="text" value={link} onChange={(e) => setLink(e.target.value)} className="admin-form-input" placeholder="tel:+74951234567" />
            </div>
            <div className="admin-grid admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Порядок</label>
                <input type="number" value={order} onChange={(e) => setOrder(+e.target.value)} className="admin-form-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ marginRight: '8px' }} />
                  Активен
                </label>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header"><h2 className="admin-card-title">Подпись (переводы)</h2></div>
            <div className="admin-lang-tabs">
              {languages.map((l) => (
                <button key={l.code} type="button" className={`admin-lang-tab ${activeTab === l.code ? 'active' : ''}`} onClick={() => setActiveTab(l.code)}>
                  {l.flag} {l.name}
                </button>
              ))}
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Подпись</label>
              <input
                type="text"
                value={labels[activeTab] || ''}
                onChange={(e) => setLabels((prev) => ({ ...prev, [activeTab]: e.target.value }))}
                className="admin-form-input"
                placeholder="Телефон"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push('/admin/contact')} className="admin-btn admin-btn-secondary">Отмена</button>
            <button type="submit" disabled={loading} className="admin-btn admin-btn-primary">{loading ? 'Сохранение...' : 'Создать'}</button>
          </div>
        </form>
      </AdminLayout>
    </SessionProvider>
  );
}
