import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Helper to create SMTP transporter
const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || 'Contacto@tailorservicios.cl';
  const pass = process.env.SMTP_PASSWORD;

  if (!pass) {
    console.warn('SMTP_PASSWORD env variable is not configured.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for port 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, nombre, email, empresa, servicio, specialty, cvUrl } = body;

    const transporter = getTransporter();
    const adminEmail = process.env.SMTP_USER || 'Contacto@tailorservicios.cl';

    // 1. Send Alert to Admin (Contacto@tailorservicios.cl)
    let adminSubject = '';
    let adminHtml = '';

    if (type === 'lead') {
      adminSubject = `[Nuevo Lead B2B] ${empresa} - ${nombre}`;
      adminHtml = `
        <div style="font-family: sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
          <h2 style="color: #ed4240; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Nuevo Contacto de Empresa</h2>
          <p>Se ha recibido una nueva solicitud de servicio en el sitio web de Tailor Servicios:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 150px;">Nombre:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${nombre}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Empresa:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${empresa}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Correo:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Servicio de Interés:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #8ec53c; font-weight: bold;">${servicio}</td>
            </tr>
          </table>
          <p style="margin-top: 30px; font-size: 0.85rem; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px;">
            Este mensaje fue generado automáticamente por el sitio web de Tailor Servicios.
          </p>
        </div>
      `;
    } else if (type === 'candidate') {
      adminSubject = `[Nueva Postulación] ${nombre} - ${specialty}`;
      adminHtml = `
        <div style="font-family: sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
          <h2 style="color: #31ade3; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Nueva Postulación de Candidato</h2>
          <p>Se ha recibido una nueva postulación con carga de CV:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 150px;">Nombre:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${nombre}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Correo:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Especialidad:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${specialty}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Enlace al CV:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;"><a href="${cvUrl}" target="_blank" style="color: #31ade3; font-weight: bold; text-decoration: underline;">Descargar Archivo CV</a></td>
            </tr>
          </table>
          <p style="margin-top: 30px; font-size: 0.85rem; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px;">
            Este mensaje fue generado automáticamente por el sitio web de Tailor Servicios.
          </p>
        </div>
      `;
    }

    // Deliver alert to admin
    await transporter.sendMail({
      from: `"Web Alertas Tailor" <${adminEmail}>`,
      to: adminEmail,
      subject: adminSubject,
      html: adminHtml,
    });

    // 2. Send Auto-responder confirmation to User/Candidate
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
          <p>Estimado/a <strong>${nombre}</strong>,</p>
          <p>Agradecemos sinceramente su interés en nuestros servicios estratégicos de Recursos Humanos para <strong>${empresa}</strong>.</p>
          <p>Hemos recibido correctamente su solicitud para el área de <strong>${servicio}</strong>. Un consultor experto de nuestro equipo se pondrá en contacto con usted a la brevedad para agendar una reunión o enviar la información correspondiente.</p>
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
          <p>Hola <strong>${nombre}</strong>,</p>
          <p>Queremos confirmarte que hemos recibido tu Currículum Vitae correctamente para formar parte de nuestros procesos de selección y base de datos de talentos.</p>
          <p>Tu CV ha sido ingresado bajo la especialidad de <strong>${specialty}</strong>. En caso de que se abra una oferta laboral alineada con tu perfil y experiencia, nos comunicaremos contigo de inmediato.</p>
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

    // Deliver auto-response to user/candidate
    await transporter.sendMail({
      from: `"Tailor Servicios" <${adminEmail}>`,
      to: email,
      subject: userSubject,
      html: userHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Mail Route Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
