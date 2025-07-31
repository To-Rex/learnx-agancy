import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { supabase } from '../lib/supabase'
import * as yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import { Upload, FileText, User, Mail, Phone, MapPin, Calendar, GraduationCap, Briefcase, CheckCircle, X } from 'lucide-react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import FileUpload from '../components/FileUpload'
import { STORAGE_BUCKETS } from '../lib/storage'

const schema = yup.object({
  firstName: yup.string().required('Ism majburiy'),
  lastName: yup.string().required('Familiya majburiy'),
  email: yup.string().email('Noto\'g\'ri email format').required('Email majburiy'),
  phone: yup.string().required('Telefon raqam majburiy'),
  birthDate: yup.date().required('Tug\'ilgan sana majburiy'),
  address: yup.string().required('Manzil majburiy'),
  education: yup.string().required('Ta\'lim darajasi majburiy'),
  program: yup.string().required('Dastur majburiy'),
  country: yup.string().required('Davlat majburiy'),
  experience: yup.string(),
  motivation: yup.string().required('Motivatsiya xati majburiy').min(100, 'Kamida 100 ta belgi')
})

const Apply: React.FC = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string }>({})
  const [formData, setFormData] = useState<any>({})

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema)
  })

  const steps = [
    { id: 1, title: t('apply.step1'), icon: User },
    { id: 2, title: t('apply.step2'), icon: GraduationCap },
    { id: 3, title: t('apply.step3'), icon: Briefcase },
    { id: 4, title: t('apply.step4'), icon: FileText }
  ]

  const programs = [
    { value: 'work-travel', label: 'Work & Travel (AQSh)' },
    { value: 'student-visa', label: 'Talaba vizasi' },
    { value: 'work-visa', label: 'Ish vizasi' },
    { value: 'education-grant', label: 'Ta\'lim granti' },
    { value: 'internship', label: 'Amaliyot dasturi' }
  ]

  const countries = [
    'AQSh', 'Kanada', 'Buyuk Britaniya', 'Germaniya', 'Fransiya', 
    'Avstraliya', 'Niderlandiya', 'Shvetsiya', 'Norvegiya', 'Daniya'
  ]

  const requiredDocuments = [
    { key: 'passport', label: 'Pasport nusxasi', required: true },
    { key: 'photo', label: 'Foto 3x4', required: true },
    { key: 'diploma', label: 'Diplom/Attestat', required: true },
    { key: 'transcript', label: 'Akademik ma\'lumotnoma', required: false },
    { key: 'cv', label: 'CV/Resume', required: false },
    { key: 'motivation', label: 'Motivatsiya xati', required: false }
  ]

  const handleFileUpload = (key: string) => (filePath: string, fileName: string) => {
    if (filePath) {
      setUploadedFiles(prev => ({ ...prev, [key]: filePath }))
      toast.success(`${fileName} muvaffaqiyatli yuklandi`)
    }
  }

  const removeFile = (key: string) => {
    setUploadedFiles(prev => ({ ...prev, [key]: '' }))
    toast.success('Fayl o\'chirildi')
  }

  const onSubmit = async (data: any) => {
    console.log('🚀 Form submitted with data:', data)
    console.log('🔐 User:', user)
    console.log('📝 Form validation passed')
    console.log('📋 Current form data:', data)
    
    if (!user) {
      toast.error('Ariza topshirish uchun tizimga kiring')
      navigate('/login')
      return
    }

    console.log('✅ User authenticated:', user.id)
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
      toast.error('Barcha majburiy maydonlarni to\'ldiring')
      return
    }

    if (!data.program || !data.country) {
      toast.error('Dastur va davlatni tanlang')
      return
    }
    console.log('✅ Form validation passed')
    
    setUploading(true)
    
    try {
      console.log('💾 Saving to database...')
      
      // Save application to database
      console.log('📤 Preparing data for database...')
      const { data: result, error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          full_name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          birth_date: data.birthDate,
          education_level: data.education,
          university: data.university || null,
          major: data.major || null,
          english_level: data.englishLevel || null,
          passport_number: data.passportNumber || null,
          program_type: data.program,
          country_preference: data.country,
          documents: uploadedFiles,
          status: 'pending',
          created_at: new Date().toISOString()
        })

      console.log('📊 Database response:', { result, error })
      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }

      console.log('✅ Application saved successfully:', result)
      toast.success('Ariza muvaffaqiyatli topshirildi!')
      console.log('🎉 Success message shown')
      
      // Reset form
      setCurrentStep(1)
      setUploadedFiles({})
      setFormData({})
      
      // Redirect to profile after successful submission
      console.log('🔄 Redirecting to profile...')
      setTimeout(() => {
        navigate('/profile')
      }, 1500)
      
    } catch (error) {
      console.error('❌ Submit error:', error)
      toast.error('Ariza topshirishda xatolik. Qaytadan urinib ko\'ring.')
      console.log('💥 Error details:', error)
    } finally {
      setUploading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ism *
                </label>
                <input
                  {...register('firstName')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ismingizni kiriting"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Familiya *
                </label>
                <input
                  {...register('lastName')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Familiyangizni kiriting"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+998 90 123 45 67"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tug'ilgan sana *
                </label>
                <input
                  type="date"
                  {...register('birthDate')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manzil *
                </label>
                <input
                  {...register('address')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="To'liq manzilingizni kiriting"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ta'lim darajasi *
              </label>
              <select
                {...register('education')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tanlang</option>
                <option value="high-school">O'rta maktab</option>
                <option value="college">Kollej</option>
                <option value="bachelor">Bakalavr</option>
                <option value="master">Magistr</option>
                <option value="phd">PhD</option>
              </select>
              {errors.education && (
                <p className="text-red-500 text-sm mt-1">{errors.education.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ish tajribasi
              </label>
              <textarea
                {...register('experience')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ish tajribangizni qisqacha yozing..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivatsiya xati *
              </label>
              <textarea
                {...register('motivation')}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nima uchun bu dasturda qatnashmoqchisiz? (kamida 100 ta belgi)"
              />
              {errors.motivation && (
                <p className="text-red-500 text-sm mt-1">{errors.motivation.message}</p>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dastur turi *
              </label>
              <select
                {...register('program')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Dasturni tanlang</option>
                {programs.map(program => (
                  <option key={program.value} value={program.value}>
                    {program.label}
                  </option>
                ))}
              </select>
              {errors.program && (
                <p className="text-red-500 text-sm mt-1">{errors.program.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Davlat *
              </label>
              <select
                {...register('country')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Davlatni tanlang</option>
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Hujjatlar haqida</h3>
              <p className="text-blue-700 text-sm">
                Barcha hujjatlar PDF, JPG, PNG, DOC yoki DOCX formatida bo'lishi kerak. 
                Maksimal fayl hajmi: 10MB
              </p>
            </div>

            {requiredDocuments.map(doc => (
              <div key={doc.key} className="border border-gray-200 rounded-lg p-4">
                <FileUpload
                  label={`${doc.label} ${doc.required ? '*' : ''}`}
                  onFileUploaded={handleFileUpload(doc.key)}
                  bucket={STORAGE_BUCKETS.DOCUMENTS}
                  acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']}
                  maxSize={10}
                  required={doc.required}
                  currentFile={uploadedFiles[doc.key]}
                />
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('apply.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('apply.description')}
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-2xl shadow-lg"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('apply.back')}
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('apply.next')}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{t('apply.submitting')}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>{t('apply.submit')}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
          
          {/* Login prompt for non-authenticated users */}
          {!user && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-center">
                Ariza topshirish uchun tizimga kirishingiz kerak.{' '}
                <Link to="/login" className="font-semibold underline hover:text-blue-900">
                  Bu yerda kiring
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Apply