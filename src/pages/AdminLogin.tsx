import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Shield, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { verifyPassword } from '../lib/auth'
import toast, { Toaster } from 'react-hot-toast'

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    console.log('Login attempt:', { username, password })

    try {
      // Check admin credentials from database
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .maybeSingle()

      console.log('Database response:', { data, error })

      if (error || !data) {
        toast.error('Noto\'g\'ri login')
        console.log('Login not found or error:', error)
        setLoading(false)
        return
      }

      console.log('Found user:', data)
      console.log('Comparing passwords:', { entered: password, stored: data.password_hash })
      
      // Simple password check for now (since bcrypt might not work in browser)
      const isPasswordValid = password === data.password_hash
      
      console.log('Password valid:', isPasswordValid)
      
      if (isPasswordValid) {
        localStorage.setItem('admin_user', JSON.stringify(data))
        toast.success('Admin panelga xush kelibsiz!')
        console.log('Login successful, navigating to dashboard')
        navigate('/admin/dashboard')
      } else {
        toast.error('Noto\'g\'ri parol')
        console.log('Password mismatch')
      }
    } catch (err) {
      console.error('Login error:', err)
      toast.error('Kirish jarayonida xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto h-20 w-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6"
          >
            <Shield className="h-10 w-10 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-extrabold text-white">
            Admin Panel
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Tizimga kirish uchun login va parolni kiriting
          </p>
        </div>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Login
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-800/50 backdrop-blur-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Login kiriting"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Parol
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-800/50 backdrop-blur-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Parol kiriting"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Kirish'
              )}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default AdminLogin