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

    const body = await request.json();

    // 2. Honeypot check (detección silenciosa de bots spam)
    if (body._hp || body.honeypot || body.website) {
      return NextResponse.json({ success: true });
    }

    // 3. Validación de tipo de solicitud
    const { type } = body;
    if (!type || !['lead', 'candidate'].includes(type)) {
      return NextResponse.json({ success: false, error: 'Tipo de solicitud inválido.' }, { status: 400 });
    }

    // 4. Sanitización y validación de campos obligatorios
    const safeNombre = sanitizeInput(body.nombre, 100);
    const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
    const safeEmail = sanitizeInput(rawEmail, 120);
    const safeEmpresa = sanitizeInput(body.empresa, 100);
    const safeServicio = sanitizeInput(body.servicio, 100);
    const safeSpecialty = sanitizeInput(body.specialty, 100);

    if (!safeNombre || safeNombre.length < 2) {
      return NextResponse.json({ success: false, error: 'Nombre requerido (mínimo 2 caracteres).' }, { status: 400 });
    }

    if (!safeEmail || !EMAIL_REGEX.test(rawEmail) || rawEmail.length > 120) {
      return NextResponse.json({ success: false, error: 'Correo electrónico inválido.' }, { status: 400 });
    }

    const adminEmail = process.env.LEADS_NOTIFICATION_EMAIL || 'contacto@tailorservicios.cl';

    // 5. Alert to Admin
    let adminSubject = '';
    let adminHtml = '';

    if (type === 'lead') {
      if (!safeEmpresa || safeEmpresa.length < 2) {
        return NextResponse.json({ success: false, error: 'Nombre de empresa requerido.' }, { status: 400 });
      }

      adminSubject = `[Nuevo Lead B2B] ${safeEmpresa} - ${safeNombre}`;
      adminHtml = `
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
    } else if (type === 'candidate') {
      const safeCvUrl = sanitizeInput(body.cvUrl, 300);

      adminSubject = `[Nueva Postulación] ${safeNombre} - ${safeSpecialty}`;
      adminHtml = `
        <div style="font-family: sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
          <h2 style="color: #31ade3; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Nueva Postulación de Candidato</h2>
          <p>Se ha recibido una nueva postulación con carga de CV:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 150px;">Nombre:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${safeNombre}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Correo:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Especialidad:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${safeSpecialty}</td>
            </tr>
            ${safeCvUrl ? `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Enlace al CV:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;"><a href="${safeCvUrl}" target="_blank" style="color: #31ade3; font-weight: bold; text-decoration: underline;">Descargar Archivo CV</a></td>
            </tr>
            ` : ''}
          </table>
          <p style="margin-top: 30px; font-size: 0.85rem; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px;">
            Este mensaje fue generado automáticamente por el sitio web de Tailor Servicios.
          </p>
        </div>
      `;
    }

    if (adminSubject) {
      await deliverEmail({ to: adminEmail, subject: adminSubject, html: adminHtml });
    }

    // 2. Auto-responder to User/Candidate
    let userSubject = '';
    let userHtml = '';

    if (type === 'lead') {
      userSubject = 'Hemos recibido su solicitud de contacto - Tailor Servicios';
      userHtml = `
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
    } else if (type === 'candidate') {
      userSubject = 'Confirmación de recepción de CV - Tailor Servicios';
      userHtml = `
        <div style="font-family: sans-serif; max-width: 600px; color: #334155; line-height: 1.6; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #31ade3; margin: 0; font-size: 1.8rem;">Tailor Servicios</h1>
            <p style="color: #94a3b8; margin: 5px 0 0;">Búsqueda y Selección de Talento</p>
          </div>
          <p>Hola <strong>${safeNombre}</strong>,</p>
          <p>Queremos confirmarte que hemos recibido tu Currículum Vitae correctamente para formar parte de nuestros procesos de selección y base de datos de talentos.</p>
          <p>Tu CV ha sido ingresado bajo la especialidad de <strong>${safeSpecialty}</strong>. En caso de que se abra una oferta laboral alineada con tu perfil y experiencia, nos comunicaremos contigo de inmediato.</p>
          <p>Te deseamos el mayor de los éxitos en tu búsqueda y crecimiento profesional.</p>
          <br />
          <p>Saludos cordiales,</p>
          <p><strong>Área de Selección de Personal</strong><br />
          <strong>Tailor Servicios</strong><br />
          <a href="https://tailorservicios.cl" target="_blank" style="color: #8ec53c; text-decoration: none; font-weight: bold;">www.tailorservicios.cl</a></p>
          
          <div style="margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 15px; font-size: 0.75rem; color: #94a3b8; text-align: justify;">
            <strong>Aviso de Privacidad (Ley 21.719 - Chile):</strong> Los datos personales y documentos facilitados por ti serán tratados confidencialmente por Tailor Servicios exclusivamente para procesos de selección y reclutamiento vigentes y futuros. Tienes pleno derecho a solicitar el acceso, rectificación, bloqueo o supresión definitiva de tu CV y datos de nuestra base de datos cuando lo desees, escribiéndonos a <a href="mailto:${adminEmail}">${adminEmail}</a>.
          </div>
        </div>
      `;
    }

    if (userSubject && safeEmail) {
      await deliverEmail({ to: safeEmail, subject: userSubject, html: userHtml });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Mail Route Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

