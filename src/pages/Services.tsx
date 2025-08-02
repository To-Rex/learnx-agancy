import React, { useState, useEffect } from 'react'
import { FileText, Plane, Users, GraduationCap, Briefcase, Heart, BookOpen, Globe, Award, CheckCircle, ArrowRight, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase } from '../lib/supabase'

interface Services {
  id: number,
  title: string,
  description: string,
  features: object
  price: string,
  featured: boolean,
  icon: string ,
  color: string
}

const Services: React.FC = () => {
  const { t } = useLanguage()
  const [services, setServices] = useState<Services[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<any>(null)

  useEffect(() => {
    loadServices()
  }, []) 

  const featureData = [
    {
      icon: Award,
      title: "services.experience",
      description: "services.experienceDesc",
      color: "blue"
    },
    {
      icon: Users,
      title: "services.team",
      description: "services.teamDesc",
      color: "green"
    },
    {
      icon: Globe,
      title: "services.countries",
      description: "services.countriesDesc",
      color: "purple"
    },
    {
      icon: CheckCircle,
      title: "services.success",
      description: "services.successDesc",
      color: "orange"
    }
  ];


  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        setServices(data)
      } else {
        // Fallback data if no services in database
        setServices([
          {
            id: 1,
            title: "Turist vizasi",
            description: "Sayohat uchun qisqa muddatli vizalar",
            features: ["Tez rasmiylashtirish", "To'liq hujjat tayyorlash", "90% muvaffaqiyat kafolati", "24/7 qo'llab-quvvatlash"],
            price: "dan 150$",
            featured: false,
            icon: "FileText",
            color: "blue"
          },
          {
            id: 2,
            title: "Talaba vizasi",
            description: "Ta'lim olish uchun uzoq muddatli vizalar",
            features: ["Universitet tanlash", "Grant yutishga yordam", "Turar joy topish", "Til kurslari"],
            price: "dan 300$",
            featured: true,
            icon: "GraduationCap",
            color: "green"
          },
          {
            id: 3,
            title: "Work & Travel",
            description: "AQSh Work & Travel dasturi",
            features: ["J-1 vizasi", "Ish joyi topish", "Madaniy almashish", "Sayohat imkoniyati"],
            price: "dan 1000$",
            featured: true,
            icon: "Plane",
            color: "orange"
          }
        ])
      }
    } catch (error) {
      console.error('Services loading error:', error)
      // Use fallback data on error
      setServices([
        {
          id: 1,
          title: "Turist vizasi",
          description: "Sayohat uchun qisqa muddatli vizalar",
          features: ["Tez rasmiylashtirish", "To'liq hujjat tayyorlash", "90% muvaffaqiyat kafolati", "24/7 qo'llab-quvvatlash"],
          price: "dan 150$",
          featured: false,
          icon: "FileText",
          color: "blue"
        }
      ])
    } finally {
      setLoading(false)
    }
  }
   

  const getIcon = (iconName: string) => {
    const icons = {
      FileText: FileText,
      Plane: Plane,
      Users: Users,
      GraduationCap: GraduationCap,
      Briefcase: Briefcase,
      Heart: Heart,
      BookOpen: BookOpen,
      Globe: Globe,
      Award: Award
    }
    const IconComponent = icons[iconName as keyof typeof icons] || FileText
    return <IconComponent className="h-8 w-8" />
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
      indigo: "from-indigo-500 to-indigo-600",
      pink: "from-pink-500 to-pink-600"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getBgColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      purple: "bg-purple-50 text-purple-600",
      orange: "bg-orange-50 text-orange-600",
      indigo: "bg-indigo-50 text-indigo-600",
      pink: "bg-pink-50 text-pink-600"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const handleServiceSelect = (service: any) => {
    setSelectedService(service)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

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
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('services.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('services.description')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service: any, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all relative cursor-pointer group ${service.featured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
              onClick={() => handleServiceSelect(service)}
            >
              {service.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Mashhur</span>
                  </span>
                </div>
              )}

              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${getBgColorClasses(service.color)} group-hover:scale-110 transition-transform`}>
                {getIcon(service.icon)}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

              <div className="space-y-3 mb-6">
                {service.duration && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Davomiyligi:</span>
                    <span className="font-semibold text-gray-700">{service.duration}</span>
                  </div>
                )}
                {service.success_rate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Muvaffaqiyat:</span>
                    <span className="font-semibold text-green-600">{service.success_rate}</span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {service.features?.slice(0, 3).map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
                {service.features?.length > 3 && (
                  <li className="text-sm text-gray-500 pl-8">
                    +{service.features.length - 3} boshqa xizmat
                  </li>
                )}
              </ul>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-bold text-blue-600">{service.price}</div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${service.featured
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}>
                  {t('services.select')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Service Details Modal */}
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
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getBgColorClasses(selectedService.color)}`}>
                  {getIcon(selectedService.icon)}
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
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
                  {selectedService.features?.map((feature: string, idx: number) => (
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
         
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t('services.whyChooseUs')}
          </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-12 rounded-2xl shadow-lg mb-16"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center group"
              >
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${getBgColorClasses(
                    item.color
                  )} group-hover:scale-110 transition-transform`}
                >
                  <item.icon className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {t(item.title)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(item.description)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>


   

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12 rounded-2xl text-white">
            <h2 className="text-3xl font-bold mb-4">{t('services.cta.title')}</h2>
            <p className="text-xl text-blue-100 mb-8">
              {t('services.cta.description')}
            </p>
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