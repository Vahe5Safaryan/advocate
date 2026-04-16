import Link from 'next/link';
import Image from 'next/image';
import { Section } from '@/components/ui';
import '@/styles/team-detail.css';

// Team members data
const teamMembers = [
  {
    id: 1,
    slug: 'tatevik-malkhasyan',
    name: 'Татевик Малхасян',
    position: 'Директор компании, Адвокат',
    license: '№ 1234',
    image: '/images/team/team1.jpg',
    bio: [
      'Татевик Малхасян является адвокатом в юридической фирме «LSA». Она специализируется как в уголовном, так и в корпоративном праве, в частности, оказывает юридическую поддержку при регистрации коммерческих компаний, фондов и некоммерческих организаций.',
      'Её профессиональный опыт в юридической фирме «LSA» начался в 2015 году. Ранее она имела опыт работы в частных и государственных учреждениях. В частности, она работала юридическим консультантом по административным и гражданским делам с 2010 по 2015 год.',
      'В 2009 году она с отличием окончила юридический факультет Ереванского государственного университета, получив степень бакалавра. Впоследствии, в 2011 году, она с отличием окончила Национальную академию наук Армении и получила степень магистра права.',
      'Она участвовала в многочисленных национальных и международных конференциях и тренингах, связанных с правом.',
      'Владеет армянским, русским и английским языками.',
    ],
  },
  {
    id: 2,
    slug: 'andranik-mnatsakanyan',
    name: 'Андраник Мнацаканян',
    position: 'Партнер, Адвокат',
    license: '№ 2345',
    image: '/images/team/team2.jpg',
    bio: [
      'Андраник Мнацаканян является партнером и адвокатом в юридической фирме «LSA». Он специализируется в области гражданского и коммерческого права, представляя интересы клиентов в судах всех инстанций.',
      'Его профессиональный опыт включает работу над сложными коммерческими спорами, сделками с недвижимостью и корпоративными реструктуризациями.',
      'Он окончил юридический факультет Ереванского государственного университета и имеет более 10 лет практического опыта в юриспруденции.',
      'Владеет армянским, русским и английским языками.',
    ],
  },
  {
    id: 3,
    slug: 'gurgen-nersisyan',
    name: 'Гурген Нерсисян',
    position: 'Партнер, Адвокат',
    license: '№ 3456',
    image: '/images/team/team3.jpg',
    bio: [
      'Гурген Нерсисян является партнером и адвокатом в юридической фирме «LSA». Он специализируется в области уголовного права и защиты прав человека.',
      'Его профессиональный опыт включает представление интересов клиентов в уголовных делах различной сложности, а также работу с международными организациями по защите прав человека.',
      'Он окончил юридический факультет Российско-Армянского университета и имеет степень магистра международного права.',
      'Владеет армянским, русским, английским и французским языками.',
    ],
  },
  {
    id: 4,
    slug: 'edgar-ayvazyan',
    name: 'Эдгар Айвазян',
    position: 'Партнер, Адвокат',
    license: '№ 4567',
    image: '/images/team/team1.jpg',
    bio: [
      'Эдгар Айвазян является партнером и адвокатом в юридической фирме «LSA». Он специализируется в области налогового и финансового права.',
      'Его профессиональный опыт включает консультирование крупных компаний по вопросам налогового планирования, а также представление интересов клиентов в налоговых спорах.',
      'Он окончил экономический и юридический факультеты и имеет двойную специализацию в области права и экономики.',
      'Владеет армянским, русским и английским языками.',
    ],
  },
  {
    id: 5,
    slug: 'arsen-sardaryan',
    name: 'Арсен Сардарян',
    position: 'Управляющий партнер',
    license: '№ 5678',
    image: '/images/team/team2.jpg',
    bio: [
      'Арсен Сардарян является управляющим партнером юридической фирмы «LSA». Он отвечает за стратегическое развитие компании и управление ключевыми проектами.',
      'Его профессиональный опыт включает более 15 лет работы в юридической сфере, включая руководящие позиции в крупных юридических фирмах.',
      'Он окончил юридический факультет Ереванского государственного университета и имеет степень MBA.',
      'Владеет армянским, русским и английским языками.',
    ],
  },
  {
    id: 6,
    slug: 'susanna-pambukchyan',
    name: 'Сусанна Памбукчян',
    position: 'Главный бухгалтер',
    license: '№ 6789',
    image: '/images/team/team3.jpg',
    bio: [
      'Сусанна Памбукчян является главным бухгалтером юридической фирмы «LSA». Она отвечает за финансовый учет и отчетность компании.',
      'Её профессиональный опыт включает более 12 лет работы в области бухгалтерского учета и финансов.',
      'Она окончила экономический факультет Армянского государственного экономического университета.',
      'Владеет армянским, русским и английским языками.',
    ],
  },
];

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return teamMembers.map((member) => ({
    slug: member.slug,
  }));
}

export default async function TeamMemberPage({ params }: { params: Params }) {
  const { slug } = await params;
  const member = teamMembers.find((m) => m.slug === slug);

  if (!member) {
    return (
      <Section background="white">
        <div className="container">
          <h1>Сотрудник не найден</h1>
          <Link href="/team">Вернуться к команде</Link>
        </div>
      </Section>
    );
  }

  return (
    <>
      {/* Hero Section */}
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

      {/* Content Section */}
      <Section background="white">
        <div className="team-detail-content">
          {/* Left - Photo and Info */}
          <div className="team-detail-sidebar">
            <div className="team-detail-photo">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="team-detail-img"
              />
            </div>
            <div className="team-detail-info">
              <h3 className="team-detail-info-name">{member.name}</h3>
              <p className="team-detail-info-position">{member.position}</p>
              <p className="team-detail-info-license">Лицензия {member.license}</p>
            </div>
          </div>

          {/* Right - Bio */}
          <div className="team-detail-bio">
            <h1 className="team-detail-title">{member.name}</h1>
            {member.bio.map((paragraph, index) => (
              <p key={index} className="team-detail-paragraph">{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
