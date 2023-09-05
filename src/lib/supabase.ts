import { createClient } from "@supabase/supabase-js"
import { Database } from "./database.types"

function getEnv() {
  const env = process.env.SUPABASE_SERVICE_KEY
  if(!env) throw "Please provide SUPABASE_SERVICE_KEY"
  return env
}

const supabaseClientSingleton = () => {
  return createClient<Database>(
    'https://yjccvjyuflpawraittig.supabase.co',
    getEnv(),
    {
      auth: {
        persistSession: false
      },
    }
  )
}

type SupabaseClientSingleton = ReturnType<typeof supabaseClientSingleton>

const globalForSupabase = globalThis as unknown as {
  supabase: SupabaseClientSingleton | undefined
}


const supabase = globalForSupabase.supabase ?? supabaseClientSingleton()

export default supabase

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = supabase
}