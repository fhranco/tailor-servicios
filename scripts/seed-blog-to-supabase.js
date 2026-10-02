const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      val = val.replace(/^["'](.*)["']$/, '$1');
      env[key] = val;
    }
  }
  return env;
}

async function seedBlogArticles() {
  console.log('=== SEMBRADO DE ARTÍCULOS EN SUPABASE POSTGRESQL ===\n');
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    console.error('❌ Falta URL o Key de Supabase en .env.local');
    process.exit(1);
  }

  const articlesPath = path.join(__dirname, '..', 'src', 'data', 'blog_articles.json');
  if (!fs.existsSync(articlesPath)) {
    console.error('❌ No se encontró src/data/blog_articles.json');
    process.exit(1);
  }

  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
  console.log(`Leídos ${articles.length} artículos desde src/data/blog_articles.json`);

  const supabase = createClient(url, serviceKey);

  for (const a of articles) {
    const dbPayload = {
      slug: a.slug,
      title: a.title,
      subtitle: a.subtitle || '',
      category: a.category || 'Gestión de Personas',
      category_key: a.categoryKey || 'personas',
      author_id: a.author?.id || 'consultoria',
      author_name: a.author?.name || 'Equipo de Consultoría Tailor',
      author_role: a.author?.role || '',
      author_institution: a.author?.institution || 'Tailor Servicios',
      author_avatar: a.author?.avatar || 'TS',
      image: a.image || '/Images/tailor-web15.webp',
      image_alt: a.imageAlt || a.title,
      summary: a.summary || '',
      content_html: a.contentHtml || null,
      content_json: {
        sections: a.sections || [],
        keyTakeaways: a.keyTakeaways || [],
        conclusion: a.conclusion || {},
        titleEn: a.titleEn || null,
        subtitleEn: a.subtitleEn || null,
        summaryEn: a.summaryEn || null,
        categoryEn: a.categoryEn || null,
        readTimeEn: a.readTimeEn || null,
        keywordsEn: a.keywordsEn || [],
        keyTakeawaysEn: a.keyTakeawaysEn || [],
        sectionsEn: a.sectionsEn || [],
        conclusionEn: a.conclusionEn || null,
        contentHtmlEn: a.contentHtmlEn || null,
        rawDraft: a.rawDraft || null,
        rawDraftEn: a.rawDraftEn || null
      },
      keywords: a.keywords || [],
      key_takeaways: a.keyTakeaways || [],
      read_time: a.readTime || '5 min de lectura',
      word_count: a.wordCount || 0,
      published: true,
      updated_at: new Date().toISOString()
    };

    console.log(`Subiendo a Supabase: "${a.title.slice(0, 45)}..." (slug: ${a.slug}) | Autor: ${dbPayload.author_name}`);
    const { data, error } = await supabase
      .from('blog_articles')
      .upsert(dbPayload, { onConflict: 'slug' })
      .select('id, slug, author_name');

    if (error) {
      console.error(`   ❌ Error upserting ${a.slug}:`, error.message);
    } else {
      console.log(`   ✅ Sincronizado exitosamente en Supabase (ID: ${data[0]?.id})`);
    }
  }

  // Registrar en privacy_audit_logs (Ley 21.719)
  try {
    await supabase.from('privacy_audit_logs').insert([{
      action: 'SEED_BLOG_ARTICLES',
      performed_by: 'MIGRATION_SCRIPT',
      ip_address: '127.0.0.1',
      user_agent: 'CLI Seeder'
    }]);
    console.log('\n✅ Auditoría registrada en privacy_audit_logs (Ley 21.719)');
  } catch (e) {}

  console.log('\n=== SEMBRADO COMPLETADO CON ÉXITO ===');
}

seedBlogArticles();
