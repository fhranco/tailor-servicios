const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
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

async function verify() {
  console.log('=== VERIFICACIÓN DE CONECTIVIDAD SUPABASE ===\n');
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    console.error('❌ Falta NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local');
    process.exit(1);
  }

  console.log('1. Credenciales locales detectadas:');
  console.log(`   - URL: ${url}`);
  console.log(`   - Anon Key: Presente (${anonKey.slice(0, 12)}...)`);
  console.log(`   - Service Role Key: ${serviceKey ? 'Presente (' + serviceKey.slice(0, 12) + '...)' : '❌ No configurada'}\n`);

  const client = createClient(url, serviceKey || anonKey);

  // Probar cada tabla
  const tables = ['blog_articles', 'b2b_leads', 'privacy_audit_logs', 'web_visits', 'jobs'];

  console.log('2. Comprobando existencia y accesibilidad de tablas en Supabase PostgreSQL:');

  for (const table of tables) {
    try {
      const { data, error, count } = await client
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('schema cache')) {
          console.log(`   - [${table}]: ⚠️ TABLA NO EXISTE en Supabase (requiere ejecutar schema.sql)`);
        } else {
          console.log(`   - [${table}]: ⚠️ Error (${error.code || 'desconocido'}): ${error.message}`);
        }
      } else {
        console.log(`   - [${table}]: ✅ CONECTADA (registros actuales: ${count !== null ? count : 'N/A'})`);
      }
    } catch (err) {
      console.log(`   - [${table}]: ❌ Error de red / conexión: ${err.message}`);
    }
  }

  // Si blog_articles existe, verificar si tiene el artículo de Ma. Pía
  try {
    const { data: blogData, error: blogErr } = await client
      .from('blog_articles')
      .select('id, slug, author_name, title')
      .limit(5);

    if (!blogErr && blogData) {
      console.log('\n3. Estado de artículos en Supabase:');
      if (blogData.length === 0) {
        console.log('   ℹ️ La tabla blog_articles está vacía. Puede poblarse con el script de sincronización.');
      } else {
        console.log(`   ℹ️ Encontrados ${blogData.length} artículos en la nube:`);
        blogData.forEach((a, i) => {
          console.log(`      ${i + 1}. [${a.slug}] Autor: "${a.author_name}"`);
        });
      }
    }
  } catch (e) {}

  console.log('\n=== FIN DE VERIFICACIÓN ===');
}

verify();
