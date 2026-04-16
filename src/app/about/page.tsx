'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Section } from '@/components/ui';
import '@/styles/about-page.css';

// Tabs data
const tabs = [
  {
    id: 'mission',
    label: 'Наша миссия',
    content: 'Наша миссия — обеспечить надежную юридическую защиту и поддержку каждому клиенту. Мы стремимся к справедливости и защите прав, используя наш опыт и профессионализм для достижения наилучших результатов.'
  },
  {
    id: 'vision',
    label: 'Наше видение',
    content: 'Мы видим себя ведущей юридической компанией в Армении, известной своей честностью, профессионализмом и преданностью интересам клиентов. Наша цель — устанавливать новые стандарты качества юридических услуг.'
  },
  {
    id: 'values',
    label: 'Наши ценности',
    content: 'Честность, профессионализм и преданность — основа нашей работы. Мы верим в индивидуальный подход к каждому делу и строим долгосрочные отношения с клиентами, основанные на доверии и взаимном уважении.'
  },
];

// Team members
const teamMembers = [
  { id: 1, slug: 'tatevik-malkhasyan', name: 'Татевик Малхасян', position: 'Директор компании, Адвокат', image: '/images/team/team1.jpg' },
  { id: 2, slug: 'andranik-mnatsakanyan', name: 'Андраник Мнацаканян', position: 'Партнер, Адвокат', image: '/images/team/team2.jpg' },
  { id: 3, slug: 'gurgen-nersisyan', name: 'Гурген Нерсисян', position: 'Партнер, Адвокат', image: '/images/team/team3.jpg' },
];

// Legal process steps
const processSteps = [
  {
    number: 1,
    title: 'Первичная консультация и оценка',
    description: 'Мы анализируем вашу ситуацию, изучаем документы и определяем оптимальную стратегию для вашего дела.'
  },
  {
    number: 2,
    title: 'Разработка правовой стратегии',
    description: 'Наши юристы разрабатывают комплексный план действий, подготавливают необходимые документы и согласовывают их с вами.'
  },
  {
    number: 3,
    title: 'Представительство и разрешение',
    description: 'Мы представляем ваши интересы в суде и государственных органах, при необходимости ведем переговоры для достижения наилучшего результата.'
  },
];

// Practice areas
const practiceAreas = [
  { icon: '⚖️', title: 'Уголовное право', description: 'Защита обвиняемых, представление интересов истца, защита свидетелей.' },
  { icon: '🛡️', title: 'Гражданское право', description: 'Имущественные споры, договорные отношения, возмещение ущерба.' },
  { icon: '👨‍👩‍👧‍👦', title: 'Семейное право', description: 'Бракоразводные процессы, алименты, опека над детьми.' },
  { icon: '💼', title: 'Трудовое право', description: 'Трудовые споры, защита прав работников и работодателей.' },
  { icon: '🏠', title: 'Недвижимость', description: 'Сделки с недвижимостью, аренда, земельные споры.' },
  { icon: '🏢', title: 'Корпоративное право', description: 'Регистрация компаний, договоры, слияния и поглощения.' },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <>
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container about-hero-content">
          <h1 className="about-hero-title">О нас</h1>
          <div className="about-breadcrumb">
            <Link href="/">Главная</Link>
            <span className="about-breadcrumb-separator">/</span>
            <span>О нас</span>
          </div>
        </div>
      </section>

      {/* Mission/Vision Section */}
      <Section background="white" className="about-mission-section">
        <div className="about-mission-grid">
          <div className="about-mission-content">
            <span className="about-label">О компании LSA</span>
            <h2 className="about-mission-title">
              Наша команда юристов обеспечивает надежную защиту клиентов
            </h2>

            {/* Tabs */}
            <div className="about-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`about-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="about-tab-content">
              {tabs.find(tab => tab.id === activeTab)?.content}
            </div>
          </div>

          <div className="about-mission-image">
            <div className="about-mission-image-wrapper">
              <div className="about-mission-image-placeholder">
                <span>👥</span>
              </div>
              <div className="about-mission-stats">
                <span className="about-mission-stats-number">240+</span>
                <span className="about-mission-stats-label">Успешных дел</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Team Section */}
      <Section background="gray">
        <div className="about-team-header">
          <span className="about-label centered">Наша команда</span>
          <h2 className="about-team-title">Познакомьтесь с нашими экспертами</h2>
        </div>

        <div className="about-team-grid">
          {teamMembers.map((member) => (
            <Link href={`/team/${member.slug}`} key={member.id} className="about-team-card">
              <div className="about-team-card-image">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="about-team-card-img"
                />
              </div>
              <div className="about-team-card-info">
                <h3 className="about-team-card-name">{member.name}</h3>
                <p className="about-team-card-position">{member.position}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Legal Process Section */}
      <Section background="white" className="about-process-section">
        <div className="about-process-grid">
          <div className="about-process-image">
            <div className="about-process-image-placeholder">
              <span>⚖️</span>
            </div>
          </div>

          <div className="about-process-content">
            <span className="about-label">Наш процесс</span>
            <h2 className="about-process-title">
              Надежные юридические решения для вашего спокойствия
            </h2>

            <div className="about-process-steps">
              {processSteps.map((step) => (
                <div key={step.number} className="about-process-step">
                  <div className="about-process-step-number">{step.number}</div>
                  <div className="about-process-step-content">
                    <h4 className="about-process-step-title">{step.title}</h4>
                    <p className="about-process-step-description">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>


      {/* Practice Areas Section */}
      <section className="about-practice-section">
        <div className="container">
          <div className="about-practice-grid">
            <div className="about-practice-content">
              <span className="about-label light">Сферы практики</span>
              <h2 className="about-practice-title">
                Опытные юристы защищают ваши права
              </h2>
              <Button href="/services" variant="gold">
                Наши услуги
              </Button>
            </div>

            <div className="about-practice-items">
              {practiceAreas.map((area, index) => (
                <div key={index} className="about-practice-item">
                  <div className="about-practice-item-icon">{area.icon}</div>
                  <div className="about-practice-item-content">
                    <h4 className="about-practice-item-title">{area.title}</h4>
                    <p className="about-practice-item-description">{area.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
