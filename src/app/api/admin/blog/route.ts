import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { getAuthorizedUser, maskIp } from '@/lib/auth';
import { blogArticlesEs } from '@/data/blogPosts';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'blog_articles.json');
const SCRATCH_PATH = path.join(process.cwd(), 'scratch', 'blog_articles.json');

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key);
}

function readLocalArticles(): any[] {
  try {
    const targetPath = fs.existsSync(DATA_PATH) ? DATA_PATH : (fs.existsSync(SCRATCH_PATH) ? SCRATCH_PATH : null);
    if (targetPath) {
      const content = fs.readFileSync(targetPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading local blog cache:', err);
  }
  return blogArticlesEs;
}

function writeLocalArticles(articles: any[]) {
  try {
    // 1. Guardar en src/data/blog_articles.json para persistencia en repo
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2), 'utf-8');

    // 2. Guardar en scratch si el directorio existe
    const scratchDir = path.dirname(SCRATCH_PATH);
    if (fs.existsSync(scratchDir)) {
      fs.writeFileSync(SCRATCH_PATH, JSON.stringify(articles, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error writing blog articles to file:', err);
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

    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data.map((dbA: any) => ({
          id: dbA.id,
          slug: dbA.slug,
          title: dbA.title,
          subtitle: dbA.subtitle || '',
          category: dbA.category || 'Gestión de Personas',
          categoryKey: dbA.category_key || 'personas',
          author: {
            id: dbA.author_id || 'consultoria',
            name: dbA.author_name || 'Equipo de Consultoría Tailor',
            role: dbA.author_role || '',
            institution: dbA.author_institution || 'Tailor Servicios',
            avatar: dbA.author_avatar || 'TS'
          },
          image: dbA.image || '/Images/tailor-web15.webp',
          imageAlt: dbA.image_alt || dbA.title,
          summary: dbA.summary || '',
          contentHtml: dbA.content_html || '',
          sections: dbA.content_json?.sections || [],
          keyTakeaways: dbA.key_takeaways || dbA.content_json?.keyTakeaways || [],
          conclusion: dbA.content_json?.conclusion || {},
          keywords: dbA.keywords || [],
          readTime: dbA.read_time || '5 min de lectura',
          wordCount: dbA.word_count || 0,
          published: dbA.published !== false,
          created_at: dbA.created_at,
          updated_at: dbA.updated_at,
          // Bilingual English fields
          titleEn: dbA.content_json?.titleEn || dbA.title_en || '',
          subtitleEn: dbA.content_json?.subtitleEn || dbA.subtitle_en || '',
          categoryEn: dbA.content_json?.categoryEn || dbA.category_en || '',
          summaryEn: dbA.content_json?.summaryEn || dbA.summary_en || '',
          readTimeEn: dbA.content_json?.readTimeEn || dbA.read_time_en || '',
          keywordsEn: dbA.content_json?.keywordsEn || [],
          keyTakeawaysEn: dbA.content_json?.keyTakeawaysEn || [],
          sectionsEn: dbA.content_json?.sectionsEn || [],
          conclusionEn: dbA.content_json?.conclusionEn || null,
          contentHtmlEn: dbA.content_json?.contentHtmlEn || dbA.content_html_en || '',
          rawDraft: dbA.content_json?.rawDraft || '',
          rawDraftEn: dbA.content_json?.rawDraftEn || ''
        }));

        return NextResponse.json({
          success: true,
          articles: mapped
        }, {
          headers: { 'Cache-Control': 'no-store, private' }
        });
      }
    } catch (dbErr) {
      console.warn('[Admin Blog GET] Supabase no disponible, usando fallback local:', dbErr);
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
            conclusion: savedArticle.conclusion || {},
            titleEn: savedArticle.titleEn || null,
            subtitleEn: savedArticle.subtitleEn || null,
            summaryEn: savedArticle.summaryEn || null,
            categoryEn: savedArticle.categoryEn || null,
            readTimeEn: savedArticle.readTimeEn || null,
            keywordsEn: savedArticle.keywordsEn || [],
            keyTakeawaysEn: savedArticle.keyTakeawaysEn || [],
            sectionsEn: savedArticle.sectionsEn || [],
            conclusionEn: savedArticle.conclusionEn || null,
            contentHtmlEn: savedArticle.contentHtmlEn || null,
            rawDraft: savedArticle.rawDraft || null,
            rawDraftEn: savedArticle.rawDraftEn || null
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
