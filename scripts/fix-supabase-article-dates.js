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

const ARTICLE_DATES = [
  {
    slug: 'hay-lugares-que-uno-habita-y-hay-otros-que-de-alguna-manera-terminan-habitandolo-a-uno-magallanes-tiene-algo-de-eso',
    published_at: '2026-10-02T12:00:00.000Z',
    created_at: '2026-10-02T12:00:00.000Z'
  },
  {
    slug: 'estrategias-atraccion-talento-zonas-extremas-chile',
    published_at: '2024-09-15T12:00:00.000Z',
    created_at: '2024-09-15T12:00:00.000Z'
  },
  {
    slug: 'implementacion-ley-karin-cultura-organizacional-chile',
    published_at: '2024-08-28T12:00:00.000Z',
    created_at: '2024-08-28T12:00:00.000Z'
  },
  {
    slug: 'impacto-desarrollo-organizacional-retencion-talento',
    published_at: '2024-07-19T12:00:00.000Z',
    created_at: '2024-07-19T12:00:00.000Z'
  },
  {
    slug: 'desafios-ley-40-horas-turnos-continuos-faenas',
    published_at: '2024-06-10T12:00:00.000Z',
    created_at: '2024-06-10T12:00:00.000Z'
  }
];

async function fixDates() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('❌ Falta URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey);

  console.log('🔄 Actualizando published_at y created_at en Supabase blog_articles...');
  for (const item of ARTICLE_DATES) {
    const { data, error } = await supabase
      .from('blog_articles')
      .update({
        published_at: item.published_at,
        created_at: item.created_at
      })
      .eq('slug', item.slug)
      .select('slug, published_at');

    if (error) {
      console.error(`❌ Error actualizando ${item.slug}:`, error.message);
    } else {
      console.log(`✅ ${item.slug.slice(0, 35)}... -> ${item.published_at}`);
    }
  }

  console.log('\n🏁 Corrección de fechas completada.');
}

fixDates();
