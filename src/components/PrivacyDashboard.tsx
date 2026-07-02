'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './PrivacyDashboard.css';

type Candidate = {
  id: string;
  privacy_accepted_at: string;
  full_name: string;
  email: string;
  specialty: string;
  cv_path: string;
};

type Lead = {
  id: string;
  privacy_accepted_at: string;
  full_name: string;
  company_name: string;
  email: string;
  service_interest: string;
};

export default function PrivacyDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Fetch candidates from private API
      const cRes = await fetch('/api/admin/candidates', {
        credentials: 'same-origin'
      });
      if (!cRes.ok) {
        const text = await cRes.text();
        throw new Error(`Candidatos HTTP ${cRes.status}: ${text}`);
      }
      const cData = await cRes.json();
      setCandidates(cData as Candidate[]);

      // Fetch leads from private API
      const lRes = await fetch('/api/admin/leads', {
        credentials: 'same-origin'
      });
      if (!lRes.ok) {
        const text = await lRes.text();
        throw new Error(`Empresas HTTP ${lRes.status}: ${text}`);
      }
      const lData = await lRes.json();
      setLeads(lData as Lead[]);
      
    } catch (err: any) {
      console.error('Fetch error:', err);
      alert(`Error de conexión segura: ${err.message}`);
    }

    setLoading(false);
  };

  const handleExport = (data: any, type: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tailor_${type}_${data.id}_export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string, table: 'candidates' | 'b2b_leads') => {
    const isConfirmed = window.confirm('ATENCIÓN: Esta acción eliminará los datos permanentemente (Derecho a Cancelación). ¿Estás seguro?');
    if (!isConfirmed) return;

    try {
      const endpoint = table === 'candidates' ? '/api/admin/candidates' : '/api/admin/leads';
      const res = await fetch(`${endpoint}?id=${id}`, { 
        method: 'DELETE',
        credentials: 'same-origin'
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error desconocido');
      }

      alert('Registro eliminado correctamente.');
      fetchData(); // refresh
    } catch (error: any) {
      alert(`Error al eliminar: ${error.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleString('es-CL');
  };

  if (loading) {
    return <div className="pd-loading">Cargando base de datos segura...</div>;
  }

  return (
    <div className="privacy-dashboard">
      
      <section className="pd-section">
        <h2 className="pd-section-title">Base de Postulantes (Candidatos)</h2>
        <div className="pd-table-container">
          <table className="pd-table">
            <thead>
              <tr>
                <th>Fecha Ingreso</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Especialidad</th>
                <th>Estado Consentimiento</th>
                <th>Acciones ARCO</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 && (
                <tr><td colSpan={6} className="pd-empty">No hay registros de postulantes.</td></tr>
              )}
              {candidates.map(c => (
                <tr key={c.id}>
                  <td>{formatDate(c.privacy_accepted_at)}</td>
                  <td>{c.full_name}</td>
                  <td>{c.email}</td>
                  <td>{c.specialty}</td>
                  <td>
                    {c.privacy_accepted_at ? (
                      <span className="pd-badge success">Válido y Registrado</span>
                    ) : (
                      <span className="pd-badge warning">Incompleto</span>
                    )}
                  </td>
                  <td className="pd-actions">
                    <button onClick={() => handleExport(c, 'candidato')} className="pd-btn outline">Exportar</button>
                    <button onClick={() => handleDelete(c.id, 'candidates')} className="pd-btn danger">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="pd-section" style={{ marginTop: '3rem' }}>
        <h2 className="pd-section-title">Base de Empresas (Leads B2B)</h2>
        <div className="pd-table-container">
          <table className="pd-table">
            <thead>
              <tr>
                <th>Fecha Ingreso</th>
                <th>Nombre / Empresa</th>
                <th>Email</th>
                <th>Servicio</th>
                <th>Estado Consentimiento</th>
                <th>Acciones ARCO</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr><td colSpan={6} className="pd-empty">No hay registros de empresas.</td></tr>
              )}
              {leads.map(l => (
                <tr key={l.id}>
                  <td>{formatDate(l.privacy_accepted_at)}</td>
                  <td>{l.full_name} <br/><small>{l.company_name}</small></td>
                  <td>{l.email}</td>
                  <td>{l.service_interest}</td>
                  <td>
                    {l.privacy_accepted_at ? (
                      <span className="pd-badge success">Válido y Registrado</span>
                    ) : (
                      <span className="pd-badge warning">Incompleto</span>
                    )}
                  </td>
                  <td className="pd-actions">
                    <button onClick={() => handleExport(l, 'empresa')} className="pd-btn outline">Exportar</button>
                    <button onClick={() => handleDelete(l.id, 'b2b_leads')} className="pd-btn danger">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
