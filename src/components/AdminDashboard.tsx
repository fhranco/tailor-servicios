'use client';

import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

type Candidate = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  specialty: string;
  cv_path: string;
};

type Lead = {
  id: string;
  created_at: string;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  message: string;
  service_interest: string;
};

type Visit = {
  id: string;
  timestamp: string;
  page_path: string;
  referrer: string;
  locale: string;
  user_agent: string;
  ip_hash: string;
};

type AuditLog = {
  id: string;
  timestamp: string;
  action: string;
  performed_by: string;
  target_id: string;
  ip_address: string;
  user_agent: string;
};

import { supabase } from '@/lib/supabase';

type PageStat = {
  path: string;
  count: number;
};

export default function AdminDashboard({ session }: { session: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'leads' | 'traffic' | 'audit'>('overview');
  const [loading, setLoading] = useState(true);

  // States for data
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [pageStats, setPageStats] = useState<PageStat[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${session?.access_token || ''}`
      };

      // 1. Fetch Candidates
      const cRes = await fetch('/api/admin/candidates', { headers });
      if (cRes.ok) {
        const cData = await cRes.json();
        setCandidates(cData);
      }

      // 2. Fetch Leads
      const lRes = await fetch('/api/admin/leads', { headers });
      if (lRes.ok) {
        const lData = await lRes.json();
        setLeads(lData);
      }

      // 3. Fetch Web Visits
      const vRes = await fetch('/api/admin/visits', { headers });
      if (vRes.ok) {
        const vData = await vRes.json();
        setVisits(vData.recentVisits || []);
        setPageStats(vData.pageStats || []);
        setTotalVisits(vData.totalVisits || 0);
      }

      // 4. Fetch Audit Logs
      const aRes = await fetch('/api/admin/audit-logs', { headers });
      if (aRes.ok) {
        const aData = await aRes.json();
        setAuditLogs(aData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const deleteRecord = async (id: string, type: 'candidates' | 'leads') => {
    const confirmMsg = type === 'candidates' 
      ? '¿Estás seguro de eliminar este candidato de manera permanente? (Esto borrará su registro e historial de la base de datos)'
      : '¿Estás seguro de eliminar este contacto de manera permanente?';
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const headers = {
        'Authorization': `Bearer ${session?.access_token || ''}`
      };
      const endpoint = type === 'candidates' ? '/api/admin/candidates' : '/api/admin/leads';
      const res = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        alert('Registro eliminado con éxito.');
        fetchDashboardData();
      } else {
        const err = await res.json();
        alert(`Error al eliminar: ${err.error}`);
      }
    } catch (err: any) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  const handleExportData = (data: any, name: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>Cargando panel de administración seguro...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-logo-area">
          <span className="logo-acronym">TS</span>
          <h2>Tailor Admin</h2>
        </div>
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Resumen General
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'candidates' ? 'active' : ''}`}
            onClick={() => setActiveTab('candidates')}
          >
            👥 Postulantes / CVs
            {candidates.length > 0 && <span className="tab-badge">{candidates.length}</span>}
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            🏢 Solicitudes B2B
            {leads.length > 0 && <span className="tab-badge">{leads.length}</span>}
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'traffic' ? 'active' : ''}`}
            onClick={() => setActiveTab('traffic')}
          >
            📈 Tráfico y Visitas
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            🛡️ Auditoría (Ley 21.719)
          </button>
        </nav>
        <div className="admin-footer-actions">
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {activeTab === 'overview' && 'Dashboard de Operaciones'}
            {activeTab === 'candidates' && 'Bandeja de Candidatos (Reclutamiento)'}
            {activeTab === 'leads' && 'Bandeja de Contactos B2B (Empresas)'}
            {activeTab === 'traffic' && 'Análisis de Tráfico Anónimo'}
            {activeTab === 'audit' && 'Bitácora de Auditoría Legal'}
          </h1>
          <button className="btn-refresh" onClick={fetchDashboardData}>
            🔄 Actualizar Datos
          </button>
        </header>

        <div className="admin-content">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-value">{candidates.length}</div>
                  <div className="stat-label">Candidatos Totales</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏢</div>
                  <div className="stat-value">{leads.length}</div>
                  <div className="stat-label">Solicitudes B2B</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-value">{totalVisits}</div>
                  <div className="stat-label">Visitas Totales a la Web</div>
                </div>
              </div>

              <div className="dashboard-double-panel">
                <div className="recent-activity-panel">
                  <h3>Últimas Acciones</h3>
                  <div className="activity-list">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="activity-item">
                        <span className="activity-time">{new Date(log.timestamp).toLocaleString('es-CL')}</span>
                        <p className="activity-text">
                          El sistema registró acceso administrativo: <strong>{log.action}</strong>
                        </p>
                      </div>
                    ))}
                    {auditLogs.length === 0 && <p className="empty-text">Sin actividad reciente registrada.</p>}
                  </div>
                </div>

                <div className="quick-actions-panel">
                  <h3>Exportación Consolidada</h3>
                  <p>Descarga copias de seguridad locales en formato estructurado para auditorías externas de datos.</p>
                  <div className="action-buttons">
                    <button className="btn-action" onClick={() => handleExportData(candidates, 'candidatos')}>
                      📥 Descargar Candidatos (JSON)
                    </button>
                    <button className="btn-action" onClick={() => handleExportData(leads, 'b2b_leads')}>
                      📥 Descargar Leads B2B (JSON)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CANDIDATES */}
          {activeTab === 'candidates' && (
            <div className="table-view-tab">
              <div className="table-header-controls">
                <p>Lista de postulantes y currículums recibidos mediante el formulario web corporativo.</p>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>CV / Documento</th>
                      <th>Consentimiento</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((c) => {
                      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
                      const cvDownloadUrl = c.cv_path 
                        ? `${supabaseUrl}/storage/v1/object/public/cvs/${c.cv_path}` 
                        : '';
                      return (
                        <tr key={c.id}>
                          <td>{new Date(c.created_at).toLocaleDateString('es-CL')}</td>
                          <td>{c.full_name}</td>
                          <td>{c.email}</td>
                          <td>{c.phone || '-'}</td>
                          <td>
                            {c.cv_path ? (
                              <a href={cvDownloadUrl} target="_blank" rel="noopener noreferrer" className="btn-table-action download">
                                📄 Descargar CV
                              </a>
                            ) : 'No cargado'}
                          </td>
                          <td>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#d1fae5', color: '#065f46', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                              ✔️ Aceptado
                            </span>
                          </td>
                          <td>
                            <button className="btn-table-action delete" onClick={() => deleteRecord(c.id, 'candidates')}>
                              🗑️ Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {candidates.length === 0 && (
                      <tr>
                        <td colSpan={7} className="empty-row">No hay candidatos registrados en la bandeja.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: LEADS */}
          {activeTab === 'leads' && (
            <div className="table-view-tab">
              <div className="table-header-controls">
                <p>Lista de mensajes comerciales y contactos recibidos del formulario de empresas B2B.</p>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Contacto</th>
                      <th>Empresa</th>
                      <th>Email / Teléfono</th>
                      <th>Servicio Interés</th>
                      <th>Mensaje / Consulta</th>
                      <th>Consentimiento</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l) => (
                      <tr key={l.id}>
                        <td>{new Date(l.created_at).toLocaleDateString('es-CL')}</td>
                        <td>{l.full_name}</td>
                        <td>{l.company_name}</td>
                        <td>
                          <div>{l.email}</div>
                          <div style={{fontSize: '0.85rem', color: '#64748b'}}>{l.phone || '-'}</div>
                        </td>
                        <td>
                          <span className="interest-badge">{l.service_interest}</span>
                        </td>
                        <td className="msg-cell" title={l.message}>{l.message}</td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#d1fae5', color: '#065f46', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                            ✔️ Aceptado
                          </span>
                        </td>
                        <td>
                          <button className="btn-table-action delete" onClick={() => deleteRecord(l.id, 'leads')}>
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan={8} className="empty-row">No hay solicitudes B2B registradas.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: TRAFFIC / VISITS */}
          {activeTab === 'traffic' && (
            <div className="traffic-tab">
              <div className="traffic-grid">
                <div className="traffic-chart-panel">
                  <h3>Páginas más visitadas</h3>
                  <div className="page-ranking-list">
                    {pageStats.map((stat, idx) => (
                      <div key={idx} className="ranking-item">
                        <span className="ranking-path">{stat.path}</span>
                        <div className="ranking-bar-wrapper">
                          <div 
                            className="ranking-bar" 
                            style={{ width: `${(stat.count / Math.max(...pageStats.map(s => s.count))) * 100}%` }}
                          ></div>
                          <span className="ranking-count">{stat.count} vistas</span>
                        </div>
                      </div>
                    ))}
                    {pageStats.length === 0 && <p className="empty-text">Sin datos de tráfico registrados.</p>}
                  </div>
                </div>

                <div className="traffic-details-panel">
                  <h3>Visitas Recientes (Anónimas)</h3>
                  <div className="visits-log-list">
                    {visits.slice(0, 15).map((v) => (
                      <div key={v.id} className="visit-log-item">
                        <div className="visit-meta">
                          <span className="visit-time">{new Date(v.timestamp).toLocaleTimeString('es-CL')}</span>
                          <span className="visit-locale">{v.locale.toUpperCase()}</span>
                        </div>
                        <p className="visit-info">
                          Vió <strong>{v.page_path}</strong>
                          {v.referrer && <span className="referrer-text"> desde {v.referrer}</span>}
                        </p>
                      </div>
                    ))}
                    {visits.length === 0 && <p className="empty-text">Sin visitas recientes registradas.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="table-view-tab">
              <div className="table-header-controls">
                <p>Historial inmutable de accesos de administrador y operaciones sobre datos personales (Ley 21.719).</p>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Fecha y Hora</th>
                      <th>Usuario / Operador</th>
                      <th>Acción / Operación</th>
                      <th>ID Registro Afectado</th>
                      <th>Dirección IP (Enmascarada)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td>{new Date(log.timestamp).toLocaleString('es-CL')}</td>
                        <td><span className="role-badge admin">{log.performed_by}</span></td>
                        <td><strong>{log.action}</strong></td>
                        <td style={{fontFamily: 'monospace', fontSize: '0.85rem'}}>{log.target_id || '-'}</td>
                        <td style={{fontFamily: 'monospace', fontSize: '0.85rem', color: '#64748b'}} title="IP enmascarada conforme a la Ley 21.719">
                          {log.ip_address || '-'}
                        </td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="empty-row">No hay registros de auditoría de privacidad.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
