'use client';

import Link from 'next/link';
import { SectionHeader, Section } from '@/components/ui';
import '@/styles/about.css';

const features = [
  {
    icon: '📚',
    title: 'Множество успешных дел',
    description: 'Наша команда успешно завершила множество дел в различных сферах права',
  },
  {
    icon: '⚖️',
    title: 'Профессиональные юристы',
    description: 'Опытные адвокаты предоставляют индивидуальные юридические консультации',
  },
  {
    icon: '💼',
    title: 'Более 10 лет опыта',
    description: 'Наш стратегический подход основан на десятилетнем опыте работы',
  },
];

export default function About() {
  return (
    <Section background="white">
      <div className="about-wrapper">
        {/* Left Content */}
        <div className="about-content">
          <SectionHeader
            subtitle="О нас"
            title="Высококачественные юридические и бухгалтерские услуги в Армении"
            description="Адвокатская контора «LSA» уже более 10 лет оказывает высококачественные юридические и бухгалтерские услуги в Ереване и регионах Армении."
            centered={false}
            className="light"
          />

          {/* Features */}
          <div className="about-features">
            {features.map((feature, index) => (
              <div key={index} className="about-feature">
                <div className="about-feature-icon">{feature.icon}</div>
                <div>
                  <h5 className="about-feature-title">{feature.title}</h5>
                  <p className="about-feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image/Video */}
        <div className="about-image">
          {/* Stats Box */}
          <div className="about-stats-box">
            <div className="about-stats-number">10+</div>
            <div className="about-stats-label">Лет опыта</div>
          </div>

          {/* Play Button */}
          <Link
            href="https://www.youtube.com/watch?v=ksvLw74GK2E"
            target="_blank"
            className="about-play-btn"
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </Link>
        </div>
      </div>
    </Section>
  );
}
