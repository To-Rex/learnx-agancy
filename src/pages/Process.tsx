import React from 'react'
import { CheckCircle, ArrowRight, FileText, Users, Plane, Award, Clock, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const Process: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Bepul maslahat",
      description: "Mutaxassislarimiz bilan bog'laning va maqsadlaringizni muhokama qiling",
      details: [
        "Shaxsiy uchrashuvda yoki onlayn maslahat",
        "Sizning imkoniyatlaringizni baholash",
        "Eng mos yo'nalishni tanlash",
        "Dastlabki reja tuzish"
      ],
      icon: Users,
      color: "blue",
      duration: "1-2 kun"
    },
    {
      id: 2,
      title: "Hujjatlar tayyorlash",
      description: "Zarur hujjatlarni to'plash va rasmiylashtirish",
      details: [
        "Hujjatlar ro'yxatini tayyorlash",
        "Tarjima va notarial tasdiq",
        "Foto va boshqa materiallar",
        "Hujjatlarni tekshirish"
      ],
      icon: FileText,
      color: "green",
      duration: "1-2 hafta"
    },
    {
      id: 3,
      title: "Ariza topshirish",
      description: "Visa yoki dastur uchun rasmiy ariza topshirish",
      details: [
        "Onlayn ariza to'ldirish",
        "Hujjatlarni yuklash",
        "To'lovlarni amalga oshirish",
        "Ariza holatini kuzatish"
      ],
      icon: Plane,
      color: "purple",
      duration: "1-3 kun"
    },
    {
      id: 4,
      title: "Natija va safar",
      description: "Ijobiy javob olish va safarga tayyorgarlik",
      details: [
        "Visa yoki qabul xatini olish",
        "Aviachiptalar bron qilish",
        "Turar joy topish",
        "Safarga tayyorgarlik"
      ],
      icon: Award,
      color: "orange",
      duration: "2-8 hafta"
    }
  ]

  const features = [
    {
      icon: Clock,
      title: "Tez jarayon",
      description: "Minimal vaqtda maksimal natija"
    },
    {
      icon: Shield,
      title: "Kafolat",
      description: "Muvaffaqiyat kafolati yoki pul qaytarish"
    },
    {
      icon: Users,
      title: "Shaxsiy yondashuv",
      description: "Har bir mijoz uchun individual reja"
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

  const getGradientClasses = (color: string) => {
    const gradients = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600"
    }
    return gradients[color as keyof typeof gradients] || gradients.blue
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
            Qanday ishlaydi?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Oddiy 4 bosqichda chet davlatlarga ta'lim olish yoki ishlash uchun 
            barcha zarur jarayonlarni amalga oshiramiz
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="space-y-12 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getColorClasses(step.color)}`}>
                    <step.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      {step.id}-bosqich
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                </div>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                
                <ul className="space-y-3">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Davomiyligi: {step.duration}</span>
                  </div>
                </div>
              </div>

              {/* Visual */}
              <div className="flex-1 flex justify-center">
                <div className={`relative w-80 h-80 bg-gradient-to-br ${getGradientClasses(step.color)} rounded-3xl flex items-center justify-center shadow-2xl`}>
                  <step.icon className="h-32 w-32 text-white opacity-20" />
                  <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-sm"></div>
                  <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{step.id}</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 mt-20">
                  <ArrowRight className="h-8 w-8 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-12 rounded-2xl shadow-lg mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Bizning afzalliklarimiz
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12 rounded-2xl text-white">
            <h2 className="text-3xl font-bold mb-4">Boshlashga tayyormisiz?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Bugun biz bilan bog'laning va birinchi bosqichni boshlang
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Bepul maslahat
              </Link>
              <Link
                to="/apply"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-block"
              >
                Ariza topshirish
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Process