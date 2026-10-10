import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { blogArticlesEs } from '@/data/blogPosts';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'blog_articles.json');
const SCRATCH_PATH = path.join(process.cwd(), 'scratch', 'blog_articles.json');

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function readLiveArticles() {
  try {
    const targetPath = fs.existsSync(DATA_PATH) ? DATA_PATH : (fs.existsSync(SCRATCH_PATH) ? SCRATCH_PATH : null);
    if (targetPath) {
      const content = fs.readFileSync(targetPath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading blog articles cache for public API:', err);
  }
  return blogArticlesEs;
}

// Mapa cronológico canónico por slug para proteger contra semillas o re-inserciones en BD
const CANONICAL_ARTICLE_DATES: Record<string, string> = {
  'siete-anos-de-historia-y-compromiso-con-magallanes': '2026-10-10T12:00:00.000Z',
  'hay-lugares-que-uno-habita-y-hay-otros-que-de-alguna-manera-terminan-habitandolo-a-uno-magallanes-tiene-algo-de-eso': '2026-10-02T12:00:00.000Z',
  'estrategias-atraccion-talento-zonas-extremas-chile': '2024-09-15T12:00:00.000Z',
  'implementacion-ley-karin-cultura-organizacional-chile': '2024-08-28T12:00:00.000Z',
  'impacto-desarrollo-organizacional-retencion-talento': '2024-07-19T12:00:00.000Z',
  'desafios-ley-40-horas-turnos-continuos-faenas': '2024-06-10T12:00:00.000Z',
};

function getExactPublicationDate(a: any): Date {
  if (a.slug && CANONICAL_ARTICLE_DATES[a.slug]) {
    return new Date(CANONICAL_ARTICLE_DATES[a.slug]);
  }
  if (a.isoDate) {
    const d = new Date(a.isoDate);
    if (!isNaN(d.getTime())) return d;
  }
  if (a.content_json?.isoDate) {
    const d = new Date(a.content_json.isoDate);
    if (!isNaN(d.getTime())) return d;
  }
  if (a.published_at) {
    const d = new Date(a.published_at);
    if (!isNaN(d.getTime())) return d;
  }
  if (a.created_at) {
    const d = new Date(a.created_at);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
}

export async function GET() {
  // 1. Intentar leer desde Supabase PostgreSQL en tiempo real
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('published', true);

      if (!error && Array.isArray(data)) {
        // Combinar artículos de base de datos con artículos locales para no perder los recién agregados
        const localArticles = readLiveArticles();
        const dbSlugs = new Set(data.map(d => d.slug));
        const combined = [...data];

        for (const local of localArticles) {
          if (!dbSlugs.has(local.slug)) {
            combined.push({
              id: local.id,
              slug: local.slug,
              title: local.title,
              subtitle: local.subtitle,
              category: local.category,
              category_key: local.categoryKey,
              title_en: local.titleEn,
              subtitle_en: local.subtitleEn,
              summary_en: local.summaryEn,
              category_en: local.categoryEn,
              read_time_en: local.readTimeEn,
              author_name: local.author?.name,
              author_role: local.author?.role,
              author_institution: local.author?.institution,
              author_avatar: local.author?.avatar,
              image: local.image,
              image_alt: local.imageAlt,
              summary: local.summary,
              content_html: local.contentHtml,
              content_json: {
                titleEn: local.titleEn,
                subtitleEn: local.subtitleEn,
                summaryEn: local.summaryEn,
                categoryEn: local.categoryEn,
                readTimeEn: local.readTimeEn,
                sections: local.sections,
                sectionsEn: local.sectionsEn,
                contentHtmlEn: local.contentHtmlEn
              },
              read_time: local.readTime,
              word_count: local.wordCount,
              isoDate: local.isoDate,
              published_at: local.published_at || (local.isoDate ? `${local.isoDate}T12:00:00.000Z` : undefined)
            });
          }
        }

        if (combined.length > 0) {
          // Orden estrictamente cronológico inverso: el más nuevo siempre primero (idx === 0 es destacado)
          const sortedData = [...combined].sort((x, y) => getExactPublicationDate(y).getTime() - getExactPublicationDate(x).getTime());

          const sanitized = sortedData.map((a, idx) => {
            const exactDate = getExactPublicationDate(a);
            return {
              id: a.id,
              slug: a.slug,
              title: a.title,
              subtitle: a.subtitle,
              category: a.category,
              categoryKey: a.category_key || a.categoryKey,
              titleEn: a.title_en || a.titleEn || a.content_json?.titleEn || null,
              subtitleEn: a.subtitle_en || a.subtitleEn || a.content_json?.subtitleEn || null,
              summaryEn: a.summary_en || a.summaryEn || a.content_json?.summaryEn || null,
              categoryEn: a.category_en || a.categoryEn || a.content_json?.categoryEn || null,
              readTimeEn: a.read_time_en || a.readTimeEn || a.content_json?.readTimeEn || null,
              date: exactDate.toLocaleDateString('es-CL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }),
              isoDate: exactDate.toISOString().split('T')[0],
              readTime: a.read_time || a.readTime,
              wordCount: a.word_count || a.wordCount,
              author: {
                name: a.author_name || a.author?.name || 'Equipo Tailor',
                role: a.author_role || a.author?.role || 'Consultoría',
                institution: a.author_institution || a.author?.institution || 'Tailor Servicios',
                avatar: a.author_avatar || a.author?.avatar || 'TS'
              },
              image: a.image,
              imageAlt: a.image_alt || a.imageAlt || a.title,
              summary: a.summary,
              featured: idx === 0 // El artículo destacado es SIEMPRE el último publicado
            };
          });

          return NextResponse.json({
            success: true,
            articles: sanitized,
            total: sanitized.length
          }, {
            headers: {
              'Cache-Control': 'no-store, must-revalidate',
            }
          });
        }
      }
    } catch (dbErr) {
      console.warn('[Public Blog API] Fallback a caché local:', dbErr);
    }
  }

  // 2. Fallback a caché local y datos estáticos
  const articles = readLiveArticles();
  
  // Garantizar orden estrictamente cronológico inverso: el último publicado siempre es el primero
  const sortedArticles = [...articles].sort((x, y) => getExactPublicationDate(y).getTime() - getExactPublicationDate(x).getTime());

  // Mapear solo los campos públicos necesarios para listados (minimización de datos y alta velocidad)
  const sanitized = sortedArticles.map((a, idx) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    subtitle: a.subtitle,
    category: a.category,
    categoryKey: a.categoryKey,
    titleEn: a.titleEn || null,
    subtitleEn: a.subtitleEn || null,
    summaryEn: a.summaryEn || null,
    categoryEn: a.categoryEn || null,
    readTimeEn: a.readTimeEn || null,
    date: a.date,
    isoDate: a.isoDate,
    readTime: a.readTime,
    wordCount: a.wordCount,
    author: {
      name: a.author?.name || 'Equipo Tailor',
      role: a.author?.role || 'Consultoría',
      institution: a.author?.institution || 'Tailor Servicios',
      avatar: a.author?.avatar || 'TS'
    },
    image: a.image,
    imageAlt: a.imageAlt || a.title,
    summary: a.summary,
    featured: idx === 0 // El artículo destacado es siempre el último publicado (índice 0)
  }));

  return NextResponse.json({
    success: true,
    articles: sanitized,
    total: sanitized.length
  }, {
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
    }
  });
}
