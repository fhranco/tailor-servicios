import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { getAuthorizedUser, maskIp } from '@/lib/auth';
import { blogArticlesEs } from '@/data/blogPosts';

const CACHE_PATH = path.join(process.cwd(), 'scratch', 'blog_articles.json');

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key);
}

function readLocalArticles(): any[] {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const content = fs.readFileSync(CACHE_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading local blog cache:', err);
  }
  return blogArticlesEs;
}

function writeLocalArticles(articles: any[]) {
  try {
    const dir = path.dirname(CACHE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_PATH, JSON.stringify(articles, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local blog cache:', err);
  }
}

// 1. GET: Listar todos los artículos para el CMS
export async function GET(req: NextRequest) {
  let user: any = null;
  try {
    user = await getAuthorizedUser(req);
  } catch (err) {
    console.warn('[Admin Blog GET] Error en autenticación:', err);
  }

  if (!user) {
    if (process.env.NODE_ENV === 'development') {
      user = { email: 'dev-local@tailorservicios.cl', id: 'dev-local' };
    } else {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
  }

  const rawIp = req.headers.get('x-forwarded-for') || 'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';
  const supabase = getAdminSupabase();

  if (supabase) {
    try {
      await supabase.from('privacy_audit_logs').insert([{
        action: 'SELECT_BLOG_ARTICLES',
        performed_by: user?.email || 'ADMIN',
        ip_address: maskIp(rawIp),
        user_agent: ua
      }]);
    } catch (logErr) {
      console.warn('Audit Log Supabase no disponible:', (logErr as any)?.message);
    }
  }

  // Leer desde archivo local/caché resiliente
  const articles = readLocalArticles();

  return NextResponse.json({
    success: true,
    articles
  }, {
    headers: { 'Cache-Control': 'no-store, private' }
  });
}

// 2. POST: Crear o Actualizar Artículo (Guardar/Editar)
export async function POST(req: NextRequest) {
  let user: any = null;
  try {
    user = await getAuthorizedUser(req);
  } catch (err) {
    console.warn('[Admin Blog POST] Error en autenticación:', err);
  }

  if (!user) {
    if (process.env.NODE_ENV === 'development') {
      user = { email: 'dev-local@tailorservicios.cl', id: 'dev-local' };
    } else {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
  }

  try {
    const body = await req.json();
    const { article } = body;

    if (!article || !article.title) {
      return NextResponse.json({ error: 'Datos de artículo incompletos: el título es obligatorio' }, { status: 400 });
    }

    // Auto-generación de slug seguro si viene vacío
    if (!article.slug || typeof article.slug !== 'string' || !article.slug.trim()) {
      article.slug = article.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-') || `articulo-${Date.now()}`;
    }

    const rawIp = req.headers.get('x-forwarded-for') || 'unknown';
    const ua = req.headers.get('user-agent') || 'unknown';
    const supabase = getAdminSupabase();

    const articles = readLocalArticles();
    const existingIndex = articles.findIndex(a => a.slug === article.slug || (article.id && a.id === article.id));

    let isUpdate = false;
    let savedArticle = { ...article };

    if (existingIndex >= 0) {
      // Editar existente
      isUpdate = true;
      savedArticle.id = articles[existingIndex].id;
      savedArticle.updated_at = new Date().toISOString();
      articles[existingIndex] = savedArticle;
    } else {
      // Crear nuevo
      savedArticle.id = article.id || Date.now();
      savedArticle.created_at = new Date().toISOString();
      articles.unshift(savedArticle);
    }

    // Persistir localmente en caché
    writeLocalArticles(articles);
    console.log(`[Admin Blog] Artículo guardado exitosamente: "${savedArticle.title}" (slug: ${savedArticle.slug}, acción: ${isUpdate ? 'update' : 'create'})`);

    // Sincronizar en Supabase PostgreSQL (si la tabla blog_articles está disponible)
    if (supabase) {
      try {
        const dbPayload = {
          slug: savedArticle.slug,
          title: savedArticle.title,
          subtitle: savedArticle.subtitle || '',
          category: savedArticle.category || 'Gestión de Personas',
          category_key: savedArticle.categoryKey || 'personas',
          author_id: savedArticle.author?.id || 'consultoria',
          author_name: savedArticle.author?.name || 'Equipo de Consultoría Tailor',
          author_role: savedArticle.author?.role || '',
          author_institution: savedArticle.author?.institution || 'Tailor Servicios',
          author_avatar: savedArticle.author?.avatar || 'TS',
          image: savedArticle.image || '/Images/tailor-web15.webp',
          image_alt: savedArticle.imageAlt || savedArticle.title,
          summary: savedArticle.summary || '',
          content_html: savedArticle.contentHtml || null,
          content_json: {
            sections: savedArticle.sections || [],
            keyTakeaways: savedArticle.keyTakeaways || [],
            conclusion: savedArticle.conclusion || {}
          },
          keywords: savedArticle.keywords || [],
          key_takeaways: savedArticle.keyTakeaways || [],
          read_time: savedArticle.readTime || '5 min de lectura',
          word_count: savedArticle.wordCount || 0,
          published: true,
          updated_at: new Date().toISOString()
        };
        const { error: dbError } = await supabase.from('blog_articles').upsert(dbPayload, { onConflict: 'slug' });
        if (dbError) {
          console.warn('[Admin Blog] Supabase upsert advertencia (se sincronizará tras ejecutar schema.sql):', dbError.message);
        } else {
          console.log('[Admin Blog] Artículo sincronizado con tabla Supabase blog_articles');
        }
      } catch (dbErr: any) {
        console.warn('[Admin Blog] Supabase tabla no disponible o conexión local:', dbErr?.message);
      }
    }

    // Auditoría Ley 21.719
    if (supabase) {
      try {
        await supabase.from('privacy_audit_logs').insert([{
          action: isUpdate ? 'UPDATE_BLOG_ARTICLE' : 'CREATE_BLOG_ARTICLE',
          performed_by: user?.email || 'ADMIN',
          ip_address: maskIp(rawIp),
          user_agent: ua
        }]);
      } catch (logErr) {
        console.warn('Audit Log Supabase no disponible:', (logErr as any)?.message);
      }
    }

    return NextResponse.json({
      success: true,
      article: savedArticle,
      action: isUpdate ? 'updated' : 'created'
    });
  } catch (err: any) {
    console.error('Error saving blog article:', err);
    return NextResponse.json({ error: 'Error interno al guardar artículo', details: err?.message }, { status: 500 });
  }
}

// 3. DELETE: Eliminar Artículo
export async function DELETE(req: NextRequest) {
  let user: any = null;
  try {
    user = await getAuthorizedUser(req);
  } catch (err) {
    console.warn('[Admin Blog DELETE] Error en autenticación:', err);
  }

  if (!user) {
    if (process.env.NODE_ENV === 'development') {
      user = { email: 'dev-local@tailorservicios.cl', id: 'dev-local' };
    } else {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
  }

  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug de artículo no especificado' }, { status: 400 });
  }

  const rawIp = req.headers.get('x-forwarded-for') || 'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';
  const supabase = getAdminSupabase();

  const articles = readLocalArticles();
  const filtered = articles.filter(a => a.slug !== slug);

  if (filtered.length === articles.length) {
    return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
  }

  writeLocalArticles(filtered);

  // Eliminar en Supabase PostgreSQL (si la tabla está disponible)
  if (supabase) {
    try {
      await supabase.from('blog_articles').delete().eq('slug', slug);
      console.log(`[Admin Blog] Artículo eliminado de tabla Supabase: ${slug}`);
    } catch (dbErr) {
      console.warn('[Admin Blog DELETE] Supabase tabla no disponible:', dbErr);
    }
  }

  // Auditoría Ley 21.719
  if (supabase) {
    try {
      await supabase.from('privacy_audit_logs').insert([{
        action: 'DELETE_BLOG_ARTICLE',
        performed_by: user?.email || 'ADMIN',
        ip_address: maskIp(rawIp),
        user_agent: ua
      }]);
    } catch (logErr) {
      console.error('Audit Log Error:', logErr);
    }
  }

  return NextResponse.json({
    success: true,
    deletedSlug: slug,
    remainingCount: filtered.length
  });
}
