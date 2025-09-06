import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollTop'
import { Toaster } from 'react-hot-toast'

// Client pages
import Home from './pages/Home'
import Services from './pages/Services'
import Process from './pages/Process'
import Stories from './pages/Stories'
import Contact from './pages/Contact'
import Apply from './pages/Apply'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import AuthCallback from './pages/AuthCalback'
import UserSendFilePage from './pages/Index'
import ClientDetailsPage from './pages/ClientsPage'

// Admin pages
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './components/layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Clients from './pages/admin/Clients'
import Applications from './pages/admin/Applications'
import ServicesAdmin from './pages/admin/Services'
import StoriesAdmin from './pages/admin/AdminStories'
import Contacts from './pages/admin/AdminContact'
import Partners from './pages/admin/Partners'
import AdminProfile from './pages/admin/AdminProfile'
import Admins from './pages/admin/Admins'
import ServicesInput from './pages/admin/ServicesInput'
import Leads from './pages/admin/Leads/Leads'
import CallManager from './pages/admin/Leads/CallManager.tsx/CallManager'
import AgentFormPage from './pages/admin/Leads/agent-form/Index'
import ConsultingManagerPage from './pages/admin/Leads/consultingmanager/Index'
import DocumentManagerPage from './pages/admin/Leads/documentManager/Index'
import DocumentEmployeePage from './pages/admin/Leads/documentEmploye/Index'

// Admin himoyalangan route komponenti
const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user')
    if (!isAdmin && !adminUser) {
      navigate('/admin/login')
    }
  }, [isAdmin, navigate])

  const adminUser = localStorage.getItem('admin_user')
  if (!isAdmin && !adminUser) {
    return null
  }

  return <>{children}</>
}

// Layout wrapper (Navbar & Footer faqat client qismida)
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <LayoutWrapper>
            <Routes>
              {/* Client routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/process" element={<Process />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path='/userfiles/:id' element={<UserSendFilePage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Admin login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin protected layout */}
              <Route path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="clients" element={<Clients />} />
                <Route path="applications" element={<Applications />} />
                <Route path="services" element={<ServicesAdmin />} />
                <Route path="stories" element={<StoriesAdmin />} />
                <Route path="partners" element={<Partners />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="client/:id" element={<ClientDetailsPage />} />
                <Route path='profile' element={<AdminProfile />} />
                <Route path='user' element={<Admins />} />
                <Route path="leads" element={<Leads />}>
                  <Route index element={<CallManager />} />  {/* <-- default chiqadi */}
                  <Route path="agent-form" element={<div>📝 Agent Form Page</div>} />
                  <Route path="consulting-manager" element={<div>📅 Consulting Manager Page</div>} />
                  <Route path="document-manager" element={<div>📝 Document-manager Page</div>} />
                  <Route path="document-employee" element={<div>📅 Document-employee Page</div>} />
                </Route>
                <Route path='service_inputs' element={<ServicesInput />} />
              </Route>
            </Routes>
          </LayoutWrapper>
          <Toaster position="top-right" reverseOrder={false} toastOptions={{}} />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
