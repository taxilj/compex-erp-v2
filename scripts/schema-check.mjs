import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://nlqpretaqtvblaheywtc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scXByZXRhcXR2YmxhaGV5d3RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk3MjA0MywiZXhwIjoyMDk2NTQ4MDQzfQ.KzIrLnAQ0oT_cmRLsikTNQKYQWlguIjpPS6kProkJMQ'
)

async function main() {
  const { data: tables, error } = await supabase
    .rpc('get_schema_tables')
  if (error) {
    // fallback: query information_schema directly
    const { data, error: e2 } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_type')
      .eq('table_schema', 'public')
    if (e2) {
      console.error('Cannot query schema:', e2)
      // try raw query
      const { data: rd, error: re } = await supabase.from('_schema').select('*').limit(1)
      console.log('raw attempt:', re)
      return
    }
    console.log('Tables:', data?.map(t => t.table_name).join(', '))
  } else {
    console.log('Tables:', tables)
  }
}
main()
