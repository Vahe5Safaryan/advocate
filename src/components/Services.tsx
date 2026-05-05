import Link from 'next/link';
import { Button, SectionHeader, Section } from '@/components/ui';
import { getLang } from '@/lib/data';
import { L, tl } from '@/lib/labels';
import '@/styles/services-page.css';

interface ServiceItem {
  id: string;
  slug: string;
  icon: string;
  title: string;
  items: string[];
}

const FALLBACK: ServiceItem[] = [
  { id: '1', slug: 'criminal', icon: '⚖️', title: 'Уголовное право', items: ['Защита обвиняемых', 'Представление интересов истца', 'Представление интересов свидетеля'] },
  { id: '2', slug: 'civil', icon: '🛡️', title: 'Гражданское право', items: ['Имущественные споры', 'Споры по сделкам и договорам', 'Дела о возмещении ущерба'] },
  { id: '3', slug: 'administrative', icon: '🏛️', title: 'Административное право', items: ['Обжалование решений госорганов', 'Поддержка по вопросам лицензирования'] },
  { id: '4', slug: 'corporate', icon: '💼', title: 'Корпоративное обслуживание', items: ['Регистрация компаний', 'Составление договоров', 'Ведение бухгалтерии'] },
  { id: '5', slug: 'accounting', icon: '🧮', title: 'Бухгалтерия и финансы', items: ['Консультации, анализ', 'Бухгалтерский учет', 'Официальные запросы'] },
  { id: '6', slug: 'immigration', icon: '🌐', title: 'Защита иностранцев', items: ['Миграция в Армению', 'Статус беженца', 'Судебная защита'] },
];

export default async function Services({ services = [] }: { services?: ServiceItem[] }) {
  const lang = await getLang();
  const data = (services.length > 0 ? services : FALLBACK).slice(0, 6);

  return (
    <Section background="gray">
      <SectionHeader
        subtitle={tl(L.services_subtitle, lang)}
        title={tl(L.services_title, lang)}
      />

      <div className="services-page-grid">
        {data.map((service) => (
          <Link href={`/services/${service.slug}`} key={service.id} className="services-page-card">
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

      <div className="services-footer">
        <Button href="/services" variant="outline">
          {tl(L.services_btn, lang)}
        </Button>
      </div>
    </Section>
  );
}
