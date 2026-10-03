'use client';

import React, { useState, useEffect, useRef } from 'react';
import './BlogArticleAdapter.css';

export interface ParsedSubsection {
  title: string;
  paragraphs: string[];
}

export interface ParsedSection {
  heading: string;
  paragraphs: string[];
  subsections?: ParsedSubsection[];
  quote?: string;
  list?: string[];
  callout?: {
    title: string;
    text: string;
  };
}

export interface ParsedArticle {
  id?: number | string;
  title: string;
  subtitle: string;
  category: string;
  categoryKey: string;
  date: string;
  isoDate: string;
  readTime: string;
  wordCount: number;
  slug: string;
  author: {
    id: string;
    name: string;
    role: string;
    institution: string;
    avatar: string;
  };
  image: string;
  imageAlt: string;
  summary: string;
  keywords: string[];
  keyTakeaways: string[];
  sections: ParsedSection[];
  conclusion: {
    title: string;
    text: string;
  };
  contentHtml?: string;
  rawDraft?: string;
  titleEn?: string;
  subtitleEn?: string;
  categoryEn?: string;
  summaryEn?: string;
  readTimeEn?: string;
  keywordsEn?: string[];
  keyTakeawaysEn?: string[];
  sectionsEn?: ParsedSection[];
  conclusionEn?: {
    title: string;
    text: string;
  } | null;
  contentHtmlEn?: string;
  rawDraftEn?: string;
}

export const TAILOR_AUTHORS = [
  {
    id: 'consultoria',
    name: 'Equipo de Consultoría Tailor',
    role: 'Especialistas en Reclutamiento & Gestión de Personas',
    institution: 'Tailor Servicios (Punta Arenas - Santiago)',
    avatar: 'TS'
  },
  {
    id: 'liderazgo',
    name: 'Ma. Pía Avendaño A.',
    role: 'Directora Ejecutiva - Liderazgo Institucional & Estrategia',
    institution: 'Tailor Servicios',
    avatar: 'MP'
  },
  {
    id: 'atraccion',
    name: 'Área de Selección & Headhunting Austral',
    role: 'Consultoría en Búsqueda Ejecutiva & Perfiles Técnicos',
    institution: 'Tailor Servicios',
    avatar: 'SH'
  },
  {
    id: 'do',
    name: 'Área de Desarrollo Organizacional & Clima',
    role: 'Especialistas en Transformación Cultural & Ley Karin',
    institution: 'Tailor Servicios',
    avatar: 'DO'
  },
  {
    id: 'normativa',
    name: 'Área de Normativa & Gestión de Dotaciones',
    role: 'Asesoría en Ley de 40 Horas & Turnos Continuos',
    institution: 'Tailor Servicios',
    avatar: 'NL'
  }
];

export const AVAILABLE_IMAGES = [
  { path: '/Images/tailor-web15.webp', label: 'Reunión Corporativa en Mesa (Oficina Moderna)' },
  { path: '/Images/tailor-web2.webp', label: 'Consultoría y Análisis Directivo' },
  { path: '/desarrollo-organizacional.webp', label: 'Taller de Desarrollo Organizacional & Pizarra' },
  { path: '/Images/tailor-web7.webp', label: 'Operaciones de Faena & Logística Continua' },
  { path: '/reclutamiento-seleccion.webp', label: 'Entrevista y Selección de Personas' },
  { path: '/conectamos-talento.webp', label: 'Conexión de Talento y Equipos' },
  { path: '/Images/tailor-web0.webp', label: 'Oficina Ejecutiva Patagonia' },
];

export default function BlogArticleAdapter({ session }: { session?: any }) {
  // Vista principal: 'list' (gestión de todos los artículos) o 'editor' (crear/editar)
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [articlesList, setArticlesList] = useState<ParsedArticle[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Estados del Editor Bilingüe
  const [rawText, setRawText] = useState('');
  const [rawTextEn, setRawTextEn] = useState('');
  const [activeLangTab, setActiveLangTab] = useState<'es' | 'en'>('es');
  const [editorLayout, setEditorLayout] = useState<'tabs' | 'columns'>('tabs');
  const [previewLocale, setPreviewLocale] = useState<'es' | 'en'>('es');
  const [activePreviewTab, setActivePreviewTab] = useState<'article' | 'card' | 'code'>('article');
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Filtros en la vista de lista
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [listLayout, setListLayout] = useState<'table' | 'grid'>('table');

  // Modal de confirmación para eliminar
  const [articleToDelete, setArticleToDelete] = useState<ParsedArticle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados de Imagen
  const [imageSourceMode, setImageSourceMode] = useState<'catalog' | 'upload' | 'url'>('catalog');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de Autor
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>('consultoria');
  const [customAuthor, setCustomAuthor] = useState({ name: '', role: '', institution: 'Tailor Servicios' });

  // Resultado estructurado actual en edición
  const [parsed, setParsed] = useState<ParsedArticle | null>(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  // Cargar artículos existentes y verificar borrador guardado al montar
  useEffect(() => {
    fetchArticles();

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tailor_blog_active_draft');
      const savedEn = localStorage.getItem('tailor_blog_active_draft_en');
      if (saved && saved.trim().length > 15) {
        setHasSavedDraft(true);
      }
      if (savedEn && savedEn.trim().length > 15) {
        setRawTextEn(savedEn);
      }
    }
  }, []);

  // Auto-guardado en localStorage mientras se escribe (ambos idiomas)
  useEffect(() => {
    if (rawText && rawText.trim().length > 15 && typeof window !== 'undefined') {
      localStorage.setItem('tailor_blog_active_draft', rawText);
    }
  }, [rawText]);

  useEffect(() => {
    if (rawTextEn && rawTextEn.trim().length > 15 && typeof window !== 'undefined') {
      localStorage.setItem('tailor_blog_active_draft_en', rawTextEn);
    }
  }, [rawTextEn]);

  const fetchArticles = async () => {
    setLoadingList(true);
    try {
      const token = session?.access_token || '';
      const res = await fetch('/api/admin/blog', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.articles)) {
          setArticlesList(data.articles);
        }
      } else {
        const fallbackRes = await fetch('/api/blog');
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (fallbackData.success && Array.isArray(fallbackData.articles)) {
            setArticlesList(fallbackData.articles);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoadingList(false);
    }
  };

  /**
   * PARSER ESTRUCTURAL ESTRICTO (REGLA DE ORO):
   * No altera ninguna palabra, coma o punto del texto original.
   * Identifica H1 (Título), Subtítulo, H2 (Secciones principales),
   * H3 (Subsecciones), listas, citas y puntos clave.
   */
  const parseDraftText = (
    textToParse: string,
    existingParsed?: ParsedArticle | null,
    authorId: string = selectedAuthorId,
    customAuthorData: any = customAuthor
  ): ParsedArticle | null => {
    if (!textToParse.trim()) return null;

    const lines = textToParse.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return null;

    // 1. H1 (Título Principal)
    const titleLine = lines[0].replace(/^#+\s*/, '');
    let remainingLines = lines.slice(1);

    // 2. Subtítulo / Bajada
    let subtitle = '';
    if (remainingLines.length > 0 && !isH2Line(remainingLines[0]) && !isH3Line(remainingLines[0])) {
      subtitle = remainingLines[0];
      remainingLines = remainingLines.slice(1);
    }

    const keyTakeaways: string[] = [];
    const sections: ParsedSection[] = [];
    let currentSection: ParsedSection | null = null;
    let currentSubsection: ParsedSubsection | null = null;
    let conclusion = {
      title: 'Conclusiones y Recomendaciones Estratégicas',
      text: ''
    };

    let i = 0;
    while (i < remainingLines.length) {
      const line = remainingLines[i];

      // Detección de bloque de Puntos Clave (Español e Inglés)
      if (/^(puntos\s+clave|aspectos\s+clave|conclusiones\s+ejecutivas|resumen\s+ejecutivo|key\s+takeaways|key\s+points|takeaways)/i.test(line)) {
        i++;
        while (i < remainingLines.length && isListLine(remainingLines[i])) {
          keyTakeaways.push(cleanListMarker(remainingLines[i]));
          i++;
        }
        continue;
      }

      // Detección de Conclusión (Español e Inglés)
      if (/^(conclusi[oó]n|en\s+conclusi[oó]n|hacia\s+una|palabras\s+finales|conclusion|in\s+conclusion|final\s+thoughts|closing\s+remarks|strategic\s+reflection)/i.test(line)) {
        conclusion.title = cleanHeadingMarker(line);
        i++;
        const conclusionParas: string[] = [];
        while (i < remainingLines.length && !isH2Line(remainingLines[i])) {
          conclusionParas.push(remainingLines[i]);
          i++;
        }
        conclusion.text = conclusionParas.join(' ');
        continue;
      }

      // Detección de Encabezado H2 (Sección Principal)
      if (isH2Line(line)) {
        if (currentSection) {
          if (currentSubsection) {
            if (!currentSection.subsections) currentSection.subsections = [];
            currentSection.subsections.push(currentSubsection);
            currentSubsection = null;
          }
          sections.push(currentSection);
        }
        currentSection = {
          heading: cleanHeadingMarker(line),
          paragraphs: [],
          subsections: []
        };
        i++;
        continue;
      }

      // Detección de Encabezado H3 (Subsección)
      if (isH3Line(line)) {
        if (!currentSection) {
          currentSection = {
            heading: 'Marco General & Antecedentes',
            paragraphs: [],
            subsections: []
          };
        }
        if (currentSubsection) {
          if (!currentSection.subsections) currentSection.subsections = [];
          currentSection.subsections.push(currentSubsection);
        }
        currentSubsection = {
          title: cleanHeadingMarker(line),
          paragraphs: []
        };
        i++;
        continue;
      }

      // Si aún no hay sección
      if (!currentSection) {
        currentSection = {
          heading: 'Introducción & Contexto',
          paragraphs: []
        };
      }

      // Detección de Cita (Blockquote o etiqueta <blockquote>)
      if (
        (line.startsWith('"') && line.endsWith('"')) ||
        (line.startsWith('«') && line.endsWith('»')) ||
        line.startsWith('>') ||
        /<blockquote[^>]*>/i.test(line)
      ) {
        const quoteText = line
          .replace(/<\/?blockquote[^>]*>/gi, '')
          .replace(/^[">«\s]+|[">»\s]+$/g, '')
          .trim();
        currentSection.quote = quoteText;
        i++;
        continue;
      }

      // Detección de Viñeta / Lista (viñeta clásica o <li>)
      if (isListLine(line)) {
        if (!currentSection.list) currentSection.list = [];
        currentSection.list.push(cleanListMarker(line));
        i++;
        continue;
      }

      // Párrafo normal (preserva texto sin alterar ni una sola palabra, soporta <p>)
      const cleanParagraph = line.replace(/<\/?p[^>]*>/gi, '').trim();
      if (cleanParagraph) {
        if (currentSubsection) {
          currentSubsection.paragraphs.push(cleanParagraph);
        } else {
          currentSection.paragraphs.push(cleanParagraph);
        }
      }
      i++;
    }

    if (currentSubsection && currentSection) {
      if (!currentSection.subsections) currentSection.subsections = [];
      currentSection.subsections.push(currentSubsection);
    }
    if (currentSection) {
      sections.push(currentSection);
    }

    // Puntos clave de respaldo si no venían explícitos
    if (keyTakeaways.length === 0) {
      for (const sec of sections) {
        if (sec.list && sec.list.length > 0) {
          keyTakeaways.push(...sec.list.slice(0, 3));
          break;
        }
      }
      if (keyTakeaways.length === 0 && subtitle) {
        keyTakeaways.push(subtitle);
      }
    }

    // Conteo de palabras exacto y tiempo de lectura
    const wordCount = textToParse.trim().split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const cleanSlug = (isEditingExisting && existingParsed?.slug)
      ? existingParsed.slug 
      : (generateSlug(titleLine) || `articulo-${Date.now()}`);

    const articleId = (isEditingExisting && existingParsed?.id) 
      ? existingParsed.id 
      : Date.now();

    // Detección automática de categoría sugerida
    let category = existingParsed?.category || 'Gestión de Personas';
    let categoryKey = existingParsed?.categoryKey || 'personas';
    const lowerText = textToParse.toLowerCase();
    if (!existingParsed) {
      if (lowerText.includes('atracci') || lowerText.includes('recluta') || lowerText.includes('talento') || lowerText.includes('magallanes') || lowerText.includes('patagonia') || lowerText.includes('headhunting')) {
        category = 'Atracción de Talento';
        categoryKey = 'atraccion';
      } else if (lowerText.includes('karin') || lowerText.includes('40 horas') || lowerText.includes('normativa') || lowerText.includes('laboral') || lowerText.includes('dt') || lowerText.includes('acoso')) {
        category = 'Normativa Laboral';
        categoryKey = 'normativa';
      } else if (lowerText.includes('desarrollo organizacional') || lowerText.includes('clima') || lowerText.includes('cultura') || lowerText.includes('liderazgo') || lowerText.includes('rotaci')) {
        category = 'Desarrollo Organizacional';
        categoryKey = 'do';
      }
    }

    // Autor seleccionado
    const selectedAuthorObj = authorId === 'custom' 
      ? {
          id: 'custom',
          name: customAuthorData.name || 'Consultor Especialista',
          role: customAuthorData.role || 'Consultoría Tailor',
          institution: customAuthorData.institution || 'Tailor Servicios',
          avatar: 'TS'
        }
      : TAILOR_AUTHORS.find(a => a.id === authorId) || TAILOR_AUTHORS[0];

    const today = new Date();
    const formattedDate = existingParsed?.date || today.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
    const isoDate = existingParsed?.isoDate || today.toISOString().split('T')[0];
    const currentImg = existingParsed?.image || AVAILABLE_IMAGES[0].path;

    return {
      id: articleId,
      title: titleLine,
      subtitle: subtitle || 'Análisis estratégico y consideraciones clave para directivos de empresas.',
      category,
      categoryKey,
      date: formattedDate,
      isoDate,
      readTime: `${readTimeMinutes} min de lectura`,
      wordCount,
      slug: cleanSlug,
      author: selectedAuthorObj,
      image: currentImg,
      imageAlt: titleLine,
      summary: subtitle || (sections[0]?.paragraphs[0] ? sections[0].paragraphs[0].slice(0, 160) + '...' : titleLine),
      keywords: extractKeywords(lowerText, category),
      keyTakeaways,
      sections,
      conclusion: conclusion.text ? conclusion : {
        title: 'Reflexión Estratégica',
        text: 'La adopción de estas prácticas permite a las organizaciones consolidar ventajas sustentables a través de sus personas.'
      }
    };
  };

  const handleParseText = () => {
    if (activeLangTab === 'es') {
      if (!rawText.trim()) return;
      const parsedData = parseDraftText(rawText, parsed, selectedAuthorId, customAuthor);
      if (parsedData) {
        if (parsed?.titleEn) parsedData.titleEn = parsed.titleEn;
        if (parsed?.subtitleEn) parsedData.subtitleEn = parsed.subtitleEn;
        if (parsed?.summaryEn) parsedData.summaryEn = parsed.summaryEn;
        if (parsed?.sectionsEn) parsedData.sectionsEn = parsed.sectionsEn;
        if (parsed?.conclusionEn) parsedData.conclusionEn = parsed.conclusionEn;
        if (parsed?.keyTakeawaysEn) parsedData.keyTakeawaysEn = parsed.keyTakeawaysEn;
        if (parsed?.keywordsEn) parsedData.keywordsEn = parsed.keywordsEn;
        if (parsed?.readTimeEn) parsedData.readTimeEn = parsed.readTimeEn;
        if (parsed?.rawDraftEn) parsedData.rawDraftEn = parsed.rawDraftEn;
        parsedData.rawDraft = rawText;
        setParsed(parsedData);
        setPreviewLocale('es');
      }
    } else {
      if (!rawTextEn.trim()) return;
      const parsedEn = parseDraftText(rawTextEn, null, selectedAuthorId, customAuthor);
      if (parsedEn && parsed) {
        setParsed({
          ...parsed,
          titleEn: parsedEn.title,
          subtitleEn: parsedEn.subtitle,
          summaryEn: parsedEn.summary,
          sectionsEn: parsedEn.sections,
          conclusionEn: parsedEn.conclusion,
          keyTakeawaysEn: parsedEn.keyTakeaways,
          keywordsEn: parsedEn.keywords,
          readTimeEn: `${Math.max(1, Math.ceil(parsedEn.wordCount / 200))} min read`,
          rawDraftEn: rawTextEn
        });
        setPreviewLocale('en');
      }
    }
  };

  const isH2Line = (line: string): boolean => {
    return /^##\s+/i.test(line) ||
           /^<h2[^>]*>/i.test(line) ||
           /^(\d+[\.\)]|[I|V|X]+[\.\)])\s+[A-ZÁÉÍÓÚ]/.test(line) ||
           (line.length < 90 && /^[A-ZÁÉÍÓÚ0-9\s\:\-\–]{6,}$/.test(line) && !line.endsWith('.'));
  };

  const isH3Line = (line: string): boolean => {
    return /^###\s+/i.test(line) ||
           /^<h3[^>]*>/i.test(line) ||
           /^(\d+\.\d+|[a-zA-Z]\))\s+/.test(line) ||
           (line.length < 80 && line.endsWith(':') && !isH2Line(line));
  };

  const isListLine = (line: string): boolean => {
    return /^[-*•–—]\s+/.test(line) ||
           /^<li[^>]*>/i.test(line) ||
           /^(\d+[\.\)]|[a-z][\.\)])\s+/.test(line);
  };

  const cleanListMarker = (line: string): string => {
    return line
      .replace(/^[-*•–—\d\.\)\s]+/, '')
      .replace(/<\/?li[^>]*>/gi, '')
      .trim();
  };

  const cleanHeadingMarker = (line: string): string => {
    return line
      .replace(/^#+\s*/, '')
      .replace(/<\/?h[1-6][^>]*>/gi, '')
      .replace(/:$/, '')
      .trim();
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const extractKeywords = (text: string, cat: string): string[] => {
    const catalog = [
      'atracción de talento', 'reclutamiento Punta Arenas', 'gestión de personas Magallanes',
      'Ley Karin Chile', 'Ley 40 horas', 'desarrollo organizacional', 'clima laboral',
      'turnos continuos', 'capacitación laboral', 'liderazgo estratégico', 'recursos humanos Patagonia'
    ];
    const found = catalog.filter(kw => text.includes(kw.toLowerCase()));
    if (found.length < 3) found.push(cat, 'Tailor Servicios', 'Punta Arenas');
    return found;
  };

  // Extraer metadatos automáticamente del HTML del artículo (H1, resumen, word count)
  const extractMetadataFromHtml = (html: string): { title?: string; summary?: string; wordCount: number } => {
    if (!html || !html.trim()) return { wordCount: 0 };
    const textOnly = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textOnly ? textOnly.split(' ').filter(Boolean).length : 0;

    let title: string | undefined;
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match) {
      title = h1Match[1].replace(/<[^>]+>/g, '').trim();
    } else {
      const h2Match = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
      if (h2Match) {
        title = h2Match[1].replace(/<[^>]+>/g, '').trim();
      }
    }

    let summary: string | undefined;
    const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (pMatch) {
      const cleanP = pMatch[1].replace(/<[^>]+>/g, '').trim();
      if (cleanP.length > 20) {
        summary = cleanP.length > 200 ? cleanP.substring(0, 197) + '...' : cleanP;
      }
    }

    return { title, summary, wordCount };
  };

  // Convertir texto plano a HTML estructurado (<p>, <h2>, <ul>)
  const convertPlainTextToHtml = (text: string): string => {
    if (!text || !text.trim()) return '';
    if (/<(p|h[1-6]|ul|ol|blockquote|div)[\s>]/i.test(text)) {
      return text;
    }
    const lines = text.split('\n');
    const result: string[] = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i].trim();
      if (!rawLine) {
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        continue;
      }

      if (/^[-*•–—]\s+/.test(rawLine)) {
        if (!inList) {
          result.push('<ul>');
          inList = true;
        }
        const itemText = rawLine.replace(/^[-*•–—]\s+/, '');
        result.push(`  <li>${itemText}</li>`);
        continue;
      } else if (inList) {
        result.push('</ul>');
        inList = false;
      }

      if (/^(\d+[\.\)]|[A-Z][\.\)]|Sección|Paso)/i.test(rawLine) && rawLine.length < 90) {
        result.push(`<h2>${rawLine}</h2>`);
        continue;
      }

      if (/^["“].+["”]$/.test(rawLine) && rawLine.length < 250) {
        result.push(`<blockquote>${rawLine}</blockquote>`);
        continue;
      }

      result.push(`<p>${rawLine}</p>`);
    }

    if (inList) {
      result.push('</ul>');
    }

    return result.join('\n');
  };

  // Convertir artículos antiguos basados en secciones a HTML para edición directa
  const sectionsToHtml = (article: ParsedArticle, isEn: boolean = false): string => {
    const sections = isEn ? (article.sectionsEn || []) : (article.sections || []);
    const conclusion = isEn ? article.conclusionEn : article.conclusion;
    const takeaways = isEn ? article.keyTakeawaysEn : article.keyTakeaways;
    
    let html = '';
    
    if (takeaways && takeaways.length > 0) {
      html += `<blockquote>\n  <strong>${isEn ? 'Key Strategic Takeaways:' : 'Puntos Clave para la Dirección:'}</strong>\n  <ul>\n`;
      for (const t of takeaways) {
        html += `    <li>${t}</li>\n`;
      }
      html += `  </ul>\n</blockquote>\n\n`;
    }
    
    for (const sec of sections) {
      html += `<h2>${sec.heading}</h2>\n`;
      for (const p of sec.paragraphs) {
        html += `<p>${p}</p>\n`;
      }
      if (sec.quote) {
        html += `<blockquote>"${sec.quote}"</blockquote>\n`;
      }
      if (sec.list && sec.list.length > 0) {
        html += `<ul>\n`;
        for (const item of sec.list) {
          html += `  <li>${item}</li>\n`;
        }
        html += `</ul>\n`;
      }
      if (sec.subsections && sec.subsections.length > 0) {
        for (const sub of sec.subsections) {
          html += `<h3>${sub.title}</h3>\n`;
          for (const sp of sub.paragraphs) {
            html += `<p>${sp}</p>\n`;
          }
        }
      }
      html += '\n';
    }
    
    if (conclusion && conclusion.text) {
      html += `<h2>${conclusion.title || (isEn ? 'Strategic Reflection' : 'Reflexión Estratégica')}</h2>\n`;
      html += `<p>${conclusion.text}</p>\n`;
    }
    
    return html.trim();
  };

  // Insertar etiquetas HTML / formato directamente en el área de texto activa
  const insertTagIntoTextarea = (openTag: string, closeTag: string, defaultText: string, targetLang?: 'es' | 'en') => {
    const lang = targetLang || activeLangTab;
    const targetId = lang === 'en' ? 'raw-text-en-input' : 'raw-text-input';
    const currentText = lang === 'en' ? rawTextEn : rawText;
    const setText = lang === 'en' ? setRawTextEn : setRawText;

    const textarea = document.getElementById(targetId) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const selectedText = currentText.substring(start, end) || defaultText;
    const replacement = `${openTag}${selectedText}${closeTag}`;
    const newText = currentText.substring(0, start) + replacement + currentText.substring(end);

    setText(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
    }, 50);
  };

  // Formatear texto plano en HTML con un solo clic
  const handleFormatPlainText = (targetLang: 'es' | 'en') => {
    const current = targetLang === 'en' ? rawTextEn : rawText;
    if (!current.trim()) {
      alert('⚠️ No hay texto para formatear.');
      return;
    }
    const formatted = convertPlainTextToHtml(current);
    if (targetLang === 'en') {
      setRawTextEn(formatted);
    } else {
      setRawText(formatted);
    }
  };

  // Asistente para generar borrador base en inglés a partir del borrador en español
  const handleGenerateEnglishFromSpanish = () => {
    if (!rawText.trim()) {
      alert('⚠️ Primero debes ingresar el contenido en español en el contenedor [🇨🇱 Español].');
      return;
    }

    if (rawTextEn.trim()) {
      const confirmReplace = window.confirm('Ya tienes contenido en el contenedor en inglés. ¿Deseas reemplazarlo con una nueva base generada desde el español?');
      if (!confirmReplace) return;
    }

    let baseEn = rawText
      .replace(/Puntos Clave para la Dirección/gi, 'Key Strategic Takeaways for Leadership')
      .replace(/Aspectos clave/gi, 'Key takeaways')
      .replace(/Resumen ejecutivo/gi, 'Executive summary')
      .replace(/Conclusión/gi, 'Conclusion')
      .replace(/En conclusión/gi, 'In conclusion')
      .replace(/Reflexión Estratégica/gi, 'Strategic Reflection');

    if (parsed && (parsed.title.includes('Magallanes') || parsed.slug.includes('magallanes'))) {
      baseEn = `<h2>Magallanes: A Strategic Gateway, Not a Peripheral Outpost</h2>
<p>We are close to Antarctica, close to strategic maritime routes, surrounded by nature that the world seeks to know, study, and protect. And in the midst of energetic, scientific, tourism, and logistical transformations that are drawing unprecedented international attention to this edge of the planet. Perhaps that is why, when someone speaks of Magallanes from the outside, we pay close attention.</p>

<p>Not because we need validation from others, but because we know firsthand the effort required to build, innovate, and grow organizations in this territory. And because we also recognize the immense potential of a region that for too long was viewed merely as the remote end of Chile, and which today, with growing momentum, is recognized as a strategic territory.</p>

<blockquote>"Words shape perceptions, but capabilities build lasting reality."</blockquote>

<h2>A Position That Is Shifting</h2>
<p>Today, Magallanes participates in strategic discussions for Chile and the world: energy transition, green hydrogen, maritime connectivity, special interest tourism, and Antarctic logistics.</p>

<h2>Strategic Reflection</h2>
<p>Championing Magallanes means acknowledging our potential with maturity to address our gaps and compete with excellence on the global stage.</p>`;
    }

    setRawTextEn(baseEn);
    if (parsed) {
      const metaEn = extractMetadataFromHtml(baseEn);
      setParsed({
        ...parsed,
        titleEn: parsed.titleEn || metaEn.title || 'Magallanes: Strategic Gateway and Southern Projection',
        summaryEn: parsed.summaryEn || metaEn.summary || '',
        contentHtmlEn: baseEn,
        rawDraftEn: baseEn
      });
      setPreviewLocale('en');
    }
  };

  // Manejador de cambio de texto HTML en Español con sincronización en tiempo real
  const handleRawTextChange = (newVal: string) => {
    setRawText(newVal);
    if (parsed) {
      const meta = extractMetadataFromHtml(newVal);
      setParsed(prev => prev ? ({
        ...prev,
        contentHtml: newVal,
        rawDraft: newVal,
        title: (prev.title === 'Nuevo Artículo de Estrategia' || !prev.title.trim()) ? (meta.title || prev.title) : prev.title,
        summary: !prev.summary.trim() ? (meta.summary || prev.summary) : prev.summary,
        wordCount: meta.wordCount || newVal.split(/\s+/).filter(Boolean).length
      }) : null);
    }
  };

  // Manejador de cambio de texto HTML en Inglés con sincronización en tiempo real
  const handleRawTextEnChange = (newVal: string) => {
    setRawTextEn(newVal);
    if (parsed) {
      const metaEn = extractMetadataFromHtml(newVal);
      setParsed(prev => prev ? ({
        ...prev,
        contentHtmlEn: newVal,
        rawDraftEn: newVal,
        titleEn: !prev.titleEn?.trim() ? (metaEn.title || prev.titleEn) : prev.titleEn,
        summaryEn: !prev.summaryEn?.trim() ? (metaEn.summary || prev.summaryEn) : prev.summaryEn
      }) : null);
    }
  };

  // Autodetectar metadatos (H1 / primer párrafo) desde el HTML
  const handleAutoDetectMetadata = (lang: 'es' | 'en') => {
    const text = lang === 'es' ? rawText : rawTextEn;
    if (!text.trim()) {
      alert(`⚠️ No hay contenido en el contenedor de ${lang === 'es' ? 'Español' : 'Inglés'}.`);
      return;
    }
    const meta = extractMetadataFromHtml(text);
    if (parsed) {
      if (lang === 'es') {
        setParsed({
          ...parsed,
          title: meta.title || parsed.title,
          summary: meta.summary || parsed.summary,
          slug: isEditingExisting ? parsed.slug : generateSlug(meta.title || parsed.title)
        });
      } else {
        setParsed({
          ...parsed,
          titleEn: meta.title || parsed.titleEn,
          summaryEn: meta.summary || parsed.summaryEn
        });
      }
    }
  };

  // Manejo de carga de imagen propia desde el computador
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result && parsed) {
        setParsed({ ...parsed, image: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAuthorChange = (authorId: string) => {
    setSelectedAuthorId(authorId);
    if (!parsed) return;

    if (authorId === 'custom') {
      setParsed({
        ...parsed,
        author: {
          id: 'custom',
          name: customAuthor.name || 'Consultor Especialista',
          role: customAuthor.role || 'Consultoría Tailor',
          institution: customAuthor.institution || 'Tailor Servicios',
          avatar: 'TS'
        }
      });
    } else {
      const match = TAILOR_AUTHORS.find(a => a.id === authorId);
      if (match) {
        setParsed({ ...parsed, author: match });
      }
    }
  };

  // Guardar y Publicar en Backend
  const handleSaveArticle = async () => {
    setSaveStatus('Guardando artículo...');

    if (!rawText.trim()) {
      alert('⚠️ Por favor escribe o pega el contenido HTML del artículo en español antes de guardar.');
      setSaveStatus(null);
      return;
    }

    const metaEs = extractMetadataFromHtml(rawText);
    const metaEn = extractMetadataFromHtml(rawTextEn);

    const titleEs = parsed?.title?.trim() || metaEs.title || 'Artículo de Estrategia';
    const titleEn = parsed?.titleEn?.trim() || metaEn.title || '';
    const summaryEs = parsed?.summary?.trim() || metaEs.summary || titleEs;
    const summaryEn = parsed?.summaryEn?.trim() || metaEn.summary || '';
    const wordCountEs = metaEs.wordCount || rawText.trim().split(/\s+/).filter(Boolean).length;
    const wordCountEn = metaEn.wordCount || rawTextEn.trim().split(/\s+/).filter(Boolean).length;
    const readTimeEs = `${Math.max(1, Math.ceil(wordCountEs / 200))} min de lectura`;
    const readTimeEn = wordCountEn > 0 ? `${Math.max(1, Math.ceil(wordCountEn / 200))} min read` : '5 min read';
    const slug = (isEditingExisting && parsed?.slug) ? parsed.slug : (generateSlug(titleEs) || `articulo-${Date.now()}`);

    const articleToSave: ParsedArticle = {
      id: parsed?.id || Date.now(),
      title: titleEs,
      subtitle: parsed?.subtitle?.trim() || summaryEs,
      summary: summaryEs,
      slug: slug,
      category: parsed?.category || 'Gestión de Personas',
      categoryKey: parsed?.categoryKey || 'personas',
      date: parsed?.date || new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }),
      isoDate: parsed?.isoDate || new Date().toISOString().split('T')[0],
      readTime: readTimeEs,
      wordCount: wordCountEs,
      author: parsed?.author || TAILOR_AUTHORS[0],
      image: parsed?.image || AVAILABLE_IMAGES[0].path,
      imageAlt: titleEs,
      keywords: parsed?.keywords && parsed.keywords.length > 0 ? parsed.keywords : extractKeywords(rawText, parsed?.category || 'Gestión de Personas'),
      keyTakeaways: parsed?.keyTakeaways || [],
      sections: parsed?.sections || [],
      conclusion: parsed?.conclusion || { title: 'Conclusión', text: '' },
      contentHtml: rawText,
      rawDraft: rawText,
      titleEn: titleEn,
      subtitleEn: parsed?.subtitleEn || summaryEn,
      summaryEn: summaryEn,
      readTimeEn: readTimeEn,
      keywordsEn: parsed?.keywordsEn || [],
      keyTakeawaysEn: parsed?.keyTakeawaysEn || [],
      sectionsEn: parsed?.sectionsEn || [],
      conclusionEn: parsed?.conclusionEn || null,
      contentHtmlEn: rawTextEn.trim() ? rawTextEn : undefined,
      rawDraftEn: rawTextEn.trim() ? rawTextEn : undefined,
    };

    setParsed(articleToSave);

    // Respaldo de seguridad inmediato en localStorage
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('tailor_blog_last_draft_backup', rawText);
        localStorage.setItem('tailor_blog_last_draft_backup_en', rawTextEn);
        localStorage.setItem('tailor_blog_last_attempted_article', JSON.stringify(articleToSave));
      }
    } catch (backupErr) {
      console.warn('No se pudo escribir respaldo en localStorage:', backupErr);
    }

    try {
      const token = session?.access_token || 'dev-token';
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ article: articleToSave })
      });

      if (res.ok) {
        const resData = await res.json().catch(() => ({}));
        const savedResult = resData.article || articleToSave;
        setSaveStatus('✅ ¡Artículo guardado y publicado exitosamente en el Blog!');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('tailor_blog_active_draft');
          localStorage.removeItem('tailor_blog_active_draft_en');
          localStorage.setItem('tailor_blog_last_published', JSON.stringify(savedResult));
        }
        await fetchArticles();
        setTimeout(() => {
          setSaveStatus(null);
          setViewMode('list');
        }, 1200);
      } else {
        const errData = await res.json().catch(() => ({}));
        const errorMsg = errData?.error || `Error en servidor (${res.status})`;
        setSaveStatus(`❌ Error: ${errorMsg}`);
        alert(`❌ Error al guardar en el servidor: ${errorMsg}\n\nTu texto sigue intacto en el editor para que no pierdas ningún cambio.`);
      }
    } catch (err: any) {
      setSaveStatus(`❌ Error de conexión: ${err?.message}`);
      alert(`❌ Error de conexión al guardar: ${err?.message}\n\nTu texto sigue intacto en el editor.`);
    }
  };

  // Eliminar Artículo
  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);

    try {
      const token = session?.access_token || '';
      const res = await fetch(`/api/admin/blog?slug=${encodeURIComponent(articleToDelete.slug)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setArticlesList(articlesList.filter(a => a.slug !== articleToDelete.slug));
        setArticleToDelete(null);
      } else {
        alert('Error al eliminar el artículo');
      }
    } catch (err) {
      alert('Error de conexión al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  // Iniciar edición de un artículo existente
  const handleEditClick = (article: ParsedArticle) => {
    setIsEditingExisting(true);
    setParsed(article);
    setSelectedAuthorId(article.author?.id || 'consultoria');

    // 1. Cargar o reconstruir HTML en español
    if (article.contentHtml && article.contentHtml.trim()) {
      setRawText(article.contentHtml);
    } else if (article.rawDraft && article.rawDraft.trim()) {
      setRawText(article.rawDraft);
    } else {
      setRawText(sectionsToHtml(article, false));
    }

    // 2. Cargar o reconstruir HTML en inglés
    if (article.contentHtmlEn && article.contentHtmlEn.trim()) {
      setRawTextEn(article.contentHtmlEn);
    } else if (article.rawDraftEn && article.rawDraftEn.trim()) {
      setRawTextEn(article.rawDraftEn);
    } else if (article.sectionsEn && article.sectionsEn.length > 0) {
      setRawTextEn(sectionsToHtml(article, true));
    } else {
      setRawTextEn('');
    }

    setActiveLangTab('es');
    setPreviewLocale('es');
    setViewMode('editor');
  };

  // Iniciar creación de artículo nuevo
  const handleNewArticleClick = () => {
    setIsEditingExisting(false);
    const initialHtml = `<h2>1. Diagnóstico Inicial & Contexto</h2>
<p>Escribe o pega aquí el primer párrafo de tu artículo en español...</p>

<h2>2. Medidas Operativas y Recomendaciones</h2>
<p>Detalla las buenas prácticas y estrategias recomendadas para directivos y líderes...</p>

<blockquote>"La adopción de estas medidas fortalece la cultura y la retención del talento clave."</blockquote>

<h2>3. Conclusiones para la Dirección</h2>
<p>Síntesis de impacto operativo y reflexiones finales para las organizaciones.</p>`;

    const newDraft: ParsedArticle = {
      id: Date.now(),
      title: 'Nuevo Artículo de Estrategia',
      subtitle: 'Análisis y recomendaciones clave para organizaciones de la Patagonia.',
      category: 'Gestión de Personas',
      categoryKey: 'personas',
      date: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }),
      isoDate: new Date().toISOString().split('T')[0],
      readTime: '5 min de lectura',
      wordCount: 350,
      slug: 'nuevo-articulo-' + Date.now().toString().slice(-4),
      author: TAILOR_AUTHORS[0],
      image: AVAILABLE_IMAGES[0].path,
      imageAlt: 'Nuevo Artículo de Estrategia',
      summary: 'Resumen introductorio del nuevo artículo de Tailor Servicios.',
      keywords: ['Tailor Servicios', 'Gestión de Personas', 'Punta Arenas'],
      keyTakeaways: [],
      sections: [],
      conclusion: {
        title: 'Reflexión Estratégica',
        text: 'La adopción de estas prácticas permite a las organizaciones consolidar ventajas sustentables a través de sus personas.'
      },
      contentHtml: initialHtml,
      rawDraft: initialHtml,
      titleEn: '',
      subtitleEn: '',
      summaryEn: '',
      readTimeEn: '5 min read',
      keywordsEn: [],
      keyTakeawaysEn: [],
      sectionsEn: [],
      conclusionEn: null,
      contentHtmlEn: '',
      rawDraftEn: ''
    };

    setParsed(newDraft);
    setRawText(initialHtml);
    setRawTextEn('');
    setSelectedAuthorId('consultoria');
    setActiveLangTab('es');
    setPreviewLocale('es');
    setViewMode('editor');
  };

  const handleCopyCode = () => {
    if (!parsed) return;
    const codeString = JSON.stringify(parsed, null, 2);
    navigator.clipboard.writeText(codeString);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleDownloadJson = () => {
    if (!parsed) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(parsed, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${parsed.slug || 'articulo-tailor'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtrado de lista
  const filteredArticles = articlesList.filter(article => {
    const matchesCategory = selectedCategoryFilter === 'all' || article.category === selectedCategoryFilter;
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="blog-adapter-container">
      {/* HEADER PRINCIPAL CMS */}
      <div className="adapter-header">
        <div className="adapter-title-group">
          <div className="header-top-row">
            <div>
              <span className="adapter-badge">Panel Editorial Tailor Servicios</span>
              <h2>Gestor y Maquetador de Artículos (Blog CMS)</h2>
              <p>
                Crea, edita, elimina y adapta artículos para el blog de Tailor Servicios. 
                Pega tus borradores en bruto y obtén una estructura visual y SEO perfecta <strong>sin modificar una sola palabra ni un punto</strong>.
              </p>
            </div>
            
            {viewMode === 'list' ? (
              <button 
                type="button" 
                className="btn-primary-action"
                onClick={handleNewArticleClick}
              >
                + Redactar / Adaptar Nuevo Artículo
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  className="btn-secondary-action"
                  onClick={() => {
                    if (rawText.trim() && !window.confirm('¿Deseas volver al listado? Recuerda guardar tus cambios antes de salir.')) {
                      return;
                    }
                    setViewMode('list');
                  }}
                >
                  ← Volver al Listado
                </button>

                <button 
                  type="button" 
                  className="btn-primary-action"
                  onClick={handleSaveArticle}
                  disabled={!rawText.trim() && !parsed}
                  style={{
                    background: '#16a34a',
                    borderColor: '#15803d',
                    fontWeight: 800,
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  💾 Guardar y Publicar en el Blog
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          VISTA 1: LISTADO DE ARTÍCULOS EXISTENTES (PANEL CRUD)
          ======================================================== */}
      {viewMode === 'list' && (
        <div className="articles-management-section">
          {/* Banner de Borrador No Guardado en Lista */}
          {hasSavedDraft && (
            <div style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#92400e',
              padding: '0.85rem 1.25rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.9rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)'
            }}>
              <div>
                <strong>⚠️ Borrador pendiente encontrado:</strong> Tienes un texto redactado en tu navegador que aún no ha sido publicado en el blog.
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    const saved = localStorage.getItem('tailor_blog_active_draft');
                    if (saved) {
                      setRawText(saved);
                      setIsEditingExisting(false);
                      const p = parseDraftText(saved);
                      if (p) setParsed(p);
                      setViewMode('editor');
                    }
                  }}
                  style={{
                    background: '#92400e',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.45rem 1rem',
                    borderRadius: '6px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  📝 Abrir y Continuar Editando
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de descartar este borrador guardado en tu navegador?')) {
                      localStorage.removeItem('tailor_blog_active_draft');
                      setHasSavedDraft(false);
                    }
                  }}
                  style={{
                    background: 'transparent',
                    color: '#78350f',
                    border: '1px solid #d97706',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Descartar
                </button>
              </div>
            </div>
          )}

          {/* Barra de Filtros y Búsqueda */}
          <div className="cms-filter-toolbar">
            <div className="search-box-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text"
                placeholder="Buscar artículo por título, tema o autor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cms-search-input"
              />
            </div>

            <div className="category-filter-pills">
              {['all', 'Atracción de Talento', 'Gestión de Personas', 'Desarrollo Organizacional', 'Normativa Laboral'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`cms-pill ${selectedCategoryFilter === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategoryFilter(cat)}
                >
                  {cat === 'all' ? 'Todos los Temas' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Estadísticas de Artículos y Selector de Vista */}
          <div className="cms-stats-bar">
            <div className="cms-stats-items">
              <span>📚 <strong>{filteredArticles.length}</strong> artículos registrados</span>
              <span>⭐ Formato: <strong>Cuadrada 1:1</strong></span>
              <span>🛡️ Auditoría: <strong>Ley 21.719 activa</strong></span>
            </div>

            <div className="cms-view-toggles">
              <button
                type="button"
                className={`btn-view-toggle ${listLayout === 'table' ? 'active' : ''}`}
                onClick={() => setListLayout('table')}
                title="Vista tabla compacta profesional"
              >
                📋 Lista Tabla
              </button>
              <button
                type="button"
                className={`btn-view-toggle ${listLayout === 'grid' ? 'active' : ''}`}
                onClick={() => setListLayout('grid')}
                title="Vista tarjetas cuadradas 1:1"
              >
                🔲 Cuadrícula 1:1
              </button>
            </div>
          </div>

          {/* Lista / Grid de Artículos */}
          {loadingList ? (
            <div className="cms-loading-state">
              <div className="spinner"></div>
              <p>Cargando catálogo de artículos...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="cms-empty-state">
              <div className="empty-icon">📭</div>
              <h3>No se encontraron artículos</h3>
              <p>No hay artículos que coincidan con tu búsqueda o aún no has creado ninguno.</p>
              <button 
                type="button" 
                className="btn-primary-action"
                onClick={handleNewArticleClick}
              >
                + Crear el Primer Artículo Ahora
              </button>
            </div>
          ) : listLayout === 'table' ? (
            /* ========================================================
               VISTA 1A: TABLA EJECUTIVA PROFESIONAL (ESTILO CMS CLEAN)
               ======================================================== */
            <div className="cms-table-wrapper">
              <table className="cms-table">
                <thead>
                  <tr>
                    <th style={{ width: '64px', textAlign: 'center' }}>Portada</th>
                    <th>Título &amp; Ruta URL</th>
                    <th>Categoría</th>
                    <th>Autor Corporativo</th>
                    <th>Publicación</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article) => (
                    <tr key={article.slug}>
                      <td style={{ textAlign: 'center' }}>
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="cms-table-thumb" 
                        />
                      </td>
                      <td>
                        <div className="cms-table-title">{article.title}</div>
                        <div className="cms-table-slug">/blog/{article.slug}</div>
                        <div className="cms-lang-badges" style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                          <span className="badge-lang es">🇨🇱 ES</span>
                          {article.titleEn ? (
                            <span className="badge-lang en">🇬🇧 EN</span>
                          ) : (
                            <span className="badge-lang en-pending">🇬🇧 Sin EN</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="cms-pill" style={{ pointerEvents: 'none', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe', display: 'inline-block' }}>
                          {article.category}
                        </span>
                      </td>
                      <td>
                        <div className="author-pill">
                          <span className="author-mini-circle">{article.author?.avatar || 'TS'}</span>
                          <span>{article.author?.name || 'Equipo Tailor'}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4 }}>
                          <div>{article.date}</div>
                          <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>⏱️ {article.readTime}</div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="cms-table-actions" style={{ justifyContent: 'flex-end', flexWrap: 'wrap', gap: '0.4rem' }}>
                          <a 
                            href={`/blog/${article.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-cms-action view-btn"
                            title="Ver versión en español"
                          >
                            👁️ ES ↗
                          </a>
                          {article.titleEn && (
                            <a 
                              href={`/en/blog/${article.slug}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn-cms-action view-btn-en"
                              title="Ver versión en inglés"
                            >
                              👁️ EN ↗
                            </a>
                          )}
                          <button
                            type="button"
                            className="btn-cms-action edit-btn"
                            onClick={() => handleEditClick(article)}
                            title="Editar contenido"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            type="button"
                            className="btn-cms-action delete-btn"
                            onClick={() => setArticleToDelete(article)}
                            title="Eliminar artículo permanentemente"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* ========================================================
               VISTA 1B: CUADRÍCULA CON IMÁGENES CUADRADAS 1:1
               ======================================================== */
            <div className="cms-articles-grid">
              {filteredArticles.map((article) => (
                <article key={article.slug} className="cms-article-card">
                  {/* Imagen Cuadrada 1:1 RESTRINGIDA */}
                  <div className="cms-card-square-img">
                    <img src={article.image} alt={article.title} />
                    <span className="cms-category-badge">{article.category}</span>
                    <span className="cms-ratio-tag">1:1</span>
                  </div>

                  <div className="cms-card-content">
                    <div className="cms-card-meta">
                      <span className="author-pill">
                        <span className="author-mini-circle">{article.author.avatar || 'TS'}</span>
                        {article.author.name}
                      </span>
                      <span>•</span>
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    <div className="cms-lang-badges" style={{ display: 'flex', gap: '5px', margin: '6px 0' }}>
                      <span className="badge-lang es">🇨🇱 ES</span>
                      {article.titleEn ? (
                        <span className="badge-lang en">🇬🇧 EN</span>
                      ) : (
                        <span className="badge-lang en-pending">🇬🇧 Sin EN</span>
                      )}
                    </div>

                    <h3 className="cms-card-title">{article.title}</h3>
                    <p className="cms-card-summary">{article.summary}</p>

                    <div className="cms-card-actions">
                      <a 
                        href={`/blog/${article.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-cms-action view-btn"
                        title="Ver versión en español"
                      >
                        👁️ ES ↗
                      </a>
                      {article.titleEn && (
                        <a 
                          href={`/en/blog/${article.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-cms-action view-btn-en"
                          title="Ver versión en inglés"
                        >
                          👁️ EN ↗
                        </a>
                      )}

                      <button
                        type="button"
                        className="btn-cms-action edit-btn"
                        onClick={() => handleEditClick(article)}
                        title="Editar contenido"
                      >
                        ✏️ Editar
                      </button>

                      <button
                        type="button"
                        className="btn-cms-action delete-btn"
                        onClick={() => setArticleToDelete(article)}
                        title="Eliminar artículo"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          VISTA 2: EDITOR / ADAPTADOR DE ARTÍCULOS
          ======================================================== */}
      {viewMode === 'editor' && (
        <div className="adapter-workspace-grid">
          {/* PANEL IZQUIERDO: Entrada de Texto y Configuración */}
          {/* PANEL IZQUIERDO: 2 Contenedores HTML Directo y Configuración Esencial */}
          <div className="adapter-input-panel">
            
            {/* 1. BARRA SUPERIOR DE DISPOSICIÓN & ESTADO */}
            <div className="editor-top-controls">
              <div className="editor-top-left">
                <span className="editor-badge-icon">📝</span>
                <div>
                  <h3 className="editor-heading-title">
                    {isEditingExisting ? 'Modificar Artículo HTML' : 'Nuevo Artículo HTML Bilingüe'}
                  </h3>
                  <p className="editor-heading-sub">
                    Ingresa directamente el código HTML en español e inglés. Se publica fielmente optimizado para SEO.
                  </p>
                </div>
              </div>

              <div className="editor-top-actions">
                {/* Selector de Disposición: Pestañas vs 2 Columnas */}
                <div className="layout-switcher-pill-group">
                  <button
                    type="button"
                    className={`btn-layout-pill ${editorLayout === 'tabs' ? 'active' : ''}`}
                    onClick={() => setEditorLayout('tabs')}
                    title="Alternar entre Español e Inglés mediante pestañas"
                  >
                    📑 Pestañas
                  </button>
                  <button
                    type="button"
                    className={`btn-layout-pill ${editorLayout === 'columns' ? 'active' : ''}`}
                    onClick={() => setEditorLayout('columns')}
                    title="Ver ambos contenedores lado a lado simultáneamente"
                  >
                    ⫴ 2 Columnas
                  </button>
                </div>

                <button 
                  type="button" 
                  className="btn-clear-text"
                  onClick={() => {
                    if ((rawText.trim() || rawTextEn.trim()) && !window.confirm('¿Deseas vaciar los contenedores actuales? Se perderá el texto ingresado.')) {
                      return;
                    }
                    setRawText('');
                    setRawTextEn('');
                    if (parsed) {
                      setParsed({
                        ...parsed,
                        contentHtml: '',
                        contentHtmlEn: ''
                      });
                    }
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('tailor_blog_active_draft');
                      localStorage.removeItem('tailor_blog_active_draft_en');
                    }
                  }}
                  title="Vaciar contenido de los contenedores"
                >
                  Limpiar
                </button>
              </div>
            </div>

            {/* Banner de Recuperación de Borrador */}
            {hasSavedDraft && (
              <div className="draft-recovery-banner">
                <span>⚠️ Hemos encontrado un borrador anterior guardado en tu navegador.</span>
                <div className="draft-recovery-actions">
                  <button
                    type="button"
                    className="btn-draft-restore"
                    onClick={() => {
                      const saved = localStorage.getItem('tailor_blog_active_draft');
                      const savedEn = localStorage.getItem('tailor_blog_active_draft_en');
                      if (saved) setRawText(saved);
                      if (savedEn) setRawTextEn(savedEn);
                      setHasSavedDraft(false);
                    }}
                  >
                    Restaurar mi borrador
                  </button>
                  <button
                    type="button"
                    className="btn-draft-dismiss"
                    onClick={() => {
                      localStorage.removeItem('tailor_blog_active_draft');
                      localStorage.removeItem('tailor_blog_active_draft_en');
                      setHasSavedDraft(false);
                    }}
                  >
                    Descartar
                  </button>
                </div>
              </div>
            )}

            {/* 2. TARJETA DE CONFIGURACIÓN ESENCIAL EDITORIAL & SEO */}
            {parsed && (
              <div className="cms-essential-settings-card">
                <div className="card-top-bar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.15rem' }}>⚙️</span>
                    <strong>Configuración Esencial & Metadatos SEO</strong>
                  </div>
                  <span className={`status-pill ${isEditingExisting ? 'edit-mode' : 'create-mode'}`}>
                    {isEditingExisting ? '✏️ Modo Edición' : '✨ Nuevo Artículo'}
                  </span>
                </div>

                <div className="settings-grid">
                  {/* Título ES */}
                  <div className="form-group-row">
                    <div className="label-with-action">
                      <label><strong>📌 Título del Artículo (H1 en Español):</strong></label>
                      <button
                        type="button"
                        className="btn-autodetect-link"
                        onClick={() => handleAutoDetectMetadata('es')}
                        title="Detectar automáticamente título y resumen desde las etiquetas <h1> y <p> del HTML"
                      >
                        ⚡ Detectar desde HTML
                      </button>
                    </div>
                    <input
                      type="text"
                      value={parsed.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setParsed({
                          ...parsed,
                          title: newTitle,
                          slug: isEditingExisting ? parsed.slug : generateSlug(newTitle)
                        });
                      }}
                      className="adapter-input"
                      placeholder="Título principal del artículo en español..."
                    />
                  </div>

                  {/* Título EN */}
                  <div className="form-group-row">
                    <div className="label-with-action">
                      <label><strong>📌 Article Title (H1 in English - Opcional):</strong></label>
                      <button
                        type="button"
                        className="btn-autodetect-link"
                        onClick={() => handleAutoDetectMetadata('en')}
                        title="Detectar automáticamente título en inglés desde las etiquetas del HTML en inglés"
                      >
                        ⚡ Detectar desde HTML EN
                      </button>
                    </div>
                    <input
                      type="text"
                      value={parsed.titleEn || ''}
                      onChange={(e) => setParsed({ ...parsed, titleEn: e.target.value })}
                      className="adapter-input"
                      placeholder="English Title for international readership..."
                    />
                  </div>

                  {/* Categoría & Autor */}
                  <div className="form-row-dual">
                    <div className="form-group-col">
                      <label><strong>🏷️ Categoría Editorial:</strong></label>
                      <select 
                        value={parsed.category} 
                        onChange={(e) => {
                          const newCat = e.target.value;
                          let key = 'personas';
                          if (newCat === 'Atracción de Talento') key = 'atraccion';
                          if (newCat === 'Normativa Laboral') key = 'normativa';
                          if (newCat === 'Desarrollo Organizacional') key = 'do';
                          setParsed({ ...parsed, category: newCat, categoryKey: key });
                        }}
                        className="adapter-select"
                      >
                        <option value="Atracción de Talento">Atracción de Talento</option>
                        <option value="Gestión de Personas">Gestión de Personas</option>
                        <option value="Desarrollo Organizacional">Desarrollo Organizacional</option>
                        <option value="Normativa Laboral">Normativa Laboral</option>
                      </select>
                    </div>

                    <div className="form-group-col">
                      <label><strong>👤 Autor del Equipo Tailor:</strong></label>
                      <select
                        value={selectedAuthorId}
                        onChange={(e) => handleAuthorChange(e.target.value)}
                        className="adapter-select"
                      >
                        {TAILOR_AUTHORS.map((author) => (
                          <option key={author.id} value={author.id}>
                            {author.name} — ({author.role})
                          </option>
                        ))}
                        <option value="custom">✏️ Autor Personalizado...</option>
                      </select>
                    </div>
                  </div>

                  {/* Autor Personalizado si aplica */}
                  {selectedAuthorId === 'custom' && (
                    <div className="custom-author-subgroup">
                      <input
                        type="text"
                        placeholder="Nombre del autor"
                        value={customAuthor.name}
                        onChange={(e) => {
                          const updated = { ...customAuthor, name: e.target.value };
                          setCustomAuthor(updated);
                          if (parsed) setParsed({ ...parsed, author: { ...parsed.author, name: e.target.value } });
                        }}
                        className="adapter-input"
                      />
                      <input
                        type="text"
                        placeholder="Cargo o especialidad"
                        value={customAuthor.role}
                        onChange={(e) => {
                          const updated = { ...customAuthor, role: e.target.value };
                          setCustomAuthor(updated);
                          if (parsed) setParsed({ ...parsed, author: { ...parsed.author, role: e.target.value } });
                        }}
                        className="adapter-input"
                      />
                    </div>
                  )}

                  {/* Imagen de Portada (1:1 Cuadrada) */}
                  <div className="form-group-row">
                    <label><strong>🖼️ Imagen de Portada (Formato Cuadrado 1:1):</strong></label>
                    <div className="image-mode-tabs">
                      <button
                        type="button"
                        className={`image-tab-btn ${imageSourceMode === 'catalog' ? 'active' : ''}`}
                        onClick={() => setImageSourceMode('catalog')}
                      >
                        Galería Tailor
                      </button>
                      <button
                        type="button"
                        className={`image-tab-btn ${imageSourceMode === 'upload' ? 'active' : ''}`}
                        onClick={() => setImageSourceMode('upload')}
                      >
                        ⬆️ Subir Imagen
                      </button>
                      <button
                        type="button"
                        className={`image-tab-btn ${imageSourceMode === 'url' ? 'active' : ''}`}
                        onClick={() => setImageSourceMode('url')}
                      >
                        URL Externa
                      </button>
                    </div>

                    {imageSourceMode === 'catalog' && (
                      <select
                        value={parsed.image}
                        onChange={(e) => setParsed({ ...parsed, image: e.target.value })}
                        className="adapter-select"
                      >
                        {AVAILABLE_IMAGES.map((img) => (
                          <option key={img.path} value={img.path}>
                            {img.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {imageSourceMode === 'upload' && (
                      <div className="upload-dropzone">
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          style={{ display: 'none' }} 
                        />
                        <button 
                          type="button" 
                          className="btn-upload-trigger"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          📁 Seleccionar archivo de imagen de tu equipo
                        </button>
                        <span className="upload-hint">Soporta WebP, PNG, JPG (Se encuadrará en formato cuadrado 1:1)</span>
                      </div>
                    )}

                    {imageSourceMode === 'url' && (
                      <input
                        type="text"
                        placeholder="https://ejemplo.com/imagen.webp"
                        value={parsed.image}
                        onChange={(e) => setParsed({ ...parsed, image: e.target.value })}
                        className="adapter-input"
                      />
                    )}
                  </div>

                  {/* Slug & Resumen SEO */}
                  <div className="form-row-dual">
                    <div className="form-group-col">
                      <label><strong>🔗 URL Slug SEO (amigable):</strong></label>
                      <input
                        type="text"
                        value={parsed.slug}
                        onChange={(e) => setParsed({ ...parsed, slug: e.target.value })}
                        className="adapter-input"
                      />
                    </div>
                    <div className="form-group-col">
                      <label><strong>🔍 Resumen SEO (Meta description ES):</strong></label>
                      <input
                        type="text"
                        value={parsed.summary}
                        onChange={(e) => setParsed({ ...parsed, summary: e.target.value })}
                        className="adapter-input"
                        placeholder="Breve resumen para Google y vista previa..."
                      />
                    </div>
                  </div>

                  {parsed.titleEn && (
                    <div className="form-group-row">
                      <label><strong>🔍 Resumen SEO en Inglés (Meta description EN):</strong></label>
                      <input
                        type="text"
                        value={parsed.summaryEn || ''}
                        onChange={(e) => setParsed({ ...parsed, summaryEn: e.target.value })}
                        className="adapter-input"
                        placeholder="Brief summary for English version..."
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. CONTENEDORES DE TEXTO / HTML DIRECTO */}
            <div className="bilingual-html-section">
              {/* Si estamos en modo pestañas, mostramos la barra de pestañas */}
              {editorLayout === 'tabs' && (
                <div className="language-selector-tabs">
                  <button
                    type="button"
                    className={`lang-tab-btn ${activeLangTab === 'es' ? 'active' : ''}`}
                    onClick={() => setActiveLangTab('es')}
                  >
                    <span className="lang-tab-flag">🇨🇱</span>
                    <div className="lang-tab-info">
                      <span className="lang-tab-title">Contenedor HTML Español</span>
                      <span className="lang-tab-subtitle">
                        {rawText.trim() ? `${rawText.trim().split(/\s+/).filter(Boolean).length} palabras` : 'Vacío'}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`lang-tab-btn ${activeLangTab === 'en' ? 'active' : ''}`}
                    onClick={() => setActiveLangTab('en')}
                  >
                    <span className="lang-tab-flag">🇬🇧</span>
                    <div className="lang-tab-info">
                      <span className="lang-tab-title">Contenedor HTML English</span>
                      <span className="lang-tab-subtitle">
                        {rawTextEn.trim() ? `${rawTextEn.trim().split(/\s+/).filter(Boolean).length} words` : 'Opcional / Pendiente'}
                      </span>
                    </div>
                  </button>
                </div>
              )}

              {/* Render de Contenedores: según tabs o 2 columnas */}
              <div className={`containers-wrapper ${editorLayout === 'columns' ? 'layout-columns' : 'layout-tabs'}`}>
                
                {/* CONTENEDOR 1: ESPAÑOL */}
                {(editorLayout === 'columns' || activeLangTab === 'es') && (
                  <div className="html-container-box es">
                    <div className="html-container-header">
                      <div className="html-container-title">
                        <span className="flag-icon">🇨🇱</span>
                        <strong>HTML del Artículo (Español)</strong>
                        <span className="word-count-badge">
                          {rawText.trim() ? `${rawText.trim().split(/\s+/).filter(Boolean).length} palabras` : '0 palabras'}
                        </span>
                      </div>
                      
                      {/* Botón para convertir texto plano a HTML si el cliente pega texto sin tags */}
                      <button
                        type="button"
                        className="btn-format-quick"
                        onClick={() => handleFormatPlainText('es')}
                        title="Convierte párrafos y listas de texto plano en etiquetas HTML limpias automáticamente"
                      >
                        ✨ Formatear a HTML
                      </button>
                    </div>

                    {/* Barra de Etiquetas HTML Rápidas */}
                    <div className="html-container-toolbar">
                      <button type="button" onClick={() => insertTagIntoTextarea('<h2>', '</h2>', 'Título de Sección', 'es')}>&lt;h2&gt; Sección</button>
                      <button type="button" onClick={() => insertTagIntoTextarea('<h3>', '</h3>', 'Subsección', 'es')}>&lt;h3&gt; Subtítulo</button>
                      <button type="button" onClick={() => insertTagIntoTextarea('<p>', '</p>', 'Párrafo de contenido', 'es')}>&lt;p&gt; Párrafo</button>
                      <button type="button" onClick={() => insertTagIntoTextarea('<ul>\n  <li>', '</li>\n</ul>', 'Elemento de lista', 'es')}>&lt;ul&gt; Lista</button>
                      <button type="button" onClick={() => insertTagIntoTextarea('<blockquote>', '</blockquote>', 'Cita destacada del autor', 'es')}>&lt;blockquote&gt; Cita</button>
                      <button type="button" onClick={() => insertTagIntoTextarea('<strong>', '</strong>', 'texto destacado', 'es')}>&lt;strong&gt;</button>
                      <button type="button" onClick={() => insertTagIntoTextarea('<a href="https://ejemplo.com">', '</a>', 'enlace', 'es')}>&lt;a&gt;</button>
                    </div>

                    <textarea
                      id="raw-text-input"
                      className="html-editor-textarea"
                      placeholder={`<h2>1. Diagnóstico Inicial & Contexto</h2>
<p>Escribe o pega aquí el contenido HTML del artículo...</p>

<h2>2. Medidas Operativas y Recomendaciones</h2>
<p>Detalla las buenas prácticas y estrategias recomendadas...</p>

<blockquote>"La adopción de estas medidas fortalece la cultura organizacional."</blockquote>

<h2>3. Conclusiones para la Dirección</h2>
<p>Síntesis de impacto operativo y reflexiones finales.</p>`}
                      value={rawText}
                      onChange={(e) => handleRawTextChange(e.target.value)}
                      rows={editorLayout === 'columns' ? 18 : 14}
                      spellCheck={false}
                    />
                  </div>
                )}

                {/* CONTENEDOR 2: INGLÉS */}
                {(editorLayout === 'columns' || activeLangTab === 'en') && (
                  <div className="html-container-box en">
                    <div className="html-container-header">
                      <div className="html-container-title">
                        <span className="flag-icon">🇬🇧</span>
                        <strong>HTML of the Article (English)</strong>
                        <span className="word-count-badge">
                          {rawTextEn.trim() ? `${rawTextEn.trim().split(/\s+/).filter(Boolean).length} words` : '0 words'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn-assistant-generate-compact"
                          onClick={handleGenerateEnglishFromSpanish}
                          title="Genera una estructura base en inglés a partir del contenido en español"
                        >
                          🪄 Base desde Español
                        </button>
                        <button
                          type="button"
                          className="btn-format-quick"
                          onClick={() => handleFormatPlainText('en')}
                          title="Formatea párrafos y listas en HTML limpio"
                        >
                          ✨ Format HTML
                        </button>
                      </div>
                    </div>

                    {/* Barra de Etiquetas HTML Rápidas EN */}
                    <div className="html-container-toolbar">
                      <button type="button" onClick={() => insertTagIntoTextarea('<h2>', '</h2>', 'Section Heading', 'en')}>&lt;h2&gt; Heading</button>
                      <button type="button" onClick={() => insertTagIntoTextarea('<h3>', '</h3>', 'Subsection', 'en')}>&lt;h3&gt; Subheading</button>
                      <button type="button" onClick={() => insertTagIntoTextarea('<p>', '</p>', 'Content paragraph', 'en')}>&lt;p&gt; Paragraph</button>
                      <button type="button" onClick={() => insertTagIntoTextarea('<ul>\n  <li>', '</li>\n</ul>', 'List item', 'en')}>&lt;ul&gt; List</button>
                      <button type="button" onClick={() => insertTagIntoTextarea('<blockquote>', '</blockquote>', 'Executive quote', 'en')}>&lt;blockquote&gt; Quote</button>
                      <button type="button" onClick={() => insertTagIntoTextarea('<strong>', '</strong>', 'bold text', 'en')}>&lt;strong&gt;</button>
                      <button type="button" onClick={() => insertTagIntoTextarea('<a href="https://example.com">', '</a>', 'link text', 'en')}>&lt;a&gt;</button>
                    </div>

                    <textarea
                      id="raw-text-en-input"
                      className="html-editor-textarea"
                      placeholder={`<h2>1. Initial Diagnosis & Context</h2>
<p>Write or paste your English HTML content here...</p>

<h2>2. Operational Measures and Recommendations</h2>
<p>Detail strategic frameworks and best practices...</p>

<blockquote>"Implementing these practices strengthens organizational culture."</blockquote>

<h2>3. Executive Conclusions</h2>
<p>Summary of operational impact and closing reflections.</p>`}
                      value={rawTextEn}
                      onChange={(e) => handleRawTextEnChange(e.target.value)}
                      rows={editorLayout === 'columns' ? 18 : 14}
                      spellCheck={false}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 4. BARRA DE ACCIÓN: GUARDAR Y PUBLICAR */}
            <div className="input-action-bar-direct">
              <button
                type="button"
                className="btn-save-publish-main"
                onClick={handleSaveArticle}
                disabled={!rawText.trim()}
              >
                💾 Guardar y Publicar en el Blog
              </button>
              {saveStatus && <div className="save-status-msg-direct">{saveStatus}</div>}
            </div>

          </div>

          {/* PANEL DERECHO: Visualizador Dual (Artículo / Tarjeta Cuadrada / Código) */}
          <div className="adapter-output-panel">
            {!parsed ? (
              <div className="empty-preview-state">
                <div className="empty-icon">📰</div>
                <h3>Esperando texto para maquetar</h3>
                <p>Pega un texto en el área izquierda y presiona <strong>"⚡ Adaptar Estructura Tailor"</strong> para ver en tiempo real la maqueta completa.</p>
              </div>
            ) : (
              <div className="output-preview-container">
                <div className="output-tab-bar">
                  <button
                    type="button"
                    className={`output-tab ${activePreviewTab === 'article' ? 'active' : ''}`}
                    onClick={() => setActivePreviewTab('article')}
                  >
                    📖 Vista Artículo Completo
                  </button>
                  <button
                    type="button"
                    className={`output-tab ${activePreviewTab === 'card' ? 'active' : ''}`}
                    onClick={() => setActivePreviewTab('card')}
                  >
                    🔲 Vista Tarjeta Grilla (1:1 Cuadrada)
                  </button>
                  <button
                    type="button"
                    className={`output-tab ${activePreviewTab === 'code' ? 'active' : ''}`}
                    onClick={() => setActivePreviewTab('code')}
                  >
                    💻 Código / JSON
                  </button>

                  {/* Selector de Idioma de Vista Previa */}
                  <div className="preview-lang-switch-group" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Vista:</span>
                    <button
                      type="button"
                      className={`btn-preview-lang ${previewLocale === 'es' ? 'active' : ''}`}
                      onClick={() => setPreviewLocale('es')}
                      style={{
                        padding: '0.22rem 0.55rem',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        background: previewLocale === 'es' ? '#1d4ed8' : '#ffffff',
                        color: previewLocale === 'es' ? '#ffffff' : '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      🇨🇱 ES
                    </button>
                    <button
                      type="button"
                      className={`btn-preview-lang ${previewLocale === 'en' ? 'active' : ''}`}
                      onClick={() => setPreviewLocale('en')}
                      style={{
                        padding: '0.22rem 0.55rem',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        background: previewLocale === 'en' ? '#1d4ed8' : '#ffffff',
                        color: previewLocale === 'en' ? '#ffffff' : '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      🇬🇧 EN
                    </button>
                  </div>

                  <div className="tab-actions-right">
                    <button 
                      type="button" 
                      className="btn-download-json"
                      onClick={handleDownloadJson}
                      title="Descargar archivo JSON para el sistema"
                    >
                      💾 Descargar JSON
                    </button>
                    <button 
                      type="button" 
                      className="btn-copy-code"
                      onClick={handleCopyCode}
                    >
                      {copySuccess ? '✅ ¡Copiado!' : '📋 Copiar Código'}
                    </button>
                  </div>
                </div>

                {/* 1. VISTA ARTÍCULO COMPLETO CON H1, H2, H3 */}
                {activePreviewTab === 'article' && (() => {
                  const isPreviewEn = previewLocale === 'en';
                  const previewTitle = isPreviewEn ? (parsed.titleEn || (rawTextEn.trim() ? '(Haz clic en ⚡ Adaptar o 💾 Guardar para procesar)' : '⚠️ Sin versión en inglés aún')) : parsed.title;
                  const previewSubtitle = isPreviewEn ? (parsed.subtitleEn || 'Strategic analysis and key considerations for executive leadership.') : parsed.subtitle;
                  const previewCategory = isPreviewEn ? (parsed.categoryEn || parsed.category) : parsed.category;
                  const previewTakeaways = isPreviewEn ? (parsed.keyTakeawaysEn && parsed.keyTakeawaysEn.length > 0 ? parsed.keyTakeawaysEn : []) : parsed.keyTakeaways;
                  const previewSections = isPreviewEn ? (parsed.sectionsEn && parsed.sectionsEn.length > 0 ? parsed.sectionsEn : []) : parsed.sections;
                  const previewConclusion = isPreviewEn ? (parsed.conclusionEn || null) : parsed.conclusion;
                  const previewReadTime = isPreviewEn ? (parsed.readTimeEn || '5 min read') : parsed.readTime;

                  return (
                    <div className="live-preview-viewport">
                      {isPreviewEn && !parsed.titleEn && (
                        <div style={{
                          padding: '1rem 1.25rem',
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          color: '#1e40af',
                          marginBottom: '1.25rem',
                          fontSize: '0.88rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          flexWrap: 'wrap'
                        }}>
                          <div>
                            <strong>💡 Vista previa en Inglés:</strong> Aún no has maquetado el contenido en inglés.
                          </div>
                          <button
                            type="button"
                            onClick={() => { setActiveLangTab('en'); handleGenerateEnglishFromSpanish(); }}
                            style={{
                              background: '#1d4ed8',
                              color: '#ffffff',
                              border: 'none',
                              padding: '0.35rem 0.85rem',
                              borderRadius: '5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontSize: '0.82rem'
                            }}
                          >
                            🪄 Asistir con Borrador EN
                          </button>
                        </div>
                      )}

                      {/* Hero del Artículo con H1 */}
                      <div className="preview-hero">
                        <span className="preview-cat-badge">{previewCategory}</span>
                        <h1 className="preview-title">{previewTitle}</h1>
                        <p className="preview-subtitle">{previewSubtitle}</p>
                        
                        <div className="preview-meta">
                          <div className="meta-author-pill">
                            <span className="author-circle">{parsed.author.avatar}</span>
                            <div>
                              <strong>{parsed.author.name}</strong>
                              <small>{parsed.author.role}</small>
                            </div>
                          </div>
                          <div className="meta-time-pill">
                            <span>📅 {parsed.date}</span>
                            <span>•</span>
                            <span>⏱️ {previewReadTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Imagen de Portada */}
                      <div className="preview-image-box">
                        <img src={parsed.image} alt={parsed.imageAlt} />
                        <span className="image-ratio-tag">Encuadre Editorial Cuadrado / Panorámico</span>
                      </div>

                      {/* Puntos Clave */}
                      {previewTakeaways.length > 0 && (
                        <div className="preview-takeaways">
                          <h4>⭐ {isPreviewEn ? 'Key Takeaways for Executive Leadership' : 'Puntos Clave para la Dirección'}</h4>
                          <ul>
                            {previewTakeaways.map((point, idx) => (
                              <li key={idx}>
                                <span className="check-bullet">✓</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Cuerpo del Artículo: Directo HTML o Secciones Tradicionales */}
                      {((isPreviewEn ? rawTextEn : rawText).trim() || (isPreviewEn ? parsed.contentHtmlEn : parsed.contentHtml)) ? (
                        <div 
                          className="preview-article-body article-html-direct"
                          dangerouslySetInnerHTML={{ 
                            __html: isPreviewEn 
                              ? (rawTextEn.trim() || parsed.contentHtmlEn || '<p><em>No English content provided yet.</em></p>') 
                              : (rawText.trim() || parsed.contentHtml || '') 
                          }}
                        />
                      ) : (
                        <>
                          {/* Secciones con H2 y H3 */}
                          <div className="preview-sections">
                            {previewSections.map((sec, sIdx) => (
                              <div key={sIdx} className="preview-section-item">
                                <h2 className="preview-h2">
                                  <span className="h2-accent-bar"></span>
                                  {sec.heading}
                                </h2>

                                {sec.paragraphs.map((p, pIdx) => (
                                  <p key={pIdx} className={sIdx === 0 && pIdx === 0 ? 'preview-lead-p' : ''}>
                                    {p}
                                  </p>
                                ))}

                                {/* Renderizado de H3 Subsecciones */}
                                {sec.subsections && sec.subsections.map((sub, subIdx) => (
                                  <div key={subIdx} className="preview-h3-block">
                                    <h3 className="preview-h3">
                                      <span className="h3-bullet">▸</span>
                                      {sub.title}
                                    </h3>
                                    {sub.paragraphs.map((sp, spIdx) => (
                                      <p key={spIdx}>{sp}</p>
                                    ))}
                                  </div>
                                ))}

                                {sec.quote && (
                                  <blockquote className="preview-quote">
                                    <p>"{sec.quote}"</p>
                                  </blockquote>
                                )}

                                {sec.list && sec.list.length > 0 && (
                                  <ul className="preview-list">
                                    {sec.list.map((item, lIdx) => (
                                      <li key={lIdx}>{item}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Conclusión */}
                          {previewConclusion && previewConclusion.text && (
                            <div className="preview-conclusion">
                              <h3>{previewConclusion.title}</h3>
                              <p>{previewConclusion.text}</p>
                            </div>
                          )}
                        </>
                      )}

                      {/* CTA Box */}
                      <div className="preview-cta">
                        <h4>{isPreviewEn ? 'Is your organization facing this challenge?' : '¿Tu organización enfrenta este desafío?'}</h4>
                        <p>{isPreviewEn ? 'Let us discuss how to adapt these strategic frameworks to your specific organizational reality.' : 'Conversemos sobre cómo adaptar estos modelos a la realidad específica de tu empresa.'}</p>
                        <span className="preview-cta-btn">{isPreviewEn ? `Schedule executive meeting with ${parsed.author.name} →` : `Agendar reunión con ${parsed.author.name} →`}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* 2. VISTA TARJETA DE GRILLA CUADRADA (1:1) */}
                {activePreviewTab === 'card' && (() => {
                  const isPreviewEn = previewLocale === 'en';
                  const cardTitle = isPreviewEn ? (parsed.titleEn || (rawTextEn.trim() ? '(Título en inglés pendiente)' : parsed.title)) : parsed.title;
                  const cardSummary = isPreviewEn ? (parsed.summaryEn || (rawTextEn.trim() ? '(Resumen en inglés pendiente)' : parsed.summary)) : parsed.summary;
                  const cardCategory = isPreviewEn ? (parsed.categoryEn || parsed.category) : parsed.category;
                  const cardReadTime = isPreviewEn ? (parsed.readTimeEn || '5 min read') : parsed.readTime;

                  return (
                    <div className="card-preview-viewport">
                      <div className="card-preview-intro">
                        <h4>Previsualización en la Grilla del Blog ({isPreviewEn ? 'Versión Internacional /en/blog' : 'Versión Español /blog'})</h4>
                        <p>Así lucirá la tarjeta del artículo para los visitantes:</p>
                      </div>

                      <div className="square-card-container">
                        <article className="mock-blog-card">
                          <div className="mock-card-image-square">
                            <img src={parsed.image} alt={parsed.imageAlt} />
                            <span className="mock-cat-badge">{cardCategory}</span>
                            <span className="mock-ratio-pill">16:10 Editorial</span>
                          </div>

                          <div className="mock-card-body">
                            <div className="mock-card-meta">
                              <span>{parsed.date}</span>
                              <span>•</span>
                              <span>{cardReadTime}</span>
                            </div>

                            <h2 className="mock-card-title">{cardTitle}</h2>
                            <p className="mock-card-summary">{cardSummary}</p>

                            <div className="mock-card-footer">
                              <span className="mock-read-link">
                                {isPreviewEn ? 'Read full article →' : 'Leer artículo completo →'}
                              </span>
                            </div>
                          </div>
                        </article>
                      </div>
                    </div>
                  );
                })()}

                {/* 3. VISTA CÓDIGO TS / JSON */}
                {activePreviewTab === 'code' && (
                  <div className="code-view-viewport">
                    <pre className="code-block">
                      <code>{JSON.stringify(parsed, null, 2)}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
      {articleToDelete && (
        <div className="modal-backdrop">
          <div className="delete-modal-card">
            <h3>⚠️ Confirmar Eliminación de Artículo</h3>
            <p>
              ¿Estás seguro de que deseas eliminar permanentemente el artículo <strong>"{articleToDelete.title}"</strong>?
            </p>
            <p className="delete-warning-text">
              Esta acción retirará el artículo de la página pública y del mapa del sitio.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setArticleToDelete(null)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-confirm-delete"
                onClick={handleDeleteArticle}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Sí, Eliminar Artículo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
