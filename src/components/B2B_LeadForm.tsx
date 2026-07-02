"use client";

import React, { useState, FocusEvent, FormEvent, useEffect } from 'react';
import './B2B_LeadForm.css';
import { useTranslations } from 'next-intl';
import { supabase } from '../lib/supabase';

interface FormState {
  nombre: { value: string; error: string };
  empresa: { value: string; error: string };
  correo: { value: string; error: string };
  servicio: { value: string; error: string };
  legal: { value: boolean; error: string };
}

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
      } else {
        const freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
        const domain = v.split('@')[1];
        if (freeDomains.includes(domain)) {
          error = t('err_email_free');
        }
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

    setIsSubmitting(true);
    setServerError('');

    try {
      const { error: dbError } = await supabase
        .from('b2b_leads')
        .insert([
          {
            full_name: formData.nombre.value,
            email: formData.correo.value,
            company_name: formData.empresa.value,
            service_interest: formData.servicio.value
            // privacy_accepted_at is handled by DB default now()
          }
        ]);

      if (dbError) throw dbError;

      setIsSuccess(true);
    } catch (err) {
      console.error('Supabase Error:', err);
      setServerError(t('err_network'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="b2b-success-state">
        <p>{t('success_msg')}</p>
      </div>
    );
  }

  return (
    <form className="b2b-form" action="https://n8n-tailor.com/webhook/fallback" method="POST" onSubmit={handleSubmit}>
      {serverError && (
        <div className="server-error" role="alert">
          {serverError}
        </div>
      )}

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
          {t('lbl_legal_1')}<a href="/privacidad" target="_blank" rel="noopener noreferrer">{t('lbl_legal_link')}</a>
        </label>
        {formData.legal.error && <span className="error-msg" role="alert">{formData.legal.error}</span>}
      </div>

      <div className="submit-container">
        <button
          type="submit"
          className={`submit-button ${isSubmitting ? 'loading' : ''}`}
          disabled={!isValid || isSubmitting}
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
