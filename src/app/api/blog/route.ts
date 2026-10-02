import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { blogArticlesEs } from '@/data/blogPosts';

const CACHE_PATH = path.join(process.cwd(), 'scratch', 'blog_articles.json');

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function readLiveArticles() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const content = fs.readFileSync(CACHE_PATH, 'utf-8');
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

export async function GET() {
  // 1. Intentar leer desde Supabase PostgreSQL en tiempo real
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const sanitized = data.map(a => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          subtitle: a.subtitle,
          category: a.category,
          categoryKey: a.category_key,
          date: new Date(a.published_at || a.created_at).toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          isoDate: a.published_at || a.created_at,
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
          featured: a.featured || false
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
    } catch (dbErr) {
      console.warn('[Public Blog API] Fallback a caché local:', dbErr);
    }
  }

  // 2. Fallback a caché local y datos estáticos
  const articles = readLiveArticles();
  
  // Mapear solo los campos públicos necesarios para listados (minimización de datos y alta velocidad)
  const sanitized = articles.map(a => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    subtitle: a.subtitle,
    category: a.category,
    categoryKey: a.categoryKey,
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
    featured: a.featured || false
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
