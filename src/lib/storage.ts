import { supabase } from './supabase'

export const STORAGE_BUCKETS = {
  DOCUMENTS: 'documents',
  AVATARS: 'avatars',
  CERTIFICATES: 'certificates'
}

// Create storage buckets if they don't exist
export const initializeStorage = async () => {
  try {
    // Check and create buckets
    const buckets = Object.values(STORAGE_BUCKETS)
    
    for (const bucketName of buckets) {
      const { data: existingBucket } = await supabase.storage.getBucket(bucketName)
      
      if (!existingBucket) {
        await supabase.storage.createBucket(bucketName, {
          public: bucketName === STORAGE_BUCKETS.AVATARS,
          allowedMimeTypes: bucketName === STORAGE_BUCKETS.AVATARS 
            ? ['image/jpeg', 'image/png', 'image/webp']
            : ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        })
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error)
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
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
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