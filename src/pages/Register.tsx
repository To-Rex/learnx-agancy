import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, GraduationCap, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import toast, { Toaster } from 'react-hot-toast'

const Register: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const { signUp, signInWithGoogle } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const requirements = t('register.requirements')
  const passwordRequirements = [
    { text: requirements.minLength, met: password.length >= 6 },
    { text: requirements.uppercase, met: /[A-Z]/.test(password) },
    { text: requirements.lowercase, met: /[a-z]/.test(password) },
    { text: requirements.number, met: /\d/.test(password) }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (password !== confirmPassword) {
      toast.error(t('register.mismatch'))
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error(t('register.weak'))
      setLoading(false)
      return
    }

    if (!agreedToTerms) {
      toast.error(t('register.termsError'))
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password)
      if (error) {
        toast.error(t('register.error') + ': ' + error.message)
      } else {
        toast.success(t('register.success'))
        navigate('/profile')
      }
    } catch {
      toast.error(t('register.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        toast.error(t('register.googleError') + error.message)
        setGoogleLoading(false)
      } else {
        toast.success(t('register.googleRedirect'))
      }
    } catch {
      toast.error(t('register.googleProcessError'))
      setGoogleLoading(false)
    }
  }

  const benefits = t('register.benefits') as string[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('register.title')}</h2>
          <p className="text-gray-600">{t('register.subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('register.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={t('register.emailPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('register.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 w-full py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={t('register.passwordPlaceholder')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-4">
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {passwordRequirements.map((req, i) => (
                  <div key={i} className="flex items-center text-sm">
                    <CheckCircle className={`h-4 w-4 mr-2 ${req.met ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={req.met ? 'text-green-700' : 'text-gray-500'}>{req.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('register.confirmPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 w-full py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={t('register.confirmPasswordPlaceholder')}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-4">
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-4 w-4 mt-1 text-purple-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                {t('register.termsError')}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl"
            >
              {loading ? '...' : t('register.signup')}
            </button>

            <div className="text-center text-sm text-gray-500 my-4">{t('register.or')}</div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
            >
              {googleLoading ? '...' : t('register.google')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('register.alreadyHave')} <Link to="/login" className="text-purple-600 font-semibold">{t('register.login')}</Link>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 bg-white/60 backdrop-blur-sm p-6 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{t('register.why')}</h3>
          <div className="space-y-3">
            {benefits.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-xl">✅</span>
                <span className="text-sm font-medium text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
