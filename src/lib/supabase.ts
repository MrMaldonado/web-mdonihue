import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

console.log('[v0] Supabase URL defined:', !!supabaseUrl)
console.log('[v0] Supabase Anon Key defined:', !!supabaseAnonKey)

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey
console.log('[v0] isSupabaseConfigured:', isSupabaseConfigured)
