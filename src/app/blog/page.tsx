'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Section } from '@/components/ui';
import '@/styles/blog-page.css';

const allBlogPosts = [
  {
    id: 1,
    title: 'Изменения в налоговом законодательстве Армении в 2024 году',
    excerpt: 'Обзор ключевых изменений в налоговом кодексе, которые вступят в силу в новом году.',
    date: '15 марта 2024',
    category: 'Налоговое право',
    image: '📰',
    href: '/blog/tax-changes-2024',
  },
  {
    id: 2,
    title: 'Как защитить свои права при трудовых спорах',
    excerpt: 'Практические советы по защите трудовых прав и разрешению конфликтов с работодателем.',
    date: '10 марта 2024',
    category: 'Трудовое право',
    image: '⚖️',
    href: '/blog/labor-disputes',
  },
  {
    id: 3,
    title: 'Регистрация бизнеса в Армении: пошаговое руководство',
    excerpt: 'Полное руководство по регистрации компании для иностранных инвесторов.',
    date: '5 марта 2024',
    category: 'Корпоративное право',
    image: '🏢',
    href: '/blog/business-registration',
  },
  {
    id: 4,
    title: 'Наследственное право: что нужно знать',
    excerpt: 'Основные аспекты наследственного права в Армении и порядок оформления наследства.',
    date: '1 марта 2024',
    category: 'Гражданское право',
    image: '📜',
    href: '/blog/inheritance-law',
  },
  {
    id: 5,
    title: 'Защита интеллектуальной собственности',
    excerpt: 'Как защитить авторские права, товарные знаки и патенты в Армении.',
    date: '25 февраля 2024',
    category: 'Интеллектуальное право',
    image: '💡',
    href: '/blog/intellectual-property',
  },
  {
    id: 6,
    title: 'Семейное право: раздел имущества при разводе',
    excerpt: 'Правовые аспекты раздела совместно нажитого имущества супругов.',
    date: '20 февраля 2024',
    category: 'Семейное право',
    image: '👨‍👩‍👧',
    href: '/blog/divorce-property',
  },
  {
    id: 7,
    title: 'Уголовная ответственность за экономические преступления',
    excerpt: 'Обзор видов экономических преступлений и мер ответственности по законодательству РА.',
    date: '15 февраля 2024',
    category: 'Уголовное право',
    image: '🔒',
    href: '/blog/economic-crimes',
  },
  {
    id: 8,
    title: 'Арбитражное разбирательство в Армении',
    excerpt: 'Преимущества арбитража как альтернативного способа разрешения споров.',
    date: '10 февраля 2024',
    category: 'Арбитраж',
    image: '⚖️',
    href: '/blog/arbitration',
  },
  {
    id: 9,
    title: 'Права потребителей: как вернуть некачественный товар',
    excerpt: 'Пошаговая инструкция по защите прав потребителей при покупке некачественного товара.',
    date: '5 февраля 2024',
    category: 'Защита потребителей',
    image: '🛒',
    href: '/blog/consumer-rights',
  },
  {
    id: 10,
    title: 'Лицензирование деятельности в Армении',
    excerpt: 'Какие виды деятельности требуют лицензии и как её получить.',
    date: '1 февраля 2024',
    category: 'Корпоративное право',
    image: '📋',
    href: '/blog/licensing',
  },
  {
    id: 11,
    title: 'Земельное право: покупка и продажа земельных участков',
    excerpt: 'Правовые особенности сделок с земельными участками в Армении.',
    date: '25 января 2024',
    category: 'Недвижимость',
    image: '🏞️',
    href: '/blog/land-law',
  },
  {
    id: 12,
    title: 'Банкротство физических лиц',
    excerpt: 'Процедура признания физического лица банкротом и её последствия.',
    date: '20 января 2024',
    category: 'Банкротство',
    image: '📉',
    href: '/blog/personal-bankruptcy',
  },
  {
    id: 13,
    title: 'Миграционное законодательство: получение ВНЖ',
    excerpt: 'Порядок получения вида на жительство в Армении для иностранных граждан.',
    date: '15 января 2024',
    category: 'Миграционное право',
    image: '🌍',
    href: '/blog/residence-permit',
  },
  {
    id: 14,
    title: 'Договор аренды: на что обратить внимание',
    excerpt: 'Ключевые пункты договора аренды недвижимости и типичные ошибки.',
    date: '10 января 2024',
    category: 'Недвижимость',
    image: '🏠',
    href: '/blog/rental-agreement',
  },
  {
    id: 15,
    title: 'Защита персональных данных в Армении',
    excerpt: 'Требования законодательства о защите персональных данных для бизнеса.',
    date: '5 января 2024',
    category: 'IT право',
    image: '🔐',
    href: '/blog/data-protection',
  },
];

const POSTS_PER_PAGE = 12;

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allBlogPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = allBlogPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

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
          <h1 className="blog-hero-title">Блог</h1>
          <div className="blog-breadcrumb">
            <Link href="/">Главная</Link>
            <span className="blog-breadcrumb-separator">/</span>
            <span>Блог</span>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <Section background="gray">
        <div className="blog-page-header">
          <span className="blog-page-label">Наши статьи</span>
          <h2 className="blog-page-title">Последние новости</h2>
          <p className="blog-page-description">
            Актуальные новости и полезные статьи о законодательстве Армении
          </p>
        </div>

        <div className="blog-page-grid">
          {currentPosts.map((post) => (
            <Link href={post.href} key={post.id} className="blog-page-card">
              <div className="blog-page-card-image">
                <span className="blog-page-card-icon">{post.image}</span>
                <span className="blog-page-card-category">{post.category}</span>
              </div>
              <div className="blog-page-card-content">
                <span className="blog-page-card-date">{post.date}</span>
                <h3 className="blog-page-card-title">{post.title}</h3>
                <p className="blog-page-card-excerpt">{post.excerpt}</p>
                <span className="blog-page-card-read-more">
                  Читать далее
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
