import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import { FileText, User, Briefcase, CheckCircle, X } from 'lucide-react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import FileUpload from '../components/FileUpload'
import { STORAGE_BUCKETS } from '../lib/storage'
import useFormPersist from 'react-hook-form-persist'

const schema = yup.object({
  firstName: yup.string().required('Ism majburiy'),
  lastName: yup.string().required('Familiya majburiy'),
  email: yup.string().email('Noto\'g\'ri email format'),
  telegram : yup.string().required('Telegram username majburiy').matches(/^@/, 'Telegram username @ bilan boshlanishi kerak'),
  phone1: yup.string(),
  phone2: yup.string(),
  // birthDate: yup.date().required('Tug\'ilgan sana majburiy'),
  // address: yup.string().required('Manzil majburiy'),
  education: yup.string().required('Ta\'lim darajasi majburiy'),
  program: yup.string().required('Dastur majburiy'),
  country: yup.string().required('Davlat majburiy'),
  experience: yup.string(),
  // motivation: yup.string().required('Motivatsiya xati majburiy').min(100, 'Kamida 100 ta belgi')
})

const Apply: React.FC = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string }>({})
  const [formData, setFormData] = useState<any>({})
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(schema)
  })

  useFormPersist('applyFormData', {
    watch,
    setValue,
    storage: window.localStorage,
    exclude: [] // Hujjatlar localStorage’da saqlanmaydi
  })

  const program  = watch('program')

  const steps = [
    { id: 1, title: t('apply.step1'), icon: User },
    { id: 2, title: t('apply.step3'), icon: Briefcase },
    // { id: 3, title: t('apply.step2'), icon: GraduationCap },
    { id: 3, title: t('apply.step4'), icon: FileText }
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
    { key: 'passport', label: 'Pasport nusxasi', required: false },
    { key: 'photo', label: 'Foto 3x4', required: false },
    { key: 'diploma', label: 'Diplom/Attestat', required: false },
    { key: 'transcript', label: 'Akademik ma\'lumotnoma', required: false  },
    // { key: 'cv', label: 'CV/Resume', required: false },
    // { key: 'motivation', label: 'Motivatsiya xati', required: false },
    { key : 'father', label: 'Otasini pasporti', required: false },
    { key: 'mother', label: 'Onasini pasporti', required: false },
    { key: 'birth-certificate', label: 'Tug\'ilganlik guvohnomasi', required: false },
    { key : 'other', label: 'Nigoh hujjatlari', required: true }
  ]

  const handleFileUpload = (key: string) => (filePath: string, fileName: string) => {
    if (filePath) {
      setUploadedFiles(prev => ({ ...prev, [key]: filePath }))
      toast.success(`${fileName} muvaffaqiyatli yuklandi`)
    } else {
      toast.error(`${fileName} yuklashda xatolik yuz berdi`)
    }
    
  }

  const removeFile = (key: string) => {
    setUploadedFiles(prev => {
      const newFiles = {...prev};
      delete newFiles[key];
      return newFiles;
    });
    toast.success('Fayl o\'chirildi')
  }

  const onSubmit = async (data: any) => {
    console.log('🚀 Forma yuborildi:', data);
    console.log('🔐 Foydalanuvchi:', user);
    console.log("📝 Forma tekshiruvi o'tdi");
    console.log("📋 Joriy forma ma'lumotlari:", data);
  
    // Foydalanuvchi tizimga kirganligini tekshirish
    if (!user) {
      toast.error("Ariza topshirish uchun tizimga kiring");
      navigate('/login');
      return;
    }
  
    console.log('✅ Foydalanuvchi autentifikatsiya qilindi:', user.id);
  
    // Majburiy maydonlarni tekshirish
    if (!data.firstName || !data.lastName || !data.email || !data.phone1 || !data.phone2 || !data.telegram ) {
      toast.error("Barcha majburiy maydonlarni to'ldiring");
      return;
    }
  
    if (!data.program || !data.country) {
      toast.error("Dastur va davlatni tanlang");
      return;
    }
    console.log("✅ Forma tekshiruvi otdi");
  
    setUploading(true);
    const requiredKeys = requiredDocuments.filter(doc => doc.required).map(doc => doc.key);
    const missingDocs = requiredKeys.filter(key => !uploadedFiles[key]);
    if (missingDocs.length > 0) {
      toast.error(`Majburiy hujjatlar to'ldirilmagan: ${missingDocs.join(', ')}`);
      return;
    }
    try {
      console.log("📤 API uchun ma'lumotlar tayyorlanmoqda...");
  
      // API uchun ma'lumotlarni tayyorlash
      const formDataPayload = {
        user_id: user.id,
        firstname: data.firstName || null,
        lastname: data.lastName || null,
        email: data.email,
        phone1: data.phone1,
        phone2: data.phone2,
        telegram: data.telegram,
        education_level: data.education,
        university: data.university || null,
        major: data.major || null,
        english_level: data.englishLevel || null,
        passport_number: data.passportNumber || null,
        program_type: data.program,
        country_preference: data.country,
        documents: uploadedFiles,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
  
      console.log("📊 APIga yuboriladigan ma'lumotlar:", formDataPayload);
      const token = localStorage.getItem('api_access_token') || ''; // API tokenni olish
      // Backend API'ga POST so'rov yuborish
      const response = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/applications/submit/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Agar autentifikatsiya kerak bo'lsa, token qo'shing
          'Authorization': `Bearer ${token}`, // Tokenni user objektidan oling
        },
        body: JSON.stringify(formDataPayload),
      });
  
      // API javobini tekshirish
      const result = await response.json();
      console.log('📊 API javobi:', result);
  
      if (!response.ok) {
        console.error('❌ API xatosi:', result);
        throw new Error(result.message || "API so'rovida xatolik");
      }
  
      console.log('✅ Ariza muvaffaqiyatli saqlandi:', result);
      toast.success("Ariza muvaffaqiyatli topshirildi!");
      console.log("🎉 Muvaffaqiyat xabari ko'rsatildi");
  
      // Formani tozalash
      setCurrentStep(1);
      setUploadedFiles({});
      setFormData({});
  
      // Profilga yo'naltirish
      console.log("🔄 Profilga yo'naltirilmoqda...");
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('❌ Yuborish xatosi:', error);
      toast.error("Ariza topshirishda xatolik. Qaytadan urinib ko'ring.");
      console.log('💥 Xato tafsilotlari:', error);
    } finally {
      setUploading(false);
    }
  };
  


  // const onSubmit = async (data: any) => {
  //   // Foydalanuvchi tizimga kirganligini tekshirish
  //   if (!user) {
  //     toast.error('Tizimga kiring');
  //     navigate('/login');
  //     return;
  //   }
  
  //   // Majburiy maydonlarni tekshirish
  //   if (!data.email || !data.phone || !data.program || !data.country) {
  //     toast.error('Barcha majburiy maydonlarni to\'ldiring');
  //     return;
  //   }
  
  //   // Hujjatlar mavjudligini tekshirish
  //   const requiredKeys = requiredDocuments.filter(doc => doc.required).map(doc => doc.key);
  //   const missingDocs = requiredKeys.filter(key => !uploadedFiles[key]);
  //   if (missingDocs.length > 0) {
  //     toast.error(`Majburiy hujjatlar to\'ldirilmagan: ${missingDocs.join(', ')}`);
  //     return;
  //   }
  
  //   setUploading(true);
  
  //   try {
  //     const formData = new FormData();
  //     formData.append('user_id', user.id);
  //     formData.append('firstname', data.firstName);
  //     formData.append('lastname', data.lastName)
  //     formData.append('email', data.email);
  //     formData.append('telegram', data.telegram);
  //     formData.append('phone1', data.phone1);
  //     formData.append('phone2', data.phone2);
  //     formData.append('program_type', data.program);
  //     formData.append('country_preference', data.country);
  //     formData.append('status', 'pending');
  
  //     // Fayllarni qo‘shish
  //     Object.keys(uploadedFiles).forEach(key => {
  //       if (uploadedFiles[key]) {
  //         // uploadedFiles[key] fayl yo'li yoki obyekt bo'lishi mumkin
  //         // Agar fayl yo'li bo'lsa, backendga URL sifatida yuboriladi
  //         formData.append(`documents[${key}]`, uploadedFiles[key]);
  //       }
  //     });
  
  //     // Yuboriladigan ma'lumotlarni konsolda ko'rish (faqat matn qismini)
  //     console.log('Yuboriladigan ma\'lumotlar:', {
  //       user_id: user.id,
  //       firstname: data.firstName,
  //       lastname: data.lastName,
  //       email: data.email,
  //       telegram: data.telegram,
  //       phone1: data.phone1,
  //       phone2: data.phone2,
  //       program_type: data.program,
  //       country_preference: data.country,
  //       documents: Object.keys(uploadedFiles).reduce((acc, key) => ({
  //         ...acc,
  //         [key]: uploadedFiles[key],
  //       }), {}),
  //     });
  
  //     // APIga so'rov yuborish
  //     const response = await fetch('https://learnx-crm-production.up.railway.app/api/v1/applications/create', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${user.token}`, // API tokenni olish
  //       },
  //       body: formData,
  //     });
  
  //     if (response.ok) {
  //       toast.success('Ariza muvaffaqiyatli topshirildi!');
  //       setUploadedFiles({});
  //       setTimeout(() => navigate('/profile'), 1500);
  //     } else {
  //       const errorText = await response.text();
  //       toast.error(`Ariza topshirishda xatolik: ${errorText}`);
  //     }
  //   } catch (error) {
  //     console.error('Xatolik:', error);
  //     toast.error('Xatolik yuz berdi, qaytadan urinib ko\'ring.');
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  // const onSubmit = async (data: any) => {
  //   // Foydalanuvchi tekshiruvi
  //   if (!user) {
  //     toast.error('Tizimga kiring');
  //     navigate('/login');
  //     return;
  //   }

  
  //   // Majburiy maydonlarni tekshirish
  //   if (!data.email || !data.phone1 || !data.program || !data.country) {
  //     toast.error('Barcha majburiy maydonlarni to\'ldiring');
  //     return;
  //   }
  
  //   // Majburiy hujjatlar tekshiruvi
  //   const requiredKeys = requiredDocuments.filter(doc => doc.required).map(doc => doc.key);
  //   const missingDocs = requiredKeys.filter(key => !uploadedFiles[key]);
  //   if (missingDocs.length > 0) {
  //     toast.error(`Majburiy hujjatlar to'ldirilmagan: ${missingDocs.join(', ')}`);
  //     return;
  //   }
  
  //   setUploading(true);
  
  //   try {
  //     const formData = new FormData();
  //     formData.append('user_id', user.id);
  //     formData.append('firstname', data.firstName || '');
  //     formData.append('lastname', data.lastName || '');
  //     formData.append('email', data.email);
  //     formData.append('telegram', data.telegram || '');
  //     formData.append('phone1', data.phone1 || '');
  //     formData.append('phone2', data.phone2 || '');
  //     formData.append('program_type', data.program);
  //     formData.append('country_preference', data.country);
  //     formData.append('status', 'pending');
  
  //     // Fayllarni qo‘shish
  //     Object.keys(uploadedFiles).forEach(key => {
  //       if (uploadedFiles[key]) {
  //         formData.append(`documents[${key}]`, uploadedFiles[key]);
  //       }
  //     });
  
  //     // Yuboriladigan ma'lumotlarni tekshirish
  //     console.log('Yuboriladigan ma\'lumotlar:', {
  //       user_id: user.id,
  //       firstname: data.firstName,
  //       lastname: data.lastName,
  //       email: data.email,
  //       telegram: data.telegram,
  //       phone1: data.phone1,
  //       phone2: data.phone2,
  //       program_type: data.program,
  //       country_preference: data.country,
  //       documents: uploadedFiles,
  //     });
  
  //     // APIga so‘rov yuborish
  //     const response = await fetch('https://learnx-crm-production.up.railway.app/api/v1/applications/create', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${user.token}`, // Tokenni tekshirish
  //       },
  //       body: formData,
  //     });
  
  //     if (response.ok) {
  //       const result = await response.json();
  //       console.log('API javobi:', result);
  //       toast.success('Ariza muvaffaqiyatli topshirildi!');
  //       setUploadedFiles({});
  //       setTimeout(() => navigate('/profile'), 1500);
  //     } else {
  //       const errorText = await response.text();
  //       console.error('API xatosi:', errorText);
  //       toast.error(`Ariza topshirishda xatolik: ${errorText}`);
  //     }
  //   } catch (error) {
  //     console.error('Xatolik:', error);
  //     toast.error('Xatolik yuz berdi, qaytadan urinib ko\'ring.');
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
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
                  Telegram username *
                </label>
                <input
                  type="text"
                  {...register('telegram')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="@telegram_username"
                />
                {errors.telegram && (
                  <p className="text-red-500 text-sm mt-1">{errors.telegram.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon raqamingiz *
                </label>
                <input
                  type="tel"
                  {...register('phone1')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+998 90 123 45 67"
                />
                {errors.phone1 && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone1.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qo'shimcha telefon raqam *
                </label>
                <input
                  type="tel"
                  {...register('phone2')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+998 90 123 45 67"
                />
                {errors.phone2 && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone2.message}</p>
                )}
              </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div> */}
          </div>
        )

      case 2:
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

      case 3:
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
                {uploadedFiles[doc.key] && (
                  <button
                    type="button"
                    onClick={() => removeFile(doc.key)}
                    className="mt-2 text-red-600 hover:underline"
                  >
                    <X />
                  </button>
                )}
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

              {currentStep < 3 ? (
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
                  // disabled={uploading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold"
                >
                  
                  {/* {uploading  ( */}
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>{t('apply.submit')}</span>
                    </>
                  {/* )} */}
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