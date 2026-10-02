import { NextResponse } from 'next/server';
import { maskIp } from '@/lib/auth';

let nodemailerInstance: any = null;
try {
  const req = eval('require');
  nodemailerInstance = req('nodemailer');
} catch {
  // nodemailer no instalado; se usa API REST nativa de Resend
}

// Helper para SMTP tradicional
const getTransporter = () => {
  if (!nodemailerInstance) return null;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || 'Contacto@tailorservicios.cl';
  const pass = process.env.SMTP_PASSWORD;

  if (!pass) return null;

  return nodemailerInstance.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

// Envío unificado: Soporte nativo para Resend API + Fallback a SMTP
async function deliverEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const apiKey = process.env.SMTP_PASSWORD;
  const isResend = process.env.SMTP_HOST?.includes('resend.com') || apiKey?.startsWith('re_');

  if (isResend && apiKey) {
    try {
      const fromAddress = process.env.EMAIL_FROM || 'Tailor Servicios <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [to],
          subject,
          html,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.warn(`[Send-Email] Error de envío Resend (${res.status}):`, data);
        return false;
      }
      console.log(`[Send-Email] Correo enviado exitosamente a ${to}:`, data.id);
      return true;
    } catch (apiErr) {
      console.error('[Send-Email] Resend fetch exception:', apiErr);
    }
  }

  // Fallback a nodemailer
  const transporter = getTransporter();
  if (transporter) {
    await transporter.sendMail({
      from: `"Tailor Servicios" <${process.env.SMTP_USER || 'Contacto@tailorservicios.cl'}>`,
      to,
      subject,
      html,
    });
    return true;
  }

  console.warn('No hay proveedor de correo activo configurado.');
  return false;
}

function sanitizeInput(val: any, maxLength = 150): string {
  if (typeof val !== 'string') return '';
  return val
    .trim()
    .slice(0, maxLength)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Lista de dominios de email desechables / temporales usados por bots y spam.
 * Cubre los servicios más activos — estable sin mantenimiento por años.
 */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.info',
  'tempmail.com', 'temp-mail.org', 'throwam.com', 'yopmail.com',
  'trashmail.com', 'trashmail.me', 'trashmail.net', 'trashmail.org',
  'mailnull.com', 'spamgourmet.com', 'sharklasers.com', 'guerrillamailblock.com',
  'grr.la', 'spam4.me', 'dispostable.com', 'fakeinbox.com', 'maildrop.cc',
  'mailnesia.com', 'mailforspam.com', 'spamhereplease.com', 'binkmail.com',
  'safetymail.info', 'spambox.us', 'spamdecoy.net', 'spamfree24.org',
  'throwam.com', 'throwam.net', 'mytemp.email', 'tmpmail.net', 'tmpmail.org',
  'tempr.email', 'discard.email', 'crazymailing.com', 'mohmal.com',
  'getnada.com', 'mailnull.com', 'spamoff.de', 'tempinbox.com',
  'spamgourmet.net', 'spamgourmet.org', 'anonbox.net', 'filzmail.com',
  'dumpmail.de', 'discardmail.com', 'discardmail.de', 'spamspot.com',
  'jetable.fr.nf', 'noref.in', 'ownmail.net', 'petml.com', 'shredmail.com',
  'spamevader.com', 'spamslicer.com', 'spoofmail.de', 'suremail.info',
  'throwam.com', 'uggsrock.com', 'veryrealemail.com', 'wasteland.rr.nu',
  'webemail.me', 'weg-werf-email.de', 'wegwerfmail.de', 'wegwerfmail.net',
  'wegwerfmail.org', 'wh4f.org', 'yopmail.fr', 'yopmail.pp.ua',
  'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc', 'nomail.xl.cx',
]);

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? DISPOSABLE_EMAIL_DOMAINS.has(domain) : false;
}

/**
 * Whitelist de orígenes permitidos para el endpoint /api/send-email.
 * Incluye dominio de producción y previews de Vercel.
 */
const ALLOWED_ORIGINS = [
  'https://tailorservicios.cl',
  'https://www.tailorservicios.cl',
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  // Permite pruebas en entorno local de desarrollo
  if (process.env.NODE_ENV === 'development' && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
    return true;
  }
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Permite preview deployments de Vercel: https://*.vercel.app
  if (/^https:\/\/[a-zA-Z0-9-]+-[a-zA-Z0-9-]+\.vercel\.app$/.test(origin)) return true;
  return false;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 * 15 }); // 15 min window
    return true;
  }
  if (entry.count >= 10) {
    return false;
  }
  entry.count += 1;
  return true;
}

/**
 * Filtro Heurístico Anti-Gibberish / Anti-Spam:
 * Detecta cadenas generadas aleatoriamente por bots (ej. "onwIJBrzaTJGCafAgNyuiK", "wPGHYQOFQHIXXPTY").
 */
function isSuspiciousBotInput(nombre: string, empresa: string): { isBot: boolean; reason?: string } {
  // 1. Cúmulo anómalo de 5 o más consonantes seguidas (imposible en español/inglés normal)
  const consonantClusterRegex = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/;
  if (consonantClusterRegex.test(nombre) || consonantClusterRegex.test(empresa)) {
    return { isBot: true, reason: 'consonant_cluster' };
  }

  // 2. Token largo sin espacios con alternancia caótica de mayúsculas/minúsculas
  const tokens = [...nombre.split(/\s+/), ...empresa.split(/\s+/)];
  for (const token of tokens) {
    if (token.length >= 10) {
      let transitions = 0;
      for (let i = 1; i < token.length; i++) {
        const prevIsUpper = token[i - 1] >= 'A' && token[i - 1] <= 'Z';
        const currIsUpper = token[i] >= 'A' && token[i] <= 'Z';
        const prevIsLower = token[i - 1] >= 'a' && token[i - 1] <= 'z';
        const currIsLower = token[i] >= 'a' && token[i] <= 'z';
        if ((prevIsUpper && currIsLower) || (prevIsLower && currIsUpper)) {
          transitions++;
        }
      }
      if (transitions >= 3) {
        return { isBot: true, reason: 'chaotic_case_token' };
      }
    }
  }

  // 3. Proporción de vocales en palabras largas (menos del 15% de vocales indica texto aleatorio)
  for (const text of [nombre, empresa]) {
    const letters = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
    if (letters.length >= 8) {
      const vowels = letters.match(/[aeiouáéíóúAEIOUÁÉÍÓÚ]/g) || [];
      const vowelRatio = vowels.length / letters.length;
      if (vowelRatio < 0.15) {
        return { isBot: true, reason: 'low_vowel_ratio' };
      }
    }
  }

  return { isBot: false };
}

/**
 * Validador de token Cloudflare Turnstile en servidor.
 */
async function verifyTurnstile(token: string | undefined, ip: string): Promise<{ valid: boolean; reason?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    // Si aún no se ha configurado la variable TURNSTILE_SECRET_KEY en Vercel,
    // se permite el paso y operan los demás filtros de contención.
    return { valid: true };
  }
  if (!token) {
    return { valid: false, reason: 'missing_turnstile_token' };
  }
  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    formData.append('remoteip', ip);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    const outcome = await res.json();
    if (!outcome.success) {
      console.warn('[Turnstile] Token inválido o expirado:', outcome['error-codes']);
      return { valid: false, reason: 'invalid_turnstile_token' };
    }
    return { valid: true };
  } catch (err) {
    console.error('[Turnstile] Error en consulta a Cloudflare siteverify:', err);
    return { valid: false, reason: 'turnstile_exception' };
  }
}

export async function POST(request: Request) {
  try {
    const rawIp = request.headers.get('x-forwarded-for') || 'local';
    const clientIp = rawIp.split(',')[0].trim();

    // 1. Rate limiting local
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { success: false, error: 'Demasiadas solicitudes. Por favor, intenta más tarde.' },
        { status: 429 }
      );
    }

    // 2. Verificación de Content-Type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Formato de solicitud no permitido. No se admiten cargas multipart ni archivos.' },
        { status: 415 }
      );
    }

    const body = await request.json();

    // 3.1 Validación de Origin (bloquea scripts externos que llaman directo al endpoint)
    const origin = request.headers.get('origin');
    if (!isAllowedOrigin(origin)) {
      console.warn(`[Send-Email] Origen bloqueado: ${origin} (IP: ${maskIp(clientIp)})`);
      return NextResponse.json(
        { success: false, error: 'Origen de solicitud no autorizado.' },
        { status: 403 }
      );
    }

    // 3. Honeypot check (detección silenciosa de bots spam)
    if (body._hp || body.honeypot || body.website || body.company_fax || body.b_email) {
      console.warn(`[Send-Email] Bot neutralizado por Honeypot (IP: ${maskIp(clientIp)})`);
      return NextResponse.json({ success: true, message: 'Solicitud procesada.' });
    }

    // 4. Time-Trap (trampa de tiempo: rechaza envíos inhumanamente veloces en < 2.5 seg)
    if (body._t) {
      const elapsed = Date.now() - Number(body._t);
      if (elapsed < 2500 || elapsed > 86400000) {
        console.warn(`[Send-Email] Bot neutralizado por Time-Trap: ${elapsed}ms (IP: ${maskIp(clientIp)})`);
        return NextResponse.json({ success: true, message: 'Solicitud procesada.' });
      }
    }

    // 5. Verificación de Cloudflare Turnstile
    const turnstileCheck = await verifyTurnstile(body.turnstile_token, clientIp);
    if (!turnstileCheck.valid) {
      console.warn(`[Send-Email] Acceso bloqueado por Turnstile: ${turnstileCheck.reason} (IP: ${maskIp(clientIp)})`);
      return NextResponse.json(
        { success: false, error: 'Verificación de seguridad requerida. Por favor, recarga la página.' },
        { status: 403 }
      );
    }

    // 6. Validación estricta de tipo de solicitud
    const { type } = body;
    if (type === 'candidate') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El envío de CV mediante formulario web ha sido deshabilitado. Los antecedentes deben ser enviados directamente desde el correo del postulante a seleccion@tailorservicios.cl.' 
        }, 
        { status: 410 }
      );
    }

    if (!type || type !== 'lead') {
      return NextResponse.json({ success: false, error: 'Tipo de solicitud inválido.' }, { status: 400 });
    }

    // 7. Bloqueo estricto de elusión de archivos
    const FORBIDDEN_FILE_KEYS = [
      'file', 'files', 'cv', 'cv_file', 'attachment', 'attachments', 
      'resume', 'curriculum', 'document', 'cv_path', 'cv_url', 'cv_base64', 'file_data'
    ];
    const hasAttemptedFileAttachment = FORBIDDEN_FILE_KEYS.some(k => k in body && body[k] != null && body[k] !== '');
    if (hasAttemptedFileAttachment) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Este formulario es exclusivo para contacto comercial B2B y no admite archivos adjuntos ni currículums. Para postulaciones laborales, envíe sus antecedentes directamente desde su correo personal a seleccion@tailorservicios.cl.' 
        },
        { status: 400 }
      );
    }

    // Detección de posibles payloads base64 o Data URIs incrustados en campos de texto
    const containsEncodedPayload = Object.values(body).some(v => 
      typeof v === 'string' && (v.startsWith('data:') || v.includes(';base64,') || v.length > 500)
    );
    if (containsEncodedPayload) {
      return NextResponse.json(
        { success: false, error: 'Carga de datos no permitida en campos de texto.' },
        { status: 400 }
      );
    }

    // 8. Sanitización y validación de campos obligatorios
    const safeNombre = sanitizeInput(body.nombre, 100);
    const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
    const safeEmail = sanitizeInput(rawEmail, 120);
    const safeEmpresa = sanitizeInput(body.empresa, 100);
    const safeServicio = sanitizeInput(body.servicio, 100);

    if (!safeNombre || safeNombre.length < 2) {
      return NextResponse.json({ success: false, error: 'Nombre requerido (mínimo 2 caracteres).' }, { status: 400 });
    }

    if (!safeEmail || !EMAIL_REGEX.test(rawEmail) || rawEmail.length > 120) {
      return NextResponse.json({ success: false, error: 'Correo electrónico inválido.' }, { status: 400 });
    }

    // 8.1 Bloqueo de emails desechables / temporales
    if (isDisposableEmail(rawEmail)) {
      console.warn(`[Send-Email] Email desechable bloqueado: ${maskIp(clientIp)}`);
      return NextResponse.json(
        { success: false, error: 'Por favor, use un correo corporativo o permanente para contactarnos.' },
        { status: 400 }
      );
    }

    if (!safeEmpresa || safeEmpresa.length < 2) {
      return NextResponse.json({ success: false, error: 'Nombre de empresa requerido.' }, { status: 400 });
    }

    // 9. Filtro Heurístico Anti-Gibberish (bloqueo silencioso de scripts spam)
    const botCheck = isSuspiciousBotInput(safeNombre, safeEmpresa);
    if (botCheck.isBot) {
      console.warn(`[Send-Email] Bot spam neutralizado por filtro heurístico: ${botCheck.reason} [${safeEmpresa} - ${safeNombre}] (IP: ${maskIp(clientIp)})`);
      return NextResponse.json({ success: true, message: 'Solicitud procesada.' });
    }

    const adminEmail = process.env.LEADS_NOTIFICATION_EMAIL || 'contacto@tailorservicios.cl';

    // 5. Alert to Admin (B2B Lead)
    const adminSubject = `[Nuevo Lead B2B] ${safeEmpresa} - ${safeNombre}`;
    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
        <h2 style="color: #ed4240; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Nuevo Contacto de Empresa</h2>
        <p>Se ha recibido una nueva solicitud de servicio en el sitio web de Tailor Servicios:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 150px;">Nombre:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${safeNombre}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Empresa:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${safeEmpresa}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Correo:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Servicio de Interés:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #8ec53c; font-weight: bold;">${safeServicio || 'No especificado'}</td>
          </tr>
        </table>
        <p style="margin-top: 30px; font-size: 0.85rem; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px;">
          Este mensaje fue generado automáticamente por el sitio web de Tailor Servicios.
        </p>
      </div>
    `;

    await deliverEmail({ to: adminEmail, subject: adminSubject, html: adminHtml });

    // 6. Auto-responder to User (Lead B2B)
    const userSubject = 'Hemos recibido su solicitud de contacto - Tailor Servicios';
    const userHtml = `
      <div style="font-family: sans-serif; max-width: 600px; color: #334155; line-height: 1.6; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ed4240; margin: 0; font-size: 1.8rem;">Tailor Servicios</h1>
          <p style="color: #94a3b8; margin: 5px 0 0;">Asesoría y Consultoría a tu Medida</p>
        </div>
        <p>Estimado/a <strong>${safeNombre}</strong>,</p>
        <p>Agradecemos sinceramente su interés en nuestros servicios estratégicos de Recursos Humanos para <strong>${safeEmpresa}</strong>.</p>
        <p>Hemos recibido correctamente su solicitud para el área de <strong>${safeServicio}</strong>. Un consultor experto de nuestro equipo se pondrá en contacto con usted a la brevedad para agendar una reunión o enviar la información correspondiente.</p>
        <p>Si tiene alguna duda urgente, puede responder a este correo o escribirnos directamente a <a href="mailto:${adminEmail}">${adminEmail}</a>.</p>
        <br />
        <p>Atentamente,</p>
        <p><strong>El Equipo de Tailor Servicios</strong><br />
        <a href="https://tailorservicios.cl" target="_blank" style="color: #8ec53c; text-decoration: none; font-weight: bold;">www.tailorservicios.cl</a></p>
        
        <div style="margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 15px; font-size: 0.75rem; color: #94a3b8; text-align: justify;">
          <strong>Aviso de Privacidad (Ley 21.719 - Chile):</strong> Los datos personales facilitados por usted serán tratados bajo absoluta confidencialidad por Tailor Servicios, única y exclusivamente con la finalidad de gestionar su solicitud de contacto corporativo. Le recordamos que cuenta con el derecho de acceso, rectificación, cancelación y oposición respecto a sus datos escribiéndonos a <a href="mailto:${adminEmail}">${adminEmail}</a>.
        </div>
      </div>
    `;

    if (safeEmail) {
      await deliverEmail({ to: safeEmail, subject: userSubject, html: userHtml });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Mail Route Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

