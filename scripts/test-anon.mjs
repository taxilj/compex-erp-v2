import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://nlqpretaqtvblaheywtc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scXByZXRhcXR2YmxhaGV5d3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzIwNDMsImV4cCI6MjA5NjU0ODA0M30.I7ihScSzaOuE8fzyQLd0yCYc3Ote0BFJdZpthIdaMlk'
)

async function test() {
  const { data, error } = await supabase.from('companies').select('*').limit(1)
  console.log('data:', JSON.stringify(data))
  console.log('error:', error)
}
test()
