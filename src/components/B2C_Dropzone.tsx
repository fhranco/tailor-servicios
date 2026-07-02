"use client";

import React, { useState, DragEvent, ChangeEvent } from 'react';
import './B2C_Dropzone.css';
import { useTranslations } from 'next-intl';
import { supabase } from '../lib/supabase';

export default function B2C_Dropzone() {
  const t = useTranslations('B2C_Dropzone');
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const preventDefaults = (e: DragEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (selectedFile: File) => {
    setError('');
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      setError(t('err_type'));
      return false;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError(t('err_size'));
      return false;
    }

    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    preventDefaults(e);
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    preventDefaults(e);
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    preventDefaults(e);
    setIsDragOver(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!file || !legalAccepted) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_anonymous_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cvs/anonymous/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('candidates')
        .insert([
          {
            full_name: 'Anónimo (Dropzone)',
            email: 'anonimo@dropzone.local',
            specialty: 'No especificada',
            cv_path: filePath
          }
        ]);

      if (dbError) throw dbError;

      setSuccess(true);
      setFile(null);
      setLegalAccepted(false);
      
    } catch (err: any) {
      console.error('Upload Error:', err);
      setError('Hubo un error al enviar tu archivo. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="b2c-dropzone-container" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h3 style={{ color: 'var(--color-dark)', marginBottom: '0.5rem' }}>¡CV enviado con éxito!</h3>
        <p style={{ color: 'var(--color-gray-dark)' }}>Hemos recibido tus antecedentes de forma segura.</p>
        <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setSuccess(false)}>Enviar otro CV</button>
      </div>
    );
  }

  return (
    <div className="b2c-dropzone-container">
      <div 
        className={`dropzone-area ${isDragOver ? 'drag-over' : ''} ${file ? 'success' : ''}`}
        role="region"
        aria-label="Carga de Currículum"
        onDragEnter={preventDefaults}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <input 
              type="file" 
              id="cv-file" 
              accept=".pdf,.docx" 
              className="sr-only" 
              onChange={handleChange}
            />
            <label htmlFor="cv-file" className="dropzone-label">
              <span className="dropzone-icon" aria-hidden="true">📄</span>
              <span className="instruction-main">{t('inst_main')}</span>
              <span className="instruction-sub">{t('inst_sub')}</span>
            </label>
          </>
        ) : (
          <div className="success-state">
            <span className="file-name">✅ {file.name}</span>
            <button type="button" className="remove-btn" onClick={handleRemove} aria-label="Eliminar archivo">
              {t('btn_remove')}
            </button>
            
            <div className="c-form-group-checkbox" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <input 
                type="checkbox" 
                id="b2c-legal" 
                checked={legalAccepted}
                onChange={(e) => setLegalAccepted(e.target.checked)}
                required
                style={{ marginTop: '0.25rem', cursor: 'pointer' }}
              />
              <label htmlFor="b2c-legal" style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)', cursor: 'pointer', lineHeight: '1.4' }}>
                {t('lbl_legal_1')} <a href="/terminos" target="_blank" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>{t('lbl_legal_link')}</a>.
              </label>
            </div>

            <button 
              type="button" 
              className="btn-primary" 
              style={{ width: '100%' }}
              disabled={!legalAccepted || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Enviando...' : t('btn_submit')}
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="dropzone-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
