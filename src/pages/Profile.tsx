import React from 'react'
import { User, Mail, Phone, MapPin, Calendar, FileText, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Profile: React.FC = () => {
  const { user } = useAuth()

  const applications = [
    {
      id: 1,
      type: "Turist vizasi",
      country: "AQSh",
      status: "Jarayonda",
      date: "2024-01-15",
      statusColor: "text-blue-600 bg-blue-100"
    },
    {
      id: 2,
      type: "Work & Travel",
      country: "AQSh",
      status: "Tasdiqlangan",
      date: "2023-12-10",
      statusColor: "text-green-600 bg-green-100"
    },
    {
      id: 3,
      type: "Maslahat",
      country: "Kanada",
      status: "Yakunlangan",
      date: "2023-11-20",
      statusColor: "text-gray-600 bg-gray-100"
    }
  ]

  const documents = [
    { name: "Passport nusxasi", uploaded: true, date: "2024-01-10" },
    { name: "Foto 3x4", uploaded: true, date: "2024-01-10" },
    { name: "Bank ma'lumotnomasi", uploaded: false, date: null },
    { name: "Ish joyidan ma'lumotnoma", uploaded: true, date: "2024-01-12" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shaxsiy kabinet</h1>
          <p className="text-gray-600 mt-2">Hisobingizni boshqaring va arizalaringizni kuzatib boring</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user?.email?.split('@')[0] || 'Foydalanuvchi'}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">+998 90 123 45 67</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Toshkent, O'zbekiston</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">A'zo bo'ldi: Yanvar 2024</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Profilni tahrirlash
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Statistika</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Jami arizalar</span>
                  <span className="font-semibold text-gray-900">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasdiqlangan</span>
                  <span className="font-semibold text-green-600">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jarayonda</span>
                  <span className="font-semibold text-blue-600">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yakunlangan</span>
                  <span className="font-semibold text-gray-600">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Applications */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Mening arizalarim</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Yangi ariza
                </button>
              </div>

              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{app.type}</h4>
                        <p className="text-gray-600">{app.country}</p>
                        <p className="text-sm text-gray-500 mt-1">Sana: {app.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${app.statusColor}`}>
                          {app.status}
                        </span>
                        <button className="block mt-2 text-blue-600 hover:text-blue-700 text-sm">
                          Batafsil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Hujjatlarim</h3>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Hujjat yuklash
                </button>
              </div>

              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.name}</h4>
                        {doc.uploaded && doc.date && (
                          <p className="text-sm text-gray-500">Yuklandi: {doc.date}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.uploaded ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-600">Yuklangan</span>
                        </>
                      ) : (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Yuklash
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">So'nggi faoliyat</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-900">Turist vizasi uchun ariza topshirildi</p>
                    <p className="text-sm text-gray-500">2 soat oldin</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-900">Work & Travel arizasi tasdiqlandi</p>
                    <p className="text-sm text-gray-500">1 kun oldin</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-900">Yangi hujjat yuklandi</p>
                    <p className="text-sm text-gray-500">3 kun oldin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile