'use client';

import React, { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import './AdminLoginForm.css';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

export default function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
  const t = useTranslations('AdminLogin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

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
    } catch (err: any) {
      setError(t('err_conn'));
    } finally {
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

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error-alert" role="alert">
              ⚠️ {error}
            </div>
          )}

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
