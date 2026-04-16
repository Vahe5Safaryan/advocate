import Link from 'next/link';
import Image from 'next/image';
import { Section } from '@/components/ui';
import '@/styles/team-page.css';

const teamMembers = [
  { id: 1, slug: 'tatevik-malkhasyan', name: 'Татевик Малхасян', position: 'Директор компании, Адвокат', image: '/images/team/team1.jpg' },
  { id: 2, slug: 'andranik-mnatsakanyan', name: 'Андраник Мнацаканян', position: 'Партнер, Адвокат', image: '/images/team/team2.jpg' },
  { id: 3, slug: 'gurgen-nersisyan', name: 'Гурген Нерсисян', position: 'Партнер, Адвокат', image: '/images/team/team3.jpg' },
  { id: 4, slug: 'edgar-ayvazyan', name: 'Эдгар Айвазян', position: 'Партнер, Адвокат', image: '/images/team/team1.jpg' },
  { id: 5, slug: 'arsen-sardaryan', name: 'Арсен Сардарян', position: 'Управляющий партнер', image: '/images/team/team2.jpg' },
  { id: 6, slug: 'susanna-pambukchyan', name: 'Сусанна Памбукчян', position: 'Главный бухгалтер', image: '/images/team/team3.jpg' },
];

export default function TeamPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="team-hero">
        <div className="team-hero-overlay"></div>
        <div className="container team-hero-content">
          <h1 className="team-hero-title">Команда</h1>
          <div className="team-breadcrumb">
            <Link href="/">Главная</Link>
            <span className="team-breadcrumb-separator">/</span>
            <span>Команда</span>
          </div>
        </div>
      </section>

      {/* Team Grid Section */}
      <Section background="gray">
        <div className="team-page-header">
          <span className="team-page-label">Наша команда</span>
          <h2 className="team-page-title">Наши специалисты</h2>
          <p className="team-page-description">
            В компании «LSA» работает команда высококвалифицированных юристов с многолетним опытом работы.
          </p>
        </div>

        <div className="team-page-grid">
          {teamMembers.map((member) => (
            <Link href={`/team/${member.slug}`} key={member.id} className="team-page-card">
              <div className="team-page-card-image">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="team-page-card-img"
                />
              </div>
              <div className="team-page-card-info">
                <h3 className="team-page-card-name">{member.name}</h3>
                <p className="team-page-card-position">{member.position}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
