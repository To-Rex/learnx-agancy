import React, { useState, useEffect } from 'react'
import { Users, FileText, MessageSquare, Settings, BarChart3, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [applications, setApplications] = useState([])
  const [services, setServices] = useState([])
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load applications
      const { data: appsData } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (appsData) setApplications(appsData)

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

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'applications', name: 'Arizalar', icon: FileText },
    { id: 'services', name: 'Xizmatlar', icon: Settings },
    { id: 'stories', name: 'Hikoyalar', icon: MessageSquare },
    { id: 'users', name: 'Foydalanuvchilar', icon: Users }
  ]

  const stats = [
    { title: 'Jami arizalar', value: applications.length, color: 'blue' },
    { title: 'Kutilayotgan', value: applications.filter((app: any) => app.status === 'pending').length, color: 'yellow' },
    { title: 'Tasdiqlangan', value: applications.filter((app: any) => app.status === 'approved').length, color: 'green' },
    { title: 'Rad etilgan', value: applications.filter((app: any) => app.status === 'rejected').length, color: 'red' }
  ]

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

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100`}>
                <FileText className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">So'nggi arizalar</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Ism</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Dastur</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Sana</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app: any) => (
                <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{app.firstName} {app.lastName}</td>
                  <td className="py-3 px-4">{app.program}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {app.status === 'pending' ? 'Kutilmoqda' :
                       app.status === 'approved' ? 'Tasdiqlangan' : 'Rad etilgan'}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(app.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderApplications = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Barcha arizalar</h3>
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
            {applications.map((app: any) => (
              <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{app.firstName} {app.lastName}</td>
                <td className="py-3 px-4">{app.email}</td>
                <td className="py-3 px-4">{app.program}</td>
                <td className="py-3 px-4">{app.country}</td>
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
                <td className="py-3 px-4">{new Date(app.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
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
  )

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Xizmatlar</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Yangi xizmat</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service: any) => (
          <div key={service.id} className="bg-white p-6 rounded-xl shadow-lg">
            <h4 className="font-bold text-gray-900 mb-2">{service.title}</h4>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-blue-600 font-semibold">{service.price}</span>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'applications':
        return renderApplications()
      case 'services':
        return renderServices()
      case 'stories':
        return <div className="bg-white p-6 rounded-xl shadow-lg">Hikoyalar bo'limi</div>
      case 'users':
        return <div className="bg-white p-6 rounded-xl shadow-lg">Foydalanuvchilar bo'limi</div>
      default:
        return renderDashboard()
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
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          
          <nav className="mt-6">
            {tabs.map((tab) => (
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
    </div>
  )
}

export default Admin