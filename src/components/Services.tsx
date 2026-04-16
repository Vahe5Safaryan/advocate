'use client';

import Link from 'next/link';
import { Button, SectionHeader, Section } from '@/components/ui';
import '@/styles/services-page.css';

const services = [
  {
    id: 1,
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Уголовное право',
    items: ['Защита обвиняемых', 'Представление интересов истца', 'Представление интересов свидетеля'],
    href: '/services/criminal',
  },
  {
    id: 2,
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    title: 'Гражданское право',
    items: ['Имущественные споры', 'Споры по сделкам и договорам', 'Дела о возмещении ущерба'],
    href: '/services/civil',
  },
  {
    id: 3,
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Административное право',
    items: ['Обжалование решений госорганов', 'Поддержка по вопросам лицензирования'],
    href: '/services/administrative',
  },
  {
    id: 4,
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Корпоративное обслуживание',
    items: ['Регистрация компаний', 'Составление договоров', 'Ведение бухгалтерии'],
    href: '/services/corporate',
  },
  {
    id: 5,
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Бухгалтерия и финансы',
    items: ['Консультации, анализ', 'Бухгалтерский учет', 'Официальные запросы'],
    href: '/services/accounting',
  },
  {
    id: 6,
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Защита иностранцев',
    items: ['Миграция в Армению', 'Статус беженца', 'Судебная защита'],
    href: '/services/immigration',
  },
];

export default function Services() {
  return (
    <Section background="gray">
      <SectionHeader
        subtitle="Услуги"
        title="Сферы деятельности"
        description="Юридическая компания «LSA» предоставляет комплексные юридические услуги."
      />

      {/* Services Grid */}
      <div className="services-page-grid">
        {services.map((service) => (
          <Link href={service.href} key={service.id} className="services-page-card">
            <div className="services-page-card-icon">
              {service.icon}
            </div>
            <div className="services-page-card-content">
              <h3 className="services-page-card-title">{service.title}</h3>
              <ul className="services-page-card-list">
                {service.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      <div className="services-footer">
        <Button href="/services" variant="outline">
          Смотреть все
        </Button>
      </div>
    </Section>
  );
}
