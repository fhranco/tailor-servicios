# Instrucciones de privacidad y cumplimiento (Ley 21.719 - Chile)

Este proyecto debe desarrollarse considerando la Ley 21.719 de protección de datos personales en Chile.

## Objetivo
Cada cambio en frontend, backend, base de datos, automatizaciones o integraciones debe evaluarse también desde el punto de vista de privacidad y tratamiento de datos personales.

## Comportamiento esperado
Antes de proponer cambios, el agente debe:
1. Identificar si la funcionalidad trata datos personales.
2. Identificar qué datos se capturan, almacenan, transfieren o muestran.
3. Detectar si existen datos sensibles, datos de menores o datos de geolocalización.
4. Evaluar la finalidad del tratamiento y si los datos solicitados son proporcionales.
5. Revisar si la funcionalidad requiere consentimiento, aviso de privacidad o trazabilidad.
6. Revisar si existen integraciones con terceros que impliquen transferencia o acceso a datos.
7. Proponer ajustes para permitir gestión de derechos del titular: acceso, rectificación, supresión, oposición, portabilidad y bloqueo.
8. Proponer medidas mínimas de seguridad, minimización, retención y auditoría.
9. Alertar cuando una decisión tenga impacto legal relevante y deba ser validada por un responsable humano o asesor legal.
10. Nunca asumir cumplimiento legal automático; siempre explicar riesgos, brechas y supuestos.

## Reglas para generar cambios
Cuando el agente cree o modifique formularios, endpoints, tablas o automatizaciones, debe entregar:
- Qué datos personales intervienen.
- Finalidad del tratamiento.
- Base o justificación operativa del tratamiento.
- Riesgos detectados.
- Recomendaciones de cumplimiento.
- Cambios técnicos sugeridos.
- Qué textos legales o avisos deberían agregarse.
- Qué logs o trazabilidad deberían registrarse.

## Casos prioritarios
- Formularios de contacto
- Formularios de reserva o compra
- Login y registro
- Newsletters y campañas de marketing
- Integraciones con CRM, analytics, pixel, email marketing y pasarelas de pago
- Almacenamiento de documentos o archivos de clientes
- Paneles donde se visualicen datos de usuarios

## Salida esperada
Siempre responder con:
1. análisis técnico,
2. análisis de privacidad,
3. riesgos,
4. cambios recomendados,
5. tareas accionables para implementar.
