'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import '@/styles/hero.css';

const slides = [
  {
    id: 1,
    subtitle: 'Ваш путь к справедливости начинается здесь',
    title: 'Добро пожаловать в LSA Law Firm',
    description: 'Предоставляем исключительные юридические услуги с приверженностью профессионализму и совершенству.',
    image: '/images/hero/hero1.jpg',
  },
  {
    id: 2,
    subtitle: 'Ваш путь к справедливости начинается здесь',
    title: 'Надёжный партнёр на пути к правосудию',
    description: 'Мы на вашей стороне, защищаем ваши права и добиваемся справедливости.',
    image: '/images/hero/hero2.jpg',
  },
  {
    id: 3,
    subtitle: 'Ваш путь к справедливости начинается здесь',
    title: 'Юридическая поддержка для каждого клиента',
    description: 'Наша команда разрабатывает индивидуальные решения для ваших уникальных правовых вопросов.',
    image: '/images/hero/hero1.jpg',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === currentSlide ? 'active' : 'inactive'}`}
        >
          {/* Background Image */}
          <div className="hero-bg-image">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="hero-bg-img"
            />
            <div className="hero-overlay"></div>
          </div>

          {/* Content */}
          <div className="hero-slide-inner">
            <div className="container">
              <div className="hero-content">
                <p className="hero-subtitle">{slide.subtitle}</p>
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-description">{slide.description}</p>
                <div className="hero-buttons">
                  <a href="tel:+37496374374" className="hero-call-btn">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.493 1.498a1 1 0 01.684.949V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    Позвонить
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrow */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="hero-arrow next"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}
