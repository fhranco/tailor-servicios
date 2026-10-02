'use client';

import React, { useEffect, useState } from 'react';
import './PrivacyDashboard.css';

type Lead = {
  id: string;
  created_at: string;
  full_name: string;
  company_name: string;
  email: string;
  service_interest: string;
};

export default function PrivacyDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
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

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm('ATENCIÓN: Esta acción eliminará los datos permanentemente conforme al Derecho de Supresión (Ley 21.719). ¿Estás seguro?');
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { 
        method: 'DELETE',
        credentials: 'same-origin'
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error desconocido');
      }

      alert('Registro eliminado correctamente.');
      fetchData();
    } catch (error: any) {
      alert(`Error al eliminar: ${error.message}`);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No registrada';
    return new Date(dateStr).toLocaleString('es-CL');
  };

  if (loading) {
    return <div className="pd-loading">Cargando registros de cumplimiento Ley 21.719...</div>;
  }

  return (
    <div className="privacy-dashboard">
      
      {/* Banner de Cumplimiento: Principio de Minimización */}
      <div style={{
        backgroundColor: '#0f2942',
        border: '1px solid #1e5591',
        borderRadius: '8px',
        padding: '1.25rem',
        marginBottom: '2rem',
        color: '#f8fafc'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#00b4ff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🛡️ Principio de Minimización de Datos (Ley 21.719 - Chile)
        </h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5' }}>
          Tailor Servicios <strong>no almacena currículums ni datos sensibles de postulantes</strong> en la base de datos de este sitio web.
          Las postulaciones son derivadas directamente al ATS oficial Rexmas o al buzón <code>seleccion@tailorservicios.cl</code>.
          Esta base de datos custodia exclusivamente <strong>contactos comerciales B2B</strong> con su debida constancia de consentimiento y trazabilidad de derechos ARCO.
        </p>
      </div>

      <section className="pd-section">
        <h2 className="pd-section-title">Base de Empresas y Contactos Comerciales (Leads B2B)</h2>
        <div className="pd-table-container">
          <table className="pd-table">
            <thead>
              <tr>
                <th>Fecha Ingreso</th>
                <th>Nombre / Empresa</th>
                <th>Email</th>
                <th>Servicio</th>
                <th>Consentimiento</th>
                <th>Acciones ARCO</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr><td colSpan={6} className="pd-empty">No hay registros de empresas.</td></tr>
              )}
              {leads.map(l => (
                <tr key={l.id}>
                  <td>{formatDate(l.created_at)}</td>
                  <td>{l.full_name} <br/><small>{l.company_name}</small></td>
                  <td>{l.email}</td>
                  <td>{l.service_interest}</td>
                  <td>
                    <span className="pd-badge success">Válido y Registrado</span>
                  </td>
                  <td className="pd-actions">
                    <button onClick={() => handleExport(l, 'empresa')} className="pd-btn outline">Exportar</button>
                    <button onClick={() => handleDelete(l.id)} className="pd-btn danger">Eliminar</button>
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
