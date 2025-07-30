import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'uz' | 'en' | 'ru'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  uz: {
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
    
    // Home page
    'home.hero.title': 'Chet davlatlarda',
    'home.hero.subtitle': "ta'lim oling",
    'home.hero.description': "O'zbekiston yoshlari uchun dunyoning eng yaxshi universitetlarida ta'lim olish, visa olish va Work & Travel dasturlarida qatnashish imkoniyatini yaratamiz",
    'home.hero.apply': 'Ariza topshirish',
    'home.hero.consultation': 'Bepul maslahat',
    'home.services.title': 'Bizning xizmatlarimiz',
    'home.services.description': "Professional jamoa sizga chet davlatlarga ta'lim olish va ishlash uchun barcha zarur xizmatlarni taqdim etadi",
    'home.testimonials.title': 'Talabalarimizning hikoyalari',
    'home.testimonials.description': 'Bizga ishongan talabalarimizning muvaffaqiyat hikoyalari',
    'home.partners.title': 'Hamkor universitetlar',
    'home.partners.description': 'Dunyoning eng yaxshi universitetlari bilan hamkorlik',
    'home.cta.title': 'Orzuingizdagi universitetga tayyormisiz?',
    'home.cta.description': 'Bugun biz bilan bog\'laning va chet davlatlarda yangi imkoniyatlarni kashf eting',
    'home.cta.apply': 'Ariza topshirish',
    'home.cta.contact': 'Bog\'lanish',
    
    // Services
    'services.title': 'Bizning xizmatlarimiz',
    'services.description': "Professional jamoa sizga chet davlatlarga ta'lim olish va ishlash uchun barcha zarur xizmatlarni taqdim etadi",
    'services.select': 'Tanlash',
    'services.details': 'Batafsil',
    'services.price': 'Narx',
    'services.duration': 'Davomiyligi',
    'services.features': 'Xizmat tarkibi:',
    'services.apply': 'Ariza topshirish',
    'services.consultation': 'Maslahat olish',
    
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
    
    // Footer
    'footer.links': 'Tezkor havolalar',
    'footer.services.title': 'Xizmatlarimiz',
    'footer.contact': 'Aloqa ma\'lumotlari',
    'footer.rights': 'Barcha huquqlar himoyalangan.',
    'footer.privacy': 'Maxfiylik siyosati',
    'footer.terms': 'Foydalanish shartlari',
    'footer.help': 'Yordam',
    
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
    
    // Home page
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
    'services.features': 'Service includes:',
    'services.apply': 'Apply Now',
    'services.consultation': 'Get Consultation',
    
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
    
    // Footer
    'footer.links': 'Quick Links',
    'footer.services.title': 'Our Services',
    'footer.contact': 'Contact Information',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.help': 'Help',
    
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
  },
  ru: {
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
    
    // Home page
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
    'services.features': 'Услуга включает:',
    'services.apply': 'Подать заявку',
    'services.consultation': 'Получить консультацию',
    
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
    
    // Footer
    'footer.links': 'Быстрые ссылки',
    'footer.services.title': 'Наши услуги',
    'footer.contact': 'Контактная информация',
    'footer.rights': 'Все права защищены.',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.terms': 'Условия обслуживания',
    'footer.help': 'Помощь',
    
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
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uz')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['uz', 'en', 'ru'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}