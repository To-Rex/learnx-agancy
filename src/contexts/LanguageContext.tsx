import React, { createContext, useContext, useState, useEffect } from 'react';
// import { GraduationCap, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
// import { Link } from 'react-router-dom';

export type Language = 'uz' | 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const translations = {
  uz: {
    register: {
      title: "Keling boshlaylik!",
      subtitle: "Yangi hisob yarating va ta'lim sayohatingizni boshlang",
      email: "Email manzil",
      emailPlaceholder: "email@example.com",
      password: "Parol",
      passwordPlaceholder: "Kuchli parol yarating",
      confirmPassword: "Parolni tasdiqlang",
      confirmPasswordPlaceholder: "Parolni qayta kiriting",
      mismatch: "Parollar mos emas",
      weak: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
      termsError: "Foydalanish shartlariga rozilik bering",
      signup: "Ro'yxatdan o'tish",
      or: "Yoki",
      google: "Google orqali ro'yxatdan o'tish",
      googleError: "Google orqali ro'yxatdan o'tish xatoligi: ",
      googleRedirect: "Google orqali ro'yxatdan o'tish boshlandi...",
      googleProcessError: "Google orqali ro'yxatdan o'tishda xatolik yuz berdi",
      success: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
      error: "Ro'yxatdan o'tish jarayonida xatolik yuz berdi",
      alreadyHave: "Allaqachon hisobingiz bormi?",
      login: "Kirish",
      why: "Nima uchun LearnX?",
      benefits: [
        "Shaxsiy yo'nalish va maslahat",
        "98% muvaffaqiyat kafolati",
        "Tez va oson jarayon"
      ],
      requirements: {
        minLength: "Kamida 6 ta belgi",
        uppercase: "Katta harf",
        lowercase: "Kichik harf",
        number: "Raqam"
      }
    },
    login: {
      title: "Xush kelibsiz!",
      subtitle: "Hisobingizga kiring va o'qishni davom eting",
      email: "Email manzil",
      password: "Parol",
      passwordPlaceholder: "Parolingizni kiriting",
      remember: "Meni eslab qol",
      forgot: "Parolni unutdingizmi?",
      login: "Kirish",
      or: "Yoki",
      google: "Google orqali kirish",
      noAccount: "Hisobingiz yo'qmi?",
      register: "Ro'yxatdan o'ting",
      success: "Muvaffaqiyatli kirdingiz!",
      invalidCredentials: "Email yoki parol noto'g'ri",
      error: "Kirish jarayonida xatolik yuz berdi",
      googleError: "Google orqali kirish xatoligi: ",
      googleRedirect: "Google orqali kirish boshlandi...",
      googleProcessError: "Google orqali kirishda xatolik yuz berdi",
      features: {
        education: "Ta'lim",
        world: "Dunyo",
        future: "Kelajak"
      }
    },
    stories: {
      "title": "Muvaffaqiyat hikoyalari",
      "subtitle": "Bizga ishongan va chet davlatlarda muvaffaqiyatga erishgan talabalarimizning haqiqiy hikoyalari",
      "filterByCountry": "Davlat bo'yicha:",
      "all": "Barchasi",
      "resultsTitle": "Bizning natijalarimiz",
      "resultsSubtitle": "Raqamlar o'z-o'zidan gapiradi",
      "nextStory": "Sizning hikoyangiz keyingi bo'lsin!",
      "ctaText": "Bugun biz bilan bog'laning va o'zingizning muvaffaqiyat hikoyangizni yarating",
      "apply": "Ariza topshirish",
      "consultation": "Bepul maslahat"
  },

    contact: {
      title: "Biz bilan bog'laning",
      subtitle: "Savolingiz bormi? Yordam kerakmi? Bizning professional jamoamiz sizga har doim yordam berishga tayyor.",
      form: {
        name: "To'liq ism",
        namePlaceholder: "Ismingizni kiriting",
        email: "Elektron pochta manzili",
        phone: "Telefon raqami",
        subject: "Mavzu",
        selectSubject: "Mavzuni tanlang",
        subjects: {
          visa: "Viza arizasi",
          workTravel: "Work & Travel",
          education: "Ta'lim granti",
          consultation: "Konsultatsiya",
          other: "Boshqa"
        },
        message: "Xabar matni",
        send: "Xabarni yuborish"
      },
      toast: {
        success: "Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.",
        error: "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
      },
      contactInfo: {
        phone: "Telefon",
        email: "Email",
        address: "Manzil",
        hours: "Ish vaqti"
      },
      location: "Bizning manzil",
      features: {
        title: "Nega aynan biz?",
        support: {
          title: "24/7 qo'llab-quvvatlash",
          desc: "Savollaringizga doim javob berishga tayyormiz"
        },
        team: {
          title: "Professional jamoa",
          desc: "Tajribali mutaxassislar sizga yordam beradi"
        },
        free: {
          title: "Bepul konsultatsiya",
          desc: "Birinchi maslahat butunlay bepul"
        }
      }
    },
    "Oddiy 4 bosqichda chet davlatlarga ta'lim olish yoki ishlash uchun barcha zarur jarayonlarni amalga oshiramiz":"Oddiy 4 bosqichda chet davlatlarga ta'lim olish yoki ishlash uchun barcha zarur jarayonlarni amalga oshiramiz",
    " Qanday ishlaydi?": "Как это работает?",
    // Navigation
    'nav.home': 'Bosh sahifa',
    'nav.services': 'Xizmatlar',
    'nav.process': 'Jarayon',
    'nav.stories': 'Hikoyalar',
    'nav.contact': 'Aloqa',
    'nav.login': 'Kirish',
    'nav.register': "Ro'yxatdan o'tish",
    'nav.profile': 'Profil',
    'nav.logout': 'Chiqish',

    // Stats
    'Muvaffaqiyatli talabalar': 'Muvaffaqiyatli talabalar',
    'Hamkor universitetlar': 'Hamkor universitetlar',
    'Muvaffaqiyat foizi': 'Muvaffaqiyat foizi',
    'Yillik tajriba': 'Yillik tajriba',

    // Home page
    'home.hero.span': "O'zbekistondagi #1 ta'lim platformasi",
    'home.hero.number': 'Muvaffaqqiyatli talabalar',
    'home.hero.title': 'Chet davlatlarda',
    'home.hero.subtitle': "ta'lim oling",
    'home.hero.description': "O'zbekiston yoshlari uchun dunyoning eng yaxshi universitetlarida ta'lim olish, visa olish va Work & Travel dasturlarida qatnashish imkoniyatini yaratamiz",
    'home.hero.apply': 'Ariza topshirish',
    'home.hero.consultation': 'Bepul maslahat',
    'home.services.title': 'Bizning xizmatlarimiz',
    'home.services.description': 'Professional jamoa sizga chet davlatlarga ta\'lim olish va ishlash uchun barcha zarur xizmatlarni taqdim etadi',
    'home.testimonials.title': 'Talabalarimizning hikoyalari',
    'home.testimonials.person1': 'LearnX orqali Work & Travel dasturiga qatnashib, ajoyib tajriba oldim. Jarayon juda oson va qulay edi.',
    'home.testimonials.person2': "Ta'lim grantini olishda LearnX jamoasi katta yordam berdi. Endi Kanadada o'qiyapman!",
    'home.testimonials.description': 'Bizga ishongan talabalarimizning muvaffaqiyat hikoyalari',
    'home.partners.title': 'Hamkor universitetlar',
    'home.partners.description': 'Dunyoning eng yaxshi universitetlari bilan hamkorlik',
    'home.cta.title': 'Orzuingizdagi universitetga tayyormisiz?',
    'home.cta.description': 'Bugun biz bilan bog\'laning va chet davlatlarda yangi imkoniyatlarni kashf eting',
    'home.cta.apply': 'Ariza topshirish',
    'home.cta.contact': 'Bog\'lanish',

    // Services
    'services.title': 'Bizning xizmatlarimiz',
    'services.description': 'Professional jamoa sizga chet davlatlarga ta\'lim olish va ishlash uchun barcha zarur xizmatlarni taqdim etadi',
    'services.select': 'Tanlash',
    'services.details': 'Batafsil',
    'services.price': 'Narx',
    'services.duration': 'Davomiyligi',
    'services.successRate': 'Muvaffaqiyat',
    'services.features': 'Xizmat tarkibi:',
    'services.apply': 'Ariza topshirish',
    'services.consultation': 'Maslahat olish',
    'services.featured': 'Mashhur',
    'services.additionalFeatures': '+{count} boshqa xizmat',
    'services.whyChooseUs': 'Nima uchun bizni tanlash kerak?',
    'services.whyChooseUs.experience.title': '5+ yillik tajriba',
    'services.whyChooseUs.experience.description': 'Chet davlatlarga yuborish sohasida katta tajriba',
    'services.whyChooseUs.team.title': 'Professional jamoa',
    'services.whyChooseUs.team.description': 'Malakali mutaxassislar va huquqshunoslar',
    'services.whyChooseUs.countries.title': '50+ davlat',
    'services.whyChooseUs.countries.description': "Dunyoning ko'plab davlatlari bilan aloqa",
    'services.whyChooseUs.success.title': '98% muvaffaqiyat',
    'services.whyChooseUs.success.description': 'Yuqori muvaffaqiyat foizi va kafolat',
    'services.cta.title': 'Orzuingizdagi imkoniyatga tayyormisiz?',
    'services.cta.description': 'Bugun biz bilan bog\'laning va yangi imkoniyatlarni kashf eting',
    'services.cta.apply': 'Ariza topshirish',
    'services.cta.contact': 'Bog\'lanish',
    'services.touristVisa.title': 'Turist vizasi',
    'services.touristVisa.description': 'Sayohat uchun qisqa muddatli vizalar',
    'services.touristVisa.features.fastProcessing': 'Tez rasmiylashtirish',
    'services.touristVisa.features.fullDocumentation': "To'liq hujjat tayyorlash",
    'services.touristVisa.features.successGuarantee': '90% muvaffaqiyat kafolati',
    'services.touristVisa.features.support': "24/7 qo'llab-quvvatlash",
    'services.touristVisa.price': 'dan 150$',
    'services.studentVisa.title': 'Talaba vizasi',
    'services.studentVisa.description': "Ta'lim olish uchun uzoq muddatli vizalar",
    'services.studentVisa.features.universitySelection': 'Universitet tanlash',
    'services.studentVisa.features.grantAssistance': 'Grant yutishga yordam',
    'services.studentVisa.features.accommodation': 'Turar joy topish',
    'services.studentVisa.features.languageCourses': 'Til kurslari',
    'services.studentVisa.price': 'dan 300$',
    'services.workTravel.title': 'Work & Travel',
    'services.workTravel.description': 'AQSh Work & Travel dasturi',
    'services.workTravel.features.j1Visa': 'J-1 vizasi',
    'services.workTravel.features.jobPlacement': 'Ish joyi topish',
    'services.workTravel.features.culturalExchange': 'Madaniy almashish',
    'services.workTravel.features.travelOpportunity': 'Sayohat imkoniyati',
    'services.workTravel.price': 'dan 1000$',
    "services": {
      "whyChooseUs": "Nega bizni tanlashingiz kerak?",
      "experience": "5+ yillik tajriba",
      "experienceDesc": "Chet davlatlarga yuborish sohasida katta tajriba",
      "team": "Professional jamoa",
      "teamDesc": "Malakali mutaxassislar va huquqshunoslar",
      "countries": "50+ davlat",
      "countriesDesc": "Dunyoning ko'plab davlatlari bilan aloqa",
      "success": "98% muvaffaqiyat",
      "successDesc": "Yuqori muvaffaqiyat foizi va kafolat"
    },

    // Footer
    'footer.links': 'Tezkor havolalar',
    'footer.services.title': 'Xizmatlarimiz',
    'footer.contact': 'Aloqa ma\'lumotlari',
    'footer.rights': 'Barcha huquqlar himoyalangan.',
    'footer.privacy': 'Maxfiylik siyosati',
    'footer.terms': 'Foydalanish shartlari',
    'footer.help': 'Yordam',
    'footer.language': 'Til',
    'footer.services.visa': 'Visa olishga yordam',
    'footer.services.workTravel': 'Work & Travel',
    'footer.services.grant': "Ta'lim granti",
    'footer.services.language': 'Til kurslari',
    'footer.services.consulting': 'Maslahat xizmati',

    // Process
    'process.title': 'Qanday ishlaydi?',
    'process.description': 'Oddiy 4 bosqichda chet davlatlarga ta\'lim olish yoki ishlash uchun barcha zarur jarayonlarni amalga oshiramiz',
    'process.step': 'bosqich',
    'process.duration': 'Davomiyligi:',
    'process.ready.title': 'Boshlashga tayyormisiz?',
    'process.ready.description': 'Bugun biz bilan bog\'laning va birinchi bosqichni boshlang',
    'process.ready.consultation': 'Bepul maslahat',
    'process.ready.apply': 'Ariza topshirish',

    // Stories
    'stories.title': 'Muvaffaqiyat hikoyalari',
    'stories.description': 'Bizga ishongan va chet davlatlarda muvaffaqiyatga erishgan talabalarimizning haqiqiy hikoyalari',
    'stories.filter': 'Davlat bo\'yicha:',
    'stories.all': 'Barchasi',
    'stories.results.title': 'Bizning natijalarimiz',
    'stories.results.description': 'Raqamlar o\'z-o\'zidan gapiradi',
    'stories.cta.title': 'Sizning hikoyangiz keyingi bo\'lsin!',
    'stories.cta.description': 'Bugun biz bilan bog\'laning va o\'zingizning muvaffaqiyat hikoyangizni yarating',

    // Contact
    'contact.title': 'Biz bilan bog\'laning',
    'contact.description': 'Savollaringiz bormi? Yordam kerakmi? Bizning professional jamoamiz sizga har doim yordam berishga tayyor',
    'contact.form.title': 'Xabar yuborish',
    'contact.form.name': 'Ism va familiya',
    'contact.form.email': 'Email manzil',
    'contact.form.phone': 'Telefon raqam',
    'contact.form.subject': 'Mavzu',
    'contact.form.message': 'Xabar',
    'contact.form.send': 'Xabar yuborish',
    'contact.info.phone': 'Telefon',
    'contact.info.email': 'Email',
    'contact.info.address': 'Manzil',
    'contact.info.hours': 'Ish vaqti',

    // Apply
    'apply.title': 'Ariza topshirish',
    'apply.description': "Chet davlatlarga ta'lim olish yoki ishlash uchun ariza topshiring",
    'apply.step1': "Shaxsiy ma'lumotlar",
    'apply.step2': "Ta'lim va tajriba",
    'apply.step3': 'Dastur tanlash',
    'apply.step4': 'Hujjatlar',
    'apply.next': 'Keyingi',
    'apply.back': 'Orqaga',
    'apply.submit': 'Ariza topshirish',
    'apply.submitting': 'Yuborilmoqda...',

    // Profile
    'profile.title': 'Shaxsiy kabinet',
    'profile.description': 'Hisobingizni boshqaring va arizalaringizni kuzatib boring',
    'profile.edit': 'Profilni tahrirlash',
    'profile.applications': 'Mening arizalarim',
    'profile.documents': 'Hujjatlarim',
    'profile.stats': 'Statistika',
    'profile.activity': "So'nggi faoliyat",

    // Login
    'login.title': 'Xush kelibsiz!',
    'login.description': 'Hisobingizga kiring va o\'qishni davom eting',
    'login.email': 'Email manzil',
    'login.password': 'Parol',
    'login.remember': 'Meni eslab qol',
    'login.forgot': 'Parolni unutdingizmi?',
    'login.submit': 'Kirish',
    'login.google': 'Google orqali kirish',
    'login.register': 'Hisobingiz yo\'qmi?',
    'login.register.link': 'Ro\'yxatdan o\'ting',

    // Register
    'register.title': 'Keling boshlaylik!',
    'register.description': 'Yangi hisob yarating va ta\'lim sayohatingizni boshlang',
    'register.name': 'To\'liq ism',
    'register.email': 'Email manzil',
    'register.password': 'Parol',
    'register.confirm': 'Parolni tasdiqlang',
    'register.terms': 'Men foydalanish shartlari va maxfiylik siyosatiga roziman',
    'register.submit': 'Ro\'yxatdan o\'tish',
    'register.google': 'Google orqali ro\'yxatdan o\'tish',
    'register.login': 'Allaqachon hisobingiz bormi?',
    'register.login.link': 'Kirish',

    // Common
    'common.loading': 'Yuklanmoqda...',
    'common.error': 'Xatolik yuz berdi',
    'common.success': 'Muvaffaqiyatli',
    'common.cancel': 'Bekor qilish',
    'common.save': 'Saqlash',
    'common.edit': 'Tahrirlash',
    'common.delete': 'O\'chirish',
    'common.view': 'Ko\'rish',
    'common.download': 'Yuklab olish',
    'common.upload': 'Yuklash',
    'common.search': 'Qidirish',
    'common.filter': 'Filtr',
    'common.all': 'Barchasi',
    'common.yes': 'Ha',
    'common.no': 'Yo\'q',
    'common.required': 'Majburiy',
    'common.optional': 'Ixtiyoriy',
    

    // Process page
    'process.step1.title': 'Bepul maslahat',
    'process.step1.description': 'Mutaxassislarimiz bilan bog\'laning va maqsadlaringizni muhokama qiling',
    'process.step1.detail1': 'Shaxsiy uchrashuvda yoki onlayn maslahat',
    'process.step1.detail2': 'Sizning imkoniyatlaringizni baholash',
    'process.step1.detail3': 'Eng mos yo\'nalishni tanlash',
    'process.step1.detail4': 'Dastlabki reja tuzish',
    'process.step1.duration': '1-2 kun',
    'process.step2.title': 'Hujjatlar tayyorlash',
    'process.step2.description': 'Zarur hujjatlarni to\'plash va rasmiylashtirish',
    'process.step2.detail1': 'Hujjatlar ro\'yxatini tayyorlash',
    'process.step2.detail2': 'Tarjima va notarial tasdiq',
    'process.step2.detail3': 'Foto va boshqa materiallar',
    'process.step2.detail4': 'Hujjatlarni tekshirish',
    'process.step2.duration': '1-2 hafta',
    'process.step3.title': 'Ariza topshirish',
    'process.step3.description': 'Visa yoki dastur uchun rasmiy ariza topshirish',
    'process.step3.detail1': 'Onlayn ariza to\'ldirish',
    'process.step3.detail2': 'Hujjatlarni yuklash',
    'process.step3.detail3': 'To\'lovlarni amalga oshirish',
    'process.step3.detail4': 'Ariza holatini kuzatish',
    'process.step3.duration': '1-3 kun',
    'process.step4.title': 'Natija va safar',
    'process.step4.description': 'Ijobiy javob olish va safarga tayyorgarlik',
    'process.step4.detail1': 'Visa yoki qabul xatini olish',
    'process.step4.detail2': 'Aviachiptalar bron qilish',
    'process.step4.detail3': 'Turar joy topish',
    'process.step4.detail4': 'Safarga tayyorgarlik',
    'process.step4.duration': '2-8 hafta',
    'process.features.fast.title': 'Tez jarayon',
    'process.features.fast.description': 'Minimal vaqtda maksimal natija',
    'process.features.guarantee.title': 'Kafolat',
    'process.features.guarantee.description': 'Muvaffaqiyat kafolati yoki pul qaytarish',
    'process.features.personal.title': 'Shaxsiy yondashuv',
    'process.features.personal.description': 'Har bir mijoz uchun individual reja',
    'process.advantages': 'Bizning afzalliklarimiz',
  },
  en: {
    register: {
      title: "Let's get started!",
      subtitle: "Create a new account and begin your educational journey",
      email: "Email address",
      emailPlaceholder: "email@example.com",
      password: "Password",
      passwordPlaceholder: "Create a strong password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter your password",
      mismatch: "Passwords do not match",
      weak: "Password must be at least 6 characters",
      termsError: "Please agree to the terms of service",
      signup: "Register",
      or: "Or",
      google: "Sign up with Google",
      googleError: "Google registration error: ",
      googleRedirect: "Google sign-up started...",
      googleProcessError: "An error occurred during Google sign-up",
      success: "You have registered successfully!",
      error: "An error occurred during registration",
      alreadyHave: "Already have an account?",
      login: "Login",
      why: "Why LearnX?",
      benefits: [
        "Personal guidance and counseling",
        "98% success guarantee",
        "Fast and easy process"
      ],
      requirements: {
        minLength: "At least 6 characters",
        uppercase: "Uppercase letter",
        lowercase: "Lowercase letter",
        number: "Number"
      }
    },
    login: {
      "title": "Welcome!",
      "subtitle": "Log in to your account and continue learning",
      "email": "Email address",
      "password": "Password",
      "passwordPlaceholder": "Enter your password",
      "remember": "Remember me",
      "forgot": "Forgot password?",
      "login": "Login",
      "or": "Or",
      "google": "Sign in with Google",
      "noAccount": "Don't have an account?",
      "register": "Register",
      "features": {
        "education": "Education",
        "world": "World",
        "future": "Future"
      }
    },

    
    
 stories: {
    "title": "Success Stories",
      "subtitle": "Real stories of our students who trusted us and succeeded abroad",
        "filterByCountry": "Filter by country:",
          "all": "All",
            "resultsTitle": "Our Results",
              "resultsSubtitle": "The numbers speak for themselves",
                "nextStory": "Let your story be the next!",
                  "ctaText": "Contact us today and create your own success story",
                    "apply": "Apply Now",
                      "consultation": "Free Consultation"

},

   
      contact: {
        title: "Contact Us",
        subtitle: "Have questions? Need help? Our professional team is always ready to assist you.",
        form: {
          name: "Full Name",
          namePlaceholder: "Enter your name",
          email: "Email Address",
          phone: "Phone Number",
          subject: "Subject",
          selectSubject: "Select a subject",
          subjects: {
            visa: "Visa Application",
            workTravel: "Work & Travel",
            education: "Education Grant",
            consultation: "Consultation",
            other: "Other"
          },
          message: "Message",
          send: "Send Message"
        },
        toast: {
          success: "Your message has been successfully sent! We will contact you soon.",
          error: "An error occurred. Please try again."
        },
        contactInfo: {
          phone: "Phone",
          email: "Email",
          address: "Address",
          hours: "Working Hours"
        },
        location: "Our Location",
        features: {
          title: "Why Choose Us?",
          support: {
            title: "24/7 Support",
            desc: "We are always ready to answer your questions"
          },
          team: {
            title: "Professional Team",
            desc: "Experienced specialists are here to help you"
          },
          free: {
            title: "Free Consultation",
            desc: "The initial consultation is completely free"
          }
        }
      },

    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.process': 'Process',
    'nav.stories': 'Stories',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',

    // Stats
    'Muvaffaqiyatli talabalar': 'Successful students',
    'Hamkor universitetlar': 'Partner universities',
    'Muvaffaqiyat foizi': 'Success rate',
    'Yillik tajriba': 'Years of experience',
    "services": {
      "whyChooseUs": "Why Choose Us?",
      "experience": "5+ Years of Experience",
      "experienceDesc": "Extensive experience in sending to foreign countries",
      "team": "Professional Team",
      "teamDesc": "Qualified specialists and legal experts",
      "countries": "50+ Countries",
      "countriesDesc": "Connections with many countries around the world",
      "success": "98% Success Rate",
      "successDesc": "High success rate and guarantee"
    },


    // Home page
    'home.hero.span': 'First ranked educational platform in Uzbekistan',
    'home.hero.number': 'Successful students',
    'home.hero.title': 'Study abroad in',
    'home.hero.subtitle': 'top universities',
    'home.hero.description': 'We create opportunities for Uzbek youth to study at the world\'s best universities, obtain visas, and participate in Work & Travel programs',
    'home.hero.apply': 'Apply Now',
    'home.hero.consultation': 'Free Consultation',
    'home.services.title': 'Our Services',
    'home.services.description': 'Our professional team provides all necessary services for studying and working abroad',
    'home.testimonials.title': 'Student Success Stories',
    'home.testimonials.description': 'Real success stories from students who trusted us',
    'home.partners.title': 'Partner Universities',
    'home.partners.description': 'Partnerships with the world\'s best universities',
    'home.cta.title': 'Ready for your dream university?',
    'home.cta.description': 'Contact us today and discover new opportunities abroad',
    'home.cta.apply': 'Apply Now',
    'home.cta.contact': 'Contact Us',

    // Services
    'services.title': 'Our Services',
    'services.description': 'Our professional team provides all necessary services for studying and working abroad',
    'services.select': 'Select',
    'services.details': 'Details',
    'services.price': 'Price',
    'services.duration': 'Duration',
    'services.successRate': 'Success Rate',
    'services.features': 'Service includes:',
    'services.apply': 'Apply Now',
    'services.consultation': 'Get Consultation',
    'services.featured': 'Featured',
    'services.additionalFeatures': '+{count} additional services',
    'services.whyChooseUs': 'Why Choose Us?',
    'services.whyChooseUs.experience.title': '5+ Years of Experience',
    'services.whyChooseUs.experience.description': 'Extensive experience in international education and visa services',
    'services.whyChooseUs.team.title': 'Professional Team',
    'services.whyChooseUs.team.description': 'Qualified specialists and legal experts',
    'services.whyChooseUs.countries.title': '50+ Countries',
    'services.whyChooseUs.countries.description': 'Connections with numerous countries worldwide',
    'services.whyChooseUs.success.title': '98% Success Rate',
    'services.whyChooseUs.success.description': 'High success rate with guaranteed results',
    'services.cta.title': 'Ready for Your Dream Opportunity?',
    'services.cta.description': 'Contact us today and discover new possibilities',
    'services.cta.apply': 'Apply Now',
    'services.cta.contact': 'Contact Us',
    'services.touristVisa.title': 'Tourist Visa',
    'services.touristVisa.description': 'Short-term visas for travel',
    'services.touristVisa.features.fastProcessing': 'Fast processing',
    'services.touristVisa.features.fullDocumentation': 'Complete document preparation',
    'services.touristVisa.features.successGuarantee': '90% success guarantee',
    'services.touristVisa.features.support': '24/7 support',
    'services.touristVisa.price': 'from $150',
    'services.studentVisa.title': 'Student Visa',
    'services.studentVisa.description': 'Long-term visas for education',
    'services.studentVisa.features.universitySelection': 'University selection',
    'services.studentVisa.features.grantAssistance': 'Grant application assistance',
    'services.studentVisa.features.accommodation': 'Accommodation search',
    'services.studentVisa.features.languageCourses': 'Language courses',
    'services.studentVisa.price': 'from $300',
    'services.workTravel.title': 'Work & Travel',
    'services.workTravel.description': 'USA Work & Travel program',
    'services.workTravel.features.j1Visa': 'J-1 visa',
    'services.workTravel.features.jobPlacement': 'Job placement',
    'services.workTravel.features.culturalExchange': 'Cultural exchange',
    'services.workTravel.features.travelOpportunity': 'Travel opportunity',
    'services.workTravel.price': 'from $1000',

    // Footer
    'footer.links': 'Quick Links',
    'footer.services.title': 'Our Services',
    'footer.contact': 'Contact Information',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.help': 'Help',
    'footer.language': 'Language',
    'footer.services.visa': 'Visa Assistance',
    'footer.services.workTravel': 'Work & Travel',
    'footer.services.grant': 'Education Grant',
    'footer.services.language': 'Language Courses',
    'footer.services.consulting': 'Consulting Services',

    // Process
    'process.title': 'How It Works?',
    'process.description': 'Complete all necessary processes for studying or working abroad in 4 simple steps',
    'process.step': 'step',
    'process.duration': 'Duration:',
    'process.ready.title': 'Ready to Start?',
    'process.ready.description': 'Contact us today and begin the first step',
    'process.ready.consultation': 'Free Consultation',
    'process.ready.apply': 'Apply Now',

    // Stories
    'stories.title': 'Success Stories',
    'stories.description': 'Real stories from students who trusted us and achieved success abroad',
    'stories.filter': 'Filter by country:',
    'stories.all': 'All',
    'stories.results.title': 'Our Results',
    'stories.results.description': 'Numbers speak for themselves',
    'stories.cta.title': 'Your story could be next!',
    'stories.cta.description': 'Contact us today and create your own success story',

    // Contact
    'contact.title': 'Contact Us',
    'contact.description': 'Have questions? Need help? Our professional team is always ready to assist you',
    'contact.form.title': 'Send Message',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.info.phone': 'Phone',
    'contact.info.email': 'Email',
    'contact.info.address': 'Address',
    'contact.info.hours': 'Working Hours',

    // Apply
    'apply.title': 'Apply Now',
    'apply.description': 'Submit your application to study or work abroad',
    'apply.step1': 'Personal Information',
    'apply.step2': 'Education & Experience',
    'apply.step3': 'Program Selection',
    'apply.step4': 'Documents',
    'apply.next': 'Next',
    'apply.back': 'Back',
    'apply.submit': 'Submit Application',
    'apply.submitting': 'Submitting...',

    // Profile
    'profile.title': 'Personal Dashboard',
    'profile.description': 'Manage your account and track your applications',
    'profile.edit': 'Edit Profile',
    'profile.applications': 'My Applications',
    'profile.documents': 'My Documents',
    'profile.stats': 'Statistics',
    'profile.activity': 'Recent Activity',

    // Login
    'login.title': 'Welcome Back!',
    'login.description': 'Sign in to your account and continue learning',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.remember': 'Remember me',
    'login.forgot': 'Forgot password?',
    'login.submit': 'Sign In',
    'login.google': 'Sign in with Google',
    'login.register': 'Don\'t have an account?',
    'login.register.link': 'Sign up',

    // Register
    'register.title': 'Let\'s Get Started!',
    'register.description': 'Create a new account and begin your educational journey',
    'register.name': 'Full Name',
    'register.email': 'Email Address',
    'register.password': 'Password',
    'register.confirm': 'Confirm Password',
    'register.terms': 'I agree to the terms of service and privacy policy',
    'register.submit': 'Sign Up',
    'register.google': 'Sign up with Google',
    'register.login': 'Already have an account?',
    'register.login.link': 'Sign in',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.required': 'Required',
    'common.optional': 'Optional',

    // Process page
    'process.step1.title': 'Free Consultation',
    'process.step1.description': 'Contact our specialists and discuss your goals',
    'process.step1.detail1': 'Personal meeting or online consultation',
    'process.step1.detail2': 'Assessment of your opportunities',
    'process.step1.detail3': 'Choosing the best direction',
    'process.step1.detail4': 'Initial planning',
    'process.step1.duration': '1-2 days',
    'process.step2.title': 'Document Preparation',
    'process.step2.description': 'Collecting and formalizing necessary documents',
    'process.step2.detail1': 'Preparing document list',
    'process.step2.detail2': 'Translation and notarization',
    'process.step2.detail3': 'Photos and other materials',
    'process.step2.detail4': 'Document verification',
    'process.step2.duration': '1-2 weeks',
    'process.step3.title': 'Application Submission',
    'process.step3.description': 'Official application for visa or program',
    'process.step3.detail1': 'Online application completion',
    'process.step3.detail2': 'Document upload',
    'process.step3.detail3': 'Payment processing',
    'process.step3.detail4': 'Application status tracking',
    'process.step3.duration': '1-3 days',
    'process.step4.title': 'Result and Travel',
    'process.step4.description': 'Receiving positive response and travel preparation',
    'process.step4.detail1': 'Receiving visa or acceptance letter',
    'process.step4.detail2': 'Flight booking',
    'process.step4.detail3': 'Finding accommodation',
    'process.step4.detail4': 'Travel preparation',
    'process.step4.duration': '2-8 weeks',
    'process.features.fast.title': 'Fast Process',
    'process.features.fast.description': 'Maximum results in minimum time',
    'process.features.guarantee.title': 'Guarantee',
    'process.features.guarantee.description': 'Success guarantee or money back',
    'process.features.personal.title': 'Personal Approach',
    'process.features.personal.description': 'Individual plan for each client',
    'process.advantages': 'Our Advantages',
    "Qanday ishlaydi?":"How does it work?",
    "Oddiy 4 bosqichda chet davlatlarga ta'lim olish yoki ishlash uchun barcha zarur jarayonlarni amalga oshiramiz":"We carry out all the necessary processes for studying or working abroad in 4 simple steps"
  },
  ru: {
    register: {
      title: "Давайте начнем!",
      subtitle: "Создайте новый аккаунт и начните свое образовательное путешествие",
      email: "Электронная почта",
      emailPlaceholder: "email@example.com",
      password: "Пароль",
      passwordPlaceholder: "Создайте надежный пароль",
      confirmPassword: "Подтвердите пароль",
      confirmPasswordPlaceholder: "Повторно введите пароль",
      mismatch: "Пароли не совпадают",
      weak: "Пароль должен содержать не менее 6 символов",
      termsError: "Пожалуйста, согласитесь с условиями использования",
      signup: "Зарегистрироваться",
      or: "Или",
      google: "Зарегистрироваться через Google",
      googleError: "Ошибка регистрации через Google: ",
      googleRedirect: "Регистрация через Google началась...",
      googleProcessError: "Произошла ошибка при регистрации через Google",
      success: "Вы успешно зарегистрированы!",
      error: "Произошла ошибка при регистрации",
      alreadyHave: "Уже есть аккаунт?",
      login: "Войти",
      why: "Почему LearnX?",
      benefits: [
        "Индивидуальное сопровождение и консультации",
        "98% гарантия успеха",
        "Быстрый и простой процесс"
      ],
      requirements: {
        minLength: "Не менее 6 символов",
        uppercase: "Заглавная буква",
        lowercase: "Строчная буква",
        number: "Цифра"
      }
    },
    login: {
      "title": "Добро пожаловать!",
      "subtitle": "Войдите в свой аккаунт и продолжайте обучение",
      "email": "Электронная почта",
      "password": "Пароль",
      "passwordPlaceholder": "Введите ваш пароль",
      "remember": "Запомнить меня",
      "forgot": "Забыли пароль?",
      "login": "Войти",
      "or": "Или",
      "google": "Войти через Google",
      "noAccount": "У вас нет аккаунта?",
      "register": "Зарегистрироваться",
      "features": {
        "education": "Образование",
        "world": "Мир",
        "future": "Будущее"
      }
    },

    stories: {
      "title": "Истории успеха",
      "subtitle": "Реальные истории наших студентов, которые доверились нам и добились успеха за рубежом",
      "filterByCountry": "Поиск по стране:",
      "all": "Все",
      "resultsTitle": "Наши результаты",
      "resultsSubtitle": "Цифры говорят сами за себя",
      "nextStory": "Ваша история может быть следующей!",
      "ctaText": "Свяжитесь с нами сегодня и создайте свою историю успеха",
      "apply": "Подать заявку",
      "consultation": "Бесплатная консультация"
    },
    
      contact: {
        title: "Свяжитесь с нами",
        subtitle: "Есть вопросы? Нужна помощь? Наша профессиональная команда всегда готова помочь вам.",
        form: {
          name: "ФИО",
          namePlaceholder: "Введите ваше имя",
          email: "Электронная почта",
          phone: "Номер телефона",
          subject: "Тема",
          selectSubject: "Выберите тему",
          subjects: {
            visa: "Оформление визы",
            workTravel: "Work & Travel",
            education: "Образовательный грант",
            consultation: "Консультация",
            other: "Другое"
          },
          message: "Сообщение",
          send: "Отправить сообщение"
        },
        toast: {
          success: "Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.",
          error: "Произошла ошибка. Пожалуйста, попробуйте снова."
        },
        contactInfo: {
          phone: "Телефон",
          email: "Электронная почта",
          address: "Адрес",
          hours: "Часы работы"
        },
        location: "Наше местоположение",
        features: {
          title: "Почему выбирают нас?",
          support: {
            title: "Поддержка 24/7",
            desc: "Всегда готовы ответить на ваши вопросы"
          },
          team: {
            title: "Профессиональная команда",
            desc: "Опытные специалисты помогут вам"
          },
          free: {
            title: "Бесплатная консультация",
            desc: "Первая консультация абсолютно бесплатна"
          }
        }
      },
    "Oddiy 4 bosqichda chet davlatlarga ta'lim olish yoki ishlash uchun barcha zarur jarayonlarni amalga oshiramiz":"Мы осуществляем все необходимые процессы для обучения или работы за рубежом в 4 простых шага",
    "Qanday ishlaydi?":"Как это работает?",
    "services": {
      "whyChooseUs": "Почему выбирают нас?",
      "experience": "Более 5 лет опыта",
      "experienceDesc": "Большой опыт отправки в зарубежные страны",
      "team": "Профессиональная команда",
      "teamDesc": "Квалифицированные специалисты и юристы",
      "countries": "Более 50 стран",
      "countriesDesc": "Связи со многими странами мира",
      "success": "98% успеха",
      "successDesc": "Высокий процент успеха и гарантии"
    },
    // Navigation
    'nav.home': 'Главная',
    'nav.services': 'Услуги',
    'nav.process': 'Процесс',
    'nav.stories': 'Истории',
    'nav.contact': 'Контакты',
    'nav.login': 'Войти',
    'nav.register': 'Регистрация',
    'nav.profile': 'Профиль',
    'nav.logout': 'Выйти',

    // Stats
    'Muvaffaqiyatli talabalar': 'Успешные студенты',
    'Hamkor universitetlar': 'Университеты-партнеры',
    'Muvaffaqiyat foizi': 'Процент успеха',
    'Yillik tajriba': 'Лет опыта',

    // Testimonial
    'home.testimonials.person1': 'Я принял участие в программе Work & Travel через LearnX и получил(а) замечательный опыт. Процесс был очень простым и удобным',
    'home.testimonials.person2': 'Команда LearnX оказала большую помощь в получении образовательного гранта. Теперь я учусь в Канаде!',

    // Home page
    'home.hero.span': 'Первая образовательная платформа в Узбекистане',
    'home.hero.number': 'Успешные студенты',
    'home.hero.title': 'Получите образование',
    'home.hero.subtitle': 'за рубежом',
    'home.hero.description': 'Мы создаем возможности для узбекской молодежи учиться в лучших университетах мира, получать визы и участвовать в программах Work & Travel',
    'home.hero.apply': 'Подать заявку',
    'home.hero.consultation': 'Бесплатная консультация',
    'home.services.title': 'Наши услуги',
    'home.services.description': 'Наша профессиональная команда предоставляет все необходимые услуги для обучения и работы за рубежом',
    'home.testimonials.title': 'Истории успеха студентов',
    'home.testimonials.description': 'Реальные истории успеха студентов, которые нам доверились',
    'home.partners.title': 'Университеты-партнеры',
    'home.partners.description': 'Партнерство с лучшими университетами мира',
    'home.cta.title': 'Готовы к университету мечты?',
    'home.cta.description': 'Свяжитесь с нами сегодня и откройте новые возможности за рубежом',
    'home.cta.apply': 'Подать заявку',
    'home.cta.contact': 'Связаться с нами',

    // Services
    'services.title': 'Наши услуги',
    'services.description': 'Наша профессиональная команда предоставляет все необходимые услуги для обучения и работы за рубежом',
    'services.select': 'Выбрать',
    'services.details': 'Подробнее',
    'services.price': 'Цена',
    'services.duration': 'Длительность',
    'services.successRate': 'Успешность',
    'services.features': 'Услуга включает:',
    'services.apply': 'Подать заявку',
    'services.consultation': 'Получить консультацию',
    'services.featured': 'Популярно',
    'services.additionalFeatures': '+{count} дополнительных услуг',
    'services.whyChooseUs': 'Почему выбирают нас?',
    'services.whyChooseUs.experience.title': 'Более 5 лет опыта',
    'services.whyChooseUs.experience.description': 'Обширный опыт в сфере международного образования и виз',
    'services.whyChooseUs.team.title': 'Профессиональная команда',
    'services.whyChooseUs.team.description': 'Квалифицированные специалисты и юристы',
    'services.whyChooseUs.countries.title': '50+ стран',
    'services.whyChooseUs.countries.description': 'Связи с множеством стран по всему миру',
    'services.whyChooseUs.success.title': '98% успеха',
    'services.whyChooseUs.success.description': 'Высокий процент успеха с гарантированными результатами',
    'services.cta.title': 'Готовы к возможностям вашей мечты?',
    'services.cta.description': 'Свяжитесь с нами сегодня и откройте новые возможности',
    'services.cta.apply': 'Подать заявку',
    'services.cta.contact': 'Связаться с нами',
    'services.touristVisa.title': 'Туристическая виза',
    'services.touristVisa.description': 'Краткосрочные визы для путешествий',
    'services.touristVisa.features.fastProcessing': 'Быстрое оформление',
    'services.touristVisa.features.fullDocumentation': 'Полная подготовка документов',
    'services.touristVisa.features.successGuarantee': '90% гарантия успеха',
    'services.touristVisa.features.support': 'Поддержка 24/7',
    'services.touristVisa.price': 'от $150',
    'services.studentVisa.title': 'Студенческая виза',
    'services.studentVisa.description': 'Долгосрочные визы для обучения',
    'services.studentVisa.features.universitySelection': 'Выбор университета',
    'services.studentVisa.features.grantAssistance': 'Помощь с подачей на гранты',
    'services.studentVisa.features.accommodation': 'Поиск жилья',
    'services.studentVisa.features.languageCourses': 'Языковые курсы',
    'services.studentVisa.price': 'от $300',
    'services.workTravel.title': 'Work & Travel',
    'services.workTravel.description': 'Программа Work & Travel в США',
    'services.workTravel.features.j1Visa': 'Виза J-1',
    'services.workTravel.features.jobPlacement': 'Трудоустройство',
    'services.workTravel.features.culturalExchange': 'Культурный обмен',
    'services.workTravel.features.travelOpportunity': 'Возможность путешествий',
    'services.workTravel.price': 'от $1000',

    // Footer
    'footer.links': 'Быстрые ссылки',
    'footer.services.title': 'Наши услуги',
    'footer.contact': 'Контактная информация',
    'footer.rights': 'Все права защищены.',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.terms': 'Условия обслуживания',
    'footer.help': 'Помощь',
    'footer.language': 'Язык',
    'footer.services.visa': 'Помощь с визой',
    'footer.services.workTravel': 'Work & Travel',
    'footer.services.grant': 'Образовательный грант',
    'footer.services.language': 'Языковые курсы',
    'footer.services.consulting': 'Консультационные услуги',

    // Process
    'process.title': 'Как это работает?',
    'process.description': 'Выполните все необходимые процессы для обучения или работы за рубежом за 4 простых шага',
    'process.step': 'шаг',
    'process.duration': 'Длительность:',
    'process.ready.title': 'Готовы начать?',
    'process.ready.description': 'Свяжитесь с нами сегодня и начните первый шаг',
    'process.ready.consultation': 'Бесплатная консультация',
    'process.ready.apply': 'Подать заявку',

    // Stories
    'stories.title': 'Истории успеха',
    'stories.description': 'Реальные истории студентов, которые нам доверились и добились успеха за рубежом',
    'stories.filter': 'Фильтр по стране:',
    'stories.all': 'Все',
    'stories.results.title': 'Наши результаты',
    'stories.results.description': 'Цифры говорят сами за себя',
    'stories.cta.title': 'Ваша история может быть следующей!',
    'stories.cta.description': 'Свяжитесь с нами сегодня и создайте свою историю успеха',

    // Contact
    'contact.title': 'Свяжитесь с нами',
    'contact.description': 'Есть вопросы? Нужна помощь? Наша профессиональная команда всегда готова вам помочь',
    'contact.form.title': 'Отправить сообщение',
    'contact.form.name': 'Полное имя',
    'contact.form.email': 'Email адрес',
    'contact.form.phone': 'Номер телефона',
    'contact.form.subject': 'Тема',
    'contact.form.message': 'Сообщение',
    'contact.form.send': 'Отправить сообщение',
    'contact.info.phone': 'Телефон',
    'contact.info.email': 'Email',
    'contact.info.address': 'Адрес',
    'contact.info.hours': 'Рабочие часы',

    // Apply
    'apply.title': 'Подать заявку',
    'apply.description': 'Подайте заявку на обучение или работу за рубежом',
    'apply.step1': 'Личная информация',
    'apply.step2': 'Образование и опыт',
    'apply.step3': 'Выбор программы',
    'apply.step4': 'Документы',
    'apply.next': 'Далее',
    'apply.back': 'Назад',
    'apply.submit': 'Подать заявку',
    'apply.submitting': 'Отправка...',

    // Profile
    'profile.title': 'Личный кабинет',
    'profile.description': 'Управляйте своим аккаунтом и отслеживайте заявки',
    'profile.edit': 'Редактировать профиль',
    'profile.applications': 'Мои заявки',
    'profile.documents': 'Мои документы',
    'profile.stats': 'Статистика',
    'profile.activity': 'Последняя активность',

    // Login
    'login.title': 'Добро пожаловать!',
    'login.description': 'Войдите в свой аккаунт и продолжите обучение',
    'login.email': 'Email адрес',
    'login.password': 'Пароль',
    'login.remember': 'Запомнить меня',
    'login.forgot': 'Забыли пароль?',
    'login.submit': 'Войти',
    'login.google': 'Войти через Google',
    'login.register': 'Нет аккаунта?',
    'login.register.link': 'Зарегистрироваться',

    // Register
    'register.title': 'Давайте начнем!',
    'register.description': 'Создайте новый аккаунт и начните свое образовательное путешествие',
    'register.name': 'Полное имя',
    'register.email': 'Email адрес',
    'register.password': 'Пароль',
    'register.confirm': 'Подтвердите пароль',
    'register.terms': 'Я согласен с условиями обслуживания и политикой конфиденциальности',
    'register.submit': 'Зарегистрироваться',
    'register.google': 'Регистрация через Google',
    'register.login': 'Уже есть аккаунт?',
    'register.login.link': 'Войти',

    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Произошла ошибка',
    'common.success': 'Успешно',
    'common.cancel': 'Отмена',
    'common.save': 'Сохранить',
    'common.edit': 'Редактировать',
    'common.delete': 'Удалить',
    'common.view': 'Просмотр',
    'common.download': 'Скачать',
    'common.upload': 'Загрузить',
    'common.search': 'Поиск',
    'common.filter': 'Фильтр',
    'common.all': 'Все',
    'common.yes': 'Да',
    'common.no': 'Нет',
    'common.required': 'Обязательно',
    'common.optional': 'Необязательно',

    // Process page
    'process.step1.title': 'Бесплатная консультация',
    'process.step1.description': 'Свяжитесь с нашими специалистами и обсудите ваши цели',
    'process.step1.detail1': 'Личная встреча или онлайн консультация',
    'process.step1.detail2': 'Оценка ваших возможностей',
    'process.step1.detail3': 'Выбор наилучшего направления',
    'process.step1.detail4': 'Первоначальное планирование',
    'process.step1.duration': '1-2 дня',
    'process.step2.title': 'Подготовка документов',
    'process.step2.description': 'Сбор и оформление необходимых документов',
    'process.step2.detail1': 'Подготовка списка документов',
    'process.step2.detail2': 'Перевод и нотариальное заверение',
    'process.step2.detail3': 'Фото и другие материалы',
    'process.step2.detail4': 'Проверка документов',
    'process.step2.duration': '1-2 недели',
    'process.step3.title': 'Подача заявки',
    'process.step3.description': 'Официальная подача заявки на визу или программу',
    'process.step3.detail1': 'Заполнение онлайн заявки',
    'process.step3.detail2': 'Загрузка документов',
    'process.step3.detail3': 'Обработка платежей',
    'process.step3.detail4': 'Отслеживание статуса заявки',
    'process.step3.duration': '1-3 дня',
    'process.step4.title': 'Результат и поездка',
    'process.step4.description': 'Получение положительного ответа и подготовка к поездке',
    'process.step4.detail1': 'Получение визы или письма о зачислении',
    'process.step4.detail2': 'Бронирование авиабилетов',
    'process.step4.detail3': 'Поиск жилья',
    'process.step4.detail4': 'Подготовка к поездке',
    'process.step4.duration': '2-8 недель',
    'process.features.fast.title': 'Быстрый процесс',
    'process.features.fast.description': 'Максимальный результат за минимальное время',
    'process.features.guarantee.title': 'Гарантия',
    'process.features.guarantee.description': 'Гарантия успеха или возврат денег',
    'process.features.personal.title': 'Персональный подход',
    'process.features.personal.description': 'Индивидуальный план для каждого клиента',
    'process.advantages': 'Наши преимущества',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uz');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['uz', 'en', 'ru'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // const t = (key: string, params: Record<string, any> = {}): string => {
  //   const translation = translations[language][key as keyof typeof translations[typeof language]];
  //   if (!translation) {
  //     console.warn(`Translation missing for key: ${key} in language: ${language}`);
  //     return key;
  //   }
  //   if (typeof translation === 'string') {
  //     return Object.keys(params).reduce(
  //       (str, param) => str.replace(`{${param}}`, params[param]),
  //       translation
  //     );
  //   }
  //   return translation;
  // };
  const t = (key: string, params: Record<string, any> = {}): any => {
    const langData = translations[language];

    // 1. Try flat access first (e.g., "homeTitle")
    if (key in langData) {
      const flatResult = langData[key as keyof typeof langData];
      if (typeof flatResult === 'string') {
        return Object.keys(params).reduce(
          (str, param) => str.replace(`{${param}}`, params[param]),
          flatResult
        );
      }
      return flatResult; // ✅ Return array or object if not a string
    }

    // 2. Nested access (e.g., "contact.contactInfo.phone")
    const keys = key.split('.');
    let nestedResult: any = langData;

    for (const k of keys) {
      nestedResult = nestedResult?.[k];
      if (nestedResult === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        return key;
      }
    }

    // ✅ Return result based on type
    if (typeof nestedResult === 'string') {
      return Object.keys(params).reduce(
        (str, param) => str.replace(`{${param}}`, params[param]),
        nestedResult
      );
    }

    return nestedResult; // ✅ Now arrays like `t("register.benefits")` will work!
  };


  // const t = (key: string, params: Record<string, any> = {}): string => {
  //   const langData = translations[language];

  //   // 1. Try flat access first (for old translations like "homeTitle")
  //   if (key in langData) {
  //     let result = langData[key as keyof typeof langData];
  //     if (typeof result === 'string') {
  //       return Object.keys(params).reduce(
  //         (str, param) => str.replace(`{${param}}`, params[param]),
  //         result
  //       );
  //     }
  //     return result;
  //   }

  //   // 2. Fallback to nested key access (for new deep keys like "contact.contactInfo.phone")
  //   const keys = key.split('.');
  //   let nestedResult: any = langData;

  //   for (const k of keys) {
  //     nestedResult = nestedResult?.[k];
  //     if (nestedResult === undefined) {
  //       console.warn(`Translation missing for key: ${key} in language: ${language}`);
  //       return key;
  //     }
  //   }

  //   if (typeof nestedResult === 'string') {
  //     return Object.keys(params).reduce(
  //       (str, param) => str.replace(`{${param}}`, params[param]),
  //       nestedResult
  //     );
  //   }

  //   return key;
  // };


  // const t = (key: string, params: Record<string, any> = {}): string => {
  //   const keys = key.split('.');
  //   let result: any = translations[language];

  //   for (const k of keys) {
  //     result = result?.[k];
  //     if (result === undefined) {
  //       console.warn(`Translation missing for key: ${key} in language: ${language}`);
  //       return key;
  //     }
  //   }

  //   if (typeof result === 'string') {
  //     return Object.keys(params).reduce(
  //       (str, param) => str.replace(`{${param}}`, params[param]),
  //       result
  //     );
  //   }

  //   return key;
  // };


 
  const value = {
    language,
    setLanguage: handleSetLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};