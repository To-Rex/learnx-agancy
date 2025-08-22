import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, FileText, CheckCircle, Edit, Upload, Download, Eye, Trash2, Plus, CreditCard, CreditCardIcon, IdCard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getFileUrl, deleteFile, STORAGE_BUCKETS } from '../lib/storage';
import ProfileEditor from '../components/ProfileEditor';
import FileUpload from '../components/FileUpload';
import toast from 'react-hot-toast';

<X className="h-6 w-6" />
interface Application {
  id: string;
  status: string;
  created_at: string;
  program_type?: string;
  country_preference?: string;
}
const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showOtherDocuments, setShowOtherDocuments] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const requiredDocumentTypes = [
    { key: 'passport', label: 'Pasport nusxasi', required: true },
    { key: 'photo', label: 'Foto 3x4', required: true },
    { key: 'diploma', label: 'Diplom/Attestat', required: true },
    { key: 'transcript', label: 'Akademik ma\'lumotnoma', required: false },
    { key: 'cv', label: 'CV/Resume', required: false },
    { key: 'motivation', label: 'Motivatsiya xati', required: false },
  ];

  useEffect(() => {
    if (user) {
      setAuthLoading(false);
    } 
  }, [user]);
  const apiToken = localStorage.getItem('api_access_token');
  const clientId = localStorage.getItem('client_id');
  const getProfile = async () => {
    setLoading(true);
    try {
      console.log('So‘rov yuborilmoqda:', {
        url: `https://learnx-crm-production.up.railway.app/api/v1/clients/get/${clientId}`,
        token: apiToken,
        clientId: clientId,
      });

      const response = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/clients/get/${clientId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('API xato javobi:', errorData);
        throw new Error(`Profil API xatosi: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const apiProfile = await response.json();
      console.log('API Profil Javobi:', apiProfile);

      setProfile({
        full_name: apiProfile.full_name || '',
        phone: apiProfile.phone || '',
        email: apiProfile.email || '',
        passport_number: apiProfile.passport_number || '',
        avatar_url: apiProfile.avatar_url || null,
        visa_type: apiProfile.visa_type || '',
        direction: apiProfile.direction || '',
        created_at: apiProfile.created_at || null,
      });

      toast.success('Profil ma\'lumotlari muvaffaqiyatli yuklandi');
    } catch (error) {
      console.error('Profil yuklashda xatolik:', error.message);
      toast.error(`Ma'lumotlarni yuklashda xatolik: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const handleProfileSave = (profileData: any) => {
    setProfile(profileData);
    setShowProfileEditor(false);
    getProfile(); // Yangi ma'lumotlarni qayta yuklash
  };


  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);



  function getStatusColor(status: string) {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case "approved":
        return "Tasdiqlangan";
      case "pending":
        return "Jarayonda";
      case "rejected":
        return "Rad etilgan";
      default:
        return "Qoralama";
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authLoading ? 'Tizimga kirilmoqda...' : 'Ma\'lumotlar yuklanmoqda...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tizimga kiring</h2>
          <p className="text-gray-600 mb-6">Profil sahifasini ko'rish uchun tizimga kirishingiz kerak</p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kirish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shaxsiy kabinet</h1>
          <p className="text-gray-600 mt-2">Hisobingizni boshqaring va arizalaringizni kuzatib boring</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-gray-100">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                      {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
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
                  <IdCard className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{profile?.passport_number || 'Manzil kiritilmagan'}</span>
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
                    {applications.filter((app) => app.status === "approved").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jarayonda</span>
                  <span className="font-semibold text-blue-600">
                    {applications.filter((app) => app.status === "pending").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rad etilgan</span>
                  <span className="font-semibold text-red-600">
                    {applications.filter((app) => app.status === "rejected").length}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Mening arizalarim</h3>
                <Link
                  to="/apply"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Yangi ariza</span>
                </Link>
              </div>

              {loading ? (
                <p>Yuklanmoqda...</p>
              ) : applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg mb-1">
                            {app.program_type?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Ariza'}
                          </h4>
                          <p className="text-gray-600 mb-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {app.country_preference || '---'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            {new Date(app.created_at).toLocaleDateString('uz-UZ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                            {getStatusText(app.status)}
                          </span>
                          <button className="block mt-3 text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
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
                  <Link
                    to="/apply"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Birinchi arizani topshiring
                  </Link>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Hujjatlarim</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedDocumentType("required");
                      setShowDocumentUpload(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Kerakli hujjat</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDocumentType("other");
                      setShowDocumentUpload(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Boshqa hujjat</span>
                  </button>
                </div>
              </div>

              {showDocumentUpload && (
                <div className="mb-6">
                  <input
                    type="file"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  {uploading && <p className="text-blue-600 text-sm mt-2">Yuklanmoqda...</p>}
                </div>
              )}

              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  Kerakli hujjatlar
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requiredDocumentTypes.map((docType) => {
                    const userDoc = documents.find((doc) =>
                      doc.document_type === docType.key
                    );
                    return (
                      <div
                        key={docType.key}
                        className={`p-4 border-2 border-dashed rounded-lg ${userDoc ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">{docType.label}</h5>
                            <p className="text-sm text-gray-500">
                              {docType.required ? "Majburiy" : "Ixtiyoriy"}
                            </p>
                          </div>
                          {userDoc ? (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="text-sm text-green-600">Yuklangan</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedDocumentType(docType.key);
                                setShowDocumentUpload(true);
                              }}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Yuklash
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 text-gray-600 mr-2" />
                    Boshqa hujjatlar
                  </h4>
                  <button
                    onClick={() => setShowOtherDocuments(!showOtherDocuments)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {showOtherDocuments ? "Yashirish" : "Ko'rish"}
                  </button>
                </div>

                {showOtherDocuments && (
                  <div className="space-y-4">
                    {documents.filter((doc) => doc.document_type === "other").length > 0 ? (
                      documents
                        .filter((doc) => doc.document_type === "other")
                        .map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="h-6 w-6 text-gray-400" />
                              <div>
                                <h4 className="font-medium text-gray-900">{doc.file_url.split("/").pop()}</h4>
                                <p className="text-sm text-gray-500">
                                  Yuklandi: {new Date(doc.uploaded_at).toLocaleDateString("uz-UZ")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                title="Ko'rish"
                              >
                                <Eye className="h-4 w-4" />
                              </a>
                              <a
                                href={doc.file_url}
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
                        ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">Boshqa hujjatlar yo'q</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">So'nggi faoliyat</h3>
              <div className="space-y-4">
                {applications.map((app: any, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-900">{app.program_type} uchun ariza topshirildi</p>
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

        <AnimatePresence>
          {showProfileEditor && (
            <ProfileEditor
              profile={profile || {}}
              onSave={handleProfileSave}
              onClose={() => setShowProfileEditor(false)}
            />
          )}
        </AnimatePresence>

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
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedDocumentType === 'required' ? 'Kerakli hujjat yuklash' :
                      selectedDocumentType === 'other' ? 'Boshqa hujjat yuklash' :
                        'Hujjat yuklash'}
                  </h3>
                  <button
                    onClick={() => setShowDocumentUpload(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {selectedDocumentType === 'required' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hujjat turi
                    </label>
                    <select
                      value={selectedDocumentType}
                      onChange={(e) => setSelectedDocumentType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Tanlang</option>
                      {requiredDocumentTypes.map((type) => (
                        <option key={type.key} value={type.key}>
                          {type.label} {type.required ? '(Majburiy)' : '(Ixtiyoriy)'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedDocumentType && selectedDocumentType !== 'required' && (
                  <FileUpload
                    label={selectedDocumentType === 'other' ? 'Har qanday hujjat tanlang' :
                      requiredDocumentTypes.find(t => t.key === selectedDocumentType)?.label || 'Hujjat tanlang'}
                    onFileUploaded={(filePath, fileName) => {
                      const prefixedPath = selectedDocumentType !== 'other' ?
                        filePath.replace(fileName, `${selectedDocumentType}-${fileName}`) : filePath;
                      handleDocumentUpload(prefixedPath, fileName);
                    }}
                    bucket={STORAGE_BUCKETS.DOCUMENTS}
                    acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']}
                    maxSize={10}
                  />
                )}

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
    </div>
  );
};

export default Profile;