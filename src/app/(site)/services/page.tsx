import Link from 'next/link';
import { Section } from '@/components/ui';
import { getServices, getLang } from '@/lib/data';
import { L, tl } from '@/lib/labels';
import '@/styles/services-page.css';

export default async function ServicesPage() {
  const [services, lang] = await Promise.all([getServices(), getLang()]);

  const data = services.length > 0 ? services : [
    { id: 'criminal', slug: 'criminal', icon: '⚖️', title: 'Уголовное Право', items: ['Защита обвиняемого', 'Представление интересов потерпевшего', 'Представление интересов свидетеля', 'Условно-досрочное освобождение осужденного', 'Дела об экстрадиции'] },
    { id: 'civil', slug: 'civil', icon: '🛡️', title: 'Гражданское Право', items: ['Споры о собственности', 'Споры по сделкам и договорам', 'Споры о возмещении ущерба', 'Страховые споры', 'Защита авторских прав', 'Наследственные дела'] },
    { id: 'administrative', slug: 'administrative', icon: '🏛️', title: 'Административное Право', items: ['Оспаривание решений государственных органов', 'Правовая поддержка по вопросам лицензирования и разрешений'] },
    { id: 'corporate', slug: 'corporate', icon: '💼', title: 'Корпоративные Услуги', items: ['Регистрация компаний', 'Составление договоров', 'Ведение бухгалтерского учета', 'Проведение переговоров', 'Поддержка в лицензировании'] },
    { id: 'accounting', slug: 'accounting', icon: '🧮', title: 'Бухгалтерский Учет И Финансы', items: ['Консультации, анализ', 'Бухгалтерский учет', 'Официальные запросы', 'Проведение переговоров'] },
    { id: 'immigration', slug: 'immigration', icon: '🌐', title: 'Защита Иностранцев', items: ['Миграция в Армению', 'Статус беженца', 'Представительство потерпевшего', 'Дела об экстрадиции', 'Судебная защита'] },
  ];

  return (
    <>
      <section className="services-hero">
        <div className="services-hero-overlay"></div>
        <div className="container services-hero-content">
          <h1 className="services-hero-title">{tl(L.services, lang)}</h1>
        </div>
      </section>

      <Section background="white">
        <div className="services-page-header">
          <span className="services-page-label">{tl(L.services_page_label, lang)}</span>
          <h2 className="services-page-title">{tl(L.services_page_title, lang)}</h2>
        </div>

        <div className="services-page-grid">
          {data.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`} className="services-page-card">
              <div className="services-page-card-icon">
                <span style={{ fontSize: '32px' }}>{service.icon}</span>
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
