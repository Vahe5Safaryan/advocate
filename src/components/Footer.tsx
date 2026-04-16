'use client';

import Link from 'next/link';
import '@/styles/footer.css';

const footerLinks = {
  services: [
    { title: 'Уголовное право', href: '/services/criminal' },
    { title: 'Гражданское право', href: '/services/civil' },
    { title: 'Административное право', href: '/services/administrative' },
    { title: 'Корпоративное право', href: '/services/corporate' },
    { title: 'Бухгалтерия', href: '/services/accounting' },
  ],
  company: [
    { title: 'О нас', href: '/about' },
    { title: 'Команда', href: '/team' },
    { title: 'Дела', href: '/cases' },
    { title: 'Блог', href: '/blog' },
    { title: 'Контакты', href: '/contact' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: '📘', href: 'https://facebook.com' },
  { name: 'Instagram', icon: '📷', href: 'https://instagram.com' },
  { name: 'LinkedIn', icon: '💼', href: 'https://linkedin.com' },
  { name: 'YouTube', icon: '▶️', href: 'https://youtube.com' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-copyright"></div>
        <div className="footer-grid">
          {/* Company Info */}
          <div>
            <div className="footer-logo">
              <span className="footer-logo-gold">LSA</span>
              <span> Legal</span>
            </div>
            <p className="footer-description">
              Адвокатская контора «LSA» уже более 10 лет оказывает высококачественные юридические и бухгалтерские услуги в городе Ереван.
            </p>
            <div className="footer-social">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  className="footer-social-link"
                >
                  <span className="footer-social-icon">{social.icon}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="footer-title">Услуги</h4>
            <ul className="footer-links">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="footer-title">Компания</h4>
            <ul className="footer-links">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="footer-title">Контакты</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <span className="footer-contact-icon">📍</span>
                <span className="footer-contact-text">Ереван, Армения</span>
              </li>
              <li className="footer-contact-item">
                <span className="footer-contact-icon">📞</span>
                <Link href="tel:+37496374374" className="footer-contact-link">
                  +374 (96) 374 374
                </Link>
              </li>
              <li className="footer-contact-item">
                <span className="footer-contact-icon">✉️</span>
                <Link href="mailto:info@lsa.am" className="footer-contact-link">
                  info@lsa.am
                </Link>
              </li>
              <li className="footer-contact-item">
                <span className="footer-contact-icon">🕐</span>
                <span className="footer-contact-text">Понедельник - Пятница: 09:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p className="footer-copyright-text">
            © {new Date().getFullYear()} LSA Legal. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
