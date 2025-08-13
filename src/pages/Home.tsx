import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, FileText, Users, Globe, Star,
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
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

interface Testimonial {
  id: string
  name: string
  country: string
  text: string
  rating: number
  image: string
}

interface Partner {
  id: string
  name: string
  logo: string
}

const icons = {
  FileText,
  Users,
  Globe,
}

const getIcon = (iconName: string) => {
  const IconComponent = icons[iconName as keyof typeof icons] || FileText
  return <IconComponent className="h-8 w-8" />
}

const getColorClasses = (color: string) => {
  const colors: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50 hover:bg-blue-100",
    green: "text-green-600 bg-green-50 hover:bg-green-100",
    purple: "text-purple-600 bg-purple-50 hover:bg-purple-100",
    orange: "text-orange-600 bg-orange-50 hover:bg-orange-100"
  }
  return colors[color.toLowerCase()] || colors.blue
}

const stats = [
  { number: "2000+", label: "Muvaffaqiyatli talabalar", icon: Users },
  { number: "50+", label: "Hamkor universitetlar", icon: Globe },
  { number: "98%", label: "Muvaffaqiyat foizi", icon: TrendingUp },
  { number: "5+", label: "Yillik tajriba", icon: Award }
]

const Home: React.FC = () => {
  const { t } = useLanguage()

  const [services, setServices] = useState<Service[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAllData = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('api_access_token') || ''

      // Services
      const servicesRes = await fetch(
        'https://learnx-crm-production.up.railway.app/api/v1/services/get-list',
      )
      if (!servicesRes.ok) throw new Error('Xizmatlar olishda xato')
      const servicesData = await servicesRes.json()
      const normalizedServices = Array.isArray(servicesData) ? servicesData.map((item: any) => ({
        id: item.id,
        title: item.title?.en || '',
        description: item.description?.en || '',
        price: item.price || '',
        featured: item.featured || false,
        icon: item.icon?.Name || 'FileText',
        color: item.icon?.Color?.toLowerCase() || 'blue',
        features: Array.isArray(item.features) ? item.features.map((f: any) => f.en || '') : [],
        duration: item.duration || undefined,
      })) : []
      setServices(normalizedServices)

      // Testimonials
      const testimonialsRes = await fetch('https://learnx-crm-production.up.railway.app/api/v1/client-stories/get-list')
      if (!testimonialsRes.ok) throw new Error('Testimonials olishda xato')
      const testimonialsData = await testimonialsRes.json()
      const formattedTestimonials = Array.isArray(testimonialsData) ? testimonialsData.map((item: any) => ({
        id: item.id,
        name: item.name,
        country: item.country,
        text: item.text,
        rating: item.rating,
        image: item.image_url
      })) : []
      setTestimonials(formattedTestimonials)

      // Partners
      const partnersRes = await fetch('https://learnx-crm-production.up.railway.app/api/v1/partners/get-list', {
      })
      if (!partnersRes.ok) throw new Error('Hamkorlarni olishda xato')
      const partnersData = await partnersRes.json()
      const formattedPartners = Array.isArray(partnersData) ? partnersData.map((p: any) => ({
        id: p.id,
        name: p.name,
        logo: p.image_url
      })) : []
      setPartners(formattedPartners)
    } catch (e: any) {
      setError(e.message || 'Nomaʼlum xatolik yuz berdi')
      setServices([])
      setTestimonials([])
      setPartners([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

   if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  if (error) return <div className="text-center py-20 text-red-600">Xatolik: {error}</div>

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm"
                >
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>{t('home.hero.span')}</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {t('home.hero.title')}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                    {t('home.hero.subtitle')}
                  </span>
                </h1>

                <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
                  {t('home.hero.description')}
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-center space-y-2 gap-4 sm:flex-row ">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/apply"
                    className="bg-gradient-to-r mt-2 from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-400 transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <span>{t('home.hero.apply')}</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/contact"
                    className="border-2 border-white/30 text-white px-12 py-4 rounded-xl font-semibold hover:bg-white/10 backdrop-blur-sm transition-all text-center"
                  >
                    {t('home.hero.consultation')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Students studying abroad"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">2000+</div>
                      <div className="text-sm text-gray-600">{t('home.hero.number')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{t(stat.label)}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.services.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('home.services.description')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map(service => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${getColorClasses(service.color)}`}>
                  {getIcon(service.icon)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <Link to="/services" className="text-blue-600 font-semibold hover:text-blue-700 transition inline-flex items-center space-x-2">
                  <span>{t('services.details')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.testimonials.title')}</h2>
            <p className="text-xl text-gray-600">{t('home.testimonials.description')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? testimonials.map((tst, i) => (
              <motion.div key={tst.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.6 }} className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center mb-4">
                  {[...Array(tst.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{tst.text}"</p>
                <div className="flex items-center space-x-4">
                  <img src={tst.image} alt={tst.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-gray-900">{tst.name}</div>
                    <div className="text-sm text-gray-500">{tst.country}</div>
                  </div>
                </div>
              </motion.div>
            )) : <p className="text-center col-span-3 text-gray-500">Testimonial ma'lumotlari topilmadi.</p>}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.partners.title')}</h2>
            <p className="text-xl text-gray-600">{t('home.partners.description')}</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {partners.length > 0 ? partners.map((partner, i) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all group"
              >
                <img
                  src={partner.logo}
                  alt={partner.name?.en}
                  className="w-full h-16 object-contain grayscale group-hover:grayscale-0 transition-all"
                />
              </motion.div>
            )) : <p className="text-center text-gray-500">Hamkorlar ma'lumotlari topilmadi.</p>}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
