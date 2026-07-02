'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '../i18n/routing';
import './CookieBanner.css';

export default function CookieBanner() {
  const t = useTranslations('CookieBanner');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/rejected cookies using document.cookie
    const consent = document.cookie.split('; ').find(row => row.startsWith('tailor_cookie_consent='));
    
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    document.cookie = "tailor_cookie_consent=all; path=/; max-age=31536000"; // 1 año
    setShowBanner(false);
  };

  const handleReject = () => {
    document.cookie = "tailor_cookie_consent=essential; path=/; max-age=31536000"; // 1 año
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div 
          className="cookie-banner-overlay"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="cookie-banner-container">
            <div className="cookie-banner-content">
              <span className="cookie-icon" aria-hidden="true">🍪</span>
              <p className="cookie-text">
                {t('text')}
                <Link href="/cookies" className="cookie-link">
                  {t('link')}
                </Link>
              </p>
            </div>
            <div className="cookie-banner-actions">
              <button className="btn-secondary cookie-btn-reject" onClick={handleReject}>
                {t('reject')}
              </button>
              <button className="btn-primary cookie-btn-accept" onClick={handleAccept}>
                {t('accept')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
