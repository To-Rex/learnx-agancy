import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Star,
  Globe,
  Building,
  Award,
  UserCheck,
  UserX,
  Save,
  X,
  Home,
  TrendingUp
} from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import { 
  AdminCard, 
  AdminButton, 
  AdminInput, 
  AdminTextarea, 
  AdminSelect, 
  AdminModal, 
  AdminTable, 
  StatsCard,
  LanguageTabs
} from '../components/AdminComponents'

const Admin: React.FC = () => {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalUsers: 0,
    totalServices: 0,
    totalStories: 0,
    totalPartners: 0
  })

  // Data states
  const [applications, setApplications] = useState([])
  const [users, setUsers] = useState([])
  const [services, setServices] = useState([])
  const [stories, setStories] = useState([])
  const [partners, setPartners] = useState([])
  const [contacts, setContacts] = useState([])

  // Modal states
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showStoryModal, setShowStoryModal] = useState(false)
  const [showPartnerModal, setShowPartnerModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeLanguage, setActiveLanguage] = useState('uz')

  // Form states
  const [serviceForm, setServiceForm] = useState({
    title: { uz: '', en: '', ru: '' },
    description: { uz: '', en: '', ru: '' },
    price: '',
    icon: 'FileText',
    color: 'blue',
    features: { uz: [], en: [], ru: [] }
  })

  const [storyForm, setStoryForm] = useState({
    name: '',
    country: '',
    text: { uz: '', en: '', ru: '' },
    rating: 5,
    image: '',
    featured: false
  })

  const [partnerForm, setPartnerForm] = useState({
    name: { uz: '', en: '', ru: '' },
    description: { uz: '', en: '', ru: '' },
    logo: '',
    website: '',
    country: '',
    established: '',
    ranking: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load applications
      const { data: applicationsData } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (applicationsData) setApplications(applicationsData)

      // Load services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (servicesData) setServices(servicesData)

      // Load stories
      const { data: storiesData } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (storiesData) setStories(storiesData)

      // Load partners
      const { data: partnersData } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (partnersData) setPartners(partnersData)

      // Load contacts
      const { data: contactsData } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (contactsData) setContacts(contactsData)

      // Load admin users
      const { data: usersData } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (usersData) setUsers(usersData)

      // Calculate stats
      setStats({
        totalApplications: applicationsData?.length || 0,
        pendingApplications: applicationsData?.filter(app => app.status === 'pending').length || 0,
        approvedApplications: applicationsData?.filter(app => app.status === 'approved').length || 0,
        totalUsers: applicationsData?.length || 0, // Unique users from applications
        totalServices: servicesData?.length || 0,
        totalStories: storiesData?.length || 0,
        totalPartners: partnersData?.length || 0
      })

    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Ma\'lumotlarni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveService = async () => {
    try {
      const serviceData = {
        title: serviceForm.title[activeLanguage],
        description: serviceForm.description[activeLanguage],
        price: serviceForm.price,
        icon: serviceForm.icon,
        color: serviceForm.color,
        features: serviceForm.features[activeLanguage],
        title_translations: serviceForm.title,
        description_translations: serviceForm.description,
        features_translations: serviceForm.features
      }

      if (editingItem) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingItem.id)
        
        if (error) throw error
        toast.success('Xizmat yangilandi')
      } else {
        const { error } = await supabase
          .from('services')
          .insert(serviceData)
        
        if (error) throw error
        toast.success('Yangi xizmat qo\'shildi')
      }

      setShowServiceModal(false)
      setEditingItem(null)
      resetServiceForm()
      loadData()
    } catch (error) {
      console.error('Service save error:', error)
      toast.error('Xizmatni saqlashda xatolik')
    }
  }

  const handleSaveStory = async () => {
    try {
      const storyData = {
        name: storyForm.name,
        country: storyForm.country,
        text: storyForm.text[activeLanguage],
        rating: storyForm.rating,
        image: storyForm.image,
        featured: storyForm.featured,
        text_translations: storyForm.text
      }

      if (editingItem) {
        const { error } = await supabase
          .from('stories')
          .update(storyData)
          .eq('id', editingItem.id)
        
        if (error) throw error
        toast.success('Hikoya yangilandi')
      } else {
        const { error } = await supabase
          .from('stories')
          .insert(storyData)
        
        if (error) throw error
        toast.success('Yangi hikoya qo\'shildi')
      }

      setShowStoryModal(false)
      setEditingItem(null)
      resetStoryForm()
      loadData()
    } catch (error) {
      console.error('Story save error:', error)
      toast.error('Hikoyani saqlashda xatolik')
    }
  }

  const handleSavePartner = async () => {
    try {
      const partnerData = {
        name: partnerForm.name[activeLanguage],
        description: partnerForm.description[activeLanguage],
        logo: partnerForm.logo,
        website: partnerForm.website,
        country: partnerForm.country,
        established: partnerForm.established,
        ranking: partnerForm.ranking,
        name_translations: partnerForm.name,
        description_translations: partnerForm.description
      }

      if (editingItem) {
        const { error } = await supabase
          .from('partners')
          .update(partnerData)
          .eq('id', editingItem.id)
        
        if (error) throw error
        toast.success('Hamkor yangilandi')
      } else {
        const { error } = await supabase
          .from('partners')
          .insert(partnerData)
        
        if (error) throw error
        toast.success('Yangi hamkor qo\'shildi')
      }

      setShowPartnerModal(false)
      setEditingItem(null)
      resetPartnerForm()
      loadData()
    } catch (error) {
      console.error('Partner save error:', error)
      toast.error('Hamkorni saqlashda xatolik')
    }
  }

  const handleDeleteItem = async (table: string, id: string) => {
    if (!confirm('O\'chirmoqchimisiz?')) return

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('O\'chirildi')
      loadData()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('O\'chirishda xatolik')
    }
  }

  const resetServiceForm = () => {
    setServiceForm({
      title: { uz: '', en: '', ru: '' },
      description: { uz: '', en: '', ru: '' },
      price: '',
      icon: 'FileText',
      color: 'blue',
      features: { uz: [], en: [], ru: [] }
    })
  }

  const resetStoryForm = () => {
    setStoryForm({
      name: '',
      country: '',
      text: { uz: '', en: '', ru: '' },
      rating: 5,
      image: '',
      featured: false
    })
  }

  const resetPartnerForm = () => {
    setPartnerForm({
      name: { uz: '', en: '', ru: '' },
      description: { uz: '', en: '', ru: '' },
      logo: '',
      website: '',
      country: '',
      established: '',
      ranking: ''
    })
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const tabs = [
    { id: 'dashboard', name: t('admin.dashboard'), icon: BarChart3 },
    { id: 'applications', name: t('admin.applications'), icon: FileText },
    { id: 'services', name: t('admin.services'), icon: Settings },
    { id: 'stories', name: t('admin.stories'), icon: MessageSquare },
    { id: 'partners', name: t('admin.partners'), icon: Building },
    { id: 'contacts', name: t('admin.contacts'), icon: MessageSquare }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-600">LearnX boshqaruv paneli</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Xush kelibsiz, Admin</span>
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Saytga qaytish</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <AdminCard className="p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </AdminCard>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard
                    title={t('admin.stats.totalApplications')}
                    value={stats.totalApplications}
                    icon={FileText}
                    color="blue"
                    trend={t('admin.stats.monthlyGrowth')}
                  />
                  <StatsCard
                    title={t('admin.stats.pending')}
                    value={stats.pendingApplications}
                    icon={FileText}
                    color="yellow"
                  />
                  <StatsCard
                    title={t('admin.stats.approved')}
                    value={stats.approvedApplications}
                    icon={FileText}
                    color="green"
                    trend={t('admin.stats.weeklyGrowth')}
                  />
                  <StatsCard
                    title={t('admin.stats.partners')}
                    value={stats.totalPartners}
                    icon={Building}
                    color="purple"
                  />
                </div>

                {/* Recent Activity */}
                <AdminCard className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t('admin.recentActivity')}</h3>
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((app: any) => (
                      <div key={app.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{app.full_name}</p>
                          <p className="text-sm text-gray-600">{app.program_type} - {app.country_preference}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.status === 'pending' ? t('admin.status.pending') :
                           app.status === 'approved' ? t('admin.status.approved') : t('admin.status.rejected')}
                        </span>
                      </div>
                    ))}
                  </div>
                </AdminCard>
              </div>
            )}

            {activeTab === 'applications' && (
              <AdminCard>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">{t('admin.applications')}</h2>
                    <div className="flex items-center space-x-3">
                      <AdminButton variant="secondary" icon={Search} size="sm">{t('common.search')}</AdminButton>
                      <AdminButton variant="secondary" icon={Filter} size="sm">{t('common.filter')}</AdminButton>
                      <AdminButton variant="secondary" icon={Download} size="sm">{t('common.download')}</AdminButton>
                    </div>
                  </div>
                </div>
                
                <AdminTable headers={[t('common.name'), t('common.email'), t('admin.program'), t('admin.country'), t('admin.status'), t('common.date'), t('admin.actions')]}>
                  {applications.map((app: any) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{app.full_name}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{app.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {app.program_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{app.country_preference}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.status === 'pending' ? t('admin.status.pending') :
                           app.status === 'approved' ? t('admin.status.approved') : t('admin.status.rejected')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(app.created_at).toLocaleDateString('uz-UZ')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:bg-green-50 p-2 rounded-lg">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </AdminTable>
              </AdminCard>
            )}

            {activeTab === 'services' && (
              <AdminCard>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">{t('admin.services')}</h2>
                    <AdminButton 
                      onClick={() => {
                        resetServiceForm()
                        setShowServiceModal(true)
                      }}
                      icon={Plus}
                    >
                      {t('admin.addService')}
                    </AdminButton>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service: any) => (
                      <div key={service.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-gray-900 text-lg">{service.title}</h3>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingItem(service)
                                setServiceForm({
                                  title: service.title_translations || { uz: service.title, en: '', ru: '' },
                                  description: service.description_translations || { uz: service.description, en: '', ru: '' },
                                  price: service.price,
                                  icon: service.icon,
                                  color: service.color,
                                  features: service.features_translations || { uz: service.features || [], en: [], ru: [] }
                                })
                                setShowServiceModal(true)
                              }}
                              className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem('services', service.id)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${service.color}-100 text-${service.color}-800`}>
                            {service.color}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AdminCard>
            )}

            {activeTab === 'stories' && (
              <AdminCard>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">{t('admin.stories')}</h2>
                    <AdminButton 
                      onClick={() => {
                        resetStoryForm()
                        setShowStoryModal(true)
                      }}
                      icon={Plus}
                    >
                      {t('admin.addStory')}
                    </AdminButton>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map((story: any) => (
                      <div key={story.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        {story.image && (
                          <img 
                            src={story.image} 
                            alt={story.name}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-gray-900">{story.name}</h3>
                              <p className="text-sm text-gray-500">{story.country}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {story.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                              <button
                                onClick={() => {
                                  setEditingItem(story)
                                  setStoryForm({
                                    name: story.name,
                                    country: story.country,
                                    text: story.text_translations || { uz: story.text, en: '', ru: '' },
                                    rating: story.rating,
                                    image: story.image,
                                    featured: story.featured
                                  })
                                  setShowStoryModal(true)
                                }}
                                className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem('stories', story.id)}
                                className="text-red-600 hover:bg-red-50 p-1 rounded"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-3 mb-3">{story.text}</p>
                          <div className="flex items-center">
                            {[...Array(story.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AdminCard>
            )}

            {activeTab === 'partners' && (
              <AdminCard>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">{t('admin.partners')}</h2>
                    <AdminButton 
                      onClick={() => {
                        resetPartnerForm()
                        setShowPartnerModal(true)
                      }}
                      icon={Plus}
                    >
                      {t('admin.addPartner')}
                    </AdminButton>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partners.map((partner: any) => (
                      <div key={partner.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-gray-900 text-lg">{partner.name}</h3>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingItem(partner)
                                setPartnerForm({
                                  name: partner.name_translations || { uz: partner.name, en: '', ru: '' },
                                  description: partner.description_translations || { uz: partner.description || '', en: '', ru: '' },
                                  logo: partner.logo,
                                  website: partner.website || '',
                                  country: partner.country || '',
                                  established: partner.established || '',
                                  ranking: partner.ranking || ''
                                })
                                setShowPartnerModal(true)
                              }}
                              className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem('partners', partner.id)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {partner.logo && (
                          <img 
                            src={partner.logo} 
                            alt={partner.name}
                            className="w-full h-32 object-contain bg-gray-50 rounded-lg mb-4"
                          />
                        )}
                        {partner.description && (
                          <p className="text-gray-600 text-sm mb-3">{partner.description}</p>
                        )}
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{partner.country}</span>
                          {partner.ranking && <span>#{partner.ranking}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AdminCard>
            )}

            {activeTab === 'contacts' && (
              <AdminCard>
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">{t('admin.contacts')}</h2>
                </div>
                
                <AdminTable headers={[t('common.name'), t('common.email'), t('common.phone'), t('common.message'), t('common.date'), t('admin.actions')]}>
                  {contacts.map((contact: any) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{contact.name}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{contact.email}</td>
                      <td className="px-6 py-4 text-gray-600">{contact.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate text-gray-600">{contact.message}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(contact.created_at).toLocaleDateString('uz-UZ')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem('contact_submissions', contact.id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </AdminTable>
              </AdminCard>
            )}
          </div>
        </div>
      </div>

      {/* Service Modal */}
      <AdminModal
        isOpen={showServiceModal}
        onClose={() => {
          setShowServiceModal(false)
          setEditingItem(null)
        }}
        title={editingItem ? 'Xizmatni tahrirlash' : 'Yangi xizmat qo\'shish'}
      >
        <LanguageTabs 
          activeLanguage={activeLanguage}
          onLanguageChange={setActiveLanguage}
        />
        
        <div className="space-y-6">
          <AdminInput
            label={t('admin.form.name')}
            value={serviceForm.title[activeLanguage]}
            onChange={(value) => setServiceForm(prev => ({
              ...prev,
              title: { ...prev.title, [activeLanguage]: value }
            }))}
            required
          />

          <AdminTextarea
            label={t('admin.form.description')}
            value={serviceForm.description[activeLanguage]}
            onChange={(value) => setServiceForm(prev => ({
              ...prev,
              description: { ...prev.description, [activeLanguage]: value }
            }))}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <AdminInput
              label={t('admin.form.price')}
              value={serviceForm.price}
              onChange={(value) => setServiceForm(prev => ({ ...prev, price: value }))}
              required
            />

            <AdminSelect
              label={t('admin.form.color')}
              value={serviceForm.color}
              onChange={(value) => setServiceForm(prev => ({ ...prev, color: value }))}
              options={[
                { value: 'blue', label: 'Ko\'k' },
                { value: 'green', label: 'Yashil' },
                { value: 'purple', label: 'Binafsha' },
                { value: 'orange', label: 'To\'q sariq' }
              ]}
              required
            />
          </div>

          <div className="flex space-x-4">
            <AdminButton onClick={handleSaveService} icon={Save}>
              {t('common.save')}
            </AdminButton>
            <AdminButton 
              variant="secondary" 
              onClick={() => {
                setShowServiceModal(false)
                setEditingItem(null)
              }}
            >
              {t('common.cancel')}
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Story Modal */}
      <AdminModal
        isOpen={showStoryModal}
        onClose={() => {
          setShowStoryModal(false)
          setEditingItem(null)
        }}
        title={editingItem ? 'Hikoyani tahrirlash' : 'Yangi hikoya qo\'shish'}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <AdminInput
              label={t('common.name')}
              value={storyForm.name}
              onChange={(value) => setStoryForm(prev => ({ ...prev, name: value }))}
              required
            />

            <AdminInput
              label={t('admin.form.country')}
              value={storyForm.country}
              onChange={(value) => setStoryForm(prev => ({ ...prev, country: value }))}
              required
            />
          </div>

          <LanguageTabs 
            activeLanguage={activeLanguage}
            onLanguageChange={setActiveLanguage}
          />

          <AdminTextarea
            label={t('admin.form.storyText')}
            value={storyForm.text[activeLanguage]}
            onChange={(value) => setStoryForm(prev => ({
              ...prev,
              text: { ...prev.text, [activeLanguage]: value }
            }))}
            rows={6}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <AdminSelect
              label={t('admin.form.rating')}
              value={storyForm.rating.toString()}
              onChange={(value) => setStoryForm(prev => ({ ...prev, rating: parseInt(value) }))}
              options={[
                { value: '5', label: '5 yulduz' },
                { value: '4', label: '4 yulduz' },
                { value: '3', label: '3 yulduz' },
                { value: '2', label: '2 yulduz' },
                { value: '1', label: '1 yulduz' }
              ]}
              required
            />

            <AdminInput
              label={t('admin.form.imageUrl')}
              value={storyForm.image}
              onChange={(value) => setStoryForm(prev => ({ ...prev, image: value }))}
              type="url"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={storyForm.featured}
              onChange={(e) => setStoryForm(prev => ({ ...prev, featured: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              {t('admin.form.featured')}
            </label>
          </div>

          <div className="flex space-x-4">
            <AdminButton onClick={handleSaveStory} icon={Save}>
              {t('common.save')}
            </AdminButton>
            <AdminButton 
              variant="secondary" 
              onClick={() => {
                setShowStoryModal(false)
                setEditingItem(null)
              }}
            >
              {t('common.cancel')}
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Partner Modal */}
      <AdminModal
        isOpen={showPartnerModal}
        onClose={() => {
          setShowPartnerModal(false)
          setEditingItem(null)
        }}
        title={editingItem ? 'Hamkorni tahrirlash' : 'Yangi hamkor qo\'shish'}
      >
        <LanguageTabs 
          activeLanguage={activeLanguage}
          onLanguageChange={setActiveLanguage}
        />
        
        <div className="space-y-6">
          <AdminInput
            label={t('admin.form.universityName')}
            value={partnerForm.name[activeLanguage]}
            onChange={(value) => setPartnerForm(prev => ({
              ...prev,
              name: { ...prev.name, [activeLanguage]: value }
            }))}
            required
          />

          <AdminTextarea
            label={t('admin.form.description')}
            value={partnerForm.description[activeLanguage]}
            onChange={(value) => setPartnerForm(prev => ({
              ...prev,
              description: { ...prev.description, [activeLanguage]: value }
            }))}
          />

          <AdminInput
            label={t('admin.form.logoUrl')}
            value={partnerForm.logo}
            onChange={(value) => setPartnerForm(prev => ({ ...prev, logo: value }))}
            type="url"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <AdminInput
              label={t('admin.form.website')}
              value={partnerForm.website}
              onChange={(value) => setPartnerForm(prev => ({ ...prev, website: value }))}
              type="url"
            />

            <AdminInput
              label={t('admin.form.country')}
              value={partnerForm.country}
              onChange={(value) => setPartnerForm(prev => ({ ...prev, country: value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AdminInput
              label={t('admin.form.established')}
              value={partnerForm.established}
              onChange={(value) => setPartnerForm(prev => ({ ...prev, established: value }))}
              type="number"
            />

            <AdminInput
              label={t('admin.form.ranking')}
              value={partnerForm.ranking}
              onChange={(value) => setPartnerForm(prev => ({ ...prev, ranking: value }))}
              type="number"
            />
          </div>

          <div className="flex space-x-4">
            <AdminButton onClick={handleSavePartner} icon={Save}>
              {t('common.save')}
            </AdminButton>
            <AdminButton 
              variant="secondary" 
              onClick={() => {
                setShowPartnerModal(false)
                setEditingItem(null)
              }}
            >
              {t('common.cancel')}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>
  )
}

export default Admin