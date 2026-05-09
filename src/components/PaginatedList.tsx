'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ListItem {
  id: string;
  slug: string;
  category: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
}

function formatDate(iso: string) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}-${mm}-${d.getFullYear()}`;
  } catch {
    return iso;
  }
}

export default function PaginatedList({
  items,
  basePath,
  perPage = 12,
  readMoreText,
  enableDetailLinks = true,
}: {
  items: ListItem[];
  basePath: string;
  perPage?: number;
  readMoreText: string;
  enableDetailLinks?: boolean;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / perPage);
  const visible = items.slice((page - 1) * perPage, page * perPage);

  const goTo = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="blog-page-grid">
        {visible.map((item) => {
          const inner = (
            <>
              <div className="blog-page-card-image">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span className="blog-page-card-icon">📰</span>
                )}
                <span className="blog-page-card-category">{item.category}</span>
              </div>
              <div className="blog-page-card-content">
                <span className="blog-page-card-date">{formatDate(item.publishedAt)}</span>
                <h3 className="blog-page-card-title">{item.title}</h3>
                <p className="blog-page-card-excerpt">{item.excerpt}</p>
                <span className="blog-page-card-read-more">
                  {readMoreText}
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </>
          );
          return enableDetailLinks ? (
            <Link href={`${basePath}/${item.slug}`} key={item.id} className="blog-page-card">
              {inner}
            </Link>
          ) : (
            <div key={item.id} className="blog-page-card">
              {inner}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="blog-pagination">
          <button type="button" className="blog-pagination-btn" onClick={() => goTo(page - 1)} disabled={page === 1}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} type="button" className={`blog-pagination-btn ${page === p ? 'active' : ''}`} onClick={() => goTo(p)}>
              {p}
            </button>
          ))}
          <button type="button" className="blog-pagination-btn" onClick={() => goTo(page + 1)} disabled={page === totalPages}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
