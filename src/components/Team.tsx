'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeader, Section } from '@/components/ui';
import { t } from '@/messages';
import '@/styles/team.css';
import { TEAM_FALLBACK_MEMBERS } from '@/lib/team-fallback';

interface TeamMember {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
  position: string;
}

export default function Team({ members = [], lang = 'ru' }: { members?: TeamMember[]; lang?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const data = members.length > 0 ? members : TEAM_FALLBACK_MEMBERS;

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const count = w < 768 ? 1 : w < 1024 ? 2 : 3;
      setVisibleCount(count);
      setCurrentIndex(0);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = Math.max(1, data.length - visibleCount + 1);
  const translatePercent = 100 / visibleCount;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % maxIndex);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + maxIndex) % maxIndex);

  return (
    <Section background="gray">
      <SectionHeader
        subtitle={t(lang, 'team_subtitle')}
        title={t(lang, 'team_title')}
      />

      <div className="team-carousel">
        <button onClick={prevSlide} className="team-carousel-arrow prev">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button onClick={nextSlide} className="team-carousel-arrow next">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="team-cards-wrapper">
          <div
            className="team-cards"
            style={{ transform: `translateX(-${currentIndex * translatePercent}%)` }}
          >
            {data.map((member) => (
              <div key={member.id} className="team-card-wrapper">
                <Link href={`/team/${member.slug}`} className="team-card">
                  <div className="team-card-image">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="team-card-img"
                    />
                  </div>
                  <div className="team-card-info">
                    <h4 className="team-card-name">{member.name}</h4>
                    <p className="team-card-position">{member.position}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
