import React from 'react'
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
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
import UserSendFilePage from './pages/Index'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from './components/ScrollTop'
import ClientDetailsPage from './pages/ClientsPage'

const AppContent = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  // const navigate =useNavigate()

  // useEffect(() => {
  //   const token = localStorage.getItem("api_access_token");
  //   if (token) {
  //     navigate("/profile");
  //   }
  // }, [navigate]);
  // console.log("TOKEN:", localStorage.getItem("api_access_token"));

  // useEffect(() => {
  //   console.log("TOKEN:", localStorage.getItem("api_access_token"));
  //   if (token) {
  //     navigate("/profile"); // agar token bo'lsa, login sahifasini o'tkazib yuboradi
  //   }
  // }, [navigate]);

  // useEffect(() => {
  //   if (token) {
  //     initializeStorage()
  //   }

  //   // Handle OAuth callback - check for tokens in URL hash
  //   const handleAuthCallback = async () => {
  //     // Check both hash and search params
  //     const hash = window.location.hash.substring(1)
  //     const search = window.location.search.substring(1)

  //     const hashParams = new URLSearchParams(hash)
  //     const searchParams = new URLSearchParams(search)

  //     const accessToken = hashParams.get('access_token')
  //     const refreshToken = hashParams.get('refresh_token')

  //     if (accessToken && refreshToken) {
  //       console.log('OAuth tokens found, processing...')

  //       try {
  //         // Set the session using the tokens
  //         const { data, error } = await supabase.auth.setSession({
  //           access_token: accessToken,
  //           refresh_token: refreshToken
  //         })
  //         if (error) {
  //           console.error('Error setting session:', error)
  //         } else {
  //           console.log('Session set successfully:', data)
  //         }
  //       } catch (err) {
  //         console.error('Error processing OAuth callback:', err)
  //       }

  //       // Clear the hash from URL
  //       window.history.replaceState(null, '', '/')
  //       // Navigate to 
  //       navigate('/')
  //       return
  //     }
  //     // const token = accessToken || searchParams.get('access_token')

  //     // Also check current session
  //     if (token && location.pathname === '/login') {
  //       navigate('/profile')
  //     }
  //   }

  //   handleAuthCallback()

  // }, [navigate, location, token])
  // useEffect(() => {
  //   const checkToken = async () => {
  //     if (!token) return;

  //     try {
  //       const res = await fetch('https://learnx-crm-production.up.railway.app/api/v1/auth/login-with-supabase', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`, // supabaseToken o‘rniga token
  //         },
  //         body: JSON.stringify({ access_token: token }),
  //       });

  //       if (res.ok) {
  //         // faqat token haqiqiy bo'lsa yo'naltirish
  //         if (location.pathname === '/login' || location.pathname === '/register') {
  //           navigate('/profile', { replace: true });
  //         }
  //       } else {
  //         console.error('Token tekshirishda xatolik:');
  //       }
  //     } catch (err) {
  //       console.error('Token tekshirishda xatolik:', err);
  //     }
  //   };

  //   checkToken();
  // }, [token, location.pathname, navigate]);




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
          <Route path='/userfiles/:id' element={<UserSendFilePage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/client/:id" element={<ClientDetailsPage />} />
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
          <ScrollToTop />
          <AppContent />
          <Toaster
            position="top-right" reverseOrder={false} toastOptions={{}} />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App