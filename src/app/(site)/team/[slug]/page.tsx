import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Section } from '@/components/ui';
import { getTeamMemberBySlug, getTeamMembers, getLang } from '@/lib/data';
import '@/styles/team-detail.css';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const members = await getTeamMembers();
  return members.map((m) => ({ slug: m.slug }));
}

const licenseLabel: Record<string, string> = {
  ru: 'Лицензия',
  en: 'License',
  hy: 'Արտոնագիր',
};

export default async function TeamMemberPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [member, lang] = await Promise.all([getTeamMemberBySlug(slug), getLang()]);

  if (!member) return notFound();

  return (
    <>
      <section className="team-detail-hero">
        <div className="team-detail-hero-overlay"></div>
        <div className="container team-detail-hero-content">
          <div className="team-detail-breadcrumb">
            <Link href="/">Главная</Link>
            <span className="team-detail-breadcrumb-separator">&gt;</span>
            <Link href="/team">Команда</Link>
            <span className="team-detail-breadcrumb-separator">&gt;</span>
            <span>{member.name}</span>
          </div>
        </div>
      </section>

      <Section background="white">
        <div className="team-detail-content">
          <div className="team-detail-sidebar">
            <div className="team-detail-photo">
              <Image src={member.imageUrl} alt={member.name} fill className="team-detail-img" />
            </div>
            <div className="team-detail-info">
              <h3 className="team-detail-info-name">{member.name}</h3>
              <p className="team-detail-info-position">{member.position}</p>
              {member.licenseNumber && (
                <p className="team-detail-info-license">{licenseLabel[lang] ?? licenseLabel.ru} {member.licenseNumber}</p>
              )}
            </div>
          </div>

          <div className="team-detail-bio">
            <h1 className="team-detail-title">{member.name}</h1>
            {member.bio.map((paragraph, index) => (
              <p key={index} className="team-detail-paragraph">{paragraph}</p>
            ))}
            {member.bio.length === 0 && (
              <p className="team-detail-paragraph">{member.position}</p>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
