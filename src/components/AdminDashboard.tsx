'use client';

import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

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
import BlogArticleAdapter from './BlogArticleAdapter';

type PageStat = {
  path: string;
  count: number;
};

export default function AdminDashboard({ session }: { session: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'blog' | 'jobs' | 'audit' | 'traffic'>('overview');
  const [loading, setLoading] = useState(true);

  // States for data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [blogCount, setBlogCount] = useState(0);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [pageStats, setPageStats] = useState<PageStat[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
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

      // 1. Fetch Leads B2B
      const lRes = await fetch('/api/admin/leads', { headers });
      if (lRes.ok) {
        const lData = await lRes.json();
        setLeads(lData);
      }

      // 2. Fetch Blog Articles Count
      const bRes = await fetch('/api/admin/blog');
      if (bRes.ok) {
        const bData = await bRes.json();
        if (Array.isArray(bData.articles)) {
          setBlogCount(bData.articles.length);
        }
      }

      // 3. Fetch Web Visits
      const vRes = await fetch('/api/admin/visits', { headers });
      if (vRes.ok) {
        const vData = await vRes.json();
        setVisits(vData.recentVisits || []);
        setPageStats(vData.pageStats || []);
        setTotalVisits(vData.totalVisits || 0);
      }

      // 4. Fetch Audit Logs (Ley 21.719)
      const aRes = await fetch('/api/admin/audit-logs', { headers });
      if (aRes.ok) {
        const aData = await aRes.json();
        setAuditLogs(aData);
      }

      // 5. Fetch Rex+ Jobs
      const jRes = await fetch('/api/jobs?includeInactive=true');
      if (jRes.ok) {
        const jData = await jRes.json();
        if (jData.success && Array.isArray(jData.jobs)) {
          setJobs(jData.jobs);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncJobs = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/jobs/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.result) {
        alert(`Sincronización completada con éxito:\n\n• Ofertas encontradas: ${data.result.found_count}\n• Nuevas creadas: ${data.result.created_count}\n• Actualizadas: ${data.result.updated_count}\n• Desactivadas: ${data.result.deactivated_count}`);
        fetchDashboardData();
      } else {
        alert(`Fallo en la sincronización: ${data.result?.error_details || data.error || 'Error desconocido'}`);
      }
    } catch (err: any) {
      alert(`Error de red al sincronizar: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const deleteLead = async (id: string) => {
    const confirmMsg = '¿Estás seguro de eliminar este contacto comercial de manera permanente? (Ejercicio de derecho de supresión Ley 21.719)';
    if (!window.confirm(confirmMsg)) return;

    try {
      const headers = {
        'Authorization': `Bearer ${session?.access_token || ''}`
      };
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE', headers });
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
            className={`admin-nav-item ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            🏢 Solicitudes B2B
            {leads.length > 0 && <span className="tab-badge">{leads.length}</span>}
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'blog' ? 'active' : ''}`}
            onClick={() => setActiveTab('blog')}
          >
            📰 Gestión de Blog (CMS)
            {blogCount > 0 && <span className="tab-badge">{blogCount}</span>}
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            💼 Ofertas Rex+
            {jobs.filter(j => j.active).length > 0 && (
              <span className="tab-badge">{jobs.filter(j => j.active).length}</span>
            )}
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            🛡️ Auditoría (Ley 21.719)
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'traffic' ? 'active' : ''}`}
            onClick={() => setActiveTab('traffic')}
          >
            📈 Tráfico y Visitas
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
            {activeTab === 'overview' && 'Dashboard de Operaciones y Cumplimiento'}
            {activeTab === 'leads' && 'Bandeja de Contactos B2B (Empresas)'}
            {activeTab === 'blog' && 'Gestión de Blog (CMS): Crear, Editar, Eliminar y Maquetar Artículos'}
            {activeTab === 'jobs' && 'Gestión y Sincronización de Ofertas (Rex+)'}
            {activeTab === 'traffic' && 'Análisis de Tráfico Anónimo'}
            {activeTab === 'audit' && 'Bitácora de Auditoría Legal (Ley 21.719)'}
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
                  <div className="stat-icon">🏢</div>
                  <div className="stat-value">{leads.length}</div>
                  <div className="stat-label">Solicitudes B2B</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📰</div>
                  <div className="stat-value">{blogCount}</div>
                  <div className="stat-label">Artículos Blog CMS</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💼</div>
                  <div className="stat-value">{jobs.filter(j => j.active).length}</div>
                  <div className="stat-label">Ofertas Rex+ Activas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-value">{totalVisits}</div>
                  <div className="stat-label">Visitas Totales a la Web</div>
                </div>
              </div>

              <div className="dashboard-double-panel">
                <div className="recent-activity-panel">
                  <h3>Últimas Acciones de Auditoría (Ley 21.719)</h3>
                  <div className="activity-list">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="activity-item">
                        <span className="activity-time">{new Date(log.timestamp).toLocaleString('es-CL')}</span>
                        <p className="activity-text">
                          Acceso administrativo registrado: <strong>{log.action}</strong>
                        </p>
                      </div>
                    ))}
                    {auditLogs.length === 0 && <p className="empty-text">Sin actividad reciente registrada.</p>}
                  </div>
                </div>

                <div className="quick-actions-panel">
                  <h3>Exportación Consolidada de Datos</h3>
                  <p>Descarga copias locales estructuradas conforme al derecho de portabilidad y auditorías externas.</p>
                  <div className="action-buttons">
                    <button className="btn-action" onClick={() => handleExportData(leads, 'b2b_leads')}>
                      📥 Descargar Leads B2B (JSON)
                    </button>
                    <button className="btn-action" onClick={() => handleExportData(auditLogs, 'auditoria_ley_21719')}>
                      📥 Descargar Bitácora Legal (JSON)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEADS B2B */}
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
                          <button className="btn-table-action delete" onClick={() => deleteLead(l.id)}>
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

          {/* TAB 3: GESTIÓN DE BLOG CMS */}
          {activeTab === 'blog' && (
            <BlogArticleAdapter session={session} />
          )}

          {/* TAB 4: OFERTAS REX+ */}
          {activeTab === 'jobs' && (
            <div className="jobs-tab">
              <div className="jobs-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#f8fafc' }}>Catálogo de Ofertas Laborales</h3>
                  <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                    Sincronización directa con el portal de empleo ATS Rex+. Postulaciones derivadas 100% al ATS.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    className="btn-action" 
                    onClick={handleSyncJobs}
                    disabled={isSyncing}
                    style={{ background: '#00b4ff', color: '#091726', fontWeight: 'bold' }}
                  >
                    {isSyncing ? '⏳ Sincronizando...' : '🔄 Sincronizar Ahora con Rex+'}
                  </button>
                  <a 
                    href="https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-action"
                    style={{ background: '#1e5591', color: '#fff', textDecoration: 'none' }}
                  >
                    ↗️ Abrir Portal Rex+
                  </a>
                </div>
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Cargo / Título</th>
                      <th>Área</th>
                      <th>Ubicación</th>
                      <th>Jornada</th>
                      <th>Estado</th>
                      <th>Publicado</th>
                      <th>Enlace Rex+</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.external_id || job.id}>
                        <td><strong>{job.title}</strong></td>
                        <td>{job.area || '-'}</td>
                        <td>{job.location || '-'}</td>
                        <td>{job.work_type || '-'}</td>
                        <td>
                          {job.active ? (
                            <span className="status-badge active" style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                              ● Activa
                            </span>
                          ) : (
                            <span className="status-badge inactive" style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                              Cerrada
                            </span>
                          )}
                        </td>
                        <td>{job.published_at ? new Date(job.published_at).toLocaleDateString('es-CL') : '-'}</td>
                        <td>
                          <a 
                            href={job.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#00b4ff', textDecoration: 'underline', fontSize: '0.85rem' }}
                          >
                            Ver en Rex+ ↗
                          </a>
                        </td>
                      </tr>
                    ))}
                    {jobs.length === 0 && (
                      <tr>
                        <td colSpan={7} className="empty-row">No hay ofertas sincronizadas aún. Haz clic en "Sincronizar Ahora con Rex+".</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: AUDITORÍA LEY 21.719 */}
          {activeTab === 'audit' && (
            <div className="audit-tab">
              <div className="table-header-controls">
                <p>Trazabilidad legal obligatoria conforme a la Ley 21.719. Registra accesos y modificaciones sobre datos de contactos comerciales.</p>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Fecha / Hora</th>
                      <th>Acción</th>
                      <th>Responsable</th>
                      <th>Dirección IP (Protegida)</th>
                      <th>Agente / Navegador</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td>{new Date(log.timestamp).toLocaleString('es-CL')}</td>
                        <td><span className="action-tag">{log.action}</span></td>
                        <td>{log.performed_by}</td>
                        <td><code>{log.ip_address}</code></td>
                        <td className="ua-cell" title={log.user_agent}>{log.user_agent}</td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="empty-row">No hay eventos de auditoría registrados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: TRAFFIC / VISITS */}
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
                            style={{ width: `${(stat.count / Math.max(...pageStats.map(s => s.count || 1))) * 100}%` }}
                          ></div>
                          <span className="ranking-count">{stat.count} vistas</span>
                        </div>
                      </div>
                    ))}
                    {pageStats.length === 0 && <p className="empty-text">Sin datos de tráfico registrados.</p>}
                  </div>
                </div>

                <div className="recent-visits-panel">
                  <h3>Historial de Visitas (Anonimizado)</h3>
                  <div className="visits-table-wrapper">
                    <table className="admin-table simple">
                      <thead>
                        <tr>
                          <th>Hora</th>
                          <th>Página</th>
                          <th>Origen</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visits.slice(0, 15).map((v) => (
                          <tr key={v.id}>
                            <td>{new Date(v.timestamp).toLocaleTimeString('es-CL')}</td>
                            <td>{v.page_path}</td>
                            <td>{v.referrer ? new URL(v.referrer).hostname : 'Directo'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
