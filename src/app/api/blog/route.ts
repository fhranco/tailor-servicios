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

      if (!error && Array.isArray(data) && data.length > 0) {
        // Orden estrictamente cronológico inverso: el más nuevo siempre primero (idx === 0 es destacado)
        const sortedData = [...data].sort((x, y) => getExactPublicationDate(y).getTime() - getExactPublicationDate(x).getTime());

        const sanitized = sortedData.map((a, idx) => {
          const exactDate = getExactPublicationDate(a);
          return {
            id: a.id,
            slug: a.slug,
            title: a.title,
            subtitle: a.subtitle,
            category: a.category,
            categoryKey: a.category_key,
            titleEn: a.title_en || a.content_json?.titleEn || null,
            subtitleEn: a.subtitle_en || a.content_json?.subtitleEn || null,
            summaryEn: a.summary_en || a.content_json?.summaryEn || null,
            categoryEn: a.category_en || a.content_json?.categoryEn || null,
            readTimeEn: a.read_time_en || a.content_json?.readTimeEn || null,
            date: exactDate.toLocaleDateString('es-CL', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            isoDate: exactDate.toISOString().split('T')[0],
            readTime: a.read_time,
            wordCount: a.word_count,
            author: {
              name: a.author_name || 'Equipo Tailor',
              role: a.author_role || 'Consultoría',
              institution: a.author_institution || 'Tailor Servicios',
              avatar: a.author_avatar || 'TS'
            },
            image: a.image,
            imageAlt: a.image_alt || a.title,
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
