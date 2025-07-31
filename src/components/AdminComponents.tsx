import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

// Reusable Card Component
export const AdminCard: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl ${className}`}
  >
    {children}
  </motion.div>
)

// Reusable Button Component
export const AdminButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  disabled?: boolean
  className?: string
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl'
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500',
    secondary: 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 focus:ring-white/50',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-500'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {children}
    </motion.button>
  )
}

// Reusable Input Component
export const AdminInput: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  required?: boolean
  className?: string
}> = ({ label, value, onChange, type = 'text', placeholder, required = false, className = '' }) => (
  <div className={className}>
    <label className="block text-sm font-semibold text-white mb-3">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-white/50"
    />
  </div>
)

// Reusable Textarea Component
export const AdminTextarea: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  required?: boolean
  className?: string
}> = ({ label, value, onChange, placeholder, rows = 4, required = false, className = '' }) => (
  <div className={className}>
    <label className="block text-sm font-semibold text-white mb-3">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-white/50 resize-none"
    />
  </div>
)

// Reusable Select Component
export const AdminSelect: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  required?: boolean
  className?: string
}> = ({ label, value, onChange, options, required = false, className = '' }) => (
  <div className={className}>
    <label className="block text-sm font-semibold text-white mb-3">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white"
    >
      <option value="" className="bg-gray-800">Tanlang</option>
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-gray-800">
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

// Reusable Modal Component
export const AdminModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: string
}> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto border border-white/20`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

// Reusable Table Component
export const AdminTable: React.FC<{
  headers: string[]
  children: React.ReactNode
}> = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-white/5">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {children}
      </tbody>
    </table>
  </div>
)

// Reusable Stats Card Component
export const StatsCard: React.FC<{
  title: string
  value: string | number
  icon: LucideIcon
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
  trend?: string
}> = ({ title, value, icon: Icon, color, trend }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600'
  }

  return (
    <AdminCard className="p-6 hover:scale-105 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p className="text-sm text-green-400 mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colors[color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </AdminCard>
  )
}

// Language Tabs Component
export const LanguageTabs: React.FC<{
  activeLanguage: string
  onLanguageChange: (lang: string) => void
}> = ({ activeLanguage, onLanguageChange }) => {
  const languages = [
    { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ]

  return (
    <div className="flex space-x-1 bg-white/10 backdrop-blur-sm p-1 rounded-xl mb-6 border border-white/20">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeLanguage === lang.code
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>{lang.flag}</span>
          <span>{lang.name}</span>
        </button>
      ))}
    </div>
  )
}