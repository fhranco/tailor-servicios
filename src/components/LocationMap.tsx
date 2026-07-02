import React from 'react';

export default function LocationMap() {
  return (
    <section className="location-map" style={{ width: '100%', height: '400px', lineHeight: 0, display: 'block' }}>
      <iframe 
        src="https://maps.google.com/maps?q=-53.18290904460772,-70.92669473582545&hl=es&z=15&output=embed" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen={false} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación Tailor Servicios"
      ></iframe>
    </section>
  );
}
