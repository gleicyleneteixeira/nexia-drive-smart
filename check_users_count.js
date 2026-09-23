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
  // Check profiles count
  const { count: profilesCount, error: profilesErr } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (profilesErr) {
    console.error("Error fetching profiles count:", profilesErr);
  } else {
    console.log("Profiles count:", profilesCount);
  }

  // Check auth users count
  const { data: { users }, error: authErr } = await supabase.auth.admin.listUsers();
  if (authErr) {
    console.error("Error listing auth users:", authErr);
  } else {
    console.log("Auth users count in this page (limit 50):", users.length);
    console.log("First 5 auth users:", users.slice(0, 5).map(u => ({ id: u.id, email: u.email })));
  }
}

run();
