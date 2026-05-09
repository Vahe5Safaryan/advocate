'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeader, Section } from '@/components/ui';
import { L, tl } from '@/lib/labels';
import '@/styles/team.css';

interface TeamMember {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
  position: string;
}

const FALLBACK: TeamMember[] = [
  { id: '1', slug: 'tatevik-malkhasyan', imageUrl: '/images/team/team1.jpg', name: 'Татевик Малхасян', position: 'Директор компании, Адвокат' },
  { id: '2', slug: 'andranik-mnatsakanyan', imageUrl: '/images/team/team2.jpg', name: 'Андраник Мнацаканян', position: 'Партнер, Адвокат' },
  { id: '3', slug: 'gurgen-nersisyan', imageUrl: '/images/team/team3.jpg', name: 'Гурген Нерсисян', position: 'Партнер, Адвокат' },
  { id: '4', slug: 'edgar-ayvazyan', imageUrl: '/images/team/team1.jpg', name: 'Эдгар Айвазян', position: 'Партнер, Адвокат' },
  { id: '5', slug: 'arsen-sardaryan', imageUrl: '/images/team/team2.jpg', name: 'Арсен Сардарян', position: 'Управляющий партнер' },
  { id: '6', slug: 'susanna-pambukchyan', imageUrl: '/images/team/team3.jpg', name: 'Сусанна Памбукчян', position: 'Главный бухгалтер' },
];

export default function Team({ members = [], lang = 'ru' }: { members?: TeamMember[]; lang?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const data = members.length > 0 ? members : FALLBACK;

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
        subtitle={tl(L.team_subtitle, lang)}
        title={tl(L.team_title, lang)}
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
