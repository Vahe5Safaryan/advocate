import Link from 'next/link';
import Image from 'next/image';
import { Section } from '@/components/ui';
import { getTeamMembers, getLang } from '@/lib/data';
import { L, tl } from '@/lib/labels';
import '@/styles/team-page.css';

const FALLBACK = [
  { id: '1', slug: 'tatevik-malkhasyan', imageUrl: '/images/team/team1.jpg', name: 'Татевик Малхасян', position: 'Директор компании, Адвокат' },
  { id: '2', slug: 'andranik-mnatsakanyan', imageUrl: '/images/team/team2.jpg', name: 'Андраник Мнацаканян', position: 'Партнер, Адвокат' },
  { id: '3', slug: 'gurgen-nersisyan', imageUrl: '/images/team/team3.jpg', name: 'Гурген Нерсисян', position: 'Партнер, Адвокат' },
  { id: '4', slug: 'edgar-ayvazyan', imageUrl: '/images/team/team1.jpg', name: 'Эдгар Айвазян', position: 'Партнер, Адвокат' },
  { id: '5', slug: 'arsen-sardaryan', imageUrl: '/images/team/team2.jpg', name: 'Арсен Сардарян', position: 'Управляющий партнер' },
  { id: '6', slug: 'susanna-pambukchyan', imageUrl: '/images/team/team3.jpg', name: 'Сусанна Памбукчян', position: 'Главный бухгалтер' },
];

export default async function TeamPage() {
  const [members, lang] = await Promise.all([getTeamMembers(), getLang()]);
  const data = members.length > 0 ? members : FALLBACK;

  return (
    <>
      <section className="team-hero">
        <div className="team-hero-overlay"></div>
        <div className="container team-hero-content">
          <h1 className="team-hero-title">{tl(L.team, lang)}</h1>
        </div>
      </section>

      <Section background="gray">
        <div className="team-page-header">
          <span className="team-page-label">{tl(L.team_page_label, lang)}</span>
          <h2 className="team-page-title">{tl(L.team_page_title, lang)}</h2>
        </div>

        <div className="team-page-grid">
          {data.map((member) => (
            <Link href={`/team/${member.slug}`} key={member.id} className="team-page-card">
              <div className="team-page-card-image">
                <Image src={member.imageUrl} alt={member.name} fill className="team-page-card-img" />
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
