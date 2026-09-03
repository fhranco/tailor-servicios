"use client";

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '../i18n/routing';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Header');

  // Handle Scroll state for glassmorphism and sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  return (
    <>
      {/* Top Meta Navigation (Hides on scroll for a cleaner sticky header) */}
      <div className={`meta-header ${isScrolled ? 'meta-hidden' : ''}`}>
        <div className="fluid-container meta-container">
          <div className="meta-left">
            <a 
              href="https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="meta-link"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {t('sube_cv')}
            </a>
            <div className="meta-divider"></div>
            <Link href="/empresas" className="meta-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              {t('buscas_contratar')}
            </Link>
          </div>
          <div className="meta-social">
            <a href="https://www.linkedin.com/company/tailor-servicios/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://www.instagram.com/tailorservicios/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.facebook.com/tailorservi" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className={`main-header light-theme ${isScrolled ? 'scrolled-glass' : ''}`}>
        <div className="fluid-container nav-container">
          <Link href="/" className="logo-link">
            <img 
              src="/tailor-logo-official.png" 
              alt="Tailor Servicios" 
              className="logo-img"
            />
          </Link>

          <button 
            className="mobile-menu-btn"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>

          <nav className={`nav-content ${isMenuOpen ? 'open' : ''}`}>
            <ul className="nav-links">
              <li><Link href="/" className="nav-item">{t('inicio')}</Link></li>
              <li><Link href="/nosotros" className="nav-item">{t('nosotros')}</Link></li>
              <li><Link href="/servicios" className="nav-item">{t('servicios')}</Link></li>
              <li><Link href="/candidatos" className="nav-item">{t('candidatos')}</Link></li>
              <li><Link href="/blog" className="nav-item">{t('blog')}</Link></li>
              <li>
                <Link href="/contacto" className="btn-contact-nav">
                  {t('contacto')}
                </Link>
              </li>
              <li className="mobile-only-account">
                <Link href="/admin" className="nav-item">
                  {t('mi_cuenta')}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop Account icon (moved outside the main ul for better layout) */}
          <div className="desktop-actions">
            <Link href="/admin" className="account-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </Link>
          </div>

        </div>
      </header>
    </>
  );
}
