import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4.5rem', margin: '0 0 1rem 0', color: 'var(--color-rojo, #be1622)', fontWeight: 800 }}>404</h1>
      <h2 style={{ fontSize: '1.75rem', margin: '0 0 1rem 0', color: 'var(--color-dark, #0f172a)' }}>Página no encontrada</h2>
      <p style={{ color: 'var(--color-gray-dark, #64748b)', maxWidth: '480px', lineHeight: 1.6, marginBottom: '2rem' }}>
        La página que buscas no existe o ha sido trasladada a una nueva ubicación.
      </p>
      <Link 
        href="/" 
        style={{ 
          backgroundColor: 'var(--color-verde, #8ec53c)', 
          color: '#ffffff', 
          padding: '0.85rem 1.75rem', 
          borderRadius: '6px', 
          textDecoration: 'none', 
          fontWeight: 700 
        }}
      >
        Volver al inicio
      </Link>
    </main>
  );
}
