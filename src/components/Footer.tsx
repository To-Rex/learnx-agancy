import React from 'react';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext'

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <GraduationCap className="h-10 w-10 text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LearnX
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('home.hero.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-white/10">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors p-2 rounded-lg hover:bg-white/10">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-white/10">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-white/10">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">{t('footer.links')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to="/process" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  {t('nav.process')}
                </Link>
              </li>
              <li>
                <Link to="/stories" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  {t('nav.stories')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/apply" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  {t('home.hero.apply')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">{t('footer.services.title')}</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  {t('services.features') + ' ' + t('services.apply')}
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">Work & Travel</span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t('services.features') + ' ' + t('services.consultation')}</span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t('services.features') + ' ' + t('services.details')}</span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t('services.features') + ' ' + t('services.price')}</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">{t('footer.contact')}</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>
                <a href='tel:+998910216001' className="text-gray-300 hover:text-white text-sm">+998 91 021 60 01</a>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <Mail className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-gray-300 text-sm cursor-pointer hover:text-white">
                  <a target='_blank' href="mailto:umidyusupov258@gmail.com">umidyusupov258@gmail.com</a>
                </span>
              </div>
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                  <MapPin className="h-4 w-4 text-orange-400" />
                </div>
                <span className="text-gray-300 text-sm hover:text-white">{t('contact.info.address')}
                  <a target='_blank' href="https://yandex.uz/map-widget/v1/?ll=69.285628%2C41.332677&z=16&l=map"> : Toshkent, O'zbekiston</a>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              © 2024 LearnX. {t('footer.rights')}
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">{t('footer.terms')}</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">{t('footer.help')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;