import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, FileText, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfileData {
  full_name: string;
  phone: string;
  email: string;
  passport_number: string;
}

interface ProfileEditorProps {
  profile: ProfileData;
  onSave: (profileData: ProfileData) => void;
  onClose: () => void;
}

const apiDomain = 'https://learnx-crm-production.up.railway.app'; // API manzili

const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave, onClose }) => {
  const [formData, setFormData] = useState<ProfileData>({
    full_name: profile.full_name || '',
    phone: profile.phone || '',
    email: profile.email || '',
    passport_number: profile.passport_number || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiToken = localStorage.getItem('api_access_token');
      const clientId = localStorage.getItem('client_id');

      if (!apiToken || !clientId) {
        throw new Error('API token yoki Client ID topilmadi. Iltimos, tizimga qayta kiring.');
      }

      const res = await fetch(`${apiDomain}/api/v1/clients/update/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Profilni yangilashda xatolik: ${JSON.stringify(errorData)}`);
      }

      toast.success('Profil muvaffaqiyatli yangilandi');
      onSave(formData);
      onClose();
    } catch (err) {
      console.error('Profilni yangilashda xatolik:', err);
      toast.error(`Xatolik yuz berdi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profilni tahrirlash</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To'liq ism</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Ismingizni kiriting"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon raqam</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                placeholder="+998 90 123 45 67"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Email kiriting"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passport raqami</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="passport_number"
                value={formData.passport_number}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                placeholder="AB1234567"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Saqlash</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Bekor qilish
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProfileEditor;