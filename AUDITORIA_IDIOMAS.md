# Informe Técnico de Auditoría: Implementación Multilingüe (ES/EN)
**Proyecto:** Tailor Servicios (Sitio Corporativo y Plataforma B2B / Candidatos)  
**Fecha de Actualización:** 15 de Septiembre de 2026  
**Auditoría Externa:** Arquitectura i18n, Enrutamiento, SEO Internacional, Seguridad y Tratamiento de Datos (Ley 21.719 - Chile)  
**Estado:** Correcciones locales implementadas y verificadas mediante compilación de producción, pruebas HTTP con `curl` y pruebas interactivas automatizadas de navegador.

---

## 1. CONTEXTO Y CAMBIOS

### 1.1 Dependencias e Infraestructura
* **Next.js:** Versión `14.2.5` (App Router).
* **Librería i18n:** `next-intl` versión `4.13.0` (declarada en `package.json` como `^4.13.0`).
* **Renderizado:** React `18.3.1`, React DOM `18.3.1`.
* **Tipado:** TypeScript `5.x` (validado con `tsc --noEmit`, salida código 0).
* **Compilación de Producción:** Ejecutada localmente con `next build` (41 páginas estáticas generadas sin errores).
* **Router Utilizado:** **Next.js App Router** bajo la estructura de segmentos dinámicos de idioma `src/app/[locale]/...`.

### 1.2 Estado de Control de Versiones (Git)
* **Rama Activa:** `main` (alineada localmente con `origin/main`).
* **Commit Base de Comparación:** `b6af48df449da6a208302e31beb985c7a60ecfcd`  
  *(fix(seo,perf,security): optimize robots.txt, harden CSP, refine preloads, add multilingual alternates and private cache headers)*.
* **Estado Local vs Publicado:**
  * **Publicado en repositorio remoto:** Estructura base previa del proyecto y cabeceras OWASP.
  * **Exclusivamente en local (Sin commit ni push):**
    1. Desactivación de detección automática de idioma (`localeDetection: false` en `src/i18n/routing.ts`).
    2. Corrección de `robots.txt` (`src/app/robots.ts`) retirando `/admin` de `disallow` para permitir a los rastreadores leer la directiva `noindex`, complementado con `X-Robots-Tag: noindex, nofollow, noarchive` en `next.config.mjs`.
    3. Eliminación de la etiqueta `canonical` de administración apuntando a la portada (`alternates: { canonical: null }` en `admin/layout.tsx`).
    4. Sustitución de `next/link` y etiquetas `<a>` duras por el componente de navegación localizada `@/i18n/routing` en `blog/page.tsx`, `HeroDual.tsx`, `AboutUsBlock.tsx`, `not-found.tsx`, `B2B_LeadForm.tsx` y `B2C_Dropzone.tsx`.
    5. Retiro del enlace público "Mi Cuenta" (`/admin`) en `Header.tsx` (tanto en versión escritorio como menú móvil).
    6. Refactorización de `LanguageSwitcher.tsx`:
       - Sincronización dinámica de anclas con eventos `hashchange` y `popstate`.
       - Limpieza automática del ancla si no pertenece a la lista permitida de la página actual (`VALID_PAGE_ANCHORS`).
       - Comprobación previa de existencia de la ruta destino (`VALID_ROUTES`), con fallback al home en rutas desconocidas.
       - Fallback neutro de `Suspense` sin marcar `ES` como activo de forma fija.
    7. Refactorización de `LanguageSwitcher.css`:
       - Área táctil mínima de 44 × 44 px en cada opción del menú móvil (WCAG 2.5.5 / 2.5.8).
       - Estilos de foco visible (`:focus-visible`), contraste optimizado y sin duplicación de selectores en escritorio.
    8. Ajuste factual en `CandidateVideoModal.security_badge`: eliminación de afirmaciones de cumplimiento no verificables y sustitución por descripción objetiva del flujo de redirección hacia Rex+ bajo la Ley 21.719.
    9. Archivo unificado de diferencias [DIFF_I18N.patch](file:///Users/patagoniacoach/.gemini/antigravity-ide/scratch/Tailor%20Servicio/DIFF_I18N.patch) (175 KB, 3.355 líneas).

---

## 2. ARQUITECTURA DE IDIOMAS Y ENRUTAMIENTO

### 2.1 Configuración Central
En `src/i18n/routing.ts`:
```typescript
import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  localeDetection: false // Desactiva la inferencia por cookies y Accept-Language
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
```

### 2.2 Diagnóstico Técnico Corregido
* Googlebot habitualmente realiza el rastreo web sin enviar una cabecera `Accept-Language` específica. No se presenta como causa confirmada de indexación una cabecera sin contar con access logs de producción.
* La desactivación de `localeDetection: false` se implementa como la mejor práctica recomendada por Google para asegurar que la URL sea la **única y estricta determinante del idioma**:
  1. `/` y rutas sin prefijo sirven siempre **español**.
  2. `/en` y rutas con prefijo sirven siempre **inglés**.
  3. Ambas versiones permanecen plenamente indexables de forma independiente mediante `canonical` propio y `hreflang` cruzado.

### 2.3 Matriz de Verificación Empírica de `localeDetection: false`
Pruebas ejecutadas sobre el servidor de producción local (`next start` en puerto `3020`):

| Caso de Prueba | URL Solicitada | Cabecera `Accept-Language` | Cookie `NEXT_LOCALE` | Código HTTP | Ubicación Redirigida | Idioma HTML Servido (`lang`) | Título Obtenido |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **Portada ES neutra** | `http://localhost:3020/` | *(Ausente)* | *(Sin cookie)* | `200 OK` | Ninguna | `lang="es"` | Tailor Servicios \| Consultoría en Recursos Humanos... |
| **Portada ES con inglés** | `http://localhost:3020/` | `en-US,en;q=0.9` | *(Sin cookie)* | `200 OK` | Ninguna | `lang="es"` | Tailor Servicios \| Consultoría en Recursos Humanos... |
| **Portada ES con español**| `http://localhost:3020/` | `es-CL,es;q=0.9` | *(Sin cookie)* | `200 OK` | Ninguna | `lang="es"` | Tailor Servicios \| Consultoría en Recursos Humanos... |
| **Portada ES cookie EN** | `http://localhost:3020/` | `en-US,en;q=0.9` | `NEXT_LOCALE=en` | `200 OK` | Ninguna | `lang="es"` | Tailor Servicios \| Consultoría en Recursos Humanos... |
| **Portada ES cookie ES** | `http://localhost:3020/` | `es-CL,es;q=0.9` | `NEXT_LOCALE=es` | `200 OK` | Ninguna | `lang="es"` | Tailor Servicios \| Consultoría en Recursos Humanos... |
| **Portada EN cookie ES** | `http://localhost:3020/en` | `es-CL,es;q=0.9` | `NEXT_LOCALE=es` | `200 OK` | Ninguna | `lang="en"` | Tailor Servicios \| HR Consulting & Talent Acquisition... |
| **Interior ES cookie EN** | `http://localhost:3020/nosotros` | `en-US,en;q=0.9` | `NEXT_LOCALE=en` | `200 OK` | Ninguna | `lang="es"` | Sobre Nosotros \| Tailor Servicios |
| **Interior EN cookie ES** | `http://localhost:3020/en/nosotros` | `es-CL,es;q=0.9` | `NEXT_LOCALE=es` | `200 OK` | Ninguna | `lang="en"` | About Us \| Tailor Servicios |

### 2.4 Verificación de Códigos de Redirección Reales
* `GET /es` $\rightarrow$ **`HTTP 307 Temporary Redirect`** (Cabecera `Location: /`).
* `GET /es/nosotros` $\rightarrow$ **`HTTP 307 Temporary Redirect`** (Cabecera `Location: /nosotros`).
* `GET /es/admin` $\rightarrow$ **`HTTP 307 Temporary Redirect`** (Cabecera `Location: /admin`).
> **Evidencia:** En el servidor de producción local (`next start`), el enrutador de `next-intl` responde con `HTTP 307 Temporary Redirect` y no con `308`.

---

## 3. SELECTOR DE IDIOMAS Y ACCESIBILIDAD

### 3.1 Implementación (`src/components/LanguageSwitcher.tsx`)
* **Conservación Selectiva de Parámetros:** Solo se transfieren parámetros pertinentes (`servicio`, `service`, `categoria`, `category`, `tab`, `q`), descartando tokens o tracking.
* **Manejo de Anclas Específicas por Página:**
  ```typescript
  const VALID_PAGE_ANCHORS: Record<string, string[]> = {
    '/': ['#portales-exclusivos', '#testimonios'],
    '/servicios': ['#reclutamiento', '#gestion', '#desarrollo'],
    '/candidatos': ['#envia-tu-cv', '#ofertas-laborales'],
    '/postulantes': ['#carga-cv'],
    '/privacidad': ['#privacidad'],
    '/cookies': ['#cookies'],
    '/terminos': ['#privacidad', '#cookies'],
  };
  ```
  Al cambiar de página o remover el hash, el selector limpia el ancla. Al conmutar de idioma en una sección con ancla válida (ej. `/servicios#reclutamiento` $\rightarrow$ `/en/servicios#reclutamiento`), el ancla se preserva.
* **Comprobación de Destino:** Si la página actual es una ruta de error o no listada en `VALID_ROUTES`, el selector ofrece el inicio `/` o `/en` del idioma destino.
* **Fallback Neutro en Suspense:**
  ```tsx
  <Suspense fallback={
    <div className={`lang-switcher lang-switcher-${props.variant || 'header'}`} role="group" aria-label="Selector de idioma">
      <span className="lang-btn">ES</span>
      <span className="lang-sep" aria-hidden="true">/</span>
      <span className="lang-btn">EN</span>
    </div>
  }>
  ```
* **Estilos y Usabilidad Táctil (`src/components/LanguageSwitcher.css`):**
  * `.lang-switcher-mobile .lang-btn`: `min-width: 44px; min-height: 44px;` para cumplir WCAG 2.5.5 / 2.5.8.
  * Estados `:focus-visible` con contorno de 2px en color de acento `#008080`.
  * Ratios de contraste: `#475569` sobre blanco (>4.5:1), activo `#0f172a` (>12:1), footer `#cbd5e1` sobre `#0f172a` (>7:1).

### 3.2 Deduplicación y Visibilidad Responsiva en la Cabecera (`Header.tsx` y `Header.css`)
* **Incidencia Corregida:** El selector de idioma móvil (`variant="mobile"`) se encontraba renderizado dentro del listado principal `ul.nav-links`. En pantallas de escritorio (>992px), dicho listado está siempre visible junto con el contenedor `.desktop-actions` (`variant="header"`), provocando que en escritorio se visualizara un selector doble contiguo.
* **Solución Implementada:**
  - Se asignó la clase semántica `mobile-only-lang` al elemento `li` que contiene el selector móvil en `src/components/Header.tsx`.
  - En `src/components/Header.css`, se configuró `.mobile-only-lang { display: none; }` para escritorio y `display: block` bajo `@media (max-width: 992px)`.
  - En `src/components/LanguageSwitcher.css`, se añadieron directivas de respaldo `@media (min-width: 993px) { .lang-switcher-mobile { display: none !important; } }` y `@media (max-width: 992px) { .lang-switcher-header { display: none !important; } }`.
* **Evidencia en Navegador:**
  - Escritorio (1280 × 800): **1 único selector visible** en la barra superior (`.desktop-actions`). Captura: `desktop_header_lang_1789514546080.png`.
  - Móvil (390 × 844): `.desktop-actions` oculto; **1 único selector visible** dentro del drawer desplegable (`.lang-switcher-mobile`). Captura: `mobile_menu_lang_1789514578620.png`.
  - Grabación de verificación: `header_dedup_check_1789514498311.webp`.

---

## 4. EVIDENCIA COMPLETA DE PÁGINAS LEGALES Y METADATOS

### 4.1 CookieBanner y Páginas Legales Conectadas al Diccionario
* **`CookieBanner.tsx`:** Conectado a `useTranslations('CookieBanner')`.
  - Español (`messages/es.json`): `"Utilizamos cookies esenciales para el funcionamiento de este sitio y cookies analíticas para mejorar tu experiencia, en cumplimiento con nuestra Política de Privacidad y Cookies."` (Botones: *"Aceptar"*, *"Solo esenciales"*).
  - Inglés (`messages/en.json`): `"We use essential cookies for the operation of this site and analytics cookies to improve your experience, in compliance with our Privacy and Cookie Policy."` (Botones: *"Accept"*, *"Essential only"*).
* **Páginas Legales (`/privacidad`, `/terminos`, `/cookies`):**
  - Títulos conectados dinámicamente: `{t('privacy_page_title')}`, `{t('cookies_page_title')}`, `{t('page_title')}`.
  - Contenido completo disponible en español e inglés bajo la sección `TerminosPage` de ambos diccionarios (detallando finalidades B2B/Candidatos, ausencia de datos financieros, derechos ARCO ante el encargado de tratamiento y política de cookies).
  - **Separación de Traducción y Asesoría Legal:** Se estipula expresamente que la traducción en inglés es lingüística y debe ser validada jurídicamente por un asesor legal antes de iniciar operaciones formales internacionales.

### 4.2 Inspección de Respuestas GET en Servidor de Producción Local

| URL Relativa | HTTP Status | `html lang` | Título (`<title>`) | `canonical` en HTML | Metadatos Robots (HTML y Cabeceras) | Indexabilidad |
| :--- | :---: | :---: | :--- | :---: | :--- | :---: |
| `/` | `200` | `es` | Tailor Servicios \| Consultoría en Recursos Humanos y Gestión del Talento | `/` | `index, follow` | **Indexable** |
| `/en` | `200` | `en` | Tailor Servicios \| HR Consulting & Talent Acquisition in Chile | `/en` | `index, follow` | **Indexable** |
| `/nosotros` | `200` | `es` | Sobre Nosotros \| Tailor Servicios | `/nosotros` | `index, follow` | **Indexable** |
| `/en/nosotros` | `200` | `en` | About Us \| Tailor Servicios | `/en/nosotros` | `index, follow` | **Indexable** |
| `/servicios` | `200` | `es` | Servicios de Recursos Humanos \| Tailor Servicios | `/servicios` | `index, follow` | **Indexable** |
| `/en/servicios` | `200` | `en` | HR Services & Solutions \| Tailor Servicios | `/en/servicios` | `index, follow` | **Indexable** |
| `/candidatos` | `200` | `es` | Candidatos - Tailor Servicios \| Tailor Servicios | `/candidatos` | `index, follow` | **Indexable** |
| `/en/candidatos` | `200` | `en` | Candidates - Tailor Servicios \| Tailor Servicios | `/en/candidatos` | `index, follow` | **Indexable** |
| `/contacto` | `200` | `es` | Contacto \| Tailor Servicios | `/contacto` | `index, follow` | **Indexable** |
| `/en/contacto` | `200` | `en` | Contact Us \| Tailor Servicios | `/en/contacto` | `index, follow` | **Indexable** |
| `/privacidad` | `200` | `es` | Política de Privacidad \| Tailor Servicios | `/privacidad` | `index, follow` | **Indexable** |
| `/en/privacidad` | `200` | `en` | Privacy Policy \| Tailor Servicios | `/en/privacidad` | `index, follow` | **Indexable** |
| `/terminos` | `200` | `es` | Términos y Condiciones - Tailor Servicios | `/terminos` | `index, follow` | **Indexable** |
| `/en/terminos` | `200` | `en` | Terms and Conditions \| Tailor Servicios | `/en/terminos` | `index, follow` | **Indexable** |
| `/cookies` | `200` | `es` | Política de Cookies \| Tailor Servicios | `/cookies` | `index, follow` | **Indexable** |
| `/en/cookies` | `200` | `en` | Cookie Policy \| Tailor Servicios | `/en/cookies` | `index, follow` | **Indexable** |
| `/admin` | `200` | `es` | Tailor Servicios \| Panel de Administración | *(Sin canonical)* | `noindex, nofollow, noarchive, nosnippet`<br>`X-Robots-Tag: noindex, nofollow, noarchive` | **NOINDEX** |
| `/en/admin` | `200` | `en` | Tailor Servicios \| Panel de Administración | *(Sin canonical)* | `noindex, nofollow, noarchive, nosnippet`<br>`X-Robots-Tag: noindex, nofollow, noarchive` | **NOINDEX** |

* **Verificación de Canonical de Administración:** Comprobado mediante GET que `/admin` y `/en/admin` **no emiten etiqueta `<link rel="canonical">` apuntando a la portada**.
* **Cabeceras Hreflang:** Presentes y recíprocas en cabeceras HTTP (`link: rel="alternate"` con `es`, `en` y `x-default`) en todas las páginas públicas.

---

## 5. AJUSTE FACTUAL DE CUMPLIMIENTO EN CANDIDATEVIDEOMODAL

* **Texto Anterior (Afirmaciones absolutas no verificadas):**  
  `"Zero web intermediaries or file retention on server. Fully compliant with Chile's Data Protection Law 21.719."`  
  *Inconsistencia con el flujo real:* El botón principal redirige al portal externo de postulaciones en Rex+ (`serviciosindustrialetailor.rexmas.com/jobs/...`), existiendo un intermediario tecnológico proveedor de ATS.
* **Texto Corregido y Factual:**
  - **Español (`messages/es.json`):**  
    `"🔒 Redirección directa a la plataforma oficial de selección en Rex+. Tratamiento de datos sujeto a la Ley 21.719 de Chile."`
  - **Inglés (`messages/en.json`):**  
    `"🔒 Direct redirection to the official Rex+ applicant tracking platform. Data processing governed by Chilean Law 21.719."`

---

## 6. PRUEBAS REALES EN NAVEGADOR SOBRE SERVIDOR DE PRODUCCIÓN LOCAL

Se ejecutó una sesión interactiva de navegador mediante subagente automatizado sobre `http://localhost:3020`, registrando los siguientes resultados empíricos:

1. **Flujo `/en/blog` $\rightarrow$ Contacto:**
   - Clic en el enlace *"Discuss this topic →"* en una tarjeta del blog.
   - **Resultado:** Navegación correcta y mantenida en inglés a `http://localhost:3020/en/contacto` (gracias al componente `<Link>` de `@/i18n/routing`).
2. **Conmutación ES/EN desde Página Interior (`/en/contacto`):**
   - El selector mostraba `EN` con la clase `lang-btn active`.
   - Clic en el botón `ES`.
   - **Resultado:** URL actualizada a `http://localhost:3020/contacto` y botón activo conmutado a `ES`.
3. **Preservación de Anclas entre Idiomas:**
   - Navegación directa a `http://localhost:3020/servicios#reclutamiento`.
   - Clic en `EN` en el selector.
   - **Resultado:** La URL cambió a `http://localhost:3020/en/servicios#reclutamiento`, manteniendo el fragmento `#reclutamiento`.
4. **Limpieza del Ancla al Navegar a Otra Página:**
   - Estando en `http://localhost:3020/en/servicios#reclutamiento`, clic en *"About Us"* en el menú principal.
   - **Resultado:** Navegación a `http://localhost:3020/en/nosotros` sin arrastrar el ancla `#reclutamiento`.
5. **Selector en Menú Móvil (Viewport 390 × 844 px):**
   - Apertura del menú desplegable hamburguesa.
   - **Resultado:** Botones `ES` y `EN` con área táctil $\ge 44 \times 44\text{ px}$, contraste visual adecuado y estados activos claramente diferenciados.
   - *Captura registrada:* `/Users/patagoniacoach/.gemini/antigravity-ide/brain/fe568ff5-0b91-474a-8787-5c01844c3e98/mobile_drawer_lang_1789514095577.png`
   - *Grabación WebP:* `/Users/patagoniacoach/.gemini/antigravity-ide/brain/fe568ff5-0b91-474a-8787-5c01844c3e98/audit_browser_verification_1789513475156.webp`

---

---

## 8. DEFINICIONES FUNCIONALES DEL PROPIETARIO: RECEPCIÓN DE CV VÍA MAILTO

### 8.1 Reglas del Negocio y Criterios del Propietario
En cumplimiento estricto con las directrices prioritarias del propietario de Tailor Servicios:
1. **El sitio NO recibe, no sube, no almacena ni despacha archivos CV desde el backend.**
2. **El flujo de postulación opera exclusivamente mediante cliente de correo del usuario:**
   - La persona pulsa *"Enviar currículum por correo"* (o *"Send resume by email"*).
   - Se abre su aplicación o webmail mediante el protocolo `mailto:`.
   - La persona adjunta voluntariamente su CV y decide libremente cuándo enviarlo.
   - El sitio web **no accede al archivo ni emite confirmaciones falsas de "CV recibido" o "Envío exitoso"**, reconociendo que la apertura del cliente no demuestra el envío efectivo.
3. **Destinatario Aprobado:** Se utiliza la casilla institucional aprobada en la configuración del proyecto: `seleccion@tailorservicios.cl`.
4. **Explicación Visible Obligatoria:** En ambas versiones lingüísticas se incorpora la leyenda visible:
   - **ES:** *"Se abrirá tu aplicación de correo. Adjunta tu currículum y envíalo desde allí."*
   - **EN:** *"Your email application will open. Attach your resume and send it from there."*
5. **Dirección Visible y Opción de Copiar:** Se ofrece la dirección de correo visible y un botón para copiarla al portapapeles con confirmación visual dinámica (`"✓ ¡Copiado!"`).
6. **Asunto y Cuerpo Pre-codificados:**
   - **ES:** `mailto:seleccion@tailorservicios.cl?subject=Postulaci%C3%B3n%20Laboral%20-%20Curr%C3%ADculum%20Vitae&body=Estimado%20equipo%20de%20Selecci%C3%B3n...`
   - **EN:** `mailto:seleccion@tailorservicios.cl?subject=Job%20Application%20-%20Resume%20%2F%20CV&body=Dear%20Recruitment%20Team...`

### 8.2 Refactorización de Componentes y Páginas
* **`src/components/CandidateUpload.tsx` (`/candidatos`):** Sustitución integral de la interfaz de carga de archivos (dropzone, input file) por la tarjeta de envío por correo con el aviso visible, botón de copia y enlace `mailto:`.
* **`src/app/[locale]/postulantes/page.tsx` (`/postulantes`):** Transformación de la página a la arquitectura de correo, manteniendo en bloque inferior separado la sección de vacantes activas en Rex+.
* **`src/components/B2C_Dropzone.tsx`:** Eliminada toda la lógica de subida y almacenamiento en Supabase Storage, transformado en componente de enlace directo por correo.
* **`src/components/CandidateVideoModal.tsx`:** Modal de bienvenida que ofrece acceso directo a la plataforma externa de Rex+, manteniendo clara la separación entre el sitio y el ATS externo.

### 8.3 Deshabilitación de Endpoints y Blindaje Anti-Elusión
* **`src/app/api/send-email/route.ts`:**
  - **Rechazo directo de candidatos:** Solicitudes con `type === 'candidate'` son rechazadas con código **`HTTP 410 Gone`**.
  - **Bloqueo de elusión bajo `type=lead`:** Si un atacante o usuario intenta adjuntar archivos simulando un lead comercial (incluyendo claves como `file`, `cv`, `attachment`, `attachments`, `resume`, `curriculum`, `cv_base64`, etc.), el endpoint lo detecta e interrumpe de inmediato con código **`HTTP 400 Bad Request`** (*"Este formulario es exclusivo para contacto comercial B2B y no admite archivos adjuntos ni currículums..."*).
  - **Detección de datos codificados:** Se rechaza con `HTTP 400` cualquier intento de incrustar data URIs o cadenas base64 en campos de texto.
  - **Restricción estricta de Content-Type:** Peticiones con `multipart/form-data` o tipos distintos a `application/json` son rechazadas con **`HTTP 415 Unsupported Media Type`**.
  - **Formularios Comerciales B2B intactos:** Las solicitudes legítimas con `type === 'lead'` (empresas interesadas en consultoría) continúan operando con sanitización, rate limiting por IP, honeypot y notificación/acuse de recibo bajo la Ley 21.719.

### 8.4 Permisos RLS en Base de Datos y Almacenamiento (Supabase)
* **Distinción entre Esquema y Contenido Histórico:**
  - **Nivel de Esquema:** Se confirmó en `schema.sql` y componentes administrativos la existencia de la definición de la tabla `public.candidates` y del bucket de almacenamiento `cvs`. En el sistema de archivos local del repositorio no existen archivos de CVs.
  - **Nivel de Datos en la Nube:** No se confirma ni expone contenido de datos personales de postulantes.
* **Cierre de Permisos y RLS en `schema.sql`:**
  - **Tabla `public.candidates`:** Se eliminaron las políticas públicas previas (`"Allow public inserts for candidates"`, `"Allow public reads for dashboard"`, `"Allow public deletes for dashboard"`). Se revocó todo privilegio al rol anónimo (`REVOKE ALL ON public.candidates FROM anon`). Un visitante o usuario sin permisos administrativos no puede insertar, listar ni borrar registros directamente.
  - **Bucket `cvs`:** Configurado como **100% privado** (`public = false`). Se eliminaron las políticas de carga (`"Allow public uploads to cvs bucket"`) y lectura pública (`"Allow public reads of cvs"`). No existe ninguna política de `INSERT` público.
* **Descargas Seguras para Administradores:**
  - En [src/app/api/admin/candidates/route.ts](file:///Users/patagoniacoach/.gemini/antigravity-ide/scratch/Tailor%20Servicio/src/app/api/admin/candidates/route.ts), el endpoint privado genera URLs firmadas temporales (`createSignedUrl`, vigencia 1 hora) mediante el Service Role únicamente para administradores con sesión activa (`getAuthorizedUser`).
  - En [AdminDashboard.tsx](file:///Users/patagoniacoach/.gemini/antigravity-ide/scratch/Tailor%20Servicio/src/components/AdminDashboard.tsx), se sustituyó la construcción de URLs públicas por las URLs firmadas de descarga segura.

### 8.5 Origen Aprobado del Destinatario `seleccion@tailorservicios.cl`
* Se verificó el historial de control de versiones del repositorio: la dirección institucional `seleccion@tailorservicios.cl` fue establecida en el commit `302dfcab` (*"feat: canal oficial de postulacion espontanea por correo a seleccion@tailorservicios.cl..."*), confirmando que proviene de la configuración oficial aprobada en el proyecto y no de una dirección arbitraria.

### 8.6 Matriz de Pruebas de Seguridad y Anti-Elusión en Navegador

Pruebas automatizadas ejecutadas directamente en el entorno de ejecución sobre `http://localhost:3000`:

| N° | Escenario de Prueba | Método / Endpoint | Payload Enviado | Código HTTP | Resultado |
| :---: | :--- | :---: | :--- | :---: | :--- |
| **1** | Postulación web directa de candidato | `POST /api/send-email` | `{"type":"candidate","email":"postulante@example.com"}` | **`410 Gone`** | **Superado** (Recepción cerrada permanentemente) |
| **2** | Intento de elusión: `type=lead` con `file` | `POST /api/send-email` | `{"type":"lead","file":"cv_base64_payload",...}` | **`400 Bad Request`** | **Superado** (Archivos rechazados expresamente) |
| **3** | Intento de elusión: `type=lead` con `cv` | `POST /api/send-email` | `{"type":"lead","cv":"cv.pdf",...}` | **`400 Bad Request`** | **Superado** (Archivos rechazados expresamente) |
| **4** | Intento de elusión: `type=lead` con `attachments` | `POST /api/send-email` | `{"type":"lead","attachments":["payload.pdf"],...}` | **`400 Bad Request`** | **Superado** (Archivos rechazados expresamente) |
| **5** | Intento de envío multipart/form-data | `POST /api/send-email` | `Content-Type: multipart/form-data` | **`415 Unsupported Media Type`** | **Superado** (Cargas multipart bloqueadas de raíz) |
| **6** | Tipo de solicitud arbitrario | `POST /api/send-email` | `{"type":"cv_submission"}` | **`400 Bad Request`** | **Superado** (Tipo no válido) |
| **7** | Acceso anónimo a candidatos | `GET /api/admin/candidates` | *(Sin sesión administrativa)* | **`401 Unauthorized`** | **Superado** (Acceso protegido por autenticación) |
| **8** | Inyección de candidato por API | `POST /api/admin/candidates`| `{"full_name":"Inyeccion",...}` | **`405 Method Not Allowed`**| **Superado** (Método POST no implementado ni admitido) |

### 8.7 Modelo de Autorización Zero-Default y Procedimiento para Habilitar Administrador Definitivo
En estricta conformidad con las definiciones del propietario:
* **Eliminación de `user_metadata`:** Se eliminó cualquier lectura de `user_metadata` para decisiones de autorización en [src/lib/auth.ts](file:///Users/patagoniacoach/.gemini/antigravity-ide/scratch/Tailor%20Servicio/src/lib/auth.ts), debido a que este objeto puede ser modificado por el propio cliente en Supabase. Únicamente se evalúan claims protegidos del sistema (`app_metadata`).
* **Eliminación de correos predeterminados y fallbacks:** Se eliminaron las asignaciones fijas y cualquier fallback a casillas comerciales (`contacto@tailorservicios.cl`).
* **Denegación por Defecto (Default Deny):** Si la variable `ADMIN_ALLOWED_EMAILS` está vacía y el usuario no posee el claim protegido `app_metadata.role = 'admin'`, el acceso a las APIs administrativas es denegado de forma inmediata (`401 Unauthorized`), sin crear cuentas ni asignar privilegios arbitrarios.

#### Procedimiento para Habilitar al Administrador Definitivo (Gmail)
Cuando el propietario disponga de su cuenta definitiva de Gmail, el alta administrativa se realizará mediante cualquiera de los siguientes métodos independientes:

* **Método A (Vía Variables de Entorno - Recomendado por simplicidad):**
  1. En `.env.local` y en el panel de Vercel (Production Environment Variables), configurar:
     ```env
     ADMIN_ALLOWED_EMAILS="tu-cuenta@gmail.com"
     ```
  2. El backend Next.js validará automáticamente que el correo autenticado en Supabase coincida con esta lista blanca.

* **Método B (Vía Claims Protegidos de Supabase en SQL Console):**
  1. Crear el usuario en el módulo **Authentication > Users** de Supabase con el correo Gmail indicado.
  2. En el **SQL Editor** de Supabase, ejecutar la siguiente sentencia para asignar el rol protegido de administrador:
     ```sql
     UPDATE auth.users 
     SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb 
     WHERE email = 'tu-cuenta@gmail.com';
     ```
  3. Esto inyecta `app_metadata.role = 'admin'` en el token JWT, otorgando autorización en el backend sin depender de variables de entorno.

---

## 9. MATRIZ DE INCIDENCIAS RESTANTES Y TAREAS PENDIENTES

### 🔴 Impacto Alto (Legal / Regulatorio)
1. **Validación Legal Externa de Cláusulas en Inglés:**  
   * **Detalle:** Los textos de privacidad en inglés reflejan fielmente el contenido chileno, pero no han sido visados por un abogado especialista en derecho internacional de protección de datos.
   * **Acción recomendada:** Someter a revisión jurídica formal antes de realizar acciones comerciales internacionales.

### 🟡 Impacto Medio (Operacional Interno)
1. **Protocolo de Retención en Casilla de Selección:**  
   * **Detalle:** Los CVs recibidos en `seleccion@tailorservicios.cl` quedan bajo custodia del servidor de correo corporativo.
   * **Acción recomendada:** Establecer formalmente el período máximo de conservación de antecedentes curriculares y la mecánica de supresión periódica bajo la Ley 21.719.

2. **Comprobación de Redirecciones en Servidor Cloud:**  
   * **Detalle:** En el servidor local `next start`, las redirecciones de `/es` responden con código `307`.
   * **Acción recomendada:** Verificar tras el despliegue en Vercel/CDN si las reglas perimetrales del proveedor conservan el código 307 o aplican 308 permanente.

3. **Pruebas con Usuarios y Lectores de Pantalla:**  
   * **Detalle:** Las pruebas de navegador automatizadas confirmaron el DOM, las áreas táctiles de 44x44px y la navegación, pero no sustituyen una prueba humana de usabilidad asistiva (NVDA, JAWS, VoiceOver).
   * **Acción recomendada:** Coordinar una prueba asistiva con usuarios de lectores de pantalla.

### 🟢 Impacto Bajo (Mantenimiento de Contenidos)
1. **Artículos de Opinión en Blog:**  
   * **Detalle:** El cuerpo de los posts del blog está redactado en castellano, mientras que los llamados a la acción y elementos periféricos están traducidos.
   * **Acción recomendada:** Evaluar la redacción o traducción de publicaciones completas en inglés si la estrategia de marketing internacional lo requiere.

---
*Fin del Informe Técnico de Auditoría.*
