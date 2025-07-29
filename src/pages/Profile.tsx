import React from 'react'
import { User, Mail, Phone, MapPin, Calendar, FileText, CheckCircle, Edit, Upload, Download, Eye, Trash2, Plus, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserFiles, getFileUrl, deleteFile, STORAGE_BUCKETS } from '../lib/storage'
import ProfileEditor from '../components/ProfileEditor'
import FileUpload from '../components/FileUpload'
import toast from 'react-hot-toast'

const Profile: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [applications, setApplications] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showProfileEditor, setShowProfileEditor] = useState(false)
  const [showDocumentUpload, setShowDocumentUpload] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState('')

  useEffect(() => {
    if (user) {
      loadProfileData()
    }
  }, [user])

  const loadProfileData = async () => {
    if (!user) return

    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData)

      // Load applications
      const { data: applicationsData } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (applicationsData) {
        setApplications(applicationsData)
      }

      // Load documents
      const { data: filesData } = await getUserFiles(user.id, STORAGE_BUCKETS.DOCUMENTS)
      if (filesData) {
        const documentsWithUrls = filesData.map(file => ({
          name: file.name,
          path: `${user.id}/${file.name}`,
          uploaded: true,
          date: file.created_at,
          size: file.metadata?.size,
          url: getFileUrl(STORAGE_BUCKETS.DOCUMENTS, `${user.id}/${file.name}`)
        }))
        setDocuments(documentsWithUrls)
      }
    } catch (error) {
      console.error('Error loading profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSave = (profileData: any) => {
    setProfile(profileData)
  }

  const handleDocumentUpload = (filePath: string, fileName: string) => {
    if (filePath) {
      const newDocument = {
        name: fileName,
        path: filePath,
        uploaded: true,
        date: new Date().toISOString(),
        url: getFileUrl(STORAGE_BUCKETS.DOCUMENTS, filePath)
      }
      setDocuments(prev => [...prev, newDocument])
      setShowDocumentUpload(false)
      toast.success('Hujjat muvaffaqiyatli yuklandi')
    }
  }

  const handleDeleteDocument = async (document: any) => {
    if (!confirm('Hujjatni o\'chirmoqchimisiz?')) return

    try {
      const { error } = await deleteFile(STORAGE_BUCKETS.DOCUMENTS, document.path)
      if (error) {
        toast.error('Hujjatni o\'chirishda xatolik')
      } else {
        setDocuments(prev => prev.filter(doc => doc.path !== document.path))
        toast.success('Hujjat o\'chirildi')
      }
    } catch (error) {
      toast.error('Hujjatni o\'chirishda xatolik yuz berdi')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'approved':
        return 'text-green-600 bg-green-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Kutilmoqda'
      case 'approved':
        return 'Tasdiqlangan'
      case 'rejected':
        return 'Rad etilgan'
      default:
        return 'Noma\'lum'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shaxsiy kabinet</h1>
          <p className="text-gray-600 mt-2">Hisobingizni boshqaring va arizalaringizni kuzatib boring</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-gray-100">
                  {profile?.avatar_url || user?.user_metadata?.avatar_url ? (
                    <img
                      src={profile?.avatar_url || user?.user_metadata?.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      <User className="h-12 w-12 text-blue-600" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Foydalanuvchi'}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{profile?.phone || 'Telefon kiritilmagan'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{profile?.address || 'Manzil kiritilmagan'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">
                    A'zo bo'ldi: {new Date(user?.created_at || '').toLocaleDateString('uz-UZ')}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setShowProfileEditor(true)}
                className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Profilni tahrirlash</span>
              </button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg mt-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Statistika</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Jami arizalar</span>
                  <span className="font-semibold text-gray-900">{applications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasdiqlangan</span>
                  <span className="font-semibold text-green-600">
                    {applications.filter((app: any) => app.status === 'approved').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jarayonda</span>
                  <span className="font-semibold text-blue-600">
                    {applications.filter((app: any) => app.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rad etilgan</span>
                  <span className="font-semibold text-red-600">
                    {applications.filter((app: any) => app.status === 'rejected').length}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Applications */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Mening arizalarim</h3>
                <button 
                  onClick={() => window.location.href = '/apply'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Yangi ariza</span>
                </button>
              </div>

              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app: any) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{app.program || 'Ariza'}</h4>
                          <p className="text-gray-600">{app.country}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Sana: {new Date(app.created_at).toLocaleDateString('uz-UZ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                            {getStatusText(app.status)}
                          </span>
                          <button className="block mt-2 text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>Batafsil</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Hali arizalar yo'q</p>
                  <button 
                    onClick={() => window.location.href = '/apply'}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Birinchi arizani topshiring
                  </button>
                </div>
              )}
            </motion.div>

            {/* Documents */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Hujjatlarim</h3>
                <button 
                  onClick={() => setShowDocumentUpload(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Hujjat yuklash</span>
                </button>
              </div>

              {documents.length > 0 ? (
                <div className="space-y-4">
                  {documents.map((doc: any, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-6 w-6 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">{doc.name}</h4>
                          <p className="text-sm text-gray-500">
                            Yuklandi: {new Date(doc.date).toLocaleDateString('uz-UZ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Ko'rish"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                        <a
                          href={doc.url}
                          download
                          className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
                          title="Yuklab olish"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteDocument(doc)}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Hali hujjatlar yuklanmagan</p>
                  <button 
                    onClick={() => setShowDocumentUpload(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Birinchi hujjatni yuklang
                  </button>
                </div>
              )}
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">So'nggi faoliyat</h3>
              <div className="space-y-4">
                {applications.slice(0, 3).map((app: any, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-900">{app.program} uchun ariza topshirildi</p>
                      <p className="text-sm text-gray-500">
                        {new Date(app.created_at).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                ))}
                {documents.slice(0, 2).map((doc: any, index) => (
                  <div key={`doc-${index}`} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-900">Yangi hujjat yuklandi: {doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(doc.date).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                ))}
                {applications.length === 0 && documents.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Hali faoliyat yo'q</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Profile Editor Modal */}
      <AnimatePresence>
        {showProfileEditor && (
          <ProfileEditor
            onClose={() => setShowProfileEditor(false)}
            onSave={handleProfileSave}
          />
        )}
      </AnimatePresence>

      {/* Document Upload Modal */}
      <AnimatePresence>
        {showDocumentUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDocumentUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Hujjat yuklash</h3>
                <button
                  onClick={() => setShowDocumentUpload(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <FileUpload
                label="Hujjat tanlang"
                onFileUploaded={handleDocumentUpload}
                bucket={STORAGE_BUCKETS.DOCUMENTS}
                acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']}
                maxSize={10}
              />

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowDocumentUpload(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Bekor qilish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Profile