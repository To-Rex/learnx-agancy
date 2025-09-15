import React, { useState, useEffect } from 'react'
import {
  FileText,
  Plane,
  Users,
  GraduationCap,
  Briefcase,
  Heart,
  BookOpen,
  Globe,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

interface Service {
  id: string
  title: string
  description: string
  features: string[]
  price: string
  featured: boolean
  icon: string
  color: string
  duration?: string
}

interface FeatureItem {
  icon: any,
  title: string
  description: string
  color: string
}

const featureData: FeatureItem[] = [
  { icon: Award, title: 'services.experience', description: 'services.experienceDesc', color: 'blue' },
  { icon: Users, title: 'services.team', description: 'services.teamDesc', color: 'green' },
  { icon: Globe, title: 'services.countries', description: 'services.countriesDesc', color: 'purple' },
  { icon: CheckCircle, title: 'services.success', description: 'services.successDesc', color: 'orange' },
]

const Services: React.FC = () => {
  const { t, translateApi, language } = useLanguage()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const loadServices = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        'https://learnx-crm-production.up.railway.app/api/v1/services/get-list',
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (!res.ok) throw new Error('Serverdan javob olmadi')
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error('Maʼlumot noto‘g‘ri formatda')

      const normalizedData = data.map((item: any) => translateApi(item))
      setServices(normalizedData)
    } catch (err: any) {
      console.error('Xizmatlarni olishda xatolik:', err)
      setError(err.message || 'Nomaʼlum xatolik yuz berdi')
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
  }, [language])

  const icons = { FileText, Plane, Users, GraduationCap, Briefcase, Heart, BookOpen, Globe, Award }

  const getIcon = (iconName: string) => {
    const IconComponent = icons[iconName as keyof typeof icons] || FileText
    return <IconComponent className="h-8 w-8" />
  }

  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    pink: 'bg-pink-50 text-pink-600',
  }

  const getBgColorClasses = (color: string) => colors[color as keyof typeof colors] || colors.blue

  const handleServiceSelect = (service: Service) => setSelectedService(service)

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-600 text-lg">Ma'lumotlarn olishda xatolik yuz berdi</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{t('services.title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{t('services.description')}</p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">Xizmatlar mavjud emas</p>
          ) : services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all relative cursor-pointer group ${service.featured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
              onClick={() => handleServiceSelect(service)}
            >
              {service.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1">
                    <Star className="h-4 w-4" /> <span>Mashhur</span>
                  </span>
                </div>
              )}
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${getBgColorClasses(service.color)} group-hover:scale-110 transition-transform`}>
                {getIcon(service.icon)}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              <div className="space-y-3 mb-6">
                {service.features?.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                {service.features?.length > 3 && (
                  <div className="text-sm text-gray-500 pl-8">+{service.features.length - 3} boshqa xizmat</div>
                )}
              </div>
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-bold text-blue-600">{service.price}</div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${service.featured ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                  {t('services.select')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getBgColorClasses(selectedService.color ?? 'blue')}`}>
                  {getIcon(selectedService.icon ?? 'FileText')}
                </div>
                <button onClick={() => setSelectedService(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedService.title}</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">{selectedService.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Narx</div>
                  <div className="text-2xl font-bold text-blue-600">{selectedService.price}</div>
                </div>
                {selectedService.duration && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Davomiyligi</div>
                    <div className="text-lg font-semibold text-gray-700">{selectedService.duration}</div>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Xizmat tarkibi:</h3>
                <ul className="space-y-3">
                  {selectedService.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-4">
                <Link
                  to="/apply"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all text-center"
                >
                  {t('services.apply')}
                </Link>
                <Link
                  to="/contact"
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all text-center"
                >
                  {t('services.consultation')}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Why Choose Us */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('services.whyChooseUs')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {featureData.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl ${getBgColorClasses(item.color)}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t(item.title)}</h3>
                <p className="text-gray-600">{t(item.description)}</p>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12 rounded-2xl text-white">
            <h2 className="text-3xl font-bold mb-4">{t('services.cta.title')}</h2>
            <p className="text-xl text-blue-100 mb-8">{t('services.cta.description')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('services.cta.contact')}
              </Link>
              <Link
                to="/apply"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                {t('services.cta.apply')}
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default Services
