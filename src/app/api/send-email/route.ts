import { NextResponse } from 'next/server';

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

export async function POST(request: Request) {
  try {
    const rawIp = request.headers.get('x-forwarded-for') || 'local';
    const clientIp = rawIp.split(',')[0].trim();

    // 1. Rate limiting
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { success: false, error: 'Demasiadas solicitudes. Por favor, intenta más tarde.' },
        { status: 429 }
      );
    }

    // 2. Verificación de Content-Type (bloqueo directo de multipart o envíos binarios)
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Formato de solicitud no permitido. No se admiten cargas multipart ni archivos.' },
        { status: 415 }
      );
    }

    const body = await request.json();

    // 3. Honeypot check (detección silenciosa de bots spam)
    if (body._hp || body.honeypot || body.website) {
      return NextResponse.json({ success: true });
    }

    // 4. Validación estricta de tipo de solicitud
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

    // 5. Bloqueo estricto de elusión: Rechazar cualquier intento de adjuntar o enviar archivos bajo type=lead
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

    // 4. Sanitización y validación de campos obligatorios
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

    if (!safeEmpresa || safeEmpresa.length < 2) {
      return NextResponse.json({ success: false, error: 'Nombre de empresa requerido.' }, { status: 400 });
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

