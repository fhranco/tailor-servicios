'use client';

import React, { useEffect, useState } from 'react';
import './JobOffersCarousel.css';
import { useTranslations } from 'next-intl';

interface JobOffer {
  id: string;
  external_id: string;
  title: string;
  location: string;
  area: string;
  work_type: string;
  url: string;
  active: boolean;
}

export default function JobOffersCarousel() {
  const t = useTranslations('JobOffersCarousel');
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.jobs)) {
            const activeJobs = data.jobs.filter((j: JobOffer) => j.active);
            setJobs(activeJobs);
          }
        }
      } catch (err) {
        console.warn('Error al cargar ofertas en carrusel:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadJobs();
  }, []);

  // Si no hay ofertas activas (y ya cargó), no renderizar la sección para evitar ruidos visuales
  if (!isLoading && jobs.length === 0) {
    return null;
  }

  // Duplicamos el array para el efecto de scroll continuo infinito
  const displayItems = jobs.length > 0 ? [...jobs, ...jobs, ...jobs] : [];

  return (
    <section className="c-jobs-section" id="ofertas-laborales">
      <div className="fluid-container">
        <div className="c-jobs-header">
          <div>
            <span className="c-jobs-badge">{t('activeOpportunities')}</span>
            <h2 className="c-jobs-title">{t('featuredOffers')}</h2>
          </div>
          <div className="c-jobs-controls">
            <a 
              href="https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="c-jobs-all-btn"
            >
              {t('viewAll')} &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Marquee Container (Full width) */}
      <div className="c-jobs-marquee-wrapper">
        <div className="c-jobs-marquee-track">
          {displayItems.map((job, index) => (
            <a 
              key={`${job.external_id || job.id}-${index}`} 
              href={job.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="c-job-card-marquee"
              style={{ textDecoration: 'none' }}
              title={`Postular a ${job.title} en Rex+`}
            >
              <div className="c-job-card-header">
                <span className="c-job-department">{job.area || 'General'}</span>
                <span className="c-job-type">{job.work_type || 'Tiempo completo'}</span>
              </div>
              
              <h3 className="c-job-title">{job.title}</h3>
              
              <div className="c-job-location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {job.location}
              </div>

              <div className="c-job-apply-btn">
                {t('btn')} &rarr;
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
