import React from 'react'
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { supabase } from './lib/supabase'
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

const AppContent = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Handle OAuth callback - check for tokens in URL
    const handleAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      
      if (accessToken) {
        // Clear the hash from URL
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
        // Navigate to profile
        navigate('/profile')
        return
      }
      
      // Also check current session
      const { data } = await supabase.auth.getSession()
      if (data.session && window.location.pathname === '/login') {
        navigate('/profile')
      }
    }

    handleAuthCallback()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/profile')
      }
    })
    
    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
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
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App