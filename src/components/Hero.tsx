'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import '@/styles/hero.css';

interface Slide {
  id: string;
  imageUrl: string;
  subtitle: string;
  title: string;
  description: string;
  buttonText?: string;
}

export default function Hero({ slides = [] }: { slides?: Slide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const data = slides.filter((s) => !!s.imageUrl);

  useEffect(() => {
    if (data.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [data.length]);

  if (data.length === 0) return null;

  return (
    <section className="hero">
      {data.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === currentSlide ? 'active' : 'inactive'}`}
        >
          <div className="hero-bg-image">
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              priority={index === 0}
              className="hero-bg-img"
              unoptimized
            />
            <div className="hero-overlay"></div>
          </div>

          <div className="hero-slide-inner">
            <div className="container">
              <div className="hero-content">
                <p className="hero-subtitle">{slide.subtitle}</p>
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-description">{slide.description}</p>
                <div className="hero-buttons">
                  <a href="tel:+37496374374" className="hero-call-btn">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.493 1.498a1 1 0 01.684.949V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {slide.buttonText ?? ''}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setCurrentSlide((prev) => (prev - 1 + data.length) % data.length)}
        className="hero-arrow prev"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % data.length)}
        className="hero-arrow next"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}
