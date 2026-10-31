'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import './AdminLoginForm.css';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
  initialError?: string;
}

export default function AdminLoginForm({ onLoginSuccess, initialError = '' }: AdminLoginFormProps) {
  const t = useTranslations('AdminLogin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [infoMsg, setInfoMsg] = useState('');

  React.useEffect(() => {
    if (initialError) {
      setError(initialError);
    }
  }, [initialError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');
    setInfoMsg('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message === 'Invalid login credentials'
          ? t('err_invalid')
          : authError.message
        );
      } else if (data.session) {
        onLoginSuccess();
      }
    } catch {
      setError(t('err_conn'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    setInfoMsg('');

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tailorservicios.cl';
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '/admin';
      const cleanPath = pathname.startsWith('/en') ? '/en/admin' : '/admin';

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}${cleanPath}`,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          }
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
      } else {
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err?.message || 'Error al conectar con Google.');
      setLoading(false);
    }
  };

  return (
    <div className="login-card-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">TS</div>
          <h2>{t('title')}</h2>
          <p>{t('desc')}</p>
        </div>

        {error && (
          <div className="login-error-alert" role="alert" style={{ marginBottom: '1.25rem' }}>
            ⚠️ {error}
          </div>
        )}

        {infoMsg && (
          <div
            role="status"
            style={{
              backgroundColor: 'rgba(22, 163, 74, 0.18)',
              border: '1px solid #16a34a',
              color: '#bbf7d0',
              padding: '0.75rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}
          >
            ✅ {infoMsg}
          </div>
        )}

        <button 
          type="button" 
          onClick={handleGoogleLogin} 
          className="google-login-btn"
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>{loading ? 'Conectando con Google...' : 'Continuar con Google'}</span>
        </button>

        <div className="login-divider">
          <span>O ingresa con correo autorizado</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label htmlFor="admin-email">{t('email_label')}</label>
            <input
              type="email"
              id="admin-email"
              placeholder="admin@tailorservicios.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="login-input-group">
            <label htmlFor="admin-password">{t('password_label')}</label>
            <input
              type="password"
              id="admin-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className={`login-submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? <span className="spinner"></span> : t('btn_submit')}
          </button>
        </form>

        <div className="login-footer">
          <p>{t('footer_notice')}</p>
        </div>
      </div>
    </div>
  );
}
