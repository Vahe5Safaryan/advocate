import Link from 'next/link';
import Image from 'next/image';
import { Button, Section } from '@/components/ui';
import { getAboutTabs, getProcessSteps, getPracticeAreas, getTeamMembers, getSettings, getLang } from '@/lib/data';
import { L, tl } from '@/lib/labels';
import AboutTabs from '@/components/AboutTabs';
import '@/styles/about-page.css';

const FALLBACK_TABS = [
  { id: '1', tabKey: 'mission', label: 'Наша миссия', content: 'Наша миссия — обеспечить надежную юридическую защиту и поддержку каждому клиенту. Мы стремимся к справедливости и защите прав, используя наш опыт и профессионализм для достижения наилучших результатов.' },
  { id: '2', tabKey: 'vision', label: 'Наше видение', content: 'Мы видим себя ведущей юридической компанией в Армении, известной своей честностью, профессионализмом и преданностью интересам клиентов.' },
  { id: '3', tabKey: 'values', label: 'Наши ценности', content: 'Честность, профессионализм и преданность — основа нашей работы. Мы верим в индивидуальный подход к каждому делу.' },
];

const FALLBACK_STEPS = [
  { id: '1', stepNumber: 1, title: 'Первичная консультация и оценка', description: 'Мы анализируем вашу ситуацию, изучаем документы и определяем оптимальную стратегию для вашего дела.' },
  { id: '2', stepNumber: 2, title: 'Разработка правовой стратегии', description: 'Наши юристы разрабатывают комплексный план действий, подготавливают необходимые документы и согласовывают их с вами.' },
  { id: '3', stepNumber: 3, title: 'Представительство и разрешение', description: 'Мы представляем ваши интересы в суде и государственных органах, при необходимости ведем переговоры для достижения наилучшего результата.' },
];

const FALLBACK_AREAS = [
  { id: '1', icon: '⚖️', title: 'Уголовное право', description: 'Защита обвиняемых, представление интересов истца, защита свидетелей.' },
  { id: '2', icon: '🛡️', title: 'Гражданское право', description: 'Имущественные споры, договорные отношения, возмещение ущерба.' },
  { id: '3', icon: '👨‍👩‍👧‍👦', title: 'Семейное право', description: 'Бракоразводные процессы, алименты, опека над детьми.' },
  { id: '4', icon: '💼', title: 'Трудовое право', description: 'Трудовые споры, защита прав работников и работодателей.' },
  { id: '5', icon: '🏠', title: 'Недвижимость', description: 'Сделки с недвижимостью, аренда, земельные споры.' },
  { id: '6', icon: '🏢', title: 'Корпоративное право', description: 'Регистрация компаний, договоры, слияния и поглощения.' },
];

const FALLBACK_TEAM = [
  { id: '1', slug: 'tatevik-malkhasyan', imageUrl: '/images/team/team1.jpg', name: 'Татевик Малхасян', position: 'Директор компании, Адвокат' },
  { id: '2', slug: 'andranik-mnatsakanyan', imageUrl: '/images/team/team2.jpg', name: 'Андраник Мнацаканян', position: 'Партнер, Адвокат' },
  { id: '3', slug: 'gurgen-nersisyan', imageUrl: '/images/team/team3.jpg', name: 'Гурген Нерсисян', position: 'Партнер, Адвокат' },
];

export default async function AboutPage() {
  const [tabs, steps, areas, allMembers, settings, lang] = await Promise.all([
    getAboutTabs(),
    getProcessSteps(),
    getPracticeAreas(),
    getTeamMembers(),
    getSettings(),
    getLang(),
  ]);

  const tabsData = tabs.length > 0 ? tabs : FALLBACK_TABS;
  const stepsData = steps.length > 0 ? steps : FALLBACK_STEPS;
  const areasData = areas.length > 0 ? areas : FALLBACK_AREAS;
  const teamData = allMembers.length > 0 ? allMembers.slice(0, 3) : FALLBACK_TEAM;

  return (
    <>
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container about-hero-content">
          <h1 className="about-hero-title">{tl(L.about, lang)}</h1>
          <div className="about-breadcrumb">
            <Link href="/">{tl(L.home, lang)}</Link>
            <span className="about-breadcrumb-separator">/</span>
            <span>{tl(L.about, lang)}</span>
          </div>
        </div>
      </section>

      {/* Mission/Vision Section */}
      <Section background="white" className="about-mission-section">
        <div className="about-mission-grid">
          <div className="about-mission-content">
            <h2 className="about-mission-title">
              {settings.about_hero_title || 'Наша команда юристов обеспечивает надежную защиту клиентов'}
            </h2>
            <AboutTabs tabs={tabsData} />
          </div>

          <div className="about-mission-image">
            <div className="about-mission-image-wrapper">
              {settings.about_hero_image ? (
                <div className="about-mission-image-placeholder" style={{ padding: 0, overflow: 'hidden' }}>
                  <Image
                    src={settings.about_hero_image}
                    alt="Команда"
                    width={560}
                    height={420}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    unoptimized={settings.about_hero_image.startsWith('/uploads/')}
                  />
                </div>
              ) : (
                <div className="about-mission-image-placeholder">
                  <span>👥</span>
                </div>
              )}
              <div className="about-mission-stats">
                <span className="about-mission-stats-number">{settings.about_stats_number || '240+'}</span>
                <span className="about-mission-stats-label">{settings.about_stats_label || 'Успешных дел'}</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Team Section */}
      <Section background="gray">
        <div className="about-team-header">
          <span className="about-label centered">{tl(L.about_team_label, lang)}</span>
          <h2 className="about-team-title">{tl(L.about_team_title, lang)}</h2>
        </div>

        <div className="about-team-grid">
          {teamData.map((member) => (
            <Link href={`/team/${member.slug}`} key={member.id} className="about-team-card">
              <div className="about-team-card-image">
                <Image src={member.imageUrl} alt={member.name} fill className="about-team-card-img" />
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
            {settings.about_process_image ? (
              <Image
                src={settings.about_process_image}
                alt="Наш процесс"
                width={560}
                height={420}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                unoptimized={settings.about_process_image.startsWith('/uploads/')}
              />
            ) : (
              <div className="about-process-image-placeholder">
                <span>⚖️</span>
              </div>
            )}
          </div>

          <div className="about-process-content">
            <span className="about-label">{tl(L.about_process_label, lang)}</span>
            <h2 className="about-process-title">
              {settings.about_process_title || 'Надежные юридические решения для вашего спокойствия'}
            </h2>

            <div className="about-process-steps">
              {stepsData.map((step) => (
                <div key={step.id} className="about-process-step">
                  <div className="about-process-step-number">{step.stepNumber}</div>
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
              <span className="about-label light">{tl(L.about_practice_label, lang)}</span>
              <h2 className="about-practice-title">{tl(L.about_practice_title, lang)}</h2>
              <Button href="/services" variant="gold">
                {tl(L.about_services_btn, lang)}
              </Button>
            </div>

            <div className="about-practice-items">
              {areasData.map((area) => (
                <div key={area.id} className="about-practice-item">
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
