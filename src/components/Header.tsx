'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import '@/styles/header.css';

const menuItems = [
    {title: 'Главная', href: '/'},
    {
        title: 'Услуги',
        href: '/services',
        submenu: [
            {title: 'Уголовное право', href: '/services/criminal'},
            {title: 'Гражданское право', href: '/services/civil'},
            {title: 'Административное право', href: '/services/administrative'},
            {title: 'Бухгалтерия', href: '/services/accounting'},
            {title: 'Корпоративное право', href: '/services/corporate'},
            {title: 'Инвестиции', href: '/services/investment'},
        ]
    },
    {title: 'Команда', href: '/team'},
    {title: 'Дела', href: '/cases'},
    {title: 'Блог', href: '/blog'},
    {title: 'О нас', href: '/about'},
    {title: 'Контакты', href: '/contact'},
];

const languages = [
    {code: 'ru', name: 'Русский', flag: '🇷🇺'},
    {code: 'en', name: 'English', flag: '🇺🇸'},
    {code: 'hy', name: 'Армянский', flag: '🇦🇲'},
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
    const [currentLang, setCurrentLang] = useState(languages[0]);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="header-inner">
                    {/* Logo */}
                    <Link href="/" className="logo">
                        <div className="logo-text">
                            <span className="logo-gold">LSA</span>
                            <span className={isScrolled ? 'logo-dark' : 'logo-light'}> Legal</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="nav-desktop">
                        {menuItems.map((item) => (
                            <div
                                key={item.href}
                                className="nav-item"
                                onMouseEnter={() => item.submenu && setActiveSubmenu(item.href)}
                                onMouseLeave={() => setActiveSubmenu(null)}
                            >
                                {item.submenu ? (
                                    <Link
                                        href={item.href}
                                        className={`nav-link nav-link-btn ${isScrolled ? 'dark' : 'light'} ${isActive(item.href) ? 'active' : ''}`}
                                    >
                                        {item.title}
                                        <span className={`nav-arrow ${activeSubmenu === item.href ? 'open' : ''}`}>▼</span>
                                    </Link>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`nav-link ${isScrolled ? 'dark' : 'light'} ${isActive(item.href) ? 'active' : ''}`}
                                    >
                                        {item.title}
                                    </Link>
                                )}

                                {item.submenu && activeSubmenu === item.href && (
                                    <div className="dropdown">
                                        {item.submenu.map((subItem) => (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                className="dropdown-link"
                                            >
                                                {subItem.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Language Switcher */}
                        <div className="lang-switcher">
                            <button
                                className={`lang-btn ${isScrolled ? 'dark' : 'light'}`}
                                onClick={() => setIsLangOpen(!isLangOpen)}
                            >
                                <span>{currentLang.flag}</span>
                                <span className="lang-arrow">▼</span>
                            </button>

                            {isLangOpen && (
                                <div className="lang-dropdown">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setCurrentLang(lang);
                                                setIsLangOpen(false);
                                            }}
                                            className="lang-option"
                                        >
                                            <span>{lang.flag}</span>
                                            <span>{lang.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Contact Info */}
                    <div className="header-contact">
                        <div className="phone-icon">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="phone-number">+374 (96) 374 374</p>
                            <p className={`phone-email ${isScrolled ? '' : 'light'}`}>info@lsa.am</p>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className="menu-btn-inner">
                            <span className={`menu-btn-line ${isScrolled ? 'dark' : ''}`}></span>
                            <span className={`menu-btn-line ${isScrolled ? 'dark' : ''}`}></span>
                            <span className={`menu-btn-line ${isScrolled ? 'dark' : ''}`}></span>
                        </div>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                    <nav>
                        {menuItems.map((item) => (
                            <div key={item.href}>
                                {item.submenu ? (
                                    <div className="mobile-nav-item-with-submenu">
                                        <Link
                                            href={item.href}
                                            className={`mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.title}
                                        </Link>
                                        <button
                                            className="mobile-submenu-toggle"
                                            onClick={() => setMobileSubmenu(mobileSubmenu === item.href ? null : item.href)}
                                        >
                                            <span className={`mobile-arrow ${mobileSubmenu === item.href ? 'open' : ''}`}>▼</span>
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.title}
                                    </Link>
                                )}
                                {item.submenu && mobileSubmenu === item.href && (
                                    <div className="mobile-submenu">
                                        {item.submenu.map((subItem) => (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                className="mobile-submenu-link"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {subItem.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}
