import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Users, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { useLanguage } from '../contexts/LanguageContext'

const Contact: React.FC = () => {
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        id: crypto.randomUUID(),
        client_id: "",
        application_id: "",
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        service_id: formData.subject || "",
        text: formData.message,
        created_by: "",
        uploaded_at: null,
        created_at: new Date().toISOString()
      }
      const response = await fetch("https://learnx-crm-production.up.railway.app/api/v1/contact-msgs/create", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      toast.success(t('contact.toast.success'))
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      console.error("Contact form API error:", error)
      toast.error(t('contact.toast.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: t('contact.contactInfo.phone'),
      details: ['+998910216001'],
      color: 'blue'
    },
    {
      icon: Mail,
      title: t('contact.contactInfo.email'),
      details: ['umidyusupov258@gmail.com'],
      color: 'green'
    },
    {
      icon: MapPin,
      title: t('contact.contactInfo.address'),
      details: ["Toshkent shahar", "Chilonzor tumani, Bunyodkor ko'chasi 12"],
      color: 'purple'
    },
    {
      icon: Clock,
      title: t('contact.contactInfo.hours'),
      details: ['Dushanba - Juma: 9:00 - 18:00', 'Shanba: 9:00 - 14:00'],
      color: 'orange'
    }
  ]

  const features = [
    {
      icon: MessageCircle,
      title: t('contact.features.support.title'),
      description: t('contact.features.support.desc')
    },
    {
      icon: Users,
      title: t('contact.features.team.title'),
      description: t('contact.features.team.desc')
    },
    {
      icon: Award,
      title: t('contact.features.free.title'),
      description: t('contact.features.free.desc')
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      orange: "bg-orange-50 text-orange-600 border-orange-200"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{t('contact.title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{t('contact.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.form.send')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('contact.form.namePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('contact.form.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('contact.form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('contact.form.subject')} *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">{t('contact.form.selectSubject')}</option>
                    <option value="visa">{t('contact.form.subjects.visa')}</option>
                    <option value="work-travel">{t('contact.form.subjects.workTravel')}</option>
                    <option value="education">{t('contact.form.subjects.education')}</option>
                    <option value="consultation">{t('contact.form.subjects.consultation')}</option>
                    <option value="other">{t('contact.form.subjects.other')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('contact.form.message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('contact.form.message')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>{t('contact.form.send')}</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>


          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            {contactInfo.map((info, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.6 }} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(info.color)} group-hover:scale-110 transition-transform`}>
                    <info.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 leading-relaxed">{detail}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Features */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="bg-white p-12 rounded-2xl shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('contact.features.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.6 }} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Map */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('contact.location')}</h2>
          <div className="h-96 rounded-xl overflow-hidden">
            <iframe src="https://yandex.uz/map-widget/v1/?ll=69.285801%2C41.333185&z=16&l=map" width="100%" height="100%" frameBorder="0" allowFullScreen className="rounded-xl" title="LearnX location"></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact
