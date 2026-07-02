# Contexto de Privacidad del Proyecto

## Proyecto
Tailor Servicios Website (Plataforma Web B2B)

## Negocio
Empresa consultora de Recursos Humanos ubicada en Punta Arenas, especializada en prestar servicios a otras empresas (B2B). Sus principales líneas de servicio son Reclutamiento y Selección, Gestión de Personas y Desarrollo Organizacional.

## Usuarios
- Clientes corporativos (Leads B2B).
- Representantes de empresas, tomadores de decisión o encargados de RRHH en la Región de Magallanes y a nivel nacional.

## Datos que hoy se capturan
- Nombre y Apellido (del representante de la empresa)
- Correo electrónico corporativo
- Nombre de la Empresa / Organización
- Preferencias (Línea de servicio en la que están interesados)
- Timestamp de consentimiento (Fecha y hora de aceptación de políticas)

*(Actualmente **NO** se captura: RUT, Teléfono, Dirección personal, Datos de reserva, Datos de pago, ni Geolocalización activa, minimizando el riesgo).*

## Sistemas e integraciones
- **Sitio web:** Desarrollado a medida en React/Next.js.
- **Integraciones pendientes por definir:**
  - *Backend/CRM:* (Aún no conectado. Actualmente el formulario simula un envío, pero requerirá conexión a un CRM como HubSpot, Pipedrive o un webhook tipo n8n/Zapier).
  - *Analytics:* Pendiente definir si se usará Google Analytics (requerirá banner de cookies).
  - *Email marketing:* Pendiente de definir plataforma para envío de propuestas.

## Riesgos o dudas actuales
- **Consentimiento claro:** ✅ Mitigado. El formulario principal ya cuenta con checkbox explícito, trazabilidad de timestamp y aviso de privacidad simplificado.
- **Flujo para eliminar datos:** ⚠️ Pendiente. Falta definir e implementar en el futuro CRM o base de datos un proceso estandarizado (SLA) para borrar datos cuando llegue un correo a `privacidad@tailorservicios.cl` (correo oficial definido para estos fines).
- **Registro de solicitudes de titulares:** ✅ Designado. René Bravo será la persona encargada en Tailor Servicios de llevar el registro operativo de las solicitudes de los usuarios (derechos ARCO).
- **Terceros que reciben datos:** ⚠️ Pendiente. Una vez que conectemos el formulario a un servidor o CRM real, habrá que actualizar la Política de Privacidad declarando explícitamente qué empresa de software procesará esos datos como "Encargado de Tratamiento".
