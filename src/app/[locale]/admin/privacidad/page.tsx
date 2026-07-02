import PrivacyDashboard from '@/components/PrivacyDashboard';

export default function AdminPrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem 0' }}>
      <div className="fluid-container">
        <h1 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Dashboard de Privacidad (Ley 21.719)</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Gestión de datos personales, consentimientos y derechos ARCO.
        </p>
        
        <PrivacyDashboard />
      </div>
    </main>
  );
}
