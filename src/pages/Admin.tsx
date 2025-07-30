import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, FileText, MessageSquare, Settings, BarChart3, Plus, Edit, Trash2, Eye, LogOut, UserPlus, Shield, Crown, Briefcase, Search, Filter, Download, Upload, CheckCircle, XCircle, Clock, AlertTriangle, Lock, Unlock, Key, Star, Globe, Award, TrendingUp, Calendar, Mail, Phone, MapPin, Save, X, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

interface AdminUser {
  id: string
  username: string
  role: 'super_admin' | 'admin' | 'manager' | 'sales'
  is_active: boolean
  created_at: string
}

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null)
  const [applications, setApplications] = useState([])
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [userFilter, setUserFilter] = useState('all')
  const [profiles, setProfiles] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [services, setServices] = useState([])
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [showCreateService, setShowCreateService] = useState(false)
  const [showEditService, setShowEditService] = useState(false)
  const [showCreateStory, setShowCreateStory] = useState(false)
  const [showEditStory, setShowEditStory] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedStory, setSelectedStory] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showUserModal, setShowUserModal] = useState(false)
  
  const navigate = useNavigate()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, userSearchTerm, userFilter])

  const checkAdminAuth = () => {
    const adminData = localStorage.getItem('admin_user')
    if (!adminData) {
      navigate('/admin')
      return
    }
    
    const admin = JSON.parse(adminData)
    setCurrentAdmin(admin)
    loadData()
  }

  const loadUsers = async () => {
    try {
      // Get authenticated users from Supabase Auth
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        console.error('Error loading auth users:', authError)
        // Fallback to empty array if auth admin access is not available
        setUsers([])
        return
      }

      if (!authUsers) {
        setUsers([])
        return
      }

      // Get profiles for all users
      const userIds = authUsers.map(user => user.id)
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds)

      // Get applications count for each user
      const { data: applicationsData } = await supabase
        .from('applications')
        .select('user_id')
        .in('user_id', userIds)

      const applicationsCount = applicationsData?.reduce((acc: any, app: any) => {
        acc[app.user_id] = (acc[app.user_id] || 0) + 1
        return acc
      }, {}) || {}

      // Combine auth users with profiles and applications count
      const usersWithStats = authUsers.map((authUser: any) => {
        const profile = profilesData?.find(p => p.id === authUser.id)
        return {
          id: authUser.id,
          email: authUser.email,
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at,
          email_confirmed_at: authUser.email_confirmed_at,
          phone: authUser.phone,
          // Profile data
          full_name: profile?.full_name || authUser.user_metadata?.full_name || '',
          avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url || '',
          phone_profile: profile?.phone || '',
          address: profile?.address || '',
          birth_date: profile?.birth_date || '',
          bio: profile?.bio || '',
          // Stats
          applications_count: applicationsCount[authUser.id] || 0,
          is_active: authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : false,
          // Provider info
          providers: authUser.app_metadata?.providers || ['email'],
          is_google_user: authUser.app_metadata?.providers?.includes('google') || false
        }
      })

      setUsers(usersWithStats)
    } catch (error) {
      console.error('Error loading users:', error)
      setUsers([])
    }
  }

  const loadData = async () => {
    try {
      // Load applications
      const { data: appsData } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (appsData) setApplications(appsData)

      // Load users from profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          applications(count)
        `)
        .order('created_at', { ascending: false })

      if (profilesError) {
        console.error('Profiles error:', profilesError)
        // Fallback: load profiles without applications count
        const { data: fallbackProfiles } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (fallbackProfiles) {
          const usersWithCounts = fallbackProfiles.map(profile => ({
            ...profile,
            email: profile.id, // Use ID as fallback for email
            applications_count: 0,
            provider: 'email',
            last_sign_in: profile.updated_at
          }))
          setUsers(usersWithCounts)
        }
      } else if (profilesData) {
        const usersWithCounts = profilesData.map(profile => ({
          ...profile,
          email: profile.id, // Use ID as fallback for email
          applications_count: profile.applications?.[0]?.count || 0,
          provider: 'email',
          last_sign_in: profile.updated_at
        }))
        setUsers(usersWithCounts)
      }

      // Load applications
      const { data: applicationsData, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (!appsError && applicationsData) {
        setApplications(applicationsData)
      }

      // Fetch profiles separately
      const { data: profiles, error: profilesError2 } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError2) throw profilesError2

      // Fetch applications count for each user
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select('user_id')

      if (applicationsError) throw applicationsError

      // Count applications per user
      const applicationCounts = applications?.reduce((acc: any, app: any) => {
        acc[app.user_id] = (acc[app.user_id] || 0) + 1
        return acc
      }, {}) || {}

      // Transform profiles to match expected user format
      const transformedUsers = profiles?.map((profile: any) => ({
        id: profile.id,
        email: profile.email || 'Kiritilmagan',
        user_metadata: {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url
        },
        app_metadata: {
          provider: 'email'
        },
        email_confirmed_at: profile.created_at,
        last_sign_in_at: profile.updated_at,
        created_at: profile.created_at,
        applications_count: applicationCounts[profile.id] || 0
      })) || []

      setUsers(transformedUsers)
      
      if (profiles) setProfiles(profiles)

      // Load admin users
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (adminData) setAdminUsers(adminData)

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

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Filter by search term
    if (userSearchTerm) {
      filtered = filtered.filter(user => 
        user.full_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(userSearchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (userFilter !== 'all') {
      filtered = filtered.filter(user => {
        switch (userFilter) {
          case 'active':
            return user.applications_count > 0
          case 'inactive':
            return user.applications_count === 0
          case 'recent':
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
            return new Date(user.created_at) > oneWeekAgo
          default:
            return true
        }
      })
    }

    setFilteredUsers(filtered)
  }

  const handleUserAction = async (userId: string, action: string) => {
    try {
      if (action === 'view') {
        const user = users.find(u => u.id === userId)
        setSelectedUser(user)
        setShowUserModal(true)
      } else if (action === 'delete') {
        if (confirm('Foydalanuvchini o\'chirmoqchimisiz?')) {
          const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId)

          if (error) throw error
          
          toast.success('Foydalanuvchi o\'chirildi')
          loadData()
        }
      }
    } catch (error) {
      toast.error('Xatolik yuz berdi')
      console.error('User action error:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_user')
    toast.success('Tizimdan chiqdingiz')
    navigate('/admin')
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, roles: ['super_admin', 'admin', 'manager', 'sales'] },
    { id: 'applications', name: 'Arizalar', icon: FileText, roles: ['super_admin', 'admin', 'manager'] },
    { id: 'users', name: 'Foydalanuvchilar', icon: Users, roles: ['super_admin', 'admin', 'manager'] },
    { id: 'staff', name: 'Xodimlar', icon: Shield, roles: ['super_admin'] },
    { id: 'services', name: 'Xizmatlar', icon: Settings, roles: ['super_admin', 'admin'] },
    { id: 'stories', name: 'Hikoyalar', icon: MessageSquare, roles: ['super_admin', 'admin'] }
  ]

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-4 w-4 text-yellow-500" />
      case 'admin': return <Shield className="h-4 w-4 text-blue-500" />
      case 'manager': return <Briefcase className="h-4 w-4 text-green-500" />
      case 'sales': return <Users className="h-4 w-4 text-purple-500" />
      default: return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Bosh Admin'
      case 'admin': return 'Admin'
      case 'manager': return 'Manager'
      case 'sales': return 'Sotuvchi'
      default: return 'Noma\'lum'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Kutilmoqda'
      case 'approved': return 'Tasdiqlangan'
      case 'rejected': return 'Rad etilgan'
      default: return 'Noma\'lum'
    }
  }

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      setApplications(prev => 
        prev.map((app: any) => 
          app.id === id ? { ...app, status } : app
        )
      )
      
      toast.success('Status yangilandi')
    } catch (error) {
      toast.error('Xatolik yuz berdi')
    }
  }

  const toggleAdminStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: !isActive })
        .eq('id', id)

      if (error) throw error

      setAdminUsers(prev => 
        prev.map((admin: any) => 
          admin.id === id ? { ...admin, is_active: !isActive } : admin
        )
      )
      
      toast.success(isActive ? 'Xodim bloklandi' : 'Xodim aktivlashtirildi')
    } catch (error) {
      toast.error('Xatolik yuz berdi')
    }
  }

  const deleteAdmin = async (id: string) => {
    if (!confirm('Xodimni o\'chirmoqchimisiz?')) return

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id)

      if (error) throw error

      setAdminUsers(prev => prev.filter((admin: any) => admin.id !== id))
      toast.success('Xodim o\'chirildi')
    } catch (error) {
      toast.error('Xatolik yuz berdi')
    }
  }

  const deleteService = async (id: string) => {
    if (!confirm('Xizmatni o\'chirmoqchimisiz?')) return

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error

      setServices(prev => prev.filter((service: any) => service.id !== id))
      toast.success('Xizmat o\'chirildi')
    } catch (error) {
      toast.error('Xatolik yuz berdi')
    }
  }

  const deleteStory = async (id: string) => {
    if (!confirm('Hikoyani o\'chirmoqchimisiz?')) return

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id)

      if (error) throw error

      setStories(prev => prev.filter((story: any) => story.id !== id))
      toast.success('Hikoya o\'chirildi')
    } catch (error) {
      toast.error('Xatolik yuz berdi')
    }
  }

  // Calculate accurate statistics
  const todayApplications = applications.filter((app: any) => 
    new Date(app.created_at).toDateString() === new Date().toDateString()
  ).length

  const thisWeekApplications = applications.filter((app: any) => {
    const appDate = new Date(app.created_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return appDate >= weekAgo
  }).length

  const thisMonthApplications = applications.filter((app: any) => {
    const appDate = new Date(app.created_at)
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    return appDate >= monthAgo
  }).length

  const successRate = applications.length > 0 
    ? Math.round((applications.filter((app: any) => app.status === 'approved').length / applications.length) * 100)
    : 0

  const stats = [
    { 
      title: 'Jami arizalar', 
      value: applications.length, 
      color: 'blue',
      icon: FileText,
      change: `+${thisWeekApplications} (hafta)`,
      trend: 'up'
    },
    { 
      title: 'Kutilayotgan', 
      value: applications.filter((app: any) => app.status === 'pending').length, 
      color: 'yellow',
      icon: Clock,
      change: `${Math.round((applications.filter((app: any) => app.status === 'pending').length / Math.max(applications.length, 1)) * 100)}%`,
      trend: 'neutral'
    },
    { 
      title: 'Tasdiqlangan', 
      value: applications.filter((app: any) => app.status === 'approved').length, 
      color: 'green',
      icon: CheckCircle,
      change: `${successRate}% muvaffaqiyat`,
      trend: 'up'
    },
    { 
      title: 'Foydalanuvchilar', 
      value: users.length, 
      color: 'purple',
      icon: Users,
      change: `+${profiles.length} profil`,
      trend: 'up'
    }
  ]

  const filteredApplications = applications.filter((app: any) => {
    const matchesSearch = app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.program_type?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const currentFilteredUsers = users.filter((user: any) => {
    const matchesSearch = 
      (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone_profile?.toLowerCase().includes(searchTerm.toLowerCase()) || false)

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active) ||
      (filterStatus === 'recent' && new Date(user.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (filterStatus === 'google' && user.is_google_user)

    return matchesSearch && matchesFilter
  })

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Xush kelibsiz, {currentAdmin?.username}!
            </h1>
            <p className="text-blue-100 flex items-center space-x-2">
              {getRoleIcon(currentAdmin?.role || '')}
              <span>{getRoleName(currentAdmin?.role || '')}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100">Bugun</p>
            <p className="text-2xl font-bold">{new Date().toLocaleDateString('uz-UZ')}</p>
            <p className="text-blue-200 text-sm">{todayApplications} yangi ariza</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <span className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-500' : 
                stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">So'nggi arizalar</h3>
          <div className="space-y-4">
            {applications.slice(0, 5).map((app: any) => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{app.full_name}</p>
                  <p className="text-sm text-gray-500">{app.program_type} - {app.country_preference}</p>
                  <p className="text-xs text-gray-400">{new Date(app.created_at).toLocaleString('uz-UZ')}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                  {getStatusText(app.status)}
                </span>
              </div>
            ))}
            {applications.length === 0 && (
              <p className="text-gray-500 text-center py-4">Hali arizalar yo'q</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tizim statistikasi</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700 flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>Bugungi arizalar</span>
              </span>
              <span className="font-semibold text-blue-600">{todayApplications}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700 flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-500" />
                <span>Faol foydalanuvchilar</span>
              </span>
              <span className="font-semibold text-green-600">{users.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700 flex items-center space-x-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <span>Xodimlar soni</span>
              </span>
              <span className="font-semibold text-purple-600">{adminUsers.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span>Muvaffaqiyat foizi</span>
              </span>
              <span className="font-semibold text-orange-600">{successRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderApplications = () => (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-gray-900">Barcha arizalar ({applications.length})</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Barchasi</option>
              <option value="pending">Kutilmoqda</option>
              <option value="approved">Tasdiqlangan</option>
              <option value="rejected">Rad etilgan</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Ism</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Dastur</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Davlat</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Sana</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app: any) => (
                <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{app.full_name}</td>
                  <td className="py-3 px-4">{app.email}</td>
                  <td className="py-3 px-4">{app.program_type}</td>
                  <td className="py-3 px-4">{app.country_preference}</td>
                  <td className="py-3 px-4">
                    <select
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Kutilmoqda</option>
                      <option value="approved">Tasdiqlangan</option>
                      <option value="rejected">Rad etilgan</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-sm">{new Date(app.created_at).toLocaleDateString('uz-UZ')}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Ko'rish"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                        title="Yuklab olish"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      {(currentAdmin?.role === 'super_admin' || currentAdmin?.role === 'admin') && (
                        <button 
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          title="O'chirish"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredApplications.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Arizalar topilmadi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderUsers = () => {
    // Combine auth users with profiles
    const combinedUsers = users.map((user: any) => {
      const profile = profiles.find((p: any) => p.id === user.id)
      return {
        ...user,
        profile: profile || null,
        applications_count: applications.filter((app: any) => app.user_id === user.id).length
      }
    })

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-gray-900">Foydalanuvchilar ({users.length})</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">Barchasi</option>
              <option value="active">Faol</option>
              <option value="inactive">Nofaol</option>
              <option value="recent">Yangi (7 kun)</option>
              <option value="google">Google foydalanuvchilari</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foydalanuvchi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arizalar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oxirgi kirish</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentFilteredUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 mr-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name || 'Ism kiritilmagan'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.is_google_user && (
                          <div className="flex items-center mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Google
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phone_profile || user.phone || 'Kiritilmagan'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.applications_count > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.applications_count}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString('uz-UZ')
                      : 'Hech qachon'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleUserAction(user.id, 'view')}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Ko'rish"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="O'chirish"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentFilteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>
                      {searchTerm || filterStatus !== 'all' ? 'Filtr bo\'yicha foydalanuvchilar topilmadi' : 'Foydalanuvchilar topilmadi'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderStaff = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Xodimlar boshqaruvi ({adminUsers.length})</h3>
          <button 
            onClick={() => setShowCreateUser(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Yangi xodim</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Login</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rol</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Yaratilgan</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((admin: any) => (
                <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center space-x-2">
                    {getRoleIcon(admin.role)}
                    <span className="font-medium">{admin.username}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      {getRoleName(admin.role)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      admin.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.is_active !== false ? 'Faol' : 'Bloklangan'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{new Date(admin.created_at).toLocaleDateString('uz-UZ')}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedUser(admin)
                          setShowEditUser(true)
                        }}
                        className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                        title="Tahrirlash"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => toggleAdminStatus(admin.id, admin.is_active !== false)}
                        className={`p-1 rounded ${
                          admin.is_active !== false 
                            ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-50' 
                            : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                        }`}
                        title={admin.is_active !== false ? 'Bloklash' : 'Aktivlashtirish'}
                      >
                        {admin.is_active !== false ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </button>
                      <button 
                        className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50"
                        title="Parolni o'zgartirish"
                      >
                        <Key className="h-4 w-4" />
                      </button>
                      {admin.role !== 'super_admin' && (
                        <button 
                          onClick={() => deleteAdmin(admin.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          title="O'chirish"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {adminUsers.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Xodimlar topilmadi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderServices = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Xizmatlar ({services.length})</h3>
          <button 
            onClick={() => setShowCreateService(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Yangi xizmat</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any) => (
            <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${service.color || 'blue'}-100`}>
                  <Settings className={`h-6 w-6 text-${service.color || 'blue'}-600`} />
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedService(service)
                      setShowEditService(true)
                    }}
                    className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => deleteService(service.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h4>
              <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
              {service.price && (
                <p className="text-lg font-bold text-blue-600 mb-2">{service.price}</p>
              )}
              {service.features && service.features.length > 0 && (
                <div className="text-sm text-gray-500">
                  {service.features.length} xususiyat
                </div>
              )}
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Hali xizmatlar qo'shilmagan</p>
            <button 
              onClick={() => setShowCreateService(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Birinchi xizmatni qo'shing
            </button>
          </div>
        )}
      </div>
    </div>
  )

  const renderStories = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Hikoyalar ({stories.length})</h3>
          <button 
            onClick={() => setShowCreateStory(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Yangi hikoya</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story: any) => (
            <div key={story.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {story.image && (
                <img 
                  src={story.image} 
                  alt={story.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-bold text-gray-900">{story.name}</h4>
                    {story.featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedStory(story)
                        setShowEditStory(true)
                      }}
                      className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => deleteStory(story.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{story.country}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{story.text}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(story.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(story.created_at).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {stories.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Hali hikoyalar qo'shilmagan</p>
            <button 
              onClick={() => setShowCreateStory(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Birinchi hikoyani qo'shing
            </button>
          </div>
        )}
      </div>
    </div>
  )

  // Modal Components
  const CreateUserModal = () => {
    const [formData, setFormData] = useState({
      username: '',
      password: '',
      role: 'sales'
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      
      try {
        const { error } = await supabase
          .rpc('create_admin_user', {
            input_username: formData.username,
            input_password: formData.password,
            input_role: formData.role
          })

        if (error) throw error

        toast.success('Yangi xodim yaratildi')
        setShowCreateUser(false)
        setFormData({ username: '', password: '', role: 'sales' })
        loadData()
      } catch (error) {
        toast.error('Xodim yaratishda xatolik')
      } finally {
        setLoading(false)
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowCreateUser(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Yangi xodim yaratish</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Login</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parol</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="sales">Sotuvchi</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Yaratish'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateUser(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )
  }

  const EditUserModal = () => {
    const [formData, setFormData] = useState({
      username: selectedUser?.username || '',
      role: selectedUser?.role || 'sales',
      newPassword: ''
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      
      try {
        const updates: any = {
          username: formData.username,
          role: formData.role
        }

        if (formData.newPassword) {
          const { error: passwordError } = await supabase
            .rpc('update_admin_password', {
              admin_id: selectedUser.id,
              new_password: formData.newPassword
            })
          
          if (passwordError) throw passwordError
        }

        const { error } = await supabase
          .from('admin_users')
          .update(updates)
          .eq('id', selectedUser.id)

        if (error) throw error

        toast.success('Xodim ma\'lumotlari yangilandi')
        setShowEditUser(false)
        setSelectedUser(null)
        loadData()
      } catch (error) {
        toast.error('Xodim yangilashda xatolik')
      } finally {
        setLoading(false)
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowEditUser(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Xodimni tahrirlash</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Login</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="sales">Sotuvchi</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yangi parol (bo'sh qoldirish mumkin)
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Yangi parol"
              />
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Saqlash'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowEditUser(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )
  }

  const CreateServiceModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      icon: 'FileText',
      color: 'blue',
      price: '',
      features: ['']
    })
    const [loading, setLoading] = useState(false)

    const addFeature = () => {
      setFormData({...formData, features: [...formData.features, '']})
    }

    const removeFeature = (index: number) => {
      setFormData({...formData, features: formData.features.filter((_, i) => i !== index)})
    }

    const updateFeature = (index: number, value: string) => {
      const newFeatures = [...formData.features]
      newFeatures[index] = value
      setFormData({...formData, features: newFeatures})
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      
      try {
        const { error } = await supabase
          .from('services')
          .insert({
            title: formData.title,
            description: formData.description,
            icon: formData.icon,
            color: formData.color,
            price: formData.price || null,
            features: formData.features.filter(f => f.trim() !== '')
          })

        if (error) throw error

        toast.success('Yangi xizmat qo\'shildi')
        setShowCreateService(false)
        setFormData({
          title: '',
          description: '',
          icon: 'FileText',
          color: 'blue',
          price: '',
          features: ['']
        })
        loadData()
      } catch (error) {
        toast.error('Xizmat qo\'shishda xatolik')
      } finally {
        setLoading(false)
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowCreateService(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Yangi xizmat qo'shish</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomi</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Narx</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="dan 150$"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tavsif</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ikonka</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="FileText">FileText</option>
                  <option value="Plane">Plane</option>
                  <option value="GraduationCap">GraduationCap</option>
                  <option value="Briefcase">Briefcase</option>
                  <option value="BookOpen">BookOpen</option>
                  <option value="Users">Users</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rang</label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="blue">Ko'k</option>
                  <option value="green">Yashil</option>
                  <option value="purple">Binafsha</option>
                  <option value="orange">To'q sariq</option>
                  <option value="indigo">Indigo</option>
                  <option value="pink">Pushti</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Xususiyatlar</label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Xususiyat"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Xususiyat qo'shish</span>
              </button>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Qo\'shish'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateService(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )
  }

  const CreateStoryModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      country: '',
      text: '',
      rating: 5,
      image: '',
      featured: false
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      
      try {
        const { error } = await supabase
          .from('stories')
          .insert(formData)

        if (error) throw error

        toast.success('Yangi hikoya qo\'shildi')
        setShowCreateStory(false)
        setFormData({
          name: '',
          country: '',
          text: '',
          rating: 5,
          image: '',
          featured: false
        })
        loadData()
      } catch (error) {
        toast.error('Hikoya qo\'shishda xatolik')
      } finally {
        setLoading(false)
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowCreateStory(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Yangi hikoya qo'shish</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ism</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Davlat</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hikoya</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reyting</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Asosiy hikoya sifatida belgilash
              </label>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Qo\'shish'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateStory(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )
  }

  const renderContent = () => {
    if (!currentAdmin) return null

    const allowedTabs = tabs.filter(tab => tab.roles.includes(currentAdmin.role))
    
    if (!allowedTabs.find(tab => tab.id === activeTab)) {
      setActiveTab('dashboard')
      return null
    }

    switch (activeTab) {
      case 'dashboard': return renderDashboard()
      case 'applications': return renderApplications()
      case 'users': return renderUsers()
      case 'staff': return renderStaff()
      case 'services': return renderServices()
      case 'stories': return renderStories()
      default: return renderDashboard()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!currentAdmin) {
    return null
  }

  const allowedTabs = tabs.filter(tab => tab.roles.includes(currentAdmin.role))

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
                <p className="text-xs text-gray-500 flex items-center space-x-1">
                  {getRoleIcon(currentAdmin.role)}
                  <span>{getRoleName(currentAdmin.role)}</span>
                </p>
              </div>
            </div>
          </div>
          
          <nav className="mt-6">
            {allowedTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === tab.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-6 py-3 text-left text-red-600 hover:bg-red-50 transition-colors mt-8 border-t border-gray-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Chiqish</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateUser && <CreateUserModal />}
        {showEditUser && <EditUserModal />}
        {showCreateService && <CreateServiceModal />}
        {showCreateStory && <CreateStoryModal />}
      </AnimatePresence>

      {/* User Details Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Foydalanuvchi ma'lumotlari</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                    {selectedUser.avatar_url ? (
                      <img
                        src={selectedUser.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {(selectedUser.full_name || selectedUser.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedUser.full_name || 'Ism kiritilmagan'}
                    </h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {selectedUser.is_google_user && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Google orqali ro'yxatdan o'tgan
                        </span>
                      )}
                      {selectedUser.email_confirmed_at && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Email tasdiqlangan
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Shaxsiy ma'lumotlar</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Telefon:</span>
                        <span className="text-gray-900">{selectedUser.phone_profile || selectedUser.phone || 'Kiritilmagan'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Manzil:</span>
                        <span className="text-gray-900">{selectedUser.address || 'Kiritilmagan'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tug'ilgan sana:</span>
                        <span className="text-gray-900">
                          {selectedUser.birth_date 
                            ? new Date(selectedUser.birth_date).toLocaleDateString('uz-UZ')
                            : 'Kiritilmagan'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ro'yxatdan o'tgan:</span>
                        <span className="text-gray-900">
                          {new Date(selectedUser.created_at).toLocaleDateString('uz-UZ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Statistika</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Arizalar soni:</span>
                        <span className="text-gray-900">{selectedUser.applications_count || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Holat:</span>
                        <span className={selectedUser.is_active ? 'text-green-600' : 'text-red-600'}>
                          {selectedUser.is_active ? 'Faol' : 'Nofaol'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Oxirgi kirish:</span>
                        <span className="text-gray-900">
                          {selectedUser.last_sign_in_at 
                            ? new Date(selectedUser.last_sign_in_at).toLocaleDateString('uz-UZ')
                            : 'Hech qachon'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ro'yxatdan o'tganiga:</span>
                        <span className="text-gray-900">
                          {Math.floor((Date.now() - new Date(selectedUser.created_at).getTime()) / (1000 * 60 * 60 * 24))} kun
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedUser.bio && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Bio</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedUser.bio}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Yopish
                  </button>
                  <button
                    onClick={() => handleUserAction(selectedUser.id, 'delete')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Foydalanuvchini o'chirish
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Admin