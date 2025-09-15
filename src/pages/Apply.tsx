import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
// import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import useFormPersist from 'react-hook-form-persist'


const schema = yup.object({
  // firstName: yup.string().required('Ism majburiy'),
  // lastName: yup.string().required('Familiya majburiy'),
  // email: yup.string().email('Noto\'g\'ri email format'),
  // telegram : yup.string().required('Telegram username majburiy').matches(/^@/, 'Telegram username @ bilan boshlanishi kerak'),
  // phone1: yup.string(),
  // phone2: yup.string(),
  // birthDate: yup.date().required('Tug\'ilgan sana majburiy'),
  // address: yup.string().required('Manzil majburiy'),
  // education: yup.string().required('Ta\'lim darajasi majburiy'),
  program: yup.string().required('Dastur majburiy'),
  country: yup.string().required('Davlat majburiy'),
  experience: yup.string(),
  // motivation: yup.string().required('Motivatsiya xati majburiy').min(100, 'Kamida 100 ta belgi')
})

const Apply: React.FC = () => {
  // const { user } = useAuth()
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [saveData, setSaveData] = useState<number | ''>('')
  const [currentStep, setCurrentStep] = useState(1)
  const [programs, setPrograms] = useState<Program[]>([]);
  const { register, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(schema)
  })

  interface Program {
    id: string;
    title: {
      uz: string;
      en: string;
      ru: string;
      [key: string]: string;
    };
  }

  useFormPersist('applyFormData', {
    watch,
    setValue,
    storage: window.localStorage,
    exclude: [] // Hujjatlar localStorage’da saqlanmaydi
  })

  // const steps = [
  //   // { id: 1, title: t('apply.step1'), icon: User },
  //   { id: 1, title: t('apply.step3'), icon: Briefcase },
  //   // { id: 3, title: t('apply.step2'), icon: GraduationCap },
  //   { id: 2, title: t('apply.step4'), icon: FileText }
  // ]

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch('https://learnx-crm-production.up.railway.app/api/v1/services/get-list', {
          method: 'GET',
        })
        if (!res.ok) {
          throw new Error(`HTTP xatolik: ${res.status}`)
        }
        const data: Program[] = await res.json()
        console.log('malumotlar', data);
        setPrograms(data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchPrograms()
  }, [])

  const countries = [
    'AQSh', 'Kanada', 'Buyuk Britaniya', 'Germaniya', 'Fransiya',
    'Avstraliya', 'Niderlandiya',
  ]

  const userFiles = async () => {
    if (!saveData) {
      toast.error('Maydon bosh, Dasturni tanlang!!!')
      return
    }
    try {
      const res = await fetch('https://learnx-crm-production.up.railway.app/api/v1/applications/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('api_access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ service_id: saveData })
      })
      const resData = await res.json()
      console.log('Yangi ariza yaratildi:', resData);
      console.log(res);
      console.log(saveData)

      if (resData?.id) {
        navigate(`/userfiles/${resData.id}`)
      } else {
        navigate(`/login`)

        toast.error('Ariza yuborishdan oldin tizimga kiring')
      }
    } catch (error) {
      console.error('Xatolik:', error)
      toast.error('Fayllarni yuklashda xatolik yuz berdi')
    }
  }

  // const nextStep = () => {

  //   if (currentStep < 2) setCurrentStep(currentStep + 1)
  // }

  // const prevStep = () => {
  //   if (currentStep > 1) setCurrentStep(currentStep - 1)
  // }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('apply.program')}
              </label>
              <select
                value={saveData}
                {...register("program", { onChange: (e) => { setSaveData(e.target.value) } })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer outline-none "
              >
                <option value="">{t('apply.program.placeholder')}</option>
                {programs.map((program, index) => {
                  const programName =
                    (language && program.title[language]) ||
                    program.title['uz'] ||
                    program.title['en'] ||
                    program.title['ru'] ||
                    'Nomsiz dastur';

                  return (
                    <option key={program.id || `fallback-${index}`} value={program.id}>
                      {programName}
                    </option>
                  );
                })}
              </select>
              {errors.program && (
                <p className="text-red-500 text-sm mt-1">{errors.program.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('apply.region')}
              </label>
              <select
                {...register('country')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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

      // case 3:
      //   return (
      //     <div className="space-y-6">
      //       <div>
      //         <label className="block text-sm font-medium text-gray-700 mb-2">
      //           Ta'lim darajasi *
      //         </label>
      //         <select
      //           {...register('education')}
      //           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      //         >
      //           <option value="">Tanlang</option>
      //           <option value="high-school">O'rta maktab</option>
      //           <option value="college">Kollej</option>
      //           <option value="bachelor">Bakalavr</option>
      //           <option value="master">Magistr</option>
      //           <option value="phd">PhD</option>
      //         </select>
      //         {errors.education && (
      //           <p className="text-red-500 text-sm mt-1">{errors.education.message}</p>
      //         )}
      //       </div>

      //       <div>
      //         <label className="block text-sm font-medium text-gray-700 mb-2">
      //           Ish tajribasi
      //         </label>
      //         <textarea
      //           {...register('experience')}
      //           rows={3}
      //           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      //           placeholder="Ish tajribangizni qisqacha yozing..."
      //         />
      //       </div>

      //       {/* <div>
      //         <label className="block text-sm font-medium text-gray-700 mb-2">
      //           Motivatsiya xati *
      //         </label>
      //         <textarea
      //           {...register('motivation')}
      //           rows={6}
      //           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      //           placeholder="Nima uchun bu dasturda qatnashmoqchisiz? (kamida 100 ta belgi)"
      //         />
      //         {errors.motivation && (
      //           <p className="text-red-500 text-sm mt-1">{errors.motivation.message}</p>
      //         )}
      //       </div> */}
      //     </div>
      //   )

      // case 4:
      //   return (
      //     <div className="space-y-6">
      //       <div className="bg-blue-50 p-4 rounded-lg">
      //         <h3 className="font-semibold text-blue-900 mb-2">Hujjatlar haqida</h3>
      //         <p className="text-blue-700 text-sm">
      //           Barcha hujjatlar PDF, JPG, PNG, DOC yoki DOCX formatida bo'lishi kerak. 
      //           Maksimal fayl hajmi: 10MB
      //         </p>
      //       </div>

      //       {requiredDocuments.map(doc => (
      //         <div key={doc.key} className="border border-gray-200 rounded-lg p-4">
      //           <FileUpload
      //             label={`${doc.label} ${doc.required ? '*' : ''}`}
      //             onFileUploaded={handleFileUpload(doc.key)}
      //             bucket={STORAGE_BUCKETS.DOCUMENTS}
      //             acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']}
      //             maxSize={10}
      //             required={doc.required}
      //             currentFile={uploadedFiles[doc.key]}
      //           />
      //           {uploadedFiles[doc.key] && (
      //             <button
      //               type="button"
      //               onClick={() => removeFile(doc.key)}
      //               className="mt-2 text-red-600 hover:underline"
      //             >
      //               <X />
      //             </button>
      //           )}
      //         </div>
      //       ))}
      //     </div>
      //   )

      default:
        return null
    }
  }

  const navigateClient = () => {
    navigate('/profile')
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
          className="text-center mb-12">
          <h1 className="text-4xl lg:text-[40px] font-bold text-gray-800 mb-4">
            {t('apply.title')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('apply.description')}
          </p>
        </motion.div>

        {/* Progress Steps */}
        {/* <div className="mb-12">
          <div className="flex items-center justify-around gap-10">
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
        </div> */}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-7 rounded-2xl shadow-lg">
          <form>
            {renderStep()}
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-5 pt-4 border-t border-gray-200">
              <button onClick={navigateClient}
                className='border text-white bg-red-500 py-2 px-5 rounded-lg hover:bg-red-400'>
                orqaga
              </button>
              <button type="button" onClick={userFiles}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400">
                {t('apply.next')}
              </button>
            </div>
          </form>

          {/* Login prompt for non-authenticated users */}
          {/* {!user && (
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-center">
                Ariza topshirish uchun tizimga kirishingiz kerak.{' '}
                <Link to="/login" className="font-semibold underline hover:text-blue-900">
                  Bu yerda kiring
                </Link>
              </p>
            </div>
          )} */}
        </motion.div>
      </div>
    </div>
  )
}

export default Apply