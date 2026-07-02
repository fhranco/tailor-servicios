"use client";

import React from 'react';
import { Link } from '../i18n/routing';
import './Footer.css';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="global-footer">
      <div className="fluid-container">
        <div className="footer-grid">
          
          <div className="footer-logo-col">
            <Link href="/">
              <img 
                src="/logo.jpeg" 
                alt="Tailor Servicios Logo" 
              />
            </Link>
            <p>
              {t('desc')}
            </p>
          </div>

          <div className="footer-col">
            <h4>{t('nav')}</h4>
            <ul className="footer-links">
              <li><Link href="/">{t('inicio')}</Link></li>
              <li><Link href="/nosotros">{t('nosotros')}</Link></li>
              <li><Link href="/servicios">{t('servicios')}</Link></li>
              <li><Link href="/contacto">{t('contacto')}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('embudos')}</h4>
            <ul className="footer-links">
              <li><Link href="/empresas">{t('empresas')}</Link></li>
              <li><Link href="/postulantes">{t('postulantes')}</Link></li>
              <li><Link href="/postulantes#carga-cv">{t('subir_cv')}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('oficinas')}</h4>
            <ul className="footer-links">
              <li><span style={{color: '#fff'}}>Punta Arenas</span></li>
              <li>Región de Magallanes</li>
              <li style={{marginTop: '0.5rem'}}><span style={{color: '#fff'}}>Santiago</span></li>
              <li>Región Metropolitana</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('legal')}</h4>
            <ul className="footer-links">
              <li><Link href="/privacidad">{t('privacidad')}</Link></li>
              <li><Link href="/terminos">{t('terminos')}</Link></li>
              <li><Link href="/cookies">{t('cookies')}</Link></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <div className="social-links">
            <a href="https://www.linkedin.com/company/tailor-servicios/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://www.instagram.com/tailorservicios/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.facebook.com/tailorservi" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
          </div>
          <div>
            © {currentYear} {t('derechos')}
          </div>
        </div>
      </div>
    </footer>
  );
}
