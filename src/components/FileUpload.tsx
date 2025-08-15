import React, { useState } from 'react'
import { Upload, X, CheckCircle, AlertCircle, FileText, Image } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const apiDomain = 'https://learnx-crm-production.up.railway.app/api/v1'; // API bazaviy manzili (avvalgi koddan olingan)

interface FileUploadProps {
  onFileUploaded: (filePath: string, fileName: string) => void
  acceptedTypes?: string[]
  maxSize?: number // in MB
  label: string
  required?: boolean
  currentFile?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
  maxSize = 5,
  label,
  required = false,
  currentFile
}) => {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const { user } = useAuth()

  const handleFileSelect = async (file: File) => {
    if (!user) {
      toast.error('Faylni yuklash uchun tizimga kiring')
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Fayl hajmi ${maxSize}MB dan katta bo'lmasligi kerak`)
      return
    }

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedTypes.includes(fileExtension)) {
      toast.error('Fayl turi qo\'llab-quvvatlanmaydi')
      return
    }

    setUploading(true)

    try {
      const apiToken = localStorage.getItem('api_access_token');
      const clientId = localStorage.getItem('client_id');

      if (!apiToken || !clientId) {
        throw new Error('API token yoki Client ID topilmadi');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('client_id', clientId);
      // Agar kerak bo'lsa, qo'shimcha maydonlar qo'shing, masalan: formData.append('document_type', 'passport');

      const response = await fetch(`${apiDomain}/files/upload`, { // Bu endpointni o'zingizning API ga moslashtiring (masalan, /clients/documents/upload)
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Fayl yuklash xatosi: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      // API javobida filePath va fileName bo'lishi kerak, masalan: { file_path: 'path/to/file', file_name: 'original-name.ext' }
      const filePath = result.file_path;
      const fileName = result.file_name || file.name;

      toast.success('Fayl muvaffaqiyatli yuklandi');
      onFileUploaded(filePath, fileName);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Fayl yuklashda xatolik: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) {
      return <Image className="h-6 w-6" />
    }
    return <FileText className="h-6 w-6" />
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {currentFile ? (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-green-800">Fayl yuklangan</p>
              <p className="text-xs text-green-600">{currentFile.split('/').pop()}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFileUploaded('', '')}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            disabled={uploading}
          />

          <div className="space-y-4">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600 mt-2">Yuklanmoqda...</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Faylni tanlash uchun bosing yoki shu yerga tashlang
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {acceptedTypes.join(', ')} (max {maxSize}MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload