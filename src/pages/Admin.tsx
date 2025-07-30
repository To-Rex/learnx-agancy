import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  X
} from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast, { Toaster } from 'react-hot-toast'

const Admin: React.FC = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalUsers: 0,
    totalServices: 0,
    totalStories: 0
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
        totalUsers: usersData?.length || 0,
        totalServices: servicesData?.length || 0,
        totalStories: storiesData?.length || 0
      })

    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Ma\'lumotlarni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Xodimni o\'chirmoqchimisiz?')) return

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', userId)

      if (error) throw error

      setUsers(prev => prev.filter(user => user.id !== userId))
      toast.success('Xodim o\'chirildi')
    } catch (error) {
      toast.error('Xodimni o\'chirishda xatolik')
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: !currentStatus })
        .eq('id', userId)

      if (error) throw error

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_active: !currentStatus } : user
      ))
      
      toast.success(currentStatus ? 'Xodim bloklandi' : 'Xodim faollashtirildi')
    } catch (error) {
      toast.error('Xodim holatini o\'zgartirishda xatolik')
    }
  }

  const handleSaveService = async () => {
    try {
      const serviceData = {
        title: serviceForm.title.uz,
        description: serviceForm.description.uz,
        price: serviceForm.price,
        icon: serviceForm.icon,
        color: serviceForm.color,
        features: serviceForm.features.uz
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
      loadData()
    } catch (error) {
      toast.error('Xizmatni saqlashda xatolik')
    }
  }

  const handleSaveStory = async () => {
    try {
      const storyData = {
        name: storyForm.name,
        country: storyForm.country,
        text: storyForm.text.uz,
        rating: storyForm.rating,
        image: storyForm.image,
        featured: storyForm.featured
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
      loadData()
    } catch (error) {
      toast.error('Hikoyani saqlashda xatolik')
    }
  }

  const handleSavePartner = async () => {
    try {
      const partnerData = {
        name: partnerForm.name.uz,
        logo: partnerForm.logo
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
      loadData()
    } catch (error) {
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
      toast.error('O\'chirishda xatolik')
    }
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'applications', name: 'Arizalar', icon: FileText },
    { id: 'users', name: 'Xodimlar', icon: Users },
    { id: 'services', name: 'Xizmatlar', icon: Settings },
    { id: 'stories', name: 'Hikoyalar', icon: MessageSquare },
    { id: 'partners', name: 'Hamkorlar', icon: Building },
    { id: 'contacts', name: 'Murojatlar', icon: MessageSquare }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Xush kelibsiz, Admin</span>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Saytga qaytish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Jami arizalar</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <FileText className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Kutilayotgan</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Tasdiqlangan</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.approvedApplications}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Xodimlar</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Xodimlar</h2>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Yangi xodim</span>
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yaratilgan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user: any) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{user.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active ? 'Faol' : 'Bloklangan'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString('uz-UZ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                                className={`p-1 rounded ${
                                  user.is_active 
                                    ? 'text-red-600 hover:bg-red-50' 
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={user.is_active ? 'Bloklash' : 'Faollashtirish'}
                              >
                                {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </button>
                              <button
                                className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                                title="Tahrirlash"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:bg-red-50 p-1 rounded"
                                title="O'chirish"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Xizmatlar</h2>
                    <button 
                      onClick={() => setShowServiceModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Yangi xizmat</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service: any) => (
                      <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-900">{service.title}</h3>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => {
                                setEditingItem(service)
                                setServiceForm({
                                  title: { uz: service.title, en: '', ru: '' },
                                  description: { uz: service.description, en: '', ru: '' },
                                  price: service.price,
                                  icon: service.icon,
                                  color: service.color,
                                  features: { uz: service.features || [], en: [], ru: [] }
                                })
                                setShowServiceModal(true)
                              }}
                              className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem('services', service.id)}
                              className="text-red-600 hover:bg-red-50 p-1 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                        <p className="text-blue-600 font-semibold">{service.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stories' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Hikoyalar</h2>
                    <button 
                      onClick={() => setShowStoryModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Yangi hikoya</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map((story: any) => (
                      <div key={story.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{story.name}</h3>
                            <p className="text-sm text-gray-500">{story.country}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {story.featured && <Star className="h-4 w-4 text-yellow-500" />}
                            <button
                              onClick={() => {
                                setEditingItem(story)
                                setStoryForm({
                                  name: story.name,
                                  country: story.country,
                                  text: { uz: story.text, en: '', ru: '' },
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
                        <p className="text-gray-600 text-sm line-clamp-3">{story.text}</p>
                        <div className="flex items-center mt-2">
                          {[...Array(story.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'partners' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Hamkor universitetlar</h2>
                    <button 
                      onClick={() => setShowPartnerModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Yangi hamkor</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partners.map((partner: any) => (
                      <div key={partner.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => {
                                setEditingItem(partner)
                                setPartnerForm({
                                  name: { uz: partner.name, en: '', ru: '' },
                                  description: { uz: '', en: '', ru: '' },
                                  logo: partner.logo,
                                  website: '',
                                  country: '',
                                  established: '',
                                  ranking: ''
                                })
                                setShowPartnerModal(true)
                              }}
                              className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem('partners', partner.id)}
                              className="text-red-600 hover:bg-red-50 p-1 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {partner.logo && (
                          <img 
                            src={partner.logo} 
                            alt={partner.name}
                            className="w-full h-32 object-contain bg-gray-50 rounded mb-2"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs content... */}
          </div>
        </div>
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Xizmatni tahrirlash' : 'Yangi xizmat qo\'shish'}
              </h3>
              <button
                onClick={() => {
                  setShowServiceModal(false)
                  setEditingItem(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomi (O'zbekcha)</label>
                <input
                  type="text"
                  value={serviceForm.title.uz}
                  onChange={(e) => setServiceForm(prev => ({
                    ...prev,
                    title: { ...prev.title, uz: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tavsif (O'zbekcha)</label>
                <textarea
                  value={serviceForm.description.uz}
                  onChange={(e) => setServiceForm(prev => ({
                    ...prev,
                    description: { ...prev.description, uz: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Narx</label>
                  <input
                    type="text"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rang</label>
                  <select
                    value={serviceForm.color}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="blue">Ko'k</option>
                    <option value="green">Yashil</option>
                    <option value="purple">Binafsha</option>
                    <option value="orange">To'q sariq</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSaveService}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Saqlash</span>
                </button>
                <button
                  onClick={() => {
                    setShowServiceModal(false)
                    setEditingItem(null)
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Hikoyani tahrirlash' : 'Yangi hikoya qo\'shish'}
              </h3>
              <button
                onClick={() => {
                  setShowStoryModal(false)
                  setEditingItem(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ism</label>
                  <input
                    type="text"
                    value={storyForm.name}
                    onChange={(e) => setStoryForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Davlat</label>
                  <input
                    type="text"
                    value={storyForm.country}
                    onChange={(e) => setStoryForm(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hikoya matni (O'zbekcha)</label>
                <textarea
                  value={storyForm.text.uz}
                  onChange={(e) => setStoryForm(prev => ({
                    ...prev,
                    text: { ...prev.text, uz: e.target.value }
                  }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reyting</label>
                  <select
                    value={storyForm.rating}
                    onChange={(e) => setStoryForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={5}>5 yulduz</option>
                    <option value={4}>4 yulduz</option>
                    <option value={3}>3 yulduz</option>
                    <option value={2}>2 yulduz</option>
                    <option value={1}>1 yulduz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rasm URL</label>
                  <input
                    type="url"
                    value={storyForm.image}
                    onChange={(e) => setStoryForm(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
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
                  Mashhur hikoya
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSaveStory}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Saqlash</span>
                </button>
                <button
                  onClick={() => {
                    setShowStoryModal(false)
                    setEditingItem(null)
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partner Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Hamkorni tahrirlash' : 'Yangi hamkor qo\'shish'}
              </h3>
              <button
                onClick={() => {
                  setShowPartnerModal(false)
                  setEditingItem(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Universitet nomi (O'zbekcha)</label>
                <input
                  type="text"
                  value={partnerForm.name.uz}
                  onChange={(e) => setPartnerForm(prev => ({
                    ...prev,
                    name: { ...prev.name, uz: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input
                  type="url"
                  value={partnerForm.logo}
                  onChange={(e) => setPartnerForm(prev => ({ ...prev, logo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tavsif (O'zbekcha)</label>
                <textarea
                  value={partnerForm.description.uz}
                  onChange={(e) => setPartnerForm(prev => ({
                    ...prev,
                    description: { ...prev.description, uz: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSavePartner}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Saqlash</span>
                </button>
                <button
                  onClick={() => {
                    setShowPartnerModal(false)
                    setEditingItem(null)
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin