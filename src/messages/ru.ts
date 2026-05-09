/** Russian UI strings — source of truth for `MessageKey`. */
export const ruMessages = {
  // Navigation
  home: 'Главная',
  blog: 'Блог',
  cases: 'Дела',
  team: 'Команда',
  services: 'Услуги',
  about: 'О нас',
  contact: 'Контакты',

  services_subtitle: 'Услуги',
  services_title: 'Сферы деятельности',
  services_btn: 'Смотреть все',
  services_page_label: 'Услуги',
  services_page_title: 'Что Мы Делаем',

  team_page_label: 'Наша команда',
  team_page_title: 'Наши специалисты',

  cases_page_label: 'Наш опыт',
  cases_page_title: 'Завершенные дела',

  blog_page_label: 'Наши статьи',
  blog_page_title: 'Последние новости',

  about_team_label: 'Наша команда',
  about_team_title: 'Познакомьтесь с нашими экспертами',
  about_process_label: 'Наш процесс',
  about_practice_label: 'Сферы практики',
  about_practice_title: 'Опытные юристы защищают ваши права',
  about_services_btn: 'Наши услуги',

  team_subtitle: 'Команда',
  team_title: 'Наши специалисты',

  blog_subtitle: 'Блог',
  blog_title: 'Последние новости',
  blog_btn: 'Все статьи',

  contact_subtitle: 'Контакты',
  contact_title: 'Свяжитесь с нами',
  contact_desc:
    'Есть вопросы или готовы начать сотрудничество? Свяжитесь с нами, и мы ответим вам в кратчайшие сроки.',

  contact_page_label: 'Напишите нам',

  form_email_label: 'Email',
  form_name: 'Имя',
  form_name_ph: 'Ваше имя',
  form_fullname_ph: 'Имя Фамилия',
  form_email_ph: 'Эл. почта',
  form_email_your: 'Ваш email',
  form_phone: 'Телефон',
  form_phone_ph: 'Ваш телефон',
  form_message: 'Сообщение',
  form_message_ph: 'Ваше сообщение',
  form_subject_ph: 'Выберите тему',
  form_submit: 'Отправить сообщение',
  form_sending: 'Отправка...',
  form_send: 'Отправить',
  form_send_another: 'Отправить ещё',

  form_success_title: 'Сообщение отправлено!',
  form_success_desc: 'Мы свяжемся с вами в ближайшее время.',
  form_error_default: 'Произошла ошибка. Попробуйте позже.',
  form_error_network: 'Не удалось отправить. Проверьте соединение.',
  form_sent_alert: 'Сообщение отправлено!',

  related_articles: 'Похожие статьи',
  related_cases: 'Похожие дела',

  blog_read_more: 'Читать далее',
  cases_read_more: 'Подробнее',

  meta_title: 'NEW LEX Legal | Юридические услуги в Армении',
  meta_description:
    'Высококачественные юридические и бухгалтерские услуги в Ереване и регионах Армении. Адвокатская контора NEW LEX — более 10 лет опыта.',
  meta_keywords:
    'NEW LEX, адвокат, Ереван, Армения, юридические услуги, бухгалтерские услуги, юрист',

  footer_description_default:
    'Адвокатская контора «NEW LEX» уже более 10 лет оказывает высококачественные юридические и бухгалтерские услуги в городе Ереван.',
  footer_copyright_default: '© 2024 NEW LEX Legal. Все права защищены.',
  footer_title_services_default: 'Услуги',
  footer_title_company_default: 'Компания',
  footer_title_contacts_default: 'Контакты',

  about_default_title: 'Высококачественные юридические и бухгалтерские услуги в Армении',
  about_default_description:
    'Адвокатская контора «NEW LEX» уже более 10 лет оказывает высококачественные юридические и бухгалтерские услуги в Ереване и регионах Армении.',
  about_stats_label_default: 'Лет опыта',
  about_feature_1_title: 'Множество успешных дел',
  about_feature_1_desc: 'Наша команда успешно завершила множество дел в различных сферах права',
  about_feature_2_title: 'Профессиональные юристы',
  about_feature_2_desc: 'Опытные адвокаты предоставляют индивидуальные юридические консультации',
  about_feature_3_title: 'Более 10 лет опыта',
  about_feature_3_desc: 'Наш стратегический подход основан на десятилетнем опыте работы',

  hero_fallback_1_subtitle: 'Ваш путь к справедливости начинается здесь',
  hero_fallback_1_title: 'Добро пожаловать в NEW LEX Law Firm',
  hero_fallback_1_desc:
    'Предоставляем исключительные юридические услуги с приверженностью профессионализму и совершенству.',
  hero_fallback_2_subtitle: 'Ваш путь к справедливости начинается здесь',
  hero_fallback_2_title: 'Надёжный партнёр на пути к правосудию',
  hero_fallback_2_desc: 'Мы на вашей стороне, защищаем ваши права и добиваемся справедливости.',
  hero_fallback_3_subtitle: 'Ваш путь к справедливости начинается здесь',
  hero_fallback_3_title: 'Юридическая поддержка для каждого клиента',
  hero_fallback_3_desc:
    'Наша команда разрабатывает индивидуальные решения для ваших уникальных правовых вопросов.',
  hero_call_btn: 'Позвонить',

  stats_fallback_1_label: 'Успешных дел',
  stats_fallback_2_label: 'Лет опыта',
  stats_fallback_3_label: 'Опытных юристов',
  stats_fallback_4_label: 'Довольных клиентов',
} as const;

export type MessageKey = keyof typeof ruMessages;
