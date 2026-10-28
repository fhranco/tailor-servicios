"use client";

import React, { useState, FocusEvent, FormEvent, useEffect, useRef } from 'react';
import './B2B_LeadForm.css';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { trackEvent } from '@/lib/analytics';

interface FormState {
  nombre: { value: string; error: string };
  empresa: { value: string; error: string };
  correo: { value: string; error: string };
  servicio: { value: string; error: string };
  legal: { value: boolean; error: string };
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAFIi14-gxvWeg3z7';

export default function B2B_LeadForm() {
  const t = useTranslations('B2B_LeadForm');
  const [formData, setFormData] = useState<FormState>({
    nombre: { value: '', error: '' },
    empresa: { value: '', error: '' },
    correo: { value: '', error: '' },
    servicio: { value: '', error: '' },
    legal: { value: false, error: '' },
  });

  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Defensas anti-bot en cliente
  const [renderTime] = useState<number>(() => Date.now());
  const [honeypot, setHoneypot] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const [shouldLoadTurnstile, setShouldLoadTurnstile] = useState(false);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const hasTrackedFormStart = useRef(false);

  const handleFormInteraction = () => {
    if (!shouldLoadTurnstile) {
      setShouldLoadTurnstile(true);
    }
    if (!hasTrackedFormStart.current) {
      hasTrackedFormStart.current = true;
      trackEvent('form_start', { form_name: 'b2b_lead_form' });
    }
  };

  useEffect(() => {
    // Si la URL contiene un ancla a contacto o b2b, activar inmediatamente
    if (typeof window !== 'undefined' && (window.location.hash.includes('contacto') || window.location.hash.includes('b2b'))) {
      setShouldLoadTurnstile(true);
      return;
    }

    if (!formRef.current || shouldLoadTurnstile) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setShouldLoadTurnstile(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '300px 0px' }
      );

      observer.observe(formRef.current);
      return () => observer.disconnect();
    } else {
      setShouldLoadTurnstile(true);
    }
  }, [shouldLoadTurnstile]);

  useEffect(() => {
    if (!shouldLoadTurnstile) return;

    const renderTurnstileWidget = () => {
      if (
        typeof window !== 'undefined' &&
        (window as any).turnstile &&
        turnstileContainerRef.current &&
        widgetIdRef.current === null
      ) {
        try {
          turnstileContainerRef.current.innerHTML = '';
          widgetIdRef.current = (window as any).turnstile.render(turnstileContainerRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            theme: 'light',
            'refresh-expired': 'auto',
            callback: (token: string) => {
              setTurnstileToken(token);
              setServerError('');
            },
            'expired-callback': () => {
              setTurnstileToken('');
            },
            'error-callback': () => {
              setTurnstileToken('');
            },
          });
        } catch (err) {
          console.error('[Turnstile] Render exception:', err);
        }
      }
    };

    const scriptId = 'cf-turnstile-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        renderTurnstileWidget();
      };
      document.head.appendChild(script);
    } else {
      renderTurnstileWidget();
    }

    // Polling de seguridad si el script ya estaba cargado
    const timer = setInterval(() => {
      if ((window as any).turnstile && widgetIdRef.current === null) {
        renderTurnstileWidget();
      }
    }, 300);

    return () => {
      clearInterval(timer);
      if (widgetIdRef.current !== null && typeof window !== 'undefined' && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetIdRef.current);
        } catch {
          // Ignorar si el nodo ya fue removido
        }
        widgetIdRef.current = null;
      }
    };
  }, [shouldLoadTurnstile]);

  useEffect(() => {
    // Check global validity
    const checkValid = () => {
      const { nombre, empresa, correo, servicio, legal } = formData;
      if (
        nombre.value && !nombre.error &&
        empresa.value && !empresa.error &&
        correo.value && !correo.error &&
        servicio.value && !servicio.error &&
        legal.value
      ) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    };
    checkValid();
  }, [formData]);

  const validateField = (name: string, value: string | boolean) => {
    let error = '';
    if (name === 'nombre' && !value) error = t('err_name');
    if (name === 'empresa' && !value) error = t('err_company');
    if (name === 'correo') {
      const v = value as string;
      if (!v) error = t('err_email');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        error = t('err_email_invalid');
      }
    }
    if (name === 'servicio' && !value) error = t('err_service');
    if (name === 'legal' && !value) error = t('err_legal');
    return error;
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    const error = validateField(name, val);
    
    setFormData(prev => ({
      ...prev,
      [name]: { value: val, error }
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    const error = validateField(name, val);
    setFormData(prev => ({
      ...prev,
      [name]: { value: val, error }
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    if (!shouldLoadTurnstile) {
      setShouldLoadTurnstile(true);
    }

    const activeToken = turnstileToken || (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement)?.value || '';
    if (!activeToken) {
      setServerError('Por favor, completa la verificación de seguridad antes de enviar.');
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'lead',
          nombre: formData.nombre.value,
          email: formData.correo.value,
          empresa: formData.empresa.value,
          servicio: formData.servicio.value,
          privacyAccepted: formData.legal.value,
          turnstile_token: activeToken,
          _t: renderTime,
          company_fax: honeypot,
        }),
      });

      let result: any = null;
      try {
        result = await res.json();
      } catch {
        result = null;
      }

      if (!res.ok || !result?.success) {
        // Renovar token de Turnstile porque cada token es de un solo uso
        if (typeof window !== 'undefined' && (window as any).turnstile && widgetIdRef.current !== null) {
          try {
            (window as any).turnstile.reset(widgetIdRef.current);
            setTurnstileToken('');
          } catch {
            // Ignorar error de reset
          }
        }
        setServerError(result?.error || t('err_network'));
        return;
      }

      // Limpiar widget de Turnstile antes de desmontar el formulario para evitar excepción DOM removeChild en React
      if (widgetIdRef.current !== null && typeof window !== 'undefined' && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetIdRef.current);
        } catch {
          // Ignorar
        }
        widgetIdRef.current = null;
      }

      setIsSuccess(true);
      trackEvent('generate_lead', {
        form_name: 'b2b_lead_form',
        service_category: formData.servicio.value || 'general'
      });
      trackEvent('form_submit_success', {
        form_name: 'b2b_lead_form',
        service_category: formData.servicio.value || 'general'
      });
    } catch (err) {
      console.error('Form Submit Error:', err);
      if (typeof window !== 'undefined' && (window as any).turnstile && widgetIdRef.current !== null) {
        try {
          (window as any).turnstile.reset(widgetIdRef.current);
          setTurnstileToken('');
        } catch {
          // Ignorar
        }
      }
      setServerError(t('err_network'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="b2b-success-state" role="status" aria-live="polite">
        <div className="b2b-success-icon" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 className="b2b-success-title">{t('success_title')}</h3>
        <p className="b2b-success-desc">{t('success_msg')}</p>
      </div>
    );
  }

  return (
    <form 
      ref={formRef} 
      className="b2b-form" 
      onSubmit={handleSubmit}
      onFocus={handleFormInteraction}
      onPointerDown={handleFormInteraction}
    >
      {serverError && (
        <div className="server-error" role="alert">
          {serverError}
        </div>
      )}

      {/* Honeypot anti-spam (invisible para usuarios reales y protegido contra Chrome Autofill) */}
      <div style={{ position: 'absolute', opacity: 0, zIndex: -1, pointerEvents: 'none', height: 0, overflow: 'hidden' }} aria-hidden="true">
        <label htmlFor="b2b_hp_fax">Internal Fax</label>
        <input
          type="text"
          id="b2b_hp_fax"
          name="b2b_hp_fax"
          tabIndex={-1}
          autoComplete="new-password"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="b2b-nombre">{t('lbl_name')}</label>
        <input
          type="text"
          id="b2b-nombre"
          name="nombre"
          placeholder={t('ph_name')}
          value={formData.nombre.value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={formData.nombre.error ? 'input-error' : formData.nombre.value ? 'input-success' : ''}
          required
        />
        {formData.nombre.error && <span className="error-msg" role="alert">{formData.nombre.error}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="b2b-empresa">{t('lbl_company')}</label>
        <input
          type="text"
          id="b2b-empresa"
          name="empresa"
          placeholder={t('ph_company')}
          value={formData.empresa.value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={formData.empresa.error ? 'input-error' : formData.empresa.value ? 'input-success' : ''}
          required
        />
        {formData.empresa.error && <span className="error-msg" role="alert">{formData.empresa.error}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="b2b-correo">{t('lbl_email')}</label>
        <input
          type="email"
          id="b2b-correo"
          name="correo"
          placeholder={t('ph_email')}
          value={formData.correo.value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={formData.correo.error ? 'input-error' : formData.correo.value && !formData.correo.error ? 'input-success' : ''}
          required
        />
        {formData.correo.error && <span className="error-msg" role="alert">{formData.correo.error}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="b2b-servicio">{t('lbl_service')}</label>
        <select
          id="b2b-servicio"
          name="servicio"
          value={formData.servicio.value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={formData.servicio.error ? 'input-error' : formData.servicio.value ? 'input-success' : ''}
          required
        >
          <option value="" disabled>{t('opt_default')}</option>
          <option value="Reclutamiento y Selección">{t('opt_recruitment')}</option>
          <option value="Gestión de Personas">{t('opt_management')}</option>
          <option value="Desarrollo Organizacional">{t('opt_development')}</option>
        </select>
        {formData.servicio.error && <span className="error-msg" role="alert">{formData.servicio.error}</span>}
      </div>

      <div className="form-group-checkbox">
        <input
          type="checkbox"
          id="b2b-legal"
          name="legal"
          checked={formData.legal.value}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <label htmlFor="b2b-legal">
          {t('lbl_legal_1')}<Link href="/privacidad" target="_blank" rel="noopener noreferrer">{t('lbl_legal_link')}</Link>
        </label>
        {formData.legal.error && <span className="error-msg" role="alert">{formData.legal.error}</span>}
      </div>

      {/* Cloudflare Turnstile Widget */}
      <div 
        ref={turnstileContainerRef}
        id="b2b-turnstile-container"
        style={{ margin: '14px 0', minHeight: '65px', display: 'flex', justifyContent: 'center' }}
      ></div>

      <div className="submit-container">
        <button
          type="submit"
          className={`submit-button ${isSubmitting ? 'loading' : ''}`}
          disabled={!isValid || isSubmitting || !turnstileToken}
        >
          {isSubmitting ? <span className="spinner" aria-hidden="true"></span> : t('btn_submit')}
        </button>
        <p className="privacy-notice">
          {t('privacy_notice')}
        </p>
      </div>
    </form>
  );
}
