'use client';

import React, { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import './AdminLoginForm.css';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

export default function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
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
          ? 'Credenciales inválidas. Verifica tu correo y contraseña.' 
          : authError.message
        );
      } else if (data.session) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">TS</div>
          <h2>Área Administrativa</h2>
          <p>Ingresa tus credenciales de Supabase para acceder al panel seguro de Tailor Servicios.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error-alert" role="alert">
              ⚠️ {error}
            </div>
          )}

          <div className="login-input-group">
            <label htmlFor="admin-email">Correo Electrónico</label>
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
            <label htmlFor="admin-password">Contraseña</label>
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
            {loading ? <span className="spinner"></span> : 'Ingresar al Dashboard'}
          </button>
        </form>

        <div className="login-footer">
          <p>Cumplimiento de Privacidad y Auditorías - Ley 21.719</p>
        </div>
      </div>
    </div>
  );
}
