'use client';

import React, { useEffect, useState } from 'react';
import './JobTicker.css';

interface Job {
  id: string;
  external_id: string;
  title: string;
  location: string;
  area: string;
  url: string;
  active: boolean;
}

export default function JobTicker() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.jobs)) {
            setJobs(data.jobs.filter((j: Job) => j.active));
          }
        }
      } catch (err) {
        console.warn('No se pudieron cargar ofertas para la marquesina:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadJobs();
    // Re-check cada 5 minutos
    const interval = setInterval(loadJobs, 5 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // FASE 9: Si no hay ofertas activas (o está cargando), ocultar completamente el ticker
  if (isLoading || jobs.length === 0) {
    return null;
  }

  // Duplicar la lista para lograr un scroll infinito continuo y sin saltos
  const repeatedJobs = [...jobs, ...jobs, ...jobs];

  return (
    <div className="job-ticker-bar" role="region" aria-label="Ofertas laborales activas">
      <div className="job-ticker-label">
        <span className="job-ticker-pulse"></span>
        <span className="job-ticker-badge">OFERTAS LABORALES</span>
      </div>

      <div className="job-ticker-track-container">
        <div className="job-ticker-track">
          {repeatedJobs.map((job, idx) => (
            <a
              key={`${job.external_id}-${idx}`}
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="job-ticker-item"
              title={`Ver oferta "${job.title}" en Rex+`}
            >
              <span className="job-ticker-arrow">→</span>
              <span className="job-ticker-title">{job.title}</span>
              <span className="job-ticker-dot">·</span>
              <span className="job-ticker-location">{job.location}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
