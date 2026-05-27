import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const DEMO_URL = 'https://placeholder.supabase.co'
const DEMO_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.placeholder'

// Cria o cliente sempre com valores válidos — modo demo se não configurado
export const supabase = createClient(
  supabaseUrl || DEMO_URL,
  supabaseAnonKey || DEMO_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
)

export const isSupabaseConfigured = () =>
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  supabaseUrl !== 'sua_url_aqui' &&
  supabaseAnonKey !== 'sua_anon_key_aqui' &&
  supabaseUrl !== DEMO_URL
