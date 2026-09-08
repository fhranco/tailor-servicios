# Manual de Presentación y Entrega Técnica: Tailor Servicios Web

Este documento resume la arquitectura, funcionalidades implementadas, cumplimiento normativo y la infraestructura técnica del sitio web de **Tailor Servicios**. Está diseñado para servir como bitácora de entrega técnica, guía operativa y base para futuras mantenciones o escalados.

---

## 1. Resumen Ejecutivo del Proyecto

El sitio web de Tailor Servicios ha sido transformado en una plataforma digital moderna para una consultora boutique de Recursos Humanos (B2B y B2C). Cuenta con:
*   **Arquitectura de vanguardia:** Desarrollado sobre **Next.js 14** (App Router) y TypeScript, garantizando carga instantánea, optimización SEO y máxima escalabilidad.
*   **Integración y Sincronización con Rex+:** Sincronización automatizada de ofertas laborales en tiempo real con el portal oficial de Rex+, actuando este último como la **única fuente de verdad** del portal.
*   **Cero Retención de CVs (Privacidad por Diseño):** Cumplimiento riguroso de la **Ley 21.719** de Protección de Datos Personales en Chile. No se almacenan archivos ni currículums en bases de datos locales; las postulaciones se derivan directamente al portal oficial de selección de Rex+.
*   **Base de Datos en la Nube:** Integración con **Supabase** para registro de leads corporativos B2B y trazabilidad de sincronizaciones.
*   **Panel de Administración Privado:** Un dashboard seguro para visualizar leads de empresas y gestionar/monitorear la sincronización de ofertas con Rex+.

---

## 2. Mapa del Sitio y Arquitectura de Navegación

El sitio se estructuró de manera desacoplada para optimizar el posicionamiento en buscadores (SEO) y facilitar la navegación:

```
Rutas principales del sitio:
├── / (Inicio - Incluye Marquesina Ticker de Ofertas Rex+ en tiempo real)
├── /nosotros (La Empresa y Valores)
├── /servicios (Nuestros Servicios de Consultoría)
├── /especializacion (Áreas de Foco)
├── /contacto (Formulario B2B para Empresas)
├── /candidatos (Portal de Empleo - Carrusel Dinámico conectado a Rex+)
├── /empresas (Portal de Soluciones para Empresas)
│
├── [Páginas Legales de Cumplimiento]
│   ├── /terminos (Términos y Condiciones)
│   ├── /privacidad (Políticas de Privacidad)
│   └── /cookies (Políticas de Cookies)
│
└── [Área Privada de Gestión]
    └── /admin (Dashboard de leads y sincronización Rex+)
```

---

## 3. Módulo de Integración y Sincronización con Rex+

### A. Rex+ como Única Fuente de Verdad
*   **URL Fuente:** `https://serviciosindustrialetailor.rexmas.com/jobs/tailor-servicios`
*   **Endpoint API:** `https://api.rexmas.com/seleccion/public/jobs_portal/5/publications`
*   **Principio Operativo:** Toda vacante creada, modificada o cerrada en Rex+ se refleja automáticamente en el sitio web sin requerir doble digitación manual.

### B. Ciclo de Actualización Automática (Cada 12 horas)
1.  **Auto-Sincronización Inteligente en Segundo Plano (SWR):** Al recibir visitas en el sitio, si los datos tienen más de 12 horas de antigüedad, el servidor consulta automáticamente a Rex+ en segundo plano sin ralentizar la navegación del usuario.
2.  **Cron Job en la Nube (`vercel.json`):** Programado para ejecutarse dos veces al día (a las 08:00 y a las 20:00 UTC) mediante Vercel Crons.
3.  **Sincronización Manual Inmediata:** Si el equipo de Selección publica una oferta urgente, puede presionar el botón *"🔄 Sincronizar Ahora con Rex+"* en el panel administrativo `/admin` para verla reflejada en 2 segundos.
4.  **Comando de Consola:** También se puede forzar desde la terminal con `npm run sync-jobs`.

### C. Salvaguardas y Resiliencia
*   **Desactivación Lógica (Soft-Delete):** Las ofertas eliminadas en Rex+ se marcan como `active = false`. Nunca se borran registros físicos para mantener la trazabilidad histórica.
*   **Bloqueo ante Anomalías:** Si Rex+ devuelve 0 ofertas de forma anómala (por ejemplo, por una caída temporal del servicio de Rex+), el sistema congela la base de datos para no dar de baja las ofertas activas por error.
*   **Caché Local de Respaldo:** El sistema almacena una copia local en `scratch/jobs_cache.json` para responder con latencia cero (0 ms) ante cualquier eventualidad.

---

## 4. Características y Funcionalidades Clave

### A. Formularios Inteligentes y Base de Datos (Supabase)
1.  **Formulario de Contacto B2B (Empresas):** 
    *   Captura datos de empresas interesadas en consultoría y servicios.
    *   Registra en la tabla `leads` y despacha notificación inmediata vía correo corporativo.
2.  **Portal de Candidatos (Postulantes):**
    *   Muestra dinámicamente las vacantes activas sincronizadas desde Rex+.
    *   Al hacer clic en cualquier oferta (*"Ver Oferta y Postular"*), el postulante es redirigido directamente al formulario oficial de Rex+.
    *   **Cero Almacenamiento de CVs:** No se capturan ni retienen archivos en el servidor web de Tailor Servicios, eliminando riesgos de fuga de información de personas.

### B. Panel de Administración Privado (Dashboard `/admin`)
Permite al equipo interno de Tailor:
*   Visualizar y dar seguimiento a los mensajes de empresas interesadas (leads).
*   Monitorear el estado de las ofertas de empleo de Rex+ (activas, inactivas, fecha de publicación).
*   Forzar la sincronización instantánea con Rex+ con un solo clic.
*   Revisar el registro de auditoría (`job_sync_logs`) con fecha, hora y resultado de cada sincronización.
*   **Acceso Protegido:** Autenticación segura mediante credenciales administrativas.

### C. Cumplimiento de la Ley 21.719 (Protección de Datos en Chile)
*   **Banner de Cookies:** Bloquea o permite cookies analíticas según la decisión del usuario.
*   **Minimización Estricta:** Solo se recaban datos B2B proporcionales a la finalidad de contacto comercial.
*   **Consentimiento Informado:** Checkbox obligatorio antes de enviar cualquier formulario.
*   **Páginas Legales:** Términos, Privacidad y Cookies actualizadas a normativa vigente.

---

## 5. Identidad Visual, SEO y Favicon

*   **Marquesina Ticker de Ofertas:** Cintillo visual dinámico en la parte superior con indicador de vacantes en vivo (*pulse animation*), que se oculta automáticamente si no hay vacantes activas y se pausa al pasar el cursor.
*   **Favicon Personalizado:** Imagotipo oficial corporativo con fondo transparente optimizado para temas claro y oscuro.
*   **Previsualizaciones en Redes Sociales (Open Graph):** Metadatos optimizados para WhatsApp, LinkedIn y buscadores:
    *   **Título:** *Tailor Servicios | Soluciones de Recursos Humanos*
    *   **Descripción:** *Consultoría estratégica en Reclutamiento, Gestión de Personas y Desarrollo Organizacional con despliegue operativo en Punta Arenas y Santiago.*

---

## 6. Infraestructura y Despliegue Técnico

La plataforma está preparada para operar bajo la siguiente infraestructura:

1.  **Código Fuente (GitHub):** Alojado en el repositorio de control de versiones `fhranco/tailor-servicios`.
2.  **Alojamiento y Servidor de Aplicación (Vercel):**
    *   Despliegue continuo (CI/CD) automático al subir cambios a la rama principal.
    *   Ejecución de Cron Jobs automáticos cada 12 horas según [`vercel.json`](file:///Users/patagoniacoach/.gemini/antigravity-ide/scratch/Tailor%20Servicio/vercel.json).
3.  **Variables de Entorno Clave:**
    *   `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto en Supabase.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Llave pública anónima de Supabase.
    *   `SUPABASE_SERVICE_ROLE_KEY`: Llave de administración para tareas internas del servidor.
    *   `ADMIN_PASSWORD`: Contraseña de acceso al Dashboard `/admin`.
    *   `SMTP_*`: Credenciales para el despacho de correos de contacto corporativo.

---

## 7. Configuración de Dominio para Paso a Producción (`tailorservicios.cl`)

Para apuntar el dominio final a la plataforma en Vercel:

1.  **En cPanel / DNS Provider:**
    *   Registro `A` para `tailorservicios.cl` apuntando a la IP de Vercel: `76.76.21.21`
    *   Registro `CNAME` para `www.tailorservicios.cl` apuntando a `cname.vercel-dns.com`
    *(Esto no altera la operación de correos corporativos en Google Workspace ni otros servicios MX).*
2.  **En el Panel de Vercel:**
    *   Ir a *Settings -> Domains*, ingresar `tailorservicios.cl` y `www.tailorservicios.cl`. Vercel gestionará el certificado SSL/HTTPS de forma automática.

---

## 8. Verificación y Pruebas Realizadas

| Caso de Prueba | Descripción | Resultado |
| :--- | :--- | :--- |
| **API Rex+ Connection** | Consulta al endpoint REST con cabecera `X-Tenant-Subdomain` | **Exitoso (2 ofertas reales extraídas)** |
| **Job Ticker (Home)** | Marquesina animada visible con pausa en hover | **Operativo** |
| **Job Carousel (/candidatos)** | Tarjetas con título, ubicación, área y redirección Rex+ | **Operativo** |
| **Admin Dashboard (/admin)** | Pestaña *💼 Ofertas Rex+* y botón de sincronización | **Operativo** |
| **Protección contra Anomalías** | Bloqueo de desactivación masiva si Rex+ reporta 0 | **Verificado (Test suite 100%)** |
| **Compilación TypeScript** | Verificación estática con `npx tsc --noEmit` | **0 Errores** |
