import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/admin/AdminSitebar'
import { Home, LogOut, Settings } from 'lucide-react'
import adminlogo from '../../../public/76.jpg'
import { BiMenuAltLeft } from 'react-icons/bi'

const AdminLayout: React.FC = () => {
    const [openProfil, setOpenProfil] = useState(false)
    const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('admin_user')
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="fixed right-0 left-[256px] z-50 flex justify-between items-center bg-gray-300 shadow px-6 py-4">
            <div className='text-[34px] text-gray-800 font-bold cursor-pointer'>
                <BiMenuAltLeft className='font-bold'/>
            </div>

            <div className='flex justify-center items-center gap-8'>
              <button onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 font-[500] rounded-xl bg-white/60 hover:bg-white/80 transition-all duration-400">
                <Home className="h-4 w-4" />
                <span>Saytga qaytish</span>
              </button>
              <div onClick={() => setOpenProfil(!openProfil)} className='cursor-pointer active:scale-95 duration-500'>
                <img src={adminlogo} alt="admin logo image" className='w-[48px] h-12 rounded-full object-cover' />
              </div>
            </div>

            {openProfil && (
            <div onClick={() => setOpenProfil(false)} className='flex items-center justify-end fixed z-50 right-6 top-20 '>
                <div onClick={(e) => e.stopPropagation()} className='border border-gray-400 rounded-lg overflow-hidden text-center bg-gray-400 w-[180px] text-white'>
                    <h2 className='py-3 bg-gray-500 font-semibold'>Admin Full name</h2>
                    <span onClick={() => {navigate('/admin/profile') ; setOpenProfil(false)}}
                        className='flex justify-center items-center gap-1 mx-auto cursor-pointer hover:bg-slate-500/40 py-3'>
                        <Settings className='h-5' />
                        <p>Profil sozlamari</p>
                    </span>
                    <button onClick={handleLogout} className='py-2 w-full hover:bg-red-500'>
                    <span className='flex items-center gap-1'>
                        <LogOut className='h-5 font-bold ml-5' />
                        Chiqish
                    </span>
                    </button>
                </div>
            </div>
            )}

            {/* <span className="text-gray-600">
              {location.pathname.replace('/admin', '') || '/dashboard'}
            </span> */}
        </header>

        {/* Page content */}
        <main className="p-4 flex-1 ml-64 mt-16 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
