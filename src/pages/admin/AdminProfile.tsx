import { ChevronDown } from "lucide-react"
import adminlogo from '../../../public/76.jpg'

const AdminProfile = () => {



  return (
    <section className="border border-white/40 p-4 my-3 bg-gray-100 rounded-xl ">
      <div className="bg-gray-100 min-h-[72vh] backdrop-blur-sm text-white">

        <div className="flex justify-between items-center px-8 py-4">
            <h2 className="text-3xl font-semibold">Admin profil</h2>
            <div className="relative">
            <select
                className="appearance-none outline-none p-2 pr-8 rounded-lg bg-transparent border border-white/30 text-center">
                <option>Admin</option>
                <option>SuperAdmin</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70" size={16} />
            </div>
        </div>

        <div className="flex justify-start gap-10 my-6">
            <img src={adminlogo} alt="Admin Logo" className="rounded-full h-40 w-40 object-cover" />
            <div className="w-[600px]">
            <form className="flex flex-col max-w-[750px] gap-2">
                <label htmlFor="fullname">Ismi, Familiyasi</label>
                <input id="fullname" type="text"
                className="w-full border border-white/20 rounded-lg bg-white/5 p-2 text-white placeholder-white/50 backdrop-blur-lg focus:outline-none focus:border-white/30 mb-2" />
                <label htmlFor="email">Email</label>
                <input id="email" type="email"
                className="w-full border border-white/20 rounded-lg bg-white/5 p-2 text-white placeholder-white/50 backdrop-blur-lg focus:outline-none focus:border-white/30 mb-2" />
                <button type="button"
                className="w-[130px] border p-2 rounded-lg border-white/30 bg-[#20C997] hover:bg-[#17B48A] active:scale-95 transition">
                O'zgartirish
                </button>
            </form>
            </div>
        </div>

        <div className="flex flex-col justify-around px-6">
            <h2 className="text-2xl py-5 font-semibold">Parolni boshqarish</h2>
            <div className="grid grid-cols-2 gap-4">
            <input type="password"
                placeholder="Hozirgi parolni kiriting"
                className="w-[380px] border border-white/20 rounded-lg bg-white/5 p-2 text-white placeholder-white/50 backdrop-blur-lg focus:outline-none focus:border-white/30" />
            <input type="password"
                placeholder="Yangi parolni kiriting"
                className="w-[380px] border border-white/20 rounded-lg bg-white/5 p-2 text-white placeholder-white/50 backdrop-blur-lg focus:outline-none focus:border-white/30" />
            <input type="password"
                placeholder="Yangi parolni tasdiqlang"
                className="w-[380px] border border-white/20 rounded-lg bg-white/5 p-2 text-white placeholder-white/50 backdrop-blur-lg focus:outline-none focus:border-white/30" />
            <button type="button"
                className="border border-white/20 w-[380px] rounded-lg h-[44px] bg-[#20C997] hover:bg-[#17B48A] active:scale-95 transition">
                Parolni o'zgartirish
            </button>
            </div>
        </div>
      </div>
    </section>
  )
}

export default AdminProfile