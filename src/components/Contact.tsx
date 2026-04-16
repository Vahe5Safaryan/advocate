'use client';

import { useState } from 'react';
import { Button, Input, Textarea, Select, SectionHeader, Section } from '@/components/ui';
import '@/styles/contact.css';

const subjectOptions = [
  { value: 'criminal', label: 'Уголовное право' },
  { value: 'civil', label: 'Гражданское право' },
  { value: 'corporate', label: 'Корпоративное право' },
  { value: 'other', label: 'Другое' },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    alert('Сообщение отправлено!');
  };

  return (
    <Section background="white">
      <div className="contact-grid">
          {/* Contact Info */}
          <div>
            <SectionHeader
              subtitle="Контакты"
              title="Свяжитесь с нами"
              description="Есть вопросы или готовы начать сотрудничество? Свяжитесь с нами, и мы ответим вам в кратчайшие сроки."
              centered={false}
            />

            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="contact-info-label">Адрес</h4>
                  <p className="contact-info-value">Ереван, Армения</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="contact-info-label">Телефон</h4>
                  <p className="contact-info-value">+374 (96) 374 374</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="contact-info-label">Эл. почта</h4>
                  <p className="contact-info-value">info@lsa.am</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="contact-info-label">Часы работы</h4>
                  <p className="contact-info-value">Понедельник - Пятница: 09:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <h3 className="contact-form-title">Отправить сообщение</h3>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-row">
                <Input
                  type="text"
                  placeholder="Имя Фамилия"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  required
                />
                <Input
                  type="email"
                  placeholder="Эл. почта"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  required
                />
              </div>
              <div className="contact-form-row">
                <Input
                  type="tel"
                  placeholder="Телефон"
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                />
                <Select
                  value={formData.subject}
                  onChange={(value) => setFormData({ ...formData, subject: value })}
                  options={subjectOptions}
                  placeholder="Выберите тему"
                />
              </div>
              <Textarea
                placeholder="Ваше сообщение"
                value={formData.message}
                onChange={(value) => setFormData({ ...formData, message: value })}
                rows={5}
                required
              />
              <Button type="submit" variant="gold" className="contact-submit">
                Отправить
              </Button>
            </form>
          </div>
        </div>
    </Section>
  );
}
