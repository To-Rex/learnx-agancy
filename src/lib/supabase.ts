import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ithoblfqjhzwtbqmepkb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aG9ibGZxamh6d3RicW1lcGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTM5ODQsImV4cCI6MjA2ODg2OTk4NH0.TGYKNdt2FdhYf1VJHk5w-DWLoTR3KerSGVJDBRRT3YQ'

// Get current URL for redirects
const getCurrentUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'http://localhost:5173'
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    redirectTo: getCurrentUrl()
  }
})

// Storage buckets
export const STORAGE_BUCKETS = {
  DOCUMENTS: 'documents',
  IMAGES: 'images',
  CERTIFICATES: 'certificates'
}