'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Section } from '@/components/ui';
import '@/styles/blog-page.css';

const allCases = [
  {
    id: 1,
    title: 'Успешная защита в деле о мошенничестве',
    excerpt: 'Клиент был оправдан по обвинению в мошенничестве благодаря тщательному анализу доказательств.',
    date: '15 марта 2024',
    category: 'Уголовное право',
    href: '/cases/fraud-defense',
  },
  {
    id: 2,
    title: 'Взыскание задолженности в размере 50 млн драмов',
    excerpt: 'Представление интересов кредитора в споре о взыскании крупной суммы задолженности.',
    date: '10 марта 2024',
    category: 'Гражданское право',
    href: '/cases/debt-collection',
  },
  {
    id: 3,
    title: 'Регистрация международной компании',
    excerpt: 'Успешная регистрация филиала международной корпорации в Армении.',
    date: '5 марта 2024',
    category: 'Корпоративное право',
    href: '/cases/international-company',
  },
  {
    id: 4,
    title: 'Раздел имущества при разводе',
    excerpt: 'Справедливый раздел совместно нажитого имущества на сумму более 100 млн драмов.',
    date: '1 марта 2024',
    category: 'Семейное право',
    href: '/cases/divorce-settlement',
  },
  {
    id: 5,
    title: 'Защита авторских прав на программное обеспечение',
    excerpt: 'Защита интеллектуальной собственности IT-компании от незаконного копирования.',
    date: '25 февраля 2024',
    category: 'Интеллектуальное право',
    href: '/cases/software-copyright',
  },
  {
    id: 6,
    title: 'Оспаривание решения налогового органа',
    excerpt: 'Отмена незаконного решения о доначислении налогов на сумму 20 млн драмов.',
    date: '20 февраля 2024',
    category: 'Налоговое право',
    href: '/cases/tax-dispute',
  },
  {
    id: 7,
    title: 'Получение статуса беженца',
    excerpt: 'Успешное получение статуса беженца для семьи из зоны конфликта.',
    date: '15 февраля 2024',
    category: 'Миграционное право',
    href: '/cases/refugee-status',
  },
  {
    id: 8,
    title: 'Защита в деле о ДТП',
    excerpt: 'Снижение обвинения и минимальное наказание для клиента в деле о ДТП.',
    date: '10 февраля 2024',
    category: 'Уголовное право',
    href: '/cases/traffic-accident',
  },
  {
    id: 9,
    title: 'Сделка по покупке коммерческой недвижимости',
    excerpt: 'Юридическое сопровождение покупки офисного здания в центре Еревана.',
    date: '5 февраля 2024',
    category: 'Недвижимость',
    href: '/cases/commercial-property',
  },
  {
    id: 10,
    title: 'Трудовой спор о незаконном увольнении',
    excerpt: 'Восстановление работника на работе и взыскание компенсации за вынужденный прогул.',
    date: '1 февраля 2024',
    category: 'Трудовое право',
    href: '/cases/wrongful-termination',
  },
  {
    id: 11,
    title: 'Наследственный спор',
    excerpt: 'Защита прав наследника в сложном деле о разделе наследственного имущества.',
    date: '25 января 2024',
    category: 'Гражданское право',
    href: '/cases/inheritance-dispute',
  },
  {
    id: 12,
    title: 'Лицензирование фармацевтической деятельности',
    excerpt: 'Получение лицензии на фармацевтическую деятельность для аптечной сети.',
    date: '20 января 2024',
    category: 'Административное право',
    href: '/cases/pharma-license',
  },
  {
    id: 13,
    title: 'Защита в арбитражном разбирательстве',
    excerpt: 'Представление интересов компании в международном арбитраже ICC.',
    date: '15 января 2024',
    category: 'Арбитраж',
    href: '/cases/arbitration-case',
  },
  {
    id: 14,
    title: 'Банкротство предприятия',
    excerpt: 'Сопровождение процедуры банкротства с максимальным удовлетворением требований кредиторов.',
    date: '10 января 2024',
    category: 'Банкротство',
    href: '/cases/bankruptcy',
  },
  {
    id: 15,
    title: 'Защита прав потребителя',
    excerpt: 'Взыскание компенсации за некачественный товар и моральный ущерб.',
    date: '5 января 2024',
    category: 'Защита потребителей',
    href: '/cases/consumer-protection',
  },
];

const CASES_PER_PAGE = 12;

export default function CasesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allCases.length / CASES_PER_PAGE);
  const startIndex = (currentPage - 1) * CASES_PER_PAGE;
  const currentCases = allCases.slice(startIndex, startIndex + CASES_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="blog-hero-overlay"></div>
        <div className="container blog-hero-content">
          <h1 className="blog-hero-title">Дела</h1>
          <div className="blog-breadcrumb">
            <Link href="/">Главная</Link>
            <span className="blog-breadcrumb-separator">/</span>
            <span>Дела</span>
          </div>
        </div>
      </section>

      {/* Cases Grid Section */}
      <Section background="gray">
        <div className="blog-page-header">
          <span className="blog-page-label">Наш опыт</span>
          <h2 className="blog-page-title">Завершенные дела</h2>
          <p className="blog-page-description">
            Примеры успешно завершенных дел нашей юридической компании
          </p>
        </div>

        <div className="blog-page-grid">
          {currentCases.map((caseItem) => (
            <Link href={caseItem.href} key={caseItem.id} className="blog-page-card">
              <div className="blog-page-card-image case-card-image">
                <span className="blog-page-card-category">{caseItem.category}</span>
              </div>
              <div className="blog-page-card-content">
                <span className="blog-page-card-date">{caseItem.date}</span>
                <h3 className="blog-page-card-title">{caseItem.title}</h3>
                <p className="blog-page-card-excerpt">{caseItem.excerpt}</p>
                <span className="blog-page-card-read-more">
                  Подробнее
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="blog-pagination">
            <button
              className="blog-pagination-btn"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`blog-pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="blog-pagination-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </Section>
    </>
  );
}
