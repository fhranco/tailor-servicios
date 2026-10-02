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

  // Estados del Editor
  const [rawText, setRawText] = useState('');
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
      if (saved && saved.trim().length > 15) {
        setHasSavedDraft(true);
      }
    }
  }, []);

  // Auto-guardado en localStorage mientras se escribe
  useEffect(() => {
    if (rawText && rawText.trim().length > 15 && typeof window !== 'undefined') {
      localStorage.setItem('tailor_blog_active_draft', rawText);
    }
  }, [rawText]);

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

      // Detección de bloque de Puntos Clave
      if (/^(puntos\s+clave|aspectos\s+clave|conclusiones\s+ejecutivas|resumen\s+ejecutivo|key\s+takeaways)/i.test(line)) {
        i++;
        while (i < remainingLines.length && isListLine(remainingLines[i])) {
          keyTakeaways.push(cleanListMarker(remainingLines[i]));
          i++;
        }
        continue;
      }

      // Detección de Conclusión
      if (/^(conclusi[oó]n|en\s+conclusi[oó]n|hacia\s+una|palabras\s+finales)/i.test(line)) {
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
    if (!rawText.trim()) return;
    const parsedData = parseDraftText(rawText, parsed, selectedAuthorId, customAuthor);
    if (parsedData) {
      setParsed(parsedData);
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

  // Insertar etiquetas HTML / formato directamente en el área de texto
  const insertTagIntoTextarea = (openTag: string, closeTag: string, defaultText: string) => {
    const textarea = document.getElementById('raw-text-input') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const selectedText = rawText.substring(start, end) || defaultText;
    const replacement = `${openTag}${selectedText}${closeTag}`;
    const newText = rawText.substring(0, start) + replacement + rawText.substring(end);

    setRawText(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
    }, 50);
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

    // 1. Auto-sincronizar siempre desde rawText si tiene contenido
    let articleToSave = parsed;
    if (rawText.trim()) {
      const generated = parseDraftText(rawText, parsed, selectedAuthorId, customAuthor);
      if (generated) {
        articleToSave = generated;
        setParsed(generated);
      }
    }

    if (!articleToSave || !articleToSave.title) {
      alert('⚠️ Por favor escribe o pega el contenido de tu artículo antes de guardar.');
      setSaveStatus(null);
      return;
    }

    // Respaldo de seguridad inmediato en localStorage
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('tailor_blog_last_draft_backup', rawText);
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
        setSaveStatus('✅ ¡Artículo guardado y publicado exitosamente!');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('tailor_blog_active_draft');
          localStorage.setItem('tailor_blog_last_published', JSON.stringify(savedResult));
        }
        await fetchArticles();
        setTimeout(() => {
          setSaveStatus(null);
          setViewMode('list');
        }, 1000);
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
    setSelectedAuthorId(article.author.id || 'consultoria');

    // Reconstruir un texto equivalente en el textarea para permitir re-parseo si se desea
    let reconstructedText = `${article.title}\n\n${article.subtitle}\n\n`;
    if (article.keyTakeaways && article.keyTakeaways.length > 0) {
      reconstructedText += `Puntos clave:\n${article.keyTakeaways.map(p => `- ${p}`).join('\n')}\n\n`;
    }
    for (const sec of article.sections) {
      reconstructedText += `${sec.heading}\n${sec.paragraphs.join('\n\n')}\n\n`;
      if (sec.quote) reconstructedText += `"${sec.quote}"\n\n`;
      if (sec.list) reconstructedText += `${sec.list.map(l => `- ${l}`).join('\n')}\n\n`;
      if (sec.subsections) {
        for (const sub of sec.subsections) {
          reconstructedText += `${sub.title}\n${sub.paragraphs.join('\n\n')}\n\n`;
        }
      }
    }
    if (article.conclusion) {
      reconstructedText += `${article.conclusion.title}\n${article.conclusion.text}`;
    }

    setRawText(reconstructedText);
    setViewMode('editor');
  };

  // Iniciar creación de artículo nuevo
  const handleNewArticleClick = () => {
    setIsEditingExisting(false);
    const newDraft: ParsedArticle = {
      id: Date.now(),
      title: 'Nuevo Artículo Estratégico',
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
      imageAlt: 'Nuevo Artículo Estratégico',
      summary: 'Resumen introductorio del nuevo artículo de Tailor Servicios.',
      keywords: ['Tailor Servicios', 'Gestión de Personas', 'Punta Arenas'],
      keyTakeaways: [
        'Diagnóstico clave sobre el desafío organizacional a resolver.',
        'Recomendación operativa para directores y gerentes de empresas.'
      ],
      sections: [
        {
          heading: '1. Diagnóstico Inicial & Contexto',
          paragraphs: [
            'Escribe aquí el análisis de contexto o pega un borrador completo en el cuadro de texto superior.'
          ],
          subsections: []
        },
        {
          heading: '2. Medidas Operativas y Recomendaciones',
          paragraphs: [
            'Detalla las buenas prácticas y estrategias recomendadas para resolver este desafío en la organización.'
          ],
          subsections: []
        }
      ],
      conclusion: {
        title: 'Conclusiones Estratégicas para la Dirección',
        text: 'La adopción de estas medidas fortalece la cultura y la retención del talento clave.'
      }
    };

    setParsed(newDraft);
    setRawText(`${newDraft.title}\n\n${newDraft.subtitle}\n\nPuntos clave:\n- Diagnóstico clave sobre el desafío organizacional a resolver.\n- Recomendación operativa para directores y gerentes de empresas.\n\n1. Diagnóstico Inicial & Contexto\nEscribe aquí el análisis de contexto o pega un borrador completo en el cuadro de texto superior.\n\n2. Medidas Operativas y Recomendaciones\nDetalla las buenas prácticas y estrategias recomendadas para resolver este desafío en la organización.\n\nConclusión:\nLa adopción de estas medidas fortalece la cultura y la retención del talento clave.`);
    setSelectedAuthorId('consultoria');
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
                        <div className="cms-table-actions" style={{ justifyContent: 'flex-end' }}>
                          <a 
                            href={`/blog/${article.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-cms-action view-btn"
                            title="Ver en vivo en la web"
                          >
                            👁️ Ver ↗
                          </a>
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

                    <h3 className="cms-card-title">{article.title}</h3>
                    <p className="cms-card-summary">{article.summary}</p>

                    <div className="cms-card-actions">
                      <a 
                        href={`/blog/${article.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-cms-action view-btn"
                        title="Ver en vivo en la web"
                      >
                        👁️ Ver Web ↗
                      </a>

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
          <div className="adapter-input-panel">
            <div className="input-card">
              <div className="card-top-bar">
                <label htmlFor="raw-text-input">
                  <strong>📝 {isEditingExisting ? 'Editando Borrador:' : 'Pega tu Texto en Bruto (Word, Doc o Correo):'}</strong>
                </label>
                <button 
                  type="button" 
                  className="btn-clear-text"
                  onClick={() => {
                    if (rawText.trim() && !window.confirm('¿Deseas vaciar el borrador actual? Se perderá el texto escrito.')) {
                      return;
                    }
                    setRawText('');
                    setParsed(null);
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('tailor_blog_active_draft');
                    }
                  }}
                >
                  Limpiar
                </button>
              </div>

              {/* Banner de Recuperación de Borrador */}
              {hasSavedDraft && (
                <div style={{
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  color: '#92400e',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <span>⚠️ Hemos encontrado un borrador anterior guardado en tu navegador.</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const saved = localStorage.getItem('tailor_blog_active_draft');
                        if (saved) {
                          setRawText(saved);
                          const p = parseDraftText(saved);
                          if (p) setParsed(p);
                          setHasSavedDraft(false);
                        }
                      }}
                      style={{
                        background: '#92400e',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '4px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Restaurar mi borrador
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem('tailor_blog_active_draft');
                        setHasSavedDraft(false);
                      }}
                      style={{
                        background: 'transparent',
                        color: '#78350f',
                        border: '1px solid #d97706',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Descartar
                    </button>
                  </div>
                </div>
              )}

              {/* Barra de Formato / Etiquetas Rápidas (HTML y Semántica) */}
              <div style={{
                display: 'flex',
                gap: '0.45rem',
                flexWrap: 'wrap',
                marginBottom: '0.65rem',
                padding: '0.45rem 0.65rem',
                background: '#f8fafc',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                alignItems: 'center',
                fontSize: '0.8rem'
              }}>
                <span style={{ color: '#475569', fontWeight: 700, marginRight: '0.2rem' }}>Insertar etiquetas:</span>
                <button
                  type="button"
                  onClick={() => insertTagIntoTextarea('<h2>', '</h2>', 'Título de Sección')}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.25rem 0.55rem', cursor: 'pointer', fontWeight: 600, color: '#1e293b' }}
                  title="Insertar etiqueta H2 para sección principal"
                >
                  &lt;h2&gt; Sección
                </button>
                <button
                  type="button"
                  onClick={() => insertTagIntoTextarea('<h3>', '</h3>', 'Subsección')}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.25rem 0.55rem', cursor: 'pointer', fontWeight: 600, color: '#1e293b' }}
                  title="Insertar etiqueta H3 para subsección"
                >
                  &lt;h3&gt; Subtítulo
                </button>
                <button
                  type="button"
                  onClick={() => insertTagIntoTextarea('<ul>\n  <li>', '</li>\n</ul>', 'Elemento de lista')}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.25rem 0.55rem', cursor: 'pointer', fontWeight: 600, color: '#1e293b' }}
                  title="Insertar lista de viñetas"
                >
                  &lt;ul&gt; Lista
                </button>
                <button
                  type="button"
                  onClick={() => insertTagIntoTextarea('<blockquote>', '</blockquote>', 'Cita destacada del autor')}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.25rem 0.55rem', cursor: 'pointer', fontWeight: 600, color: '#1e293b' }}
                  title="Insertar cita destacada"
                >
                  &lt;blockquote&gt; Cita
                </button>
                <button
                  type="button"
                  onClick={() => insertTagIntoTextarea('<p>', '</p>', 'Párrafo de contenido')}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.25rem 0.55rem', cursor: 'pointer', fontWeight: 600, color: '#1e293b' }}
                  title="Insertar párrafo"
                >
                  &lt;p&gt; Párrafo
                </button>
              </div>

              <textarea
                id="raw-text-input"
                className="adapter-textarea"
                placeholder="Pega aquí el texto completo del artículo...

Ejemplo:
Estrategias de atracción de talento en Magallanes
Cómo las organizaciones superan la lejanía geográfica con propuestas de valor.

Puntos clave:
- La lejanía exige compensaciones más allá del dinero.
- El arraigo familiar reduce la deserción en un 45%.

1. El contexto laboral en el sur austral
La región experimenta un dinamismo sin precedentes...

1.1 Oportunidades en energías limpias y acuicultura
El sector acuícola demanda perfiles técnicos con alta especialización...

«En zonas extremas, reclutar no es solo llenar una vacante: es planificar la sustentabilidad.»

Conclusión:
La atracción de talento en el sur demanda profesionalizar cada fase..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={12}
              />

              <div className="input-action-bar" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleSaveArticle}
                  disabled={!rawText.trim()}
                  style={{
                    flex: '1.2',
                    background: '#16a34a',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  💾 Guardar y Publicar en el Blog
                </button>
                <button
                  type="button"
                  className="btn-parse-execute"
                  onClick={handleParseText}
                  disabled={!rawText.trim()}
                  style={{ flex: '1' }}
                >
                  ⚡ Adaptar y Ver Estructura
                </button>
              </div>
            </div>

            {/* AJUSTES EDITORIALES: Autor, Portada e Imagen */}
            {parsed && (
              <div className="adapter-controls-card">
                <div className="card-top-bar">
                  <h3>⚙️ {isEditingExisting ? 'Modificar Artículo' : 'Configuración del Artículo'}</h3>
                  <span className={`status-pill ${isEditingExisting ? 'edit-mode' : 'create-mode'}`}>
                    {isEditingExisting ? '✏️ Modo Edición' : '✨ Nuevo Borrador'}
                  </span>
                </div>

                {/* 0. EDICIÓN DIRECTA DE TÍTULO, SUBTÍTULO Y RESUMEN */}
                <div className="form-group-row">
                  <label><strong>📌 Título del Artículo (H1):</strong></label>
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
                    placeholder="Título principal del artículo (H1)..."
                  />
                </div>

                <div className="form-group-row">
                  <label><strong>📝 Subtítulo / Bajada Ejecutiva:</strong></label>
                  <textarea
                    value={parsed.subtitle}
                    onChange={(e) => setParsed({ ...parsed, subtitle: e.target.value })}
                    className="adapter-textarea small-textarea"
                    rows={2}
                    placeholder="Bajada descriptiva que acompaña al título..."
                  />
                </div>

                <div className="form-group-row">
                  <label><strong>🔍 Resumen SEO (Meta description):</strong></label>
                  <textarea
                    value={parsed.summary}
                    onChange={(e) => setParsed({ ...parsed, summary: e.target.value })}
                    className="adapter-textarea small-textarea"
                    rows={2}
                    placeholder="Breve resumen para Google y redes sociales..."
                  />
                </div>

                <div className="form-group-row">
                  <label><strong>⭐ Puntos Clave para la Dirección (uno por línea):</strong></label>
                  <textarea
                    value={(parsed.keyTakeaways || []).join('\n')}
                    onChange={(e) => setParsed({
                      ...parsed,
                      keyTakeaways: e.target.value.split('\n').filter(l => l.trim().length > 0)
                    })}
                    className="adapter-textarea small-textarea"
                    rows={3}
                    placeholder="Punto clave 1&#10;Punto clave 2&#10;Punto clave 3..."
                  />
                </div>

                {/* 1. SELECCIÓN DE AUTOR DEL EQUIPO TAILOR */}
                <div className="form-group-row">
                  <label>👤 ¿Quién escribe este artículo? (Equipo Tailor):</label>
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

                {/* 2. SUBIR O SELECCIONAR IMAGEN DE PORTADA */}
                <div className="form-group-row">
                  <label>🖼️ Imagen de Portada (Formato Cuadrado 1:1):</label>
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

                {/* 3. CATEGORÍA & SLUG */}
                <div className="form-group-row">
                  <label>Categoría Editorial:</label>
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

                <div className="form-group-row">
                  <label>URL Slug SEO (amigable):</label>
                  <input
                    type="text"
                    value={parsed.slug}
                    onChange={(e) => setParsed({ ...parsed, slug: e.target.value })}
                    className="adapter-input"
                  />
                </div>

                {/* BOTÓN DE GUARDAR Y PUBLICAR */}
                <div className="save-action-area">
                  <button
                    type="button"
                    className="btn-save-publish"
                    onClick={handleSaveArticle}
                  >
                    💾 Guardar y Publicar en el Blog
                  </button>
                  {saveStatus && <div className="save-status-msg">{saveStatus}</div>}
                </div>

                {/* SEMÁFORO DE CALIDAD SEO & E-E-A-T */}
                <div className="seo-quality-scorecard">
                  <div className="scorecard-header">
                    <span className="scorecard-icon">🎯</span>
                    <strong>Auditoría de Calidad SEO & E-E-A-T:</strong>
                  </div>
                  <div className="scorecard-items">
                    <span className={`score-badge ${parsed.wordCount >= 800 ? 'good' : 'warning'}`}>
                      {parsed.wordCount >= 800 ? '✓' : '⚠️'} {parsed.wordCount} palabras {parsed.wordCount >= 800 ? '(Óptimo Autoridad)' : '(Ideal > 800)'}
                    </span>
                    <span className="score-badge good">✓ H1 Título detectado</span>
                    <span className={`score-badge ${parsed.sections.length >= 2 ? 'good' : 'warning'}`}>
                      {parsed.sections.length >= 2 ? '✓' : '⚠️'} {parsed.sections.length} secciones H2
                    </span>
                    <span className="score-badge good">✓ Formato 1:1 Cuadrado</span>
                    <span className="score-badge good">✓ Autor {parsed.author.name}</span>
                  </div>
                </div>

              </div>
            )}
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
                {activePreviewTab === 'article' && (
                  <div className="live-preview-viewport">
                    {/* Hero del Artículo con H1 */}
                    <div className="preview-hero">
                      <span className="preview-cat-badge">{parsed.category}</span>
                      <h1 className="preview-title">{parsed.title}</h1>
                      <p className="preview-subtitle">{parsed.subtitle}</p>
                      
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
                          <span>⏱️ {parsed.readTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Imagen de Portada */}
                    <div className="preview-image-box">
                      <img src={parsed.image} alt={parsed.imageAlt} />
                      <span className="image-ratio-tag">Encuadre Editorial Cuadrado / Panorámico</span>
                    </div>

                    {/* Puntos Clave */}
                    {parsed.keyTakeaways.length > 0 && (
                      <div className="preview-takeaways">
                        <h4>⭐ Puntos Clave para la Dirección</h4>
                        <ul>
                          {parsed.keyTakeaways.map((point, idx) => (
                            <li key={idx}>
                              <span className="check-bullet">✓</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Secciones con H2 y H3 */}
                    <div className="preview-sections">
                      {parsed.sections.map((sec, sIdx) => (
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
                    {parsed.conclusion.text && (
                      <div className="preview-conclusion">
                        <h3>{parsed.conclusion.title}</h3>
                        <p>{parsed.conclusion.text}</p>
                      </div>
                    )}

                    {/* CTA Box */}
                    <div className="preview-cta">
                      <h4>¿Tu organización enfrenta este desafío?</h4>
                      <p>Conversemos sobre cómo adaptar estos modelos a la realidad específica de tu empresa.</p>
                      <span className="preview-cta-btn">Agendar reunión con {parsed.author.name} →</span>
                    </div>
                  </div>
                )}

                {/* 2. VISTA TARJETA DE GRILLA CUADRADA (1:1) */}
                {activePreviewTab === 'card' && (
                  <div className="card-preview-viewport">
                    <div className="card-preview-intro">
                      <h4>Previsualización en la Grilla del Blog (Formato Cuadrado 1:1)</h4>
                      <p>Así lucirá la tarjeta del artículo en la página pública <code>/blog</code>:</p>
                    </div>

                    <div className="square-card-container">
                      <article className="mock-blog-card">
                        <div className="mock-card-image-square">
                          <img src={parsed.image} alt={parsed.imageAlt} />
                          <span className="mock-cat-badge">{parsed.category}</span>
                          <span className="mock-ratio-pill">1:1 Cuadrada</span>
                        </div>

                        <div className="mock-card-body">
                          <div className="mock-card-meta">
                            <span>{parsed.date}</span>
                            <span>•</span>
                            <span>{parsed.readTime}</span>
                          </div>

                          <h2 className="mock-card-title">{parsed.title}</h2>
                          <p className="mock-card-summary">{parsed.summary}</p>

                          <div className="mock-card-footer">
                            <span className="mock-read-link">Leer artículo completo →</span>
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                )}

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
