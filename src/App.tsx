import React from 'react'
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { supabase } from './lib/supabase'
import { initializeStorage } from './lib/storage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Process from './pages/Process'
import Stories from './pages/Stories'
import Contact from './pages/Contact'
import Apply from './pages/Apply'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'
import AuthCallback from './pages/AuthCalback'

const AppContent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      initializeStorage()
    }

    // Handle OAuth callback - check for tokens in URL hash
    const handleAuthCallback = async () => {
      // Check both hash and search params
      const hash = window.location.hash.substring(1)
      const search = window.location.search.substring(1)

      const hashParams = new URLSearchParams(hash)
      const searchParams = new URLSearchParams(search)

      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')

      if (accessToken && refreshToken) {
        console.log('OAuth tokens found, processing...')

        try {
          // Set the session using the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })          
          if (error) {
            console.error('Error setting session:', error)
          } else {
            console.log('Session set successfully:', data)
          }
        } catch (err) {
          console.error('Error processing OAuth callback:', err)
        }

        // Clear the hash from URL
        window.history.replaceState(null, '', '/')
        // Navigate to 
        navigate('/')
        return
      }
      // const token = accessToken || searchParams.get('access_token')
      
      // Also check current session
      const { data } = await supabase.auth.getSession()
      if (data.session && window.location.pathname === '/login') {
        navigate('/profile')
      }
    }

    handleAuthCallback()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // console.log('Auth state changed:', event, session)
      if (event === 'SIGNED_IN' && session) {
        // console.log('User signed in:', session.user)
        initializeStorage()
      }      
    })

    return () => subscription.unsubscribe()
  }, [navigate, location, user])

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/process" element={<Process />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth/callback" element={<AuthCallback/>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

// Admin himoyalangan route komponenti
const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Admin emas bo'lsa login sahifasiga yo'naltirish
    const adminUser = localStorage.getItem('admin_user')
    if (!isAdmin && !adminUser) {
      navigate('/admin/login')
    }
  }, [isAdmin, navigate])

  // Admin tekshiruvi
  const adminUser = localStorage.getItem('admin_user')
  if (!isAdmin && !adminUser) {
    return null // Login sahifasiga yo'naltirilmoqda
  }

  return <>{children}</>
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App