
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase URL or Key!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing candidates table insert...');
  const { data, error } = await supabase.from('candidates').insert([
    {
      full_name: 'Test Node',
      email: 'test@node.local',
      specialty: 'test',
      cv_path: 'test.pdf'
    }
  ]).select();
  
  if (error) {
    console.error('Error inserting:', error);
  } else {
    console.log('Success:', data);
  }
}

test();
