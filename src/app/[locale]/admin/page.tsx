'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminDashboard from '@/components/AdminDashboard';
import AdminLoginForm from '@/components/AdminLoginForm';
import { useTranslations } from 'next-intl';

export default function AdminPage() {
  const t = useTranslations('AdminLogin');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#94a3b8', fontSize: '1.2rem', fontFamily: 'sans-serif' }}>{t('loading')}</div>
      </main>
    );
  }

  if (session) {
    return <AdminDashboard session={session} />;
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1rem' }}>
      <AdminLoginForm onLoginSuccess={() => {}} />
      {process.env.NODE_ENV === 'development' && (
        <button
          type="button"
          onClick={() => setSession({ user: { email: 'dev-local@tailorservicios.cl', role: 'admin' }, access_token: 'dev-token' })}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#94a3b8',
            fontSize: '0.85rem',
            padding: '0.55rem 1.2rem',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          ⚡ Acceso Rápido Local (Entorno de Desarrollo)
        </button>
      )}
    </main>
  );
}
