import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin — credentials from .env
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@lsa.am';
  const adminPassword = await hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: adminPassword, name: 'Администратор', role: 'admin' },
  });
  console.log('✓ Admin');

  // Languages
  for (const lang of [
    { code: 'ru', name: 'Русский', flag: '🇷🇺', isDefault: true },
    { code: 'en', name: 'English', flag: '🇺🇸', isDefault: false },
    { code: 'hy', name: 'Հայ', flag: '🇦🇲', isDefault: false },
  ]) {
    await prisma.language.upsert({ where: { code: lang.code }, update: {}, create: lang });
  }
  console.log('✓ Languages');

  // Hero Slides
  await prisma.heroSlideTranslation.deleteMany();
  await prisma.heroSlide.deleteMany();
  for (const [, slide] of [
    {
      imageUrl: '/images/hero/hero1.jpg', order: 0,
      ru: { subtitle: 'Ваш путь к справедливости начинается здесь', title: 'Добро пожаловать в NEW LEX Law Firm', description: 'Предоставляем исключительные юридические услуги с приверженностью профессионализму и совершенству.', buttonText: 'Позвонить' },
      en: { subtitle: 'Your Journey to Justice Starts Here', title: 'Welcome to NEW LEX Law Firm', description: 'Providing exceptional legal services with a commitment to professionalism and excellence.', buttonText: 'Call Now' },
    },
    {
      imageUrl: '/images/hero/hero2.jpg', order: 1,
      ru: { subtitle: 'Ваш путь к справедливости начинается здесь', title: 'Надёжный партнёр на пути к правосудию', description: 'Мы на вашей стороне, защищаем ваши права и добиваемся справедливости.', buttonText: 'Позвонить' },
      en: { subtitle: 'Your Journey to Justice Starts Here', title: 'Trusted Partner on Your Path to Justice', description: 'We are on your side, protecting your rights and ensuring justice is achieved.', buttonText: 'Call Now' },
    },
    {
      imageUrl: '/images/hero/hero1.jpg', order: 2,
      ru: { subtitle: 'Ваш путь к справедливости начинается здесь', title: 'Юридическая поддержка для каждого клиента', description: 'Наша команда разрабатывает индивидуальные решения для ваших уникальных правовых вопросов.', buttonText: 'Позвонить' },
      en: { subtitle: 'Your Journey to Justice Starts Here', title: 'Legal Support for Every Client', description: 'Our team develops individual solutions for your unique legal matters.', buttonText: 'Call Now' },
    },
  ].entries()) {
    const s = await prisma.heroSlide.create({ data: { imageUrl: slide.imageUrl, order: slide.order, isActive: true } });
    for (const [lang, tr] of Object.entries({ ru: slide.ru, en: slide.en })) {
      await prisma.heroSlideTranslation.create({ data: { slideId: s.id, language: lang, ...tr } });
    }
  }
  console.log('✓ Hero slides');

  // Services
  await prisma.serviceTranslation.deleteMany();
  await prisma.service.deleteMany();
  const servicesData = [
    {
      slug: 'criminal', icon: '⚖️', order: 0,
      ru: { title: 'Уголовное право', heroTitle: 'Уголовное Право', items: JSON.stringify(['Защита обвиняемого', 'Представление интересов потерпевшего', 'Представление интересов свидетеля', 'Условно-досрочное освобождение', 'Дела об экстрадиции']), intro: JSON.stringify(['Уголовное право является одной из ключевых отраслей права, регулирующей ответственность за совершение преступлений.', 'Юридическая фирма NEW LEX предоставляет полный спектр услуг в области уголовного права.']), sections: JSON.stringify([{ title: 'Наши услуги в области уголовного права включают:', items: ['Защита обвиняемого на всех стадиях уголовного процесса', 'Представление интересов потерпевшего', 'Представление интересов свидетеля', 'Условно-досрочное освобождение осужденного', 'Дела об экстрадиции'] }]) },
      en: { title: 'Criminal Law', heroTitle: 'Criminal Law', items: JSON.stringify(['Defense of the accused', 'Victim representation', 'Witness representation', 'Parole', 'Extradition cases']), intro: JSON.stringify(['Criminal law is one of the key branches of law governing liability for crimes.', 'NEW LEX Law Firm provides a full range of criminal law services.']), sections: JSON.stringify([{ title: 'Our criminal law services include:', items: ['Defense of the accused at all stages', 'Victim representation', 'Witness representation', 'Parole proceedings', 'Extradition cases'] }]) },
    },
    {
      slug: 'civil', icon: '🛡️', order: 1,
      ru: { title: 'Гражданское право', heroTitle: 'Гражданское Право', items: JSON.stringify(['Споры о собственности', 'Споры по сделкам и договорам', 'Споры о возмещении ущерба', 'Страховые споры', 'Защита авторских прав', 'Наследственные дела']), intro: JSON.stringify(['Гражданское право регулирует множество общественных отношений, включая имущество, договоры, наследование.', 'Юридическая фирма NEW LEX предоставляет правовые услуги в области гражданского права.']), sections: JSON.stringify([{ title: 'Компания оказывает юридические услуги по следующим направлениям:', items: ['Споры, связанные с имущественными правами', 'Споры, возникающие из сделок и договоров', 'Споры, связанные с возмещением ущерба', 'Страховые споры', 'Наследственные дела'] }]) },
      en: { title: 'Civil Law', heroTitle: 'Civil Law', items: JSON.stringify(['Property disputes', 'Contract disputes', 'Damage claims', 'Insurance disputes', 'Copyright protection', 'Inheritance cases']), intro: JSON.stringify(['Civil law governs many social relations including property, contracts, and inheritance.', 'NEW LEX Law Firm provides legal services in civil law.']), sections: JSON.stringify([{ title: 'Our civil law services include:', items: ['Property rights disputes', 'Contract and transaction disputes', 'Damage compensation disputes', 'Insurance disputes', 'Inheritance cases'] }]) },
    },
    {
      slug: 'administrative', icon: '🏛️', order: 2,
      ru: { title: 'Административное право', heroTitle: 'Административное Право', items: JSON.stringify(['Оспаривание решений госорганов', 'Поддержка по вопросам лицензирования', 'Налоговые и таможенные споры', 'Представительство в административных процедурах']), intro: JSON.stringify(['Административное право регулирует отношения между гражданами, организациями и государственными органами.', 'NEW LEX оказывает квалифицированную помощь в разрешении административных споров.']), sections: JSON.stringify([{ title: 'Наши услуги в области административного права:', items: ['Оспаривание решений государственных органов', 'Правовая поддержка по вопросам лицензирования и разрешений', 'Разрешение налоговых споров', 'Представительство в таможенных спорах'] }]) },
      en: { title: 'Administrative Law', heroTitle: 'Administrative Law', items: JSON.stringify(['Challenging government decisions', 'Licensing support', 'Tax and customs disputes', 'Administrative proceedings']), intro: JSON.stringify(['Administrative law governs relations between citizens, organizations, and government bodies.', 'NEW LEX provides qualified assistance in resolving administrative disputes.']), sections: JSON.stringify([{ title: 'Our administrative law services:', items: ['Challenging government decisions', 'Licensing and permit support', 'Tax dispute resolution', 'Customs dispute representation'] }]) },
    },
    {
      slug: 'corporate', icon: '💼', order: 3,
      ru: { title: 'Корпоративные услуги', heroTitle: 'Корпоративные Услуги', items: JSON.stringify(['Регистрация компаний', 'Составление договоров', 'Ведение бухгалтерского учета', 'Проведение переговоров', 'Поддержка в лицензировании']), intro: JSON.stringify(['Корпоративное право охватывает широкий спектр вопросов, связанных с созданием, функционированием и реорганизацией юридических лиц.', 'NEW LEX предоставляет комплексные услуги в области корпоративного права.']), sections: JSON.stringify([{ title: 'Наши корпоративные услуги включают:', items: ['Регистрация компаний всех организационно-правовых форм', 'Составление и экспертиза договоров', 'Ведение бухгалтерского учета', 'Проведение переговоров', 'Поддержка в лицензировании'] }]) },
      en: { title: 'Corporate Services', heroTitle: 'Corporate Services', items: JSON.stringify(['Company registration', 'Contract drafting', 'Accounting', 'Negotiations', 'Licensing support']), intro: JSON.stringify(['Corporate law covers a wide range of issues related to the creation, operation, and reorganization of legal entities.', 'NEW LEX provides comprehensive corporate law services.']), sections: JSON.stringify([{ title: 'Our corporate services include:', items: ['Company registration', 'Contract drafting and review', 'Accounting services', 'Negotiations', 'Licensing support'] }]) },
    },
    {
      slug: 'accounting', icon: '🧮', order: 4,
      ru: { title: 'Бухгалтерия и финансы', heroTitle: 'Бухгалтерский Учет И Финансы', items: JSON.stringify(['Консультации, анализ', 'Бухгалтерский учет', 'Официальные запросы', 'Проведение переговоров']), intro: JSON.stringify(['Правильное ведение бухгалтерского учета является основой успешного функционирования любого бизнеса.', 'Наша компания предоставляет полный спектр бухгалтерских услуг.']), sections: JSON.stringify([{ title: 'Наши бухгалтерские услуги включают:', items: ['Консультации и анализ финансовой деятельности', 'Ведение бухгалтерского учета', 'Подготовка и подача официальных запросов', 'Налоговое планирование'] }]) },
      en: { title: 'Accounting & Finance', heroTitle: 'Accounting & Finance', items: JSON.stringify(['Consulting and analysis', 'Accounting services', 'Official requests', 'Negotiations']), intro: JSON.stringify(['Proper accounting is the foundation of any successful business.', 'Our company provides a full range of accounting services.']), sections: JSON.stringify([{ title: 'Our accounting services include:', items: ['Financial consulting and analysis', 'Accounting services', 'Official request preparation', 'Tax planning'] }]) },
    },
    {
      slug: 'immigration', icon: '🌐', order: 5,
      ru: { title: 'Защита иностранцев', heroTitle: 'Правовая Поддержка Иностранных Граждан', items: JSON.stringify(['Миграция в Армению', 'Статус беженца', 'Представительство потерпевшего', 'Дела об экстрадиции', 'Судебная защита']), intro: JSON.stringify(['Иностранные граждане, находящиеся в Армении, могут столкнуться с различными правовыми вопросами.', 'Наша компания специализируется на защите прав иностранных граждан.']), sections: JSON.stringify([{ title: 'Наши услуги для иностранных граждан:', items: ['Помощь в миграции в Армению', 'Получение статуса беженца', 'Представительство потерпевшего', 'Дела об экстрадиции', 'Получение вида на жительство'] }]) },
      en: { title: 'Foreigners Protection', heroTitle: 'Legal Support for Foreign Nationals', items: JSON.stringify(['Migration to Armenia', 'Refugee status', 'Victim representation', 'Extradition cases', 'Legal defense']), intro: JSON.stringify(['Foreign nationals in Armenia may face various legal issues requiring qualified assistance.', 'Our company specializes in protecting the rights of foreign nationals.']), sections: JSON.stringify([{ title: 'Our services for foreign nationals:', items: ['Assistance with migration to Armenia', 'Refugee status acquisition', 'Victim representation', 'Extradition cases', 'Residence permit acquisition'] }]) },
    },
  ];

  for (const s of servicesData) {
    const svc = await prisma.service.create({ data: { slug: s.slug, icon: s.icon, order: s.order, isActive: true } });
    for (const [lang, tr] of Object.entries({ ru: s.ru, en: s.en })) {
      await prisma.serviceTranslation.create({ data: { serviceId: svc.id, language: lang, ...tr } });
    }
  }
  console.log('✓ Services');

  // Statistics
  await prisma.statisticTranslation.deleteMany();
  await prisma.statistic.deleteMany();
  for (const [, stat] of [
    { number: '500', suffix: '+', order: 0, ru: 'Успешных дел', en: 'Successful cases' },
    { number: '10', suffix: '+', order: 1, ru: 'Лет опыта', en: 'Years of experience' },
    { number: '15', suffix: '', order: 2, ru: 'Опытных юристов', en: 'Experienced lawyers' },
    { number: '98', suffix: '%', order: 3, ru: 'Довольных клиентов', en: 'Satisfied clients' },
  ].entries()) {
    const s = await prisma.statistic.create({ data: { number: stat.number, suffix: stat.suffix, order: stat.order, isActive: true } });
    await prisma.statisticTranslation.create({ data: { statisticId: s.id, language: 'ru', label: stat.ru } });
    await prisma.statisticTranslation.create({ data: { statisticId: s.id, language: 'en', label: stat.en } });
  }
  console.log('✓ Statistics');

  // Team Members
  await prisma.teamMemberTranslation.deleteMany();
  await prisma.teamMember.deleteMany();
  const teamData = [
    {
      slug: 'tatevik-malkhasyan', imageUrl: '/images/team/team1.jpg', licenseNumber: '№ 1234', order: 0,
      ru: { name: 'Татевик Малхасян', position: 'Директор компании, Адвокат', bio: JSON.stringify(['Татевик Малхасян является адвокатом в юридической фирме «NEW LEX». Она специализируется как в уголовном, так и в корпоративном праве, в частности, оказывает юридическую поддержку при регистрации коммерческих компаний, фондов и некоммерческих организаций.', 'Её профессиональный опыт в юридической фирме «NEW LEX» начался в 2015 году. Ранее она имела опыт работы в частных и государственных учреждениях.', 'В 2009 году она с отличием окончила юридический факультет Ереванского государственного университета. Впоследствии получила степень магистра права.', 'Владеет армянским, русским и английским языками.']) },
      en: { name: 'Tatevik Malkhasyan', position: 'Company Director, Lawyer', bio: JSON.stringify(['Tatevik Malkhasyan is a lawyer at NEW LEX Law Firm. She specializes in both criminal and corporate law.', 'She graduated from the Yerevan State University Faculty of Law in 2009 with honors.', 'She speaks Armenian, Russian, and English.']) },
    },
    {
      slug: 'andranik-mnatsakanyan', imageUrl: '/images/team/team2.jpg', licenseNumber: '№ 2345', order: 1,
      ru: { name: 'Андраник Мнацаканян', position: 'Партнер, Адвокат', bio: JSON.stringify(['Андраник Мнацаканян является партнером и адвокатом в юридической фирме «NEW LEX». Он специализируется в области гражданского и коммерческого права.', 'Его профессиональный опыт включает работу над сложными коммерческими спорами, сделками с недвижимостью и корпоративными реструктуризациями.', 'Владеет армянским, русским и английским языками.']) },
      en: { name: 'Andranik Mnatsakanyan', position: 'Partner, Lawyer', bio: JSON.stringify(['Andranik Mnatsakanyan is a partner and lawyer at NEW LEX Law Firm. He specializes in civil and commercial law.', 'He speaks Armenian, Russian, and English.']) },
    },
    {
      slug: 'gurgen-nersisyan', imageUrl: '/images/team/team3.jpg', licenseNumber: '№ 3456', order: 2,
      ru: { name: 'Гурген Нерсисян', position: 'Партнер, Адвокат', bio: JSON.stringify(['Гурген Нерсисян является партнером и адвокатом в юридической фирме «NEW LEX». Он специализируется в области уголовного права и защиты прав человека.', 'Владеет армянским, русским, английским и французским языками.']) },
      en: { name: 'Gurgen Nersisyan', position: 'Partner, Lawyer', bio: JSON.stringify(['Gurgen Nersisyan is a partner and lawyer at NEW LEX Law Firm. He specializes in criminal law and human rights.', 'He speaks Armenian, Russian, English, and French.']) },
    },
    {
      slug: 'edgar-ayvazyan', imageUrl: '/images/team/team1.jpg', licenseNumber: '№ 4567', order: 3,
      ru: { name: 'Эдгар Айвазян', position: 'Партнер, Адвокат', bio: JSON.stringify(['Эдгар Айвазян является партнером и адвокатом в юридической фирме «NEW LEX». Он специализируется в области налогового и финансового права.', 'Владеет армянским, русским и английским языками.']) },
      en: { name: 'Edgar Ayvazyan', position: 'Partner, Lawyer', bio: JSON.stringify(['Edgar Ayvazyan is a partner and lawyer at NEW LEX Law Firm. He specializes in tax and financial law.', 'He speaks Armenian, Russian, and English.']) },
    },
    {
      slug: 'arsen-sardaryan', imageUrl: '/images/team/team2.jpg', licenseNumber: '№ 5678', order: 4,
      ru: { name: 'Арсен Сардарян', position: 'Управляющий партнер', bio: JSON.stringify(['Арсен Сардарян является управляющим партнером юридической фирмы «NEW LEX». Он отвечает за стратегическое развитие компании и управление ключевыми проектами.', 'Владеет армянским, русским и английским языками.']) },
      en: { name: 'Arsen Sardaryan', position: 'Managing Partner', bio: JSON.stringify(['Arsen Sardaryan is the managing partner of NEW LEX Law Firm. He is responsible for the strategic development of the company.', 'He speaks Armenian, Russian, and English.']) },
    },
    {
      slug: 'susanna-pambukchyan', imageUrl: '/images/team/team3.jpg', licenseNumber: '№ 6789', order: 5,
      ru: { name: 'Сусанна Памбукчян', position: 'Главный бухгалтер', bio: JSON.stringify(['Сусанна Памбукчян является главным бухгалтером юридической фирмы «NEW LEX». Она отвечает за финансовый учет и отчетность компании.', 'Владеет армянским, русским и английским языками.']) },
      en: { name: 'Susanna Pambukchyan', position: 'Chief Accountant', bio: JSON.stringify(['Susanna Pambukchyan is the chief accountant of NEW LEX Law Firm. She is responsible for financial accounting and reporting.', 'She speaks Armenian, Russian, and English.']) },
    },
  ];

  for (const m of teamData) {
    const member = await prisma.teamMember.create({ data: { slug: m.slug, imageUrl: m.imageUrl, licenseNumber: m.licenseNumber, order: m.order, isActive: true } });
    for (const [lang, tr] of Object.entries({ ru: m.ru, en: m.en })) {
      await prisma.teamMemberTranslation.create({ data: { teamMemberId: member.id, language: lang, ...tr } });
    }
  }
  console.log('✓ Team members');

  // About Tabs
  await prisma.aboutTabTranslation.deleteMany();
  await prisma.aboutTab.deleteMany();
  for (const tab of [
    { tabKey: 'mission', order: 0, ru: { label: 'Наша миссия', content: 'Наша миссия — обеспечить надежную юридическую защиту и поддержку каждому клиенту. Мы стремимся к справедливости и защите прав, используя наш опыт и профессионализм для достижения наилучших результатов.' }, en: { label: 'Our Mission', content: 'Our mission is to provide reliable legal protection and support to every client. We strive for justice using our experience and professionalism.' } },
    { tabKey: 'vision', order: 1, ru: { label: 'Наше видение', content: 'Мы видим себя ведущей юридической компанией в Армении, известной своей честностью, профессионализмом и преданностью интересам клиентов. Наша цель — устанавливать новые стандарты качества юридических услуг.' }, en: { label: 'Our Vision', content: 'We see ourselves as the leading law firm in Armenia, known for our integrity, professionalism, and dedication to clients.' } },
    { tabKey: 'values', order: 2, ru: { label: 'Наши ценности', content: 'Честность, профессионализм и преданность — основа нашей работы. Мы верим в индивидуальный подход к каждому делу и строим долгосрочные отношения с клиентами, основанные на доверии и взаимном уважении.' }, en: { label: 'Our Values', content: 'Integrity, professionalism, and dedication are the foundation of our work. We believe in an individual approach to each case.' } },
  ]) {
    const t = await prisma.aboutTab.create({ data: { tabKey: tab.tabKey, order: tab.order } });
    for (const [lang, tr] of Object.entries({ ru: tab.ru, en: tab.en })) {
      await prisma.aboutTabTranslation.create({ data: { tabId: t.id, language: lang, ...tr } });
    }
  }
  console.log('✓ About tabs');

  // Process Steps
  await prisma.processStepTranslation.deleteMany();
  await prisma.processStep.deleteMany();
  for (const step of [
    { stepNumber: 1, order: 0, ru: { title: 'Первичная консультация и оценка', description: 'Мы анализируем вашу ситуацию, изучаем документы и определяем оптимальную стратегию для вашего дела.' }, en: { title: 'Initial Consultation & Assessment', description: 'We analyze your situation, review documents, and determine the optimal strategy for your case.' } },
    { stepNumber: 2, order: 1, ru: { title: 'Разработка правовой стратегии', description: 'Наши юристы разрабатывают комплексный план действий, подготавливают необходимые документы и согласовывают их с вами.' }, en: { title: 'Legal Strategy Development', description: 'Our lawyers develop a comprehensive action plan, prepare necessary documents, and coordinate with you.' } },
    { stepNumber: 3, order: 2, ru: { title: 'Представительство и разрешение', description: 'Мы представляем ваши интересы в суде и государственных органах, при необходимости ведем переговоры для достижения наилучшего результата.' }, en: { title: 'Representation & Resolution', description: 'We represent your interests in court and government agencies, conducting negotiations when needed.' } },
  ]) {
    const s = await prisma.processStep.create({ data: { stepNumber: step.stepNumber, order: step.order } });
    for (const [lang, tr] of Object.entries({ ru: step.ru, en: step.en })) {
      await prisma.processStepTranslation.create({ data: { stepId: s.id, language: lang, ...tr } });
    }
  }
  console.log('✓ Process steps');

  // Practice Areas
  await prisma.practiceAreaTranslation.deleteMany();
  await prisma.practiceArea.deleteMany();
  for (const area of [
    { icon: '⚖️', order: 0, ru: { title: 'Уголовное право', description: 'Защита обвиняемых, представление интересов истца, защита свидетелей.' }, en: { title: 'Criminal Law', description: 'Defense of the accused, victim representation, witness protection.' } },
    { icon: '🛡️', order: 1, ru: { title: 'Гражданское право', description: 'Имущественные споры, договорные отношения, возмещение ущерба.' }, en: { title: 'Civil Law', description: 'Property disputes, contractual relations, damage compensation.' } },
    { icon: '👨‍👩‍👧‍👦', order: 2, ru: { title: 'Семейное право', description: 'Бракоразводные процессы, алименты, опека над детьми.' }, en: { title: 'Family Law', description: 'Divorce proceedings, alimony, child custody.' } },
    { icon: '💼', order: 3, ru: { title: 'Трудовое право', description: 'Трудовые споры, защита прав работников и работодателей.' }, en: { title: 'Labor Law', description: 'Labor disputes, protection of employee and employer rights.' } },
    { icon: '🏠', order: 4, ru: { title: 'Недвижимость', description: 'Сделки с недвижимостью, аренда, земельные споры.' }, en: { title: 'Real Estate', description: 'Real estate transactions, leases, land disputes.' } },
    { icon: '🏢', order: 5, ru: { title: 'Корпоративное право', description: 'Регистрация компаний, договоры, слияния и поглощения.' }, en: { title: 'Corporate Law', description: 'Company registration, contracts, mergers and acquisitions.' } },
  ]) {
    const a = await prisma.practiceArea.create({ data: { icon: area.icon, order: area.order } });
    for (const [lang, tr] of Object.entries({ ru: area.ru, en: area.en })) {
      await prisma.practiceAreaTranslation.create({ data: { practiceAreaId: a.id, language: lang, ...tr } });
    }
  }
  console.log('✓ Practice areas');

  // Contact Info
  await prisma.contactInfoTranslation.deleteMany();
  await prisma.contactInfo.deleteMany();
  for (const item of [
    { type: 'address', value: 'ул. Туманяна 8, Ереван, Армения', icon: '📍', link: '', order: 0, ru: 'Адрес', en: 'Address' },
    { type: 'phone', value: '+374 (96) 374 374', icon: '📞', link: 'tel:+37496374374', order: 1, ru: 'Телефон', en: 'Phone' },
    { type: 'email', value: 'info@lsa.am', icon: '📧', link: 'mailto:info@lsa.am', order: 2, ru: 'Эл. почта', en: 'Email' },
    { type: 'hours', value: 'Пн-Пт: 09:00–18:00', icon: '🕐', link: '', order: 3, ru: 'Часы работы', en: 'Working Hours' },
  ]) {
    const c = await prisma.contactInfo.create({ data: { type: item.type, value: item.value, icon: item.icon, link: item.link, order: item.order, isActive: true } });
    await prisma.contactInfoTranslation.create({ data: { contactInfoId: c.id, language: 'ru', label: item.ru } });
    await prisma.contactInfoTranslation.create({ data: { contactInfoId: c.id, language: 'en', label: item.en } });
  }
  console.log('✓ Contact info');

  // Site Settings
  const settingsList = [
    { key: 'site_name', value: 'NEW LEX Law Firm', ru: 'NEW LEX Юридическая фирма', en: 'NEW LEX Law Firm' },
    { key: 'site_description', value: 'Юридические услуги в Армении', ru: 'Юридические услуги в Армении', en: 'Legal services in Armenia' },
    { key: 'phone', value: '+374 (96) 374 374', ru: '', en: '' },
    { key: 'email', value: 'info@lsa.am', ru: '', en: '' },
    { key: 'address', value: 'ул. Туманяна 8, Ереван, Армения', ru: 'ул. Туманяна 8, Ереван, Армения', en: '8 Tumanyan St., Yerevan, Armenia' },
    { key: 'copyright', value: '© 2024 NEW LEX Law Firm. Все права защищены.', ru: '© 2024 NEW LEX Law Firm. Все права защищены.', en: '© 2024 NEW LEX Law Firm. All rights reserved.' },
    { key: 'working_hours', value: 'Пн-Пт: 09:00–18:00', ru: 'Пн-Пт: 09:00–18:00', en: 'Mon-Fri: 09:00–18:00' },
    { key: 'footer_description', value: 'Адвокатская контора «NEW LEX» уже более 10 лет оказывает высококачественные юридические и бухгалтерские услуги в городе Ереван.', ru: 'Адвокатская контора «NEW LEX» уже более 10 лет оказывает высококачественные юридические и бухгалтерские услуги в городе Ереван.', en: 'NEW LEX Law Firm has been providing high-quality legal and accounting services in Yerevan for over 10 years.' },
    { key: 'footer_title_services', value: 'Услуги', ru: 'Услуги', en: 'Services' },
    { key: 'footer_title_company',  value: 'Компания', ru: 'Компания', en: 'Company' },
    { key: 'footer_title_contacts', value: 'Контакты', ru: 'Контакты', en: 'Contacts' },
    { key: 'social_facebook', value: '', ru: '', en: '' },
    { key: 'social_instagram', value: '', ru: '', en: '' },
    { key: 'social_linkedin', value: '', ru: '', en: '' },
    { key: 'social_youtube', value: '', ru: '', en: '' },
  ];
  for (const s of settingsList) {
    const setting = await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
    if (s.ru) {
      await prisma.siteSettingTranslation.upsert({
        where: { settingId_language: { settingId: setting.id, language: 'ru' } },
        update: { value: s.ru },
        create: { settingId: setting.id, language: 'ru', value: s.ru },
      });
    }
    if (s.en) {
      await prisma.siteSettingTranslation.upsert({
        where: { settingId_language: { settingId: setting.id, language: 'en' } },
        update: { value: s.en },
        create: { settingId: setting.id, language: 'en', value: s.en },
      });
    }
  }
  console.log('✓ Site settings');

  // Menu Items
  await prisma.menuItemTranslation.deleteMany();
  await prisma.menuItem.deleteMany();
  const menuItems = [
    { href: '/', order: 0, ru: 'Главная', en: 'Home' },
    { href: '/services', order: 1, ru: 'Услуги', en: 'Services' },
    { href: '/team', order: 2, ru: 'Команда', en: 'Team' },
    { href: '/cases', order: 3, ru: 'Дела', en: 'Cases' },
    { href: '/blog', order: 4, ru: 'Блог', en: 'Blog' },
    { href: '/about', order: 5, ru: 'О нас', en: 'About' },
    { href: '/contact', order: 6, ru: 'Контакты', en: 'Contacts' },
  ];
  for (const item of menuItems) {
    const m = await prisma.menuItem.create({ data: { href: item.href, order: item.order, isActive: true } });
    await prisma.menuItemTranslation.create({ data: { menuItemId: m.id, language: 'ru', title: item.ru } });
    await prisma.menuItemTranslation.create({ data: { menuItemId: m.id, language: 'en', title: item.en } });
  }
  console.log('✓ Menu items');

  console.log('\n✅ Seed completed!');
  console.log('📧 Admin: admin@lsa.am / admin123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
