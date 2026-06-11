import pg from 'pg';

const ref = 'nlqpretaqtvblaheywtc';
const srk = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scXByZXRhcXR2YmxhaGV5d3RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk3MjA0MywiZXhwIjoyMDk2NTQ4MDQzfQ.KzIrLnAQ0oT_cmRLsikTNQKYQWlguIjpPS6kProkJMQ';
const regions = ['ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'us-east-1', 'eu-west-1', 'eu-central-1', 'us-west-1'];

async function tryConnect(host, port, user, password, database = 'postgres') {
  const client = new pg.Client({
    host, port, user, password, database,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  try {
    await client.connect();
    const res = await client.query('SELECT 1 as ok, current_database(), version()');
    console.log(`SUCCESS: ${host}:${port} user=${user}`);
    console.log('  Result:', JSON.stringify(res.rows[0]));
    await client.end();
    return true;
  } catch (e) {
    console.log(`FAIL: ${host}:${port} user=${user} → ${e.message?.split('\n')[0] || e}`);
    return false;
  }
}

async function main() {
  // 1. Direct connection (port 5432) with service_role_key as password
  for (const region of regions) {
    if (await tryConnect(`db.${ref}.supabase.co`, 5432, 'postgres', srk)) return;
  }

  // 2. Supavisor pooler (transaction mode, port 6543) with various users
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    // a) pooler user = project_ref, password = srk
    if (await tryConnect(host, 6543, ref, srk)) return;
    // b) pooler user = postgres.project_ref, password = srk
    if (await tryConnect(host, 6543, `postgres.${ref}`, srk)) return;
    // c) pooler user = postgres, password = srk
    if (await tryConnect(host, 6543, 'postgres', srk)) return;
    // d) session mode port 5432
    if (await tryConnect(host, 5432, ref, srk)) return;
    if (await tryConnect(host, 5432, `postgres.${ref}`, srk)) return;
  }

  // 3. Direct connection with project_ref as user
  if (await tryConnect(`db.${ref}.supabase.co`, 5432, ref, srk)) return;

  console.log('\nAll connection attempts failed.');
}

main().catch(console.error);
