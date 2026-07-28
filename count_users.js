import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Parse .env manually
const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { count: profileCount, error: pErr } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { data: { users }, error: uErr } = await supabase.auth.admin.listUsers();

  console.log(`Total profiles: ${profileCount}`);
  console.log(`Total auth.users: ${users?.length || 0}`);
  
  if (users && users.length > 0) {
    console.log("Last 5 auth.users created:");
    users.slice(-5).forEach(u => {
      console.log(`  - Email: ${u.email}, Created At: ${u.created_at}, ID: ${u.id}`);
    });
  }
}

run();
