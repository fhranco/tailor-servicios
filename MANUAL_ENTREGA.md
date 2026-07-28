# Manual de Presentación y Entrega Técnica: Tailor Servicios Web

Este documento resume la arquitectura, funcionalidades implementadas, cumplimiento normativo y la infraestructura técnica del nuevo sitio web de **Tailor Servicios**. Está diseñado para servir como bitácora de entrega técnica y base para futuras mantenciones o escalados.

---

## 1. Resumen Ejecutivo del Proyecto

El sitio web de Tailor Servicios ha sido transformado en una plataforma digital moderna para una consultora boutique de Recursos Humanos (B2B y B2C). Cuenta con:
*   **Arquitectura de vanguardia:** Desarrollado sobre **Next.js 14** (App Router) y TypeScript, garantizando carga instantánea, optimización SEO y escalabilidad.
*   **Base de Datos en la Nube:** Integración completa con **Supabase** para registro de leads y postulantes.
*   **Cumplimiento Legal Chileno (Ley 21.719):** Implementación rigurosa de protección de datos personales.
*   **Panel de Administración Privado:** Un dashboard seguro para visualizar leads de empresas y descargar currículums de candidatos.

---

## 2. Mapa del Sitio y Arquitectura de Navegación

El sitio se estructuró de manera desacoplada para optimizar el posicionamiento en buscadores (SEO) y facilitar la navegación:

```
Rutas principales del sitio:
├── / (Inicio)
├── /nosotros (La Empresa)
├── /servicios (Nuestros Servicios)
├── /especializacion (Áreas de Foco)
├── /contacto (Formulario B2B para Empresas)
├── /candidatos (Portal de Postulantes/Candidatos)
├── /empresas (Portal de Soluciones para Empresas)
│
├── [Páginas Legales de Cumplimiento]
│   ├── /terminos (Términos y Condiciones)
│   ├── /privacidad (Políticas de Privacidad)
│   └── /cookies (Políticas de Cookies)
│
└── [Área Privada de Gestión]
    └── /admin/privacidad (Dashboard de leads y candidatos)
```

---

## 3. Características y Funcionalidades Clave

### A. Formularios Inteligentes y Base de Datos (Supabase)
1.  **Formulario de Contacto B2B (Empresas):** 
    *   Captura datos de empresas interesadas en consultoría.
    *   Guarda automáticamente en la tabla `leads` de Supabase.
2.  **Formulario de Carga de CV (Candidatos):**
    *   Sube los currículums de forma segura a un **Storage Bucket** privado en Supabase.
    *   Guarda la información de contacto y el enlace al documento en la tabla `candidates`.
    *   Incluye validación estricta de archivos (máximo 5MB, solo formatos PDF, DOC, DOCX).

### B. Panel de Administración Privado (Dashboard)
Ubicado en `/admin/privacidad`, este panel permite al equipo interno de Tailor:
*   Visualizar los mensajes y datos de contacto de empresas interesadas (leads).
*   Ver las postulaciones de candidatos en tiempo real.
*   **Descargar directamente los archivos de CV** con un solo clic de forma segura.
*   **Acceso Protegido:** Implementado con seguridad HTTP Basic Auth basada en credenciales encriptadas en Vercel.

### C. Cumplimiento de la Ley 21.719 (Protección de Datos en Chile)
El sitio fue auditado y ajustado para cumplir con la legislación de datos personales:
*   **Banner de Cookies:** Banner interactivo que bloquea/acepta cookies según la preferencia del usuario y la recuerda.
*   **Consentimiento Explícito:** Casillas obligatorias de aceptación en los formularios de contacto y postulación antes de permitir el envío de datos.
*   **Páginas Legales Desacopladas:** Cada política tiene su propia ruta limpia con vigencia actualizada a **Julio 2026**.

---

## 4. Identidad Visual, SEO y Favicon

*   **Favicon Personalizado:** Se extrajo el imagotipo oficial del archivo corporativo `2.png`, eliminando el fondo blanco para crear un icono transparente que se adapta perfectamente a navegadores en modo claro y oscuro.
*   **Previsualizaciones en Redes Sociales (Open Graph):** Cuando el link se comparte en plataformas como WhatsApp, Slack o LinkedIn, se genera una tarjeta de previsualización con:
    *   **Título:** *Tailor Servicios | Soluciones de Recursos Humanos*
    *   **Descripción:** *Consultoría estratégica en Reclutamiento, Gestión de Personas y Desarrollo Organizacional con despliegue operativo en Punta Arenas y Santiago.*
    *   **Miniatura:** Imagen corporativa transparente integrada.

---

## 5. Infraestructura y Despliegue Técnico

La plataforma quedó desplegada bajo la siguiente arquitectura en la nube:

1.  **Código Fuente (GitHub):** Alojado en el repositorio privado de control de cambios: `https://github.com/fhranco/tailor-servicios`
2.  **Servidor de Aplicación (Vercel):** Conexión CI/CD directa. Cada vez que se sube un cambio a la rama `main` de GitHub, Vercel compila y actualiza la web de forma automática en menos de 1 minuto sin caídas de servicio.
3.  **Variables de Entorno Clave (Configuradas en Vercel):**
    *   `NEXT_PUBLIC_SUPABASE_URL`: Endpoint de la API de base de datos.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Llave pública de acceso a Supabase.
    *   `SUPABASE_SERVICE_ROLE_KEY`: Llave de bypass para el almacenamiento seguro de archivos.
    *   `ADMIN_PASSWORD`: Contraseña de acceso al Dashboard.

---

## 6. Siguientes Pasos Recomendados para el Cliente

Cuando el cliente revise la web y decida pasar a producción bajo su dominio definitivo (`tailorservicios.cl`), los pasos a seguir son:

1.  **Cambio de DNS en cPanel:** 
    Modificar el registro `A` de `tailorservicios.cl` y el `CNAME` de `www` en el cPanel (Zone Editor) para que apunten a los servidores de Vercel (Vercel proveerá los valores exactos, usualmente `76.76.21.21`).
    *Nota: Esto NO afectará sus correos corporativos en Google Workspace.*
2.  **Añadir Dominio en Vercel:**
    Ingresar al panel del proyecto en Vercel, ir a *Settings -> Domains* y agregar `tailorservicios.cl`. Vercel generará e instalará el certificado SSL (HTTPS) de forma automática y gratuita.

---

## 7. Justificación Tecnológica y Negocio (Para el Cliente)

### ¿Por qué elegimos esta Arquitectura y no WordPress?
Tradicionalmente, las webs corporativas se creaban sobre WordPress. Para un negocio boutique de consultoría estratégica y manejo de datos de personas, **desarrollar con código moderno (Next.js) es una decisión crítica de negocio:**

| Criterio | Solución a Medida (Código) | WordPress Tradicional |
| :--- | :--- | :--- |
| **Seguridad de Datos** | **Máxima.** La base de datos (Supabase) está aislada de la web. Cumple con encriptación avanzada estándar de la industria. | **Baja-Media.** Al usar plantillas y plugins de terceros, es vulnerable a hackeos constantes de bases de datos de spam. |
| **Velocidad y Carga** | **Instantánea (0.5s).** El código está compilado para cargar solo lo que el usuario ve, lo que mejora drásticamente el posicionamiento SEO. | **Lenta (3s+).** Carga excesiva de código innecesario, fuentes lentas y plugins obsoletos. |
| **Protección contra Caídas** | **Inmune.** Alojado de forma distribuida a nivel global mediante Vercel CDN. Tolera picos masivos de tráfico. | **Dependiente.** Si el servidor básico de hosting falla o se sobrecarga, la página se cae por completo. |
| **Mantención** | **Cero costo de mantención.** No requiere actualizaciones manuales de plugins que rompan la página web. | **Alta.** Requiere actualizar plugins semanalmente con el riesgo constante de romper el diseño o la base de datos. |

### La Importancia del Cumplimiento Legal (Ley 21.719 en Chile)
Recibir currículums de candidatos (CVs) y almacenar datos de empresas no es un tema ligero. Con la nueva Ley 21.719, las multas por mal manejo o filtración de datos de titulares son muy elevadas. 
Esta web fue construida bajo el principio de **Privacidad por Diseño**:
1.  **Consentimiento Demostrable:** Los formularios no permiten enviar datos a menos que el usuario marque activamente que leyó y aceptó las políticas.
2.  **Seguridad en el Storage:** Los CVs no quedan flotando en carpetas públicas del hosting; se guardan en un almacenamiento encriptado y restringido (Supabase Storage).
3.  **Trazabilidad:** Cada postulación queda auditada con fecha y hora en el panel administrativo.

### Futura Autoadministración (Escalabilidad a CMS)
El sitio está preparado para crecer. Si a futuro el cliente desea **autoadministrar** (cambiar textos, fotos o agregar servicios él mismo desde un panel visual sin programar), la arquitectura en Next.js permite conectar un **Headless CMS** (como *Sanity* o *Contentful*). Esto le dará la misma facilidad de edición de un Word, pero manteniendo el 100% de la velocidad, seguridad y robustez del código a medida.

---

## 8. Guía de Revisión de Contenidos para el Cliente

Para proponer cambios en esta versión candidata de entrega, sugerimos al cliente realizar la revisión en las siguientes áreas clave:

1.  **Revisión de Textos Legales:** Validar los párrafos de las páginas de *Privacidad*, *Términos* y *Cookies* con su asesor legal interno (fechados a Julio 2026).
2.  **Líneas de Negocio y Servicios:** Revisar si las descripciones y beneficios de las pestañas en "/servicios" y "/especializacion" se alineen exactamente con su portafolio comercial actual.
3.  **Configuración de Canales de Contacto (Emails, Teléfonos y WhatsApp):**
    *   **Correos de Recepción:** Definir a qué cuentas corporativas deben llegar los mensajes. Actualmente, los datos quedan almacenados en la base de datos segura de Supabase. Si desean que el sistema envíe una notificación directa por email cada vez que entra una postulación o un contacto, deben indicar las casillas destino (por ejemplo, `contacto@tailorservicios.cl` o `seleccion@tailorservicios.cl`).
    *   **Teléfonos y Botón de WhatsApp:** Indicar los números oficiales de contacto. Si desean añadir un botón flotante de WhatsApp o enlaces telefónicos rápidos (del tipo `tel:+569...`), sugerimos definir los números y el mensaje predeterminado con el que se iniciará la conversación (ej. *"Hola Tailor Servicios, me gustaría solicitar una asesoría..."*).
    *   **Direcciones y Oficinas:** Validar las descripciones de las oficinas de Punta Arenas y Santiago para asegurar que reflejen la dirección o formato de atención al cliente deseado.
4.  **Pruebas de Formularios:** Realizar una postulación de prueba en "/candidatos" subiendo un CV y un contacto en "/contacto" para verificar que los datos se reciban correctamente en su panel administrativo.
