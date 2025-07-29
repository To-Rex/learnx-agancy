import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ithoqlfqjhzwtbqmepkb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aG9xbGZxamh6d3RicW1lcGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NzU5NzQsImV4cCI6MjA2OTM1MTk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    redirectTo: 'https://deft-gumdrop-6e6f8a.netlify.app'
  }
})

// Storage buckets
export const STORAGE_BUCKETS = {
  DOCUMENTS: 'documents',
  IMAGES: 'images',
  CERTIFICATES: 'certificates'
}