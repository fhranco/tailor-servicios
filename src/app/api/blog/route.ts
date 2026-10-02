import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { blogArticlesEs } from '@/data/blogPosts';

const CACHE_PATH = path.join(process.cwd(), 'scratch', 'blog_articles.json');

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
