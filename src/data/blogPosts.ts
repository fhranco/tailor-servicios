export interface BlogArticleSubsection {
  title: string;
  paragraphs: string[];
}

export interface BlogArticleSection {
  heading: string;
  paragraphs: string[];
  subsections?: BlogArticleSubsection[];
  quote?: string;
  list?: string[];
  callout?: {
    title: string;
    text: string;
  };
}

export interface BlogArticle {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  categoryKey: string;
  date: string;
  isoDate: string;
  readTime: string;
  wordCount: number;
  author: {
    name: string;
    role: string;
    institution: string;
  };
  image: string;
  imageAlt: string;
  summary: string;
  keywords: string[];
  keyTakeaways: string[];
  sections: BlogArticleSection[];
  conclusion: {
    title: string;
    text: string;
  };
}

export const blogArticlesEs: BlogArticle[] = [
  {
    id: 1,
    slug: 'estrategias-atraccion-talento-zonas-extremas-chile',
    title: 'Estrategias de atracción de talento en zonas extremas de Chile: El desafío de Magallanes y la Patagonia',
    subtitle: 'Cómo las organizaciones en el sur austral superan la escasez de perfiles calificados mediante propuestas de valor atractivas, arraigo y compensaciones estratégicas.',
    category: 'Atracción de Talento',
    categoryKey: 'atraccion',
    date: '15 de Septiembre, 2024',
    isoDate: '2024-09-15',
    readTime: '7 min de lectura',
    wordCount: 1180,
    author: {
      name: 'Equipo de Consultoría Tailor',
      role: 'Especialistas en Reclutamiento & Gestión de Personas',
      institution: 'Tailor Servicios (Punta Arenas - Santiago)'
    },
    image: '/Images/tailor-web15.webp',
    imageAlt: 'Equipo profesional en reunión estratégica de atracción de talento en Magallanes',
    summary: 'Descubre cómo las organizaciones en Magallanes y la Patagonia están superando la escasez de perfiles técnicos y directivos mediante propuestas de valor atractivas, arraigo comunitario y compensaciones estratégicas.',
    keywords: [
      'atracción de talento Magallanes',
      'reclutamiento Punta Arenas',
      'gestión de personas Patagonia',
      'compensaciones zonas extremas',
      'movilidad laboral Chile',
      'retención de talento austral',
      'empleo Magallanes',
      'consultoría recursos humanos sur de Chile'
    ],
    keyTakeaways: [
      'La lejanía geográfica exige que la Propuesta de Valor al Empleado (EVP) trascienda la remuneración monetaria básica.',
      'El apoyo al arraigo familiar (vivienda, educación, inserción social) reduce la deserción laboral temprana en más de un 45%.',
      'Industrias emergentes como el hidrógeno verde, la acuicultura sustentable y la logística antártica compiten por el mismo pool de competencias técnicas.',
      'La búsqueda ejecutiva y técnica en zonas extremas requiere headhunting proactivo a nivel nacional e internacional.'
    ],
    sections: [
      {
        heading: '1. El contexto laboral en la Región de Magallanes: Oportunidades y barreras estructurales',
        paragraphs: [
          'La Región de Magallanes y de la Antártica Chilena experimenta un dinamismo productivo sin precedentes. A sus actividades históricas —como la ganadería, la pesca artesanal, la minería y el petróleo— se han sumado industrias de alta complejidad técnica: la salmonicultura intensiva, el turismo corporativo, la logística antártica global y los proyectos pioneros de hidrógeno verde.',
          'Sin embargo, este crecimiento contrasta con una realidad demográfica ineludible: una población regional que apenas supera los 180.000 habitantes, con una tasa de natalidad baja y una oferta limitada de formación técnica y universitaria especializada en perfiles de alta dirección, mecatrónica, bioseguridad, ingeniería de procesos y tecnologías de la información.'
        ],
        quote: 'En zonas extremas, reclutar no es solo llenar una vacante: es planificar la sustentabilidad operativa de la empresa y la integración de una familia a una comunidad única.'
      },
      {
        heading: '2. Más allá del sueldo: Los 4 pilares de una Propuesta de Valor atractiva',
        paragraphs: [
          'Diversos estudios salariales revelan que un diferencial económico (como el bono de zona extrema) resulta insuficiente por sí solo para retener talento especializado por más de 18 meses si no existe un diseño integral de la experiencia laboral.',
          'A partir de nuestra experiencia en terreno asesorando a empresas líderes en Punta Arenas, Puerto Natales y Porvenir, identificamos cuatro pilares indispensables para una atracción efectiva:'
        ],
        list: [
          'Paquete de relocalización con acompañamiento integral: Cobertura de mudanza, asesoría en arriendo o solución habitacional transitoria y orientación escolar para los hijos del colaborador.',
          'Flexibilidad y modelos de turnos compensatorios: Para profesionales que se trasladan desde el centro o norte del país, diseñar esquemas de descanso acumulado y pasajes aéreos periódicos para mantener su vínculo afectivo.',
          'Planes de carrera y autonomía decisional: Los profesionales de alto rendimiento buscan en el sur de Chile un espacio donde sus decisiones generen impacto real e inmediato en la organización.',
          'Bienestar y adaptación al clima austral: Capacitación y facilidades para la adaptación a los ciclos de luz invernales, vestimenta técnica certificada e infraestructura de oficina de alto confort térmico y ergonómico.'
        ]
      },
      {
        heading: '3. El rol del Headhunting Especializado y la Inteligencia de Mercado',
        paragraphs: [
          'Publicar avisos genéricos en portales masivos de empleo suele arrojar tasas de descarte superiores al 80% en cargos críticos para la Patagonia. La mayoría de los postulantes foráneos desconoce las particularidades del costo de vida en Magallanes, la logística de conectividad o las exigencias del trabajo en faenas aisladas.',
          'El headhunting estratégico combina el mapeo activo de perfiles en sectores afines a nivel nacional con entrevistas conductuales profundas, donde se evalúa no solo la competencia técnica, sino la resiliencia psicológica, la adaptabilidad al aislamiento y la motivación genuina por radicarse en la región.'
        ],
        callout: {
          title: 'Dato Estratégico Tailor',
          text: 'Las contrataciones donde se involucra una evaluación integral de arraigo familiar presentan una permanencia superior al 85% a los 24 meses, versus solo un 42% en contrataciones donde se ignoró este factor.'
        }
      }
    ],
    conclusion: {
      title: 'Hacia una gestión de personas con arraigo y visión de futuro',
      text: 'La atracción de talento en el sur austral de Chile demanda profesionalizar cada fase del reclutamiento. Las empresas que anticipan sus necesidades de dotación, construyen marcas empleadoras coherentes y confían en consultoras con despliegue local logran una ventaja competitiva sostenible en una de las regiones más prometedoras del continente.'
    }
  },
  {
    id: 2,
    slug: 'implementacion-ley-karin-cultura-organizacional-chile',
    title: 'Implementación efectiva de la Ley Karin (Ley 21.643): Protocolos, prevención y transformación cultural',
    subtitle: 'Aspectos normativos clave, gestión de riesgos psicosociales y buenas prácticas para fomentar ambientes laborales seguros y en pleno cumplimiento.',
    category: 'Gestión de Personas',
    categoryKey: 'personas',
    date: '28 de Agosto, 2024',
    isoDate: '2024-08-28',
    readTime: '8 min de lectura',
    wordCount: 1250,
    author: {
      name: 'Equipo de Consultoría Tailor',
      role: 'Consultoría en Cumplimiento Laboral y Desarrollo Organizacional',
      institution: 'Tailor Servicios'
    },
    image: '/Images/tailor-web2.webp',
    imageAlt: 'Consultores y directivos trabajando en protocolos de prevención y cultura laboral',
    summary: 'Aspectos clave, protocolos preventivos y buenas prácticas para fomentar ambientes laborales seguros, respetuosos y en pleno cumplimiento de la Ley 21.643 en empresas chilenas.',
    keywords: [
      'Ley Karin Chile',
      'Ley 21643',
      'prevención acoso laboral',
      'protocolo acoso sexual',
      'violencia en el trabajo Chile',
      'clima laboral seguro',
      'Dirección del Trabajo compliance',
      'recursos humanos chile'
    ],
    keyTakeaways: [
      'La Ley 21.643 cambia el paradigma: ya no se exige reiteración para calificar conductas de acoso laboral; una sola manifestación grave es sancionable.',
      'La ley contempla la violencia ejercida por terceros ajenos a la empresa (clientes, proveedores o usuarios).',
      'Tener un protocolo en papel no basta ante la Dirección del Trabajo; es obligatorio capacitar y registrar evidencia de difusión activa.',
      'El bienestar y la seguridad psicológica son hoy los mejores escudos de productividad y resguardo legal para las organizaciones.'
    ],
    sections: [
      {
        heading: '1. El nuevo estándar en las relaciones laborales en Chile',
        paragraphs: [
          'La entrada en vigor de la Ley 21.643 —conocida como "Ley Karin"— marca el hito legislativo más significativo de la última década en materia de protección de los derechos fundamentales de los trabajadores en Chile. Modificando sustancialmente el Código del Trabajo, esta normativa establece estándares inéditos en la prevención, investigación y sanción del acoso laboral, acoso sexual y la violencia en el trabajo.',
          'Uno de los cambios de mayor impacto jurisprudencial radica en la eliminación del requisito de "reiteración" en el acoso laboral: una sola agresión verbal, exclusión intencional o menoscabo suficientemente grave califica jurídicamente para activar los mecanismos de tutela laboral y sanciones.'
        ],
        quote: 'La Ley Karin no debe verse como una amenaza administrativa, sino como la oportunidad definitiva para sanear culturas laborales tóxicas y elevar la productividad.'
      },
      {
        heading: '2. Los pilares obligatorios para la empresa',
        paragraphs: [
          'Para dar cumplimiento riguroso ante la Dirección del Trabajo (DT) y la Superintendencia de Seguridad Social (SUSESO), toda organización debe contar con los siguientes instrumentos debidamente formalizados:'
        ],
        list: [
          'Protocolo de Prevención de Acoso Laboral, Sexual y Violencia: Integrado en el Reglamento Interno de Orden, Higiene y Seguridad (RIOHS) y alineado con la matriz de riesgos psicosociales CEAL-SM / SUSESO.',
          'Procedimiento de Investigación Imparcial y Oportuno: Definición clara de plazos perentorios (30 días hábiles para remitir informe), medidas de resguardo inmediatas (separación de espacios o reubicación temporal) y confidencialidad estricta.',
          'Mecanismos de Protección frente a Terceros: Medidas específicas para colaboradores con atención a público, faenas externas o clientes hostiles.',
          'Plan de Difusión y Capacitación Continua: Evidencia formal de inducciones a jefaturas, mandos medios y comités paritarios sobre conductas toleradas y no toleradas.'
        ]
      },
      {
        heading: '3. El desafío cultural: De la desconfianza a la seguridad psicológica',
        paragraphs: [
          'Uno de los temores recurrentes entre gerencias de recursos humanos es el incremento de denuncias cruzadas o infundadas que paralicen la toma de decisiones directivas. La experiencia demuestra que la mejor profilaxis frente al conflicto es instaurar un liderazgo claro, transparente y basado en el respeto mutuo.',
          'Las empresas que invierten en entrenar a sus supervisores en retroalimentación asertiva, gestión de discrepancias y contención emocional reducen hasta en un 70% las derivaciones a procesos disciplinarios formales, creando un ecosistema donde los problemas se resuelven antes de escalar a sedes judiciales.'
        ],
        callout: {
          title: 'Recomendación de Cumplimiento',
          text: 'Audita hoy mismo si tu Reglamento Interno cuenta con el anexo actualizado según los dictámenes de la Dirección del Trabajo. Las multas por carecer de protocolos vigentes pueden superar las 60 UTM por infracción.'
        }
      }
    ],
    conclusion: {
      title: 'Compromiso institucional con el trabajo decente',
      text: 'Cumplir con la Ley Karin va más allá del checklist legal. En Tailor Servicios acompañamos a organizaciones en Punta Arenas y Santiago a diseñar protocolos a la medida de su operación, capacitar a sus líderes y consolidar ambientes de trabajo éticos, motivantes y de alto rendimiento.'
    }
  },
  {
    id: 3,
    slug: 'impacto-desarrollo-organizacional-retencion-talento',
    title: 'El impacto del Desarrollo Organizacional en la retención del talento clave en empresas del sur austral',
    subtitle: 'Planes de carrera, liderazgo empático y medición continua de clima laboral como pilares para reducir la rotación no deseada en industrias regionales.',
    category: 'Desarrollo Organizacional',
    categoryKey: 'do',
    date: '19 de Julio, 2024',
    isoDate: '2024-07-19',
    readTime: '6 min de lectura',
    wordCount: 1120,
    author: {
      name: 'Equipo de Consultoría Tailor',
      role: 'Especialistas en Desarrollo Organizacional & Clima',
      institution: 'Tailor Servicios'
    },
    image: '/desarrollo-organizacional.webp',
    imageAlt: 'Taller de desarrollo organizacional y mapa de competencias para equipos',
    summary: 'Planes de carrera, liderazgo empático y medición continua de clima laboral como pilares para reducir la rotación no deseada en empresas del sur de Chile.',
    keywords: [
      'desarrollo organizacional Chile',
      'retención de talento Magallanes',
      'rotación de personal',
      'clima laboral empresas',
      'planes de carrera y sucesión',
      'consultoría DO punta arenas'
    ],
    keyTakeaways: [
      'El costo de reemplazar a un colaborador clave en regiones aisladas puede ascender a entre 6 y 9 salarios mensuales integrales.',
      'El 72% de los profesionales que renuncian no lo hacen por motivos económicos, sino por falta de visión de futuro y mala relación con su jefatura directa.',
      'La evaluación de desempeño solo genera valor si está conectada a planes de desarrollo individuales y reconocimiento oportuno.',
      'La medición de clima laboral debe ser periódica y orientada a planes de acción concretos con seguimiento trimestral.'
    ],
    sections: [
      {
        heading: '1. El costo real de la rotación en mercados laborales acotados',
        paragraphs: [
          'En plazas de escala acotada como Magallanes, perder a un jefe de planta, un especialista ambiental, un médico veterinario acuícola o un directivo de operaciones genera un impacto desproporcionado. Además de los costos directos de indemnización y headhunting, la empresa sufre curvas de aprendizaje prolongadas, sobrecarga en los equipos remanentes y eventuales pérdidas de clientes estratégicos.',
          'El Desarrollo Organizacional (DO) no es un lujo reservado a corporaciones multinacionales; es la disciplina metodológica que asegura que las personas adecuadas permanezcan comprometidas, alineadas y motivadas en el proyecto empresarial.'
        ]
      },
      {
        heading: '2. Los tres componentes de una estrategia efectiva de DO',
        paragraphs: [
          'Una intervención de Desarrollo Organizacional estructurada aborda el ciclo de vida del colaborador desde tres ángulos sinérgicos:'
        ],
        list: [
          'Diagnóstico de Clima y Cultura con foco en la acción: Aplicación de metodologías cuantitativas y cualitativas (focus groups) que identifiquen los verdaderos cuellos de botella de la convivencia, la comunicación interna y el reconocimiento.',
          'Mapeo de Competencias y Planes de Sucesión: Identificar a los colaboradores de alto potencial (HiPo) y diseñar rutas de crecimiento claras para que no busquen en la competencia lo que pueden conquistar internamente.',
          'Entrenamiento en Liderazgo Situacional: Transformar jefaturas técnicas en facilitadores de equipos capaces de inspirar, delegar y resolver fricciones de manera proactiva.'
        ],
        quote: 'Las personas no renuncian a las empresas: renuncian a la falta de horizonte, a la arbitrariedad y al estancamiento profesional.'
      }
    ],
    conclusion: {
      title: 'El retorno de inversión en las personas',
      text: 'Invertir en Desarrollo Organizacional ofrece uno de los retornos más claros y cuantificables para la gerencia general: dotaciones estables, climas laborales colaborativos y empresas capaces de sortear cualquier ciclo económico con un equipo leal y cohesionado.'
    }
  },
  {
    id: 4,
    slug: 'desafios-ley-40-horas-turnos-continuos-faenas',
    title: 'Desafíos y oportunidades de la Ley de 40 Horas en operaciones continuas, faenas y turnos especiales',
    subtitle: 'Modelos de adaptabilidad laboral, cálculo de dotaciones y optimización de productividad para industrias productivas y logísticas en la zona austral.',
    category: 'Normativa Laboral',
    categoryKey: 'normativa',
    date: '10 de Junio, 2024',
    isoDate: '2024-06-10',
    readTime: '6 min de lectura',
    wordCount: 1100,
    author: {
      name: 'Equipo de Consultoría Tailor',
      role: 'Consultoría en Gestión de Dotaciones y Normativa Laboral',
      institution: 'Tailor Servicios'
    },
    image: '/Images/tailor-web7.webp',
    imageAlt: 'Operaciones en faena industrial y logística continua en el sur de Chile',
    summary: 'Estrategias de adaptabilidad y modelos de turnos eficientes para industrias productivas, acuícolas y logísticas en la zona austral ante la gradualidad de las 40 horas.',
    keywords: [
      'Ley 40 horas Chile',
      'turnos excepcionales faenas',
      'productividad laboral Chile',
      'jornada de trabajo Magallanes',
      'gestión de dotaciones industriales',
      'código del trabajo turnos continuos'
    ],
    keyTakeaways: [
      'La gradualidad de la Ley de 40 Horas exige a las faenas continuas rediseñar mallas de turnos y sistemas de rotación con meses de anticipación.',
      'La compensación de horas mediante días de descanso anual adicional se posiciona como una de las alternativas más eficientes para faenas aisladas.',
      'Mantener la productividad requiere digitalizar procesos rutinarios y capacitar a la dotación en optimización de tiempos.',
      'La negociación temprana y transparente con comités paritarios y sindicatos evita contingencias laborales ante la DT.'
    ],
    sections: [
      {
        heading: '1. El desafío del régimen 24/7 en la zona austral',
        paragraphs: [
          'La implementación gradual de la Ley de 40 Horas en Chile representa un desafío mayúsculo para sectores que operan bajo régimen ininterrumpido: plantas de proceso de salmón, faenas de exploración energética, puertos y centros de distribución logística en Magallanes.',
          'A diferencia de una empresa de servicios de oficina, donde la reducción horaria puede compensarse ajustando el horario de salida los viernes, las plantas de proceso y turnos de faena no pueden detener sus líneas sin incurrir en mermas económicas severas.'
        ]
      },
      {
        heading: '2. Fórmulas de adaptabilidad permitidas por el marco legal',
        paragraphs: [
          'El legislador contempló mecanismos de flexibilidad que las empresas deben explorar estratégicamente:'
        ],
        list: [
          'Promedios semanales en base a ciclos bisemanales o mensuales: Permite promediar la jornada en períodos de hasta 4 semanas.',
          'Compensación con días feriados adicionales: Acordar colectiva o individualmente hasta 5 días de feriado anual adicional a cambio de mantener jornadas compactas en terreno.',
          'Rediseño de solapamientos de turnos: Eliminar tiempos muertos en el traspaso de cuadrillas mediante protocolos estandarizados de entrega de turno.'
        ],
        quote: 'Reducir la jornada laboral sin perder competitividad es un desafío de ingeniería de procesos y gestión estratégica de personas.'
      }
    ],
    conclusion: {
      title: 'Planificación preventiva con Tailor Servicios',
      text: 'En Tailor Servicios ayudamos a las empresas a modelar sus dotaciones óptimas, recalcular costos operativos y gestionar la transición normativa con paz laboral y eficiencia económica garantizada.'
    }
  }
];

function getLiveArticles(): BlogArticle[] {
  if (typeof window === 'undefined') {
    try {
      const req = eval('require');
      const fs = req('fs');
      const path = req('path');
      const cachePath = path.join(process.cwd(), 'scratch', 'blog_articles.json');
      if (fs.existsSync(cachePath)) {
        const content = fs.readFileSync(cachePath, 'utf-8');
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback a blogArticlesEs
    }
  }
  return blogArticlesEs;
}

export function getBlogArticleBySlug(slug: string, locale: string = 'es'): BlogArticle | undefined {
  const articles = getLiveArticles();
  return articles.find(article => article.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  const articles = getLiveArticles();
  return articles.map(article => article.slug);
}
