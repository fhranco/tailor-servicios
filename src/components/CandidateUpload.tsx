'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CandidateUpload.css';
import { useTranslations } from 'next-intl';
import { supabase } from '../lib/supabase';

export default function CandidateUpload() {
  const t = useTranslations('CandidateUpload');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [legalAccepted, setLegalAccepted] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !legalAccepted || !name || !email) {
      setErrorMsg('Por favor, completa todos los campos requeridos y sube tu CV.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMessage('');

    try {
      // 1. Upload CV to Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `candidatos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Insert Candidate record
      const { error: dbError } = await supabase
        .from('candidates')
        .insert([
          {
            full_name: name,
            email: email,
            specialty: specialty,
            cv_path: filePath,
            // privacy_accepted_at is set by default now() in DB
          }
        ]);

      if (dbError) throw dbError;

      setSuccessMessage('¡Tu CV ha sido enviado exitosamente!');
      setFile(null);
      setName('');
      setEmail('');
      setSpecialty('');
      setLegalAccepted(false);
      
    } catch (error: any) {
      console.error('Upload Error:', error);
      setErrorMsg('Hubo un error al enviar tu CV. Por favor intenta más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="c-upload-section" id="subir-cv">
      <div className="fluid-container">
        <motion.div 
          className="c-upload-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="c-upload-text">
            <span className="c-upload-badge">{t('badge')}</span>
            <h2 className="c-upload-title">{t('title')}</h2>
            <p className="c-upload-desc">
              {t('desc')}
            </p>
          </div>

          <div className="c-upload-form-wrapper">
            <form className="c-upload-form" onSubmit={handleSubmit}>
              {successMessage && <div className="c-success-msg" style={{color: 'green', marginBottom: '1rem', padding: '1rem', backgroundColor: '#e6ffe6', borderRadius: '8px'}}>{successMessage}</div>}
              {errorMsg && <div className="c-error-msg" style={{color: 'red', marginBottom: '1rem', padding: '1rem', backgroundColor: '#ffe6e6', borderRadius: '8px'}}>{errorMsg}</div>}
              
              <div className="c-form-group">
                <label>{t('lbl_name')}</label>
                <input type="text" placeholder={t('ph_name')} value={name} onChange={e => setName(e.target.value)} required />
              </div>
              
              <div className="c-form-group">
                <label>{t('lbl_email')}</label>
                <input type="email" placeholder="juan@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              
              <div className="c-form-group">
                <label>{t('lbl_area')}</label>
                <select value={specialty} onChange={e => setSpecialty(e.target.value)} required>
                  <option value="">{t('opt_default')}</option>
                  <option value="acuicultura">{t('opt_acuicultura')}</option>
                  <option value="energia">{t('opt_energia')}</option>
                  <option value="logistica">{t('opt_logistica')}</option>
                  <option value="turismo">{t('opt_turismo')}</option>
                  <option value="otro">{t('opt_otro')}</option>
                </select>
              </div>

              <div className="c-form-group">
                <label>{t('lbl_cv')}</label>
                <div 
                  className={`c-dropzone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    id="cv-upload" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleChange} 
                  />
                  <label htmlFor="cv-upload" className="c-dropzone-label">
                    {file ? (
                      <div className="c-file-selected">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <span>{file.name}</span>
                      </div>
                    ) : (
                      <div className="c-file-prompt">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <span>{t('prompt_drag')} <strong>{t('prompt_click')}</strong></span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="c-form-group c-form-group-checkbox" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
                <input 
                  type="checkbox" 
                  id="cu-legal" 
                  checked={legalAccepted}
                  onChange={(e) => setLegalAccepted(e.target.checked)}
                  required
                  style={{ marginTop: '0.25rem', cursor: 'pointer' }}
                />
                <label htmlFor="cu-legal" style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)', cursor: 'pointer', lineHeight: '1.4' }}>
                  {t('lbl_legal_1')} <a href="/terminos" target="_blank" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>{t('lbl_legal_link')}</a>.
                </label>
              </div>

              <button type="submit" className="btn-primary c-submit-btn" disabled={!legalAccepted || isSubmitting}>
                {isSubmitting ? 'Enviando...' : t('btn_submit')}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
