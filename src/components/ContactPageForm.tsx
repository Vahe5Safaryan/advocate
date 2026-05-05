'use client';

import { useState } from 'react';
import type { ReactElement } from 'react';
import { L, tl } from '@/lib/labels';

interface ContactItem {
  id: string;
  type: string;
  value: string;
  icon: string;
  link: string;
  label: string;
}

const TYPE_ICONS: Record<string, ReactElement> = {
  address: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  email: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  phone: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  phone2: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
};

export default function ContactPageForm({ contactInfo, lang = 'ru' }: { contactInfo: ContactItem[]; lang?: string }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setError(data.error || tl(L.form_error_default, lang));
      }
    } catch {
      setError(tl(L.form_error_network, lang));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page-layout">
      <div className="contact-page-info">
        <span className="contact-page-label">{tl(L.contact_page_label, lang)}</span>
        <h2 className="contact-page-title">{tl(L.contact_title, lang)}</h2>

        <div className="contact-page-items">
          {contactInfo.map((item) => (
            <div key={item.id} className="contact-page-item">
              <div className="contact-page-item-icon">
                {TYPE_ICONS[item.type] ?? <span style={{ fontSize: '20px' }}>{item.icon || '📍'}</span>}
              </div>
              <div className="contact-page-item-content">
                <h4 className="contact-page-item-title">{item.label}</h4>
                {(item.type === 'phone' || item.type === 'phone2') ? (
                  <a href={`tel:${item.value.replace(/\s/g, '')}`} className="contact-page-item-value">{item.value}</a>
                ) : item.link ? (
                  <a href={item.link} className="contact-page-item-value">{item.value}</a>
                ) : (
                  <p className="contact-page-item-value">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="contact-page-form-wrapper">
        {success ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '8px' }}>{tl(L.form_success_title, lang)}</h3>
            <p style={{ color: '#666', marginBottom: '24px' }}>{tl(L.form_success_desc, lang)}</p>
            <button onClick={() => setSuccess(false)} className="contact-page-submit" style={{ width: 'auto', padding: '12px 32px' }}>
              {tl(L.form_send_another, lang)}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-page-form">
            <div className="contact-page-form-row">
              <div className="contact-page-form-group">
                <label htmlFor="name">{tl(L.form_name, lang)}</label>
                <input type="text" id="name" name="name" placeholder={tl(L.form_name_ph, lang)} value={formData.name} onChange={handleChange} required />
              </div>
              <div className="contact-page-form-group">
                <label htmlFor="email">{tl(L.form_email_label, lang)}</label>
                <input type="email" id="email" name="email" placeholder={tl(L.form_email_your, lang)} value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="contact-page-form-group">
              <label htmlFor="phone">{tl(L.form_phone, lang)}</label>
              <input type="tel" id="phone" name="phone" placeholder={tl(L.form_phone_ph, lang)} value={formData.phone} onChange={handleChange} />
            </div>
            <div className="contact-page-form-group">
              <label htmlFor="message">{tl(L.form_message, lang)}</label>
              <textarea id="message" name="message" placeholder={tl(L.form_message_ph, lang)} rows={5} value={formData.message} onChange={handleChange} required></textarea>
            </div>
            {error && (
              <div style={{ color: '#dc2626', fontSize: '14px', marginBottom: '12px', padding: '10px 14px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={sending} className="contact-page-submit">
              {sending ? tl(L.form_sending, lang) : tl(L.form_submit, lang)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
