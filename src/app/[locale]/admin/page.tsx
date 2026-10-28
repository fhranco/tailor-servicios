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
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const verifyAndSetSession = async (currentSession: any) => {
      if (!currentSession) {
        if (isMounted) {
          setSession(null);
          setLoading(false);
        }
        return;
      }

      if (currentSession.access_token === 'dev-token') {
        if (isMounted) {
          setAuthError('');
          setSession(currentSession);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch('/api/admin/blog', {
          headers: {
            Authorization: `Bearer ${currentSession.access_token}`
          }
        });

        if (res.status === 401 || res.status === 403) {
          await supabase.auth.signOut();
          if (isMounted) {
            setSession(null);
            setAuthError(
              `Acceso denegado: la cuenta ${currentSession.user?.email || 'autenticada'} no cuenta con permisos administrativos autorizados en Tailor Servicios.`
            );
            setLoading(false);
          }
          return;
        }
      } catch (err) {
        console.warn('[AdminPage] No se pudo verificar autorización inicial:', err);
      }

      if (isMounted) {
        setAuthError('');
        setSession(currentSession);
        setLoading(false);
      }
    };

    // 1. Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      verifyAndSetSession(session);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      verifyAndSetSession(nextSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
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
      <AdminLoginForm onLoginSuccess={() => {}} initialError={authError} />
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
