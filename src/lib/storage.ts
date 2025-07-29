import { supabase } from './supabase'

export const STORAGE_BUCKETS = {
  DOCUMENTS: 'documents',
  AVATARS: 'avatars'
}

// Initialize storage buckets
export const initializeStorage = async () => {
  try {
    // Check if buckets exist, if not they should be created via migration
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.log('Storage buckets not accessible:', error.message)
      return false
    }
    
    const bucketNames = buckets?.map(b => b.name) || []
    const hasAvatars = bucketNames.includes('avatars')
    const hasDocuments = bucketNames.includes('documents')
    
    if (hasAvatars && hasDocuments) {
      console.log('✅ Storage buckets initialized successfully')
      return true
    } else {
      console.log('⚠️ Some storage buckets missing. Run migration to create them.')
      return false
    }
  } catch (error) {
    console.log('Storage initialization error:', error)
    return false
  }
}

// Upload file to storage
export const uploadFile = async (
  bucket: string, 
  path: string, 
  file: File,
  options?: { upsert?: boolean }
) => {
  try {
    // Ensure file path includes user ID for RLS
    const finalPath = path.startsWith('auth.uid()') ? path : path
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(finalPath, file, {
        cacheControl: '3600',
        upsert: options?.upsert || false
      })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Upload error:', error)
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
    console.error('Get URL error:', error)
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