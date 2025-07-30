import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, FileText, MessageSquare, Settings, BarChart3, Plus, Edit, Trash2, Eye, LogOut, UserPlus, Shield, Crown, Briefcase, Search, Filter, Download, Upload, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

interface AdminUser {
  id: string
  username: string
  role: 'super_admin' | 'admin' | 'manager' | 'sales'
  created_at: string
}

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null)
  const [applications, setApplications] = useState([])
  const [users, setUsers] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [services, setServices] = useState([])
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  const navigate = useNavigate()

  useEffect(() => {
    checkAdminAuth()
  }, [])

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

  const loadData = async () => {
    try {
      // Load applications
      const { data: appsData } = await supabase
        .from('applications')
        .select(`
          *,
          profiles(full_name, phone)
        `)
        .order('created_at', { ascending: false })
      
      if (appsData) setApplications(appsData)

      // Load regular users
      const { data: usersData } = await supabase
        .from('profiles')
        .select(`
          *,
          applications(count)
        `)
        .order('created_at', { ascending: false })
      
      if (usersData) setUsers(usersData)

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

  const stats = [
    { 
      title: 'Jami arizalar', 
      value: applications.length, 
      color: 'blue',
      icon: FileText,
      change: '+12%'
    },
    { 
      title: 'Kutilayotgan', 
      value: applications.filter((app: any) => app.status === 'pending').length, 
      color: 'yellow',
      icon: Clock,
      change: '+5%'
    },
    { 
      title: 'Tasdiqlangan', 
      value: applications.filter((app: any) => app.status === 'approved').length, 
      color: 'green',
      icon: CheckCircle,
      change: '+18%'
    },
    { 
      title: 'Foydalanuvchilar', 
      value: users.length, 
      color: 'purple',
      icon: Users,
      change: '+8%'
    }
  ]

  const filteredApplications = applications.filter((app: any) => {
    const matchesSearch = app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.program_type?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus
    
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
              <span className="text-green-500 text-sm font-medium">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">So'nggi arizalar</h3>
          <div className="space-y-4">
            {applications.slice(0, 5).map((app: any) => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{app.full_name}</p>
                  <p className="text-sm text-gray-500">{app.program_type}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                  {getStatusText(app.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tizim statistikasi</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bugungi arizalar</span>
              <span className="font-semibold text-blue-600">
                {applications.filter((app: any) => 
                  new Date(app.created_at).toDateString() === new Date().toDateString()
                ).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Faol foydalanuvchilar</span>
              <span className="font-semibold text-green-600">{users.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Xodimlar soni</span>
              <span className="font-semibold text-purple-600">{adminUsers.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Muvaffaqiyat foizi</span>
              <span className="font-semibold text-orange-600">
                {applications.length > 0 
                  ? Math.round((applications.filter((app: any) => app.status === 'approved').length / applications.length) * 100)
                  : 0}%
              </span>
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
          <h3 className="text-xl font-bold text-gray-900">Barcha arizalar</h3>
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
                  <td className="py-3 px-4">{app.full_name}</td>
                  <td className="py-3 px-4">{app.email}</td>
                  <td className="py-3 px-4">{app.program_type}</td>
                  <td className="py-3 px-4">{app.country_preference}</td>
                  <td className="py-3 px-4">
                    <select
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="pending">Kutilmoqda</option>
                      <option value="approved">Tasdiqlangan</option>
                      <option value="rejected">Rad etilgan</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">{new Date(app.created_at).toLocaleDateString('uz-UZ')}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50">
                        <Download className="h-4 w-4" />
                      </button>
                      {(currentAdmin?.role === 'super_admin' || currentAdmin?.role === 'admin') && (
                        <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Foydalanuvchilar</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Ism</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Telefon</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Arizalar</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Ro'yxatdan o'tgan</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{user.full_name || 'Kiritilmagan'}</td>
                <td className="py-3 px-4">{user.id}</td>
                <td className="py-3 px-4">{user.phone || 'Kiritilmagan'}</td>
                <td className="py-3 px-4">
                  {applications.filter((app: any) => app.user_id === user.id).length}
                </td>
                <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString('uz-UZ')}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50">
                      <Edit className="h-4 w-4" />
                    </button>
                    {(currentAdmin?.role === 'super_admin' || currentAdmin?.role === 'admin') && (
                      <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderStaff = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Xodimlar boshqaruvi</h3>
          <button 
            onClick={() => setShowCreateUser(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
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
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Yaratilgan</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((admin: any) => (
                <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center space-x-2">
                    {getRoleIcon(admin.role)}
                    <span>{admin.username}</span>
                  </td>
                  <td className="py-3 px-4">{getRoleName(admin.role)}</td>
                  <td className="py-3 px-4">{new Date(admin.created_at).toLocaleDateString('uz-UZ')}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50">
                        <Edit className="h-4 w-4" />
                      </button>
                      {admin.role !== 'super_admin' && (
                        <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const CreateUserModal = () => {
    const [formData, setFormData] = useState({
      username: '',
      password: '',
      role: 'sales'
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      try {
        const { error } = await supabase
          .from('admin_users')
          .insert({
            username: formData.username,
            password_hash: formData.password, // In production, hash this
            role: formData.role
          })

        if (error) throw error

        toast.success('Yangi xodim yaratildi')
        setShowCreateUser(false)
        loadData()
      } catch (error) {
        toast.error('Xodim yaratishda xatolik')
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
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Yaratish
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
      case 'services': return <div className="bg-white p-6 rounded-xl shadow-lg">Xizmatlar bo'limi</div>
      case 'stories': return <div className="bg-white p-6 rounded-xl shadow-lg">Hikoyalar bo'limi</div>
      default: return renderDashboard()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
      </AnimatePresence>
    </div>
  )
}

export default Admin