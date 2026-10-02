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

async function check() {
  const env = loadEnv();
  const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await client
    .from('blog_articles')
    .select('id, slug, title, content_json')
    .eq('slug', 'hay-lugares-que-uno-habita-y-hay-otros-que-de-alguna-manera-terminan-habitandolo-a-uno-magallanes-tiene-algo-de-eso')
    .single();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('=== ARTÍCULO EN SUPABASE ===');
    console.log('ID:', data.id);
    console.log('Título Español:', data.title);
    console.log('Título Inglés (titleEn):', data.content_json?.titleEn);
    console.log('Categoría Inglés (categoryEn):', data.content_json?.categoryEn);
    console.log('Tiempo Lectura Inglés (readTimeEn):', data.content_json?.readTimeEn);
    console.log('Resumen Inglés (summaryEn):', data.content_json?.summaryEn);
    console.log('Contenido HTML en Inglés (caracteres):', data.content_json?.contentHtmlEn ? data.content_json.contentHtmlEn.length : 0);
    console.log('Párrafos en Inglés (sectionsEn):', data.content_json?.sectionsEn?.length || 0);
  }
}

check();
