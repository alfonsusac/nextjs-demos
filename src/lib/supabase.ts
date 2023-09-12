import { createClient } from "@supabase/supabase-js"
import { Database } from "./database.types"
import fetch2 from "node-fetch"

const supabaseClientSingleton = () => {
  return createClient<Database>(
    'https://yjccvjyuflpawraittig.supabase.co',
    getEnv(),
    {
      auth: {
        persistSession: false
      },
      global: {
        fetch: fetch2 as unknown as typeof fetch
      }
    },
  )
}

function getEnv() {
  const env = process.env.SUPABASE_SERVICE_KEY
  if (!env) throw "Please provide SUPABASE_SERVICE_KEY"
  return env
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