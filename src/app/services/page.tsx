import Link from 'next/link';
import { Section } from '@/components/ui';
import '@/styles/services-page.css';

const services = [
  {
    id: 'criminal',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Уголовное Право',
    items: [
      'Защита обвиняемого',
      'Представление интересов потерпевшего',
      'Представление интересов свидетеля',
      'Условно-досрочное освобождение осужденного',
      'Дела об экстрадиции'
    ],
    href: '/services/criminal'
  },
  {
    id: 'civil',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    title: 'Гражданское Право',
    items: [
      'Споры о собственности',
      'Споры по сделкам и договорам',
      'Споры о возмещении ущерба',
      'Страховые споры',
      'Защита авторских прав',
      'Наследственные дела'
    ],
    href: '/services/civil'
  },
  {
    id: 'administrative',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Административное Право',
    items: [
      'Оспаривание решений государственных органов',
      'Правовая поддержка по вопросам лицензирования и разрешений',
      'Разрешение и представительство в налоговых и таможенных спорах',
      'Представительство в административных процедурах'
    ],
    href: '/services/administrative'
  },
  {
    id: 'corporate',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Корпоративные Услуги',
    items: [
      'Регистрация компаний',
      'Составление договоров',
      'Ведение бухгалтерского учета',
      'Проведение переговоров',
      'Поддержка в лицензировании'
    ],
    href: '/services/corporate'
  },
  {
    id: 'accounting',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Бухгалтерский Учет И Финансы',
    items: [
      'Консультации, анализ',
      'Бухгалтерский учет',
      'Официальные запросы',
      'Проведение переговоров'
    ],
    href: '/services/accounting'
  },
  {
    id: 'immigration',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Защита Иностранцев',
    items: [
      'Миграция в Армению',
      'Статус беженца',
      'Представительство потерпевшего',
      'Дела об экстрадиции',
      'Судебная защита'
    ],
    href: '/services/immigration'
  }
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="services-hero">
        <div className="services-hero-overlay"></div>
        <div className="container services-hero-content">
          <h1 className="services-hero-title">Услуги</h1>
          <div className="services-breadcrumb">
            <Link href="/">Главная</Link>
            <span className="services-breadcrumb-separator">/</span>
            <span>Услуги</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <Section background="white">
        <div className="services-page-header">
          <span className="services-page-label">УСЛУГИ</span>
          <h2 className="services-page-title">Что Мы Делаем</h2>
          <p className="services-page-description">
            В «Эл Эс Эй» мы занимаемся различными практиками и предоставляем нашим клиентам
            комплексные юридические услуги, охватывающие широкий спектр их потребностей. Наша
            команда готова рассмотреть любое дело, которое вам понадобится:
          </p>
        </div>

        <div className="services-page-grid">
          {services.map((service) => (
            <Link key={service.id} href={service.href} className="services-page-card">
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
      </Section>
    </>
  );
}
