import { supabase } from './supabase'

export const STORAGE_BUCKETS = {
  DOCUMENTS: 'documents',
  AVATARS: 'avatars',
  CERTIFICATES: 'certificates'
}

// Initialize storage (buckets should be created manually in Supabase dashboard)
export const initializeStorage = async () => {
  // Storage buckets (documents, avatars, certificates) should be created manually
  // in your Supabase project dashboard under Storage section
  console.log('Storage initialized - ensure buckets exist in Supabase dashboard')
}

// Upload file to storage
export const uploadFile = async (
  bucket: string, 
  path: string, 
  file: File,
  options?: { upsert?: boolean }
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: options?.upsert || false
      })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Get file URL
export const getFileUrl = (bucket: string, path: string) => {
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  } catch (error) {
    console.warn(`Storage bucket '${bucket}' not found. Please create it in Supabase dashboard.`)
    return null
  }
}

// Delete file
export const deleteFile = async (bucket: string, path: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    return { error }
  } catch (error) {
    return { error }
  }
}

// Get user's files
export const getUserFiles = async (userId: string, bucket: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(`${userId}/`, {
        limit: 100,
        offset: 0
      })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}