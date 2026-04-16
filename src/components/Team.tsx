'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeader, Section } from '@/components/ui';
import '@/styles/team.css';

const teamMembers = [
  { id: 1, slug: 'tatevik-malkhasyan', name: 'Татевик Малхасян', position: 'Директор компании, Адвокат', image: '/images/team/team1.jpg' },
  { id: 2, slug: 'andranik-mnatsakanyan', name: 'Андраник Мнацаканян', position: 'Партнер, Адвокат', image: '/images/team/team2.jpg' },
  { id: 3, slug: 'gurgen-nersisyan', name: 'Гурген Нерсисян', position: 'Партнер, Адвокат', image: '/images/team/team3.jpg' },
  { id: 4, slug: 'edgar-ayvazyan', name: 'Эдгар Айвазян', position: 'Партнер, Адвокат', image: '/images/team/team1.jpg' },
  { id: 5, slug: 'arsen-sardaryan', name: 'Арсен Сардарян', position: 'Управляющий партнер', image: '/images/team/team2.jpg' },
  { id: 6, slug: 'susanna-pambukchyan', name: 'Сусанна Памбукчян', position: 'Главный бухгалтер', image: '/images/team/team3.jpg' },
];

export default function Team() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, teamMembers.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, teamMembers.length - 2)) % Math.max(1, teamMembers.length - 2));
  };

  return (
    <Section background="gray">
      <SectionHeader
        subtitle="Команда"
        title="Наши специалисты"
        description="В компании «LSA» работает команда высококвалифицированных юристов."
      />

      {/* Carousel */}
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
            style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
          >
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card-wrapper">
                <Link href={`/team/${member.slug}`} className="team-card">
                  <div className="team-card-image">
                    <Image
                      src={member.image}
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
