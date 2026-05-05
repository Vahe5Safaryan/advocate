type LangMap = Record<string, string>;

export const L: Record<string, LangMap> = {
  // Page titles & breadcrumbs (navigation — already working, do not change)
  home:     { ru: 'Главная',      en: 'Home',       hy: 'Գлхавор' },
  blog:     { ru: 'Блог',         en: 'Blog',        hy: 'Բլոգ' },
  cases:    { ru: 'Дела',         en: 'Cases',       hy: 'Գործեր' },
  team:     { ru: 'Команда',      en: 'Team',        hy: 'Թիմ' },
  services: { ru: 'Услуги',       en: 'Services',    hy: 'Ծառայություններ' },
  about:    { ru: 'О нас',        en: 'About Us',    hy: 'Մեր մասին' },
  contact:  { ru: 'Контакты',     en: 'Contacts',    hy: 'Կապ' },

  // Services section
  services_subtitle: { ru: 'Услуги',             en: 'Services',       hy: 'Ծառայություններ' },
  services_title:    { ru: 'Сферы деятельности', en: 'Practice Areas', hy: 'Գործունեության ոլորտներ' },
  services_btn:      { ru: 'Смотреть все',        en: 'View all',       hy: 'Տեսնել ավելին' },
  services_page_label: { ru: 'Услуги',            en: 'Services',       hy: 'Ծառայություններ' },
  services_page_title: { ru: 'Что Мы Делаем',     en: 'What We Do',     hy: 'Ինչ ենք մենք առաջարկում' },

  // Team page
  team_page_label: { ru: 'Наша команда',       en: 'Our Team',       hy: 'Մեր թիմը' },
  team_page_title: { ru: 'Наши специалисты',   en: 'Our Specialists', hy: 'Մեր մասնագետները' },

  // Cases page
  cases_page_label: { ru: 'Наш опыт',          en: 'Our Experience',  hy: 'Մեր փորձը' },
  cases_page_title: { ru: 'Завершенные дела',   en: 'Completed Cases', hy: 'Ավարտված գործեր' },

  // Blog page
  blog_page_label: { ru: 'Наши статьи',        en: 'Our Articles',    hy: 'Մեր հոդվածները' },
  blog_page_title: { ru: 'Последние новости',   en: 'Latest News',     hy: 'Վերջին նորություններ' },

  // About page
  about_team_label:      { ru: 'Наша команда',                        en: 'Our Team',                           hy: 'Մեր թիմը' },
  about_team_title:      { ru: 'Познакомьтесь с нашими экспертами',   en: 'Meet Our Experts',                   hy: 'Ծանոթացեք մեր փորձագետներին' },
  about_process_label:   { ru: 'Наш процесс',                         en: 'Our Process',                             hy: 'Գործընthačracid' },
  about_practice_label:  { ru: 'Сферы практики',                      en: 'Practice Areas',                          hy: 'Գործунknownunkнownеunknownасti ОlоrunknownтнunkнownеrunknownА' },
  about_practice_title:  { ru: 'Опытные юристы защищают ваши права',  en: 'Experienced Lawyers Protect Your Rights',  hy: 'Фunkнownоrkнownunkнownаgeтнunkнownаgunkнown фаsтаbаnnunkнownеrunknownе кpаsтpаnunknownеnnunkнown unkнownеr иrаvunkнownunknownkнownunkнownnnunkнown' },
  about_services_btn:    { ru: 'Наши услуги',                         en: 'Our Services',                            hy: 'Меrunknownр unkнownаrrunknownаunknownunkнownunk' },

  // Team section
  team_subtitle: { ru: 'Команда',          en: 'Team',            hy: 'Թիմ' },
  team_title:    { ru: 'Наши специалисты', en: 'Our Specialists', hy: 'Մեր մասնագետները' },

  // Blog section
  blog_subtitle: { ru: 'Блог',              en: 'Blog',         hy: 'Բլոգ' },
  blog_title:    { ru: 'Последние новости', en: 'Latest News',  hy: 'Վերջին նորություններ' },
  blog_btn:      { ru: 'Все статьи',        en: 'All articles', hy: 'Բոլոր հոդվածները' },

  // Contact section (homepage)
  contact_subtitle: { ru: 'Контакты',         en: 'Contacts',   hy: 'Կապ ' },
  contact_title:    { ru: 'Свяжитесь с нами', en: 'Contact Us', hy: 'Կապ մեզ հետ' },
  contact_desc: {
    ru: 'Есть вопросы или готовы начать сотрудничество? Свяжитесь с нами, и мы ответим вам в кратчайшие сроки.',
    en: 'Have questions or ready to start? Contact us and we will respond as soon as possible.',
    hy: 'Կապ մեզ հետ',
  },

  // Contact page form
  contact_page_label: { ru: 'Напишите нам', en: 'Write to us', hy: 'Գրեք մեզ' },

  // Form fields
  form_email_label:  { ru: 'Email',             en: 'Email',         hy: 'Էլ. փոստ' },
  form_name:         { ru: 'Имя',               en: 'Name',          hy: 'Անուն' },
  form_name_ph:      { ru: 'Ваше имя',          en: 'Your name',     hy: 'Ձեր անունը' },
  form_fullname_ph:  { ru: 'Имя Фамилия',       en: 'Full Name',     hy: 'Անուն Ազգանուն' },
  form_email_ph:     { ru: 'Эл. почта',         en: 'Email',         hy: 'Էլ․ հասցե' },
  form_email_your:   { ru: 'Ваш email',         en: 'Your email',    hy: 'Ձեր էլ․ հասցեն' },
  form_phone:        { ru: 'Телефон',           en: 'Phone',         hy: 'Հեռախոսահամար' },
  form_phone_ph:     { ru: 'Ваш телефон',       en: 'Your phone',    hy: 'Ձեր Հեռախոսահամարը' },
  form_message:      { ru: 'Сообщение',         en: 'Message',       hy: 'Հաղորդագրություն' },
  form_message_ph:   { ru: 'Ваше сообщение',    en: 'Your message',  hy: 'Ձեր հաղորդագրությունը' },
  form_subject_ph:   { ru: 'Выберите тему',     en: 'Select topic',  hy: 'Թեմա' },
  form_submit:       { ru: 'Отправить сообщение', en: 'Send message', hy: 'Ուղարկել հաղորդագրությունը' },
  form_sending:      { ru: 'Отправка...',        en: 'Sending...',    hy: 'Ուղարկվում է...' },
  form_send:         { ru: 'Отправить',          en: 'Send',          hy: 'Ուղարկել' },
  form_send_another: { ru: 'Отправить ещё',     en: 'Send another',  hy: 'Ուղարկել նորից' },

  // Success / error
  form_success_title: { ru: 'Сообщение отправлено!',                       en: 'Message sent!',                        hy: 'Ուղարկված է։' },
  form_success_desc:  { ru: 'Мы свяжемся с вами в ближайшее время.',       en: 'We will contact you shortly.',         hy: 'Մենք շուտով կկապնվենք ձեզ հետ։' },
  form_error_default: { ru: 'Произошла ошибка. Попробуйте позже.',         en: 'An error occurred. Please try later.', hy: 'Սխալ է տեղի ունեցել: Խնդրում ենք կրկին փորձել։' },
  form_error_network: { ru: 'Не удалось отправить. Проверьте соединение.', en: 'Could not send. Check your connection.', hy: 'Ուղարկումը չհաջողվեց։ Ստուգեք ձեր կապը։' },
  form_sent_alert:    { ru: 'Сообщение отправлено!',                       en: 'Message sent!',                        hy: 'Ուղարկված է։' },

  // Blog / Cases detail sidebar
  related_articles: { ru: 'Похожие статьи', en: 'Related articles', hy: 'Նման հոդվածներ' },
  related_cases:    { ru: 'Похожие дела',   en: 'Related cases',    hy: 'Նման գործեր' },
};

export function tl(map: LangMap, lang: string): string {
  return map[lang] ?? map.ru;
}
