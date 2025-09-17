import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star, MapPin, Calendar, ArrowRight, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

const Stories: React.FC = () => {
  const { t } = useLanguage()
  const {user} = useAuth()
  const [stories, setStories] = useState<any[]>([])
  const [filteredStories, setFilteredStories] = useState<any[]>([])
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadStories()
  }, [])

  useEffect(() => {
    filterStories()
  }, [selectedCountry, stories])

  const loadStories = async () => {
    try {
      const res = await fetch("https://learnx-crm-production.up.railway.app/api/v1/client-stories/get-list")
      const data = await res.json()

      if (data && data.length > 0) {
        const mappedStories = data.map((item: any) => ({
          id: item.id,
          name: item.name || "",
          country: item.country || "",
          text: item.text || "",
          rating: item.rating || 0,
          image: item.image_url || "",
          created_at: item.created_at
        }))
        setStories(mappedStories)
      } else {
        setStories([])
      }
    } catch (error) {
      console.error("Stories API load error:", error)
      setStories([])
    } finally {
      setLoading(false)
    }
  }

  const filterStories = () => {
    if (selectedCountry === 'all') {
      setFilteredStories(stories)
    } else {
      setFilteredStories(stories.filter(story => story.country === selectedCountry))
    }
  }

  const navigateUser = () => {
    if(user){
      navigate('/apply');
    }else {
      navigate('/login')
    }
  }

  const countries = ['all', ...Array.from(new Set(stories.map(story => story.country)))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const stats = [
    { number: "2000+", label: t('stories.stat.successfulStudents') },
    { number: "50+", label: t('stories.stat.partnerCountries') },
    { number: "98%", label: t('stories.stat.successRate') },
    { number: "5+", label: t('stories.stat.yearsExperience') }
  ]

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
            {t('stories.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('stories.subtitle')}
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700 font-medium">{t('stories.filterByCountry')}</span>
          </div>
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCountry === country
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                }`}
            >
              {country === 'all' ? t('stories.all') : country}
            </button>
          ))}
        </motion.div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-800">
                  {story.country}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-700 mb-6 leading-relaxed line-clamp-4">
                  {story.text}
                </p>

                {/* Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{story.country}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(story.created_at).toLocaleDateString('uz-UZ')}</span>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="font-bold text-gray-900">{story.name}</div>
                    <div className="text-sm text-gray-500">{story.country}</div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 p-12 rounded-2xl text-white mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{t('stories.resultsTitle')}</h2>
            <p className="text-blue-100 text-lg">{t('stories.resultsSubtitle')}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-white p-12 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('stories.nextStory')}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('stories.ctaText')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={navigateUser}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl inline-block">
                {t('stories.apply')}
              </button>
              <Link
                to="/contact"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all inline-block">
                {t('stories.consultation')}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Stories
