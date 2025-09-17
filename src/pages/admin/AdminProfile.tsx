import adminlogo from '../../../public/76.jpg'
import { useEffect, useState } from "react"

const AdminProfile = () => {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1200)
        return()=> clearTimeout(timer)
    }, [])

return (
   <>
    {loading ?
      (<p className="loader1"></p>)
       :
      <section className="border border-white/5 bg-gray-100 p-4 my-3 rounded-xl ">
        <div className=" min-h-[72vh] backdrop-blur-sm text-gray-800">

            <div className="flex justify-start gap-10 my-6">
                <img src={adminlogo} alt="Admin Logo" className="rounded-full h-40 w-40 object-cover" />
                <div className="w-[600px]">
                    <form className="flex flex-col max-w-[400px] gap-2">
                        <label htmlFor="fullname">Ismi, Familiyasi</label>
                        <input id="fullname" type="text"
                            className="w-full border border-gray-400 rounded-lg bg-white/5 p-2 text-gray-500 placeholder-gray-400 backdrop-blur-lg focus:outline-none focus:border-gray-600 mb-2" />
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email"
                            className="w-full border border-gray-400 rounded-lg bg-white/5 p-2 text-gray-500 placeholder-gray-400 backdrop-blur-lg focus:outline-none focus:border-gray-600 mb-2" />
                        <button type="button"
                            className="w-[130px] border p-2 rounded-lg text-white  bg-blue-400 hover:bg-blue-500 active:scale-95 transition">
                            O'zgartirish
                        </button>
                    </form>
                </div>
            </div>

            <div className="flex flex-col justify-around px-6 ">
                <h2 className="text-2xl py-5 font-semibold text-gray-600">Parolni boshqarish</h2>
                <div className="grid grid-cols-2 gap-4 max-w-[520px]">
                    <input type="password"
                        placeholder="Hozirgi parolni kiriting"
                        className="w-full border border-gray-400 rounded-lg bg-white/5 p-2 text-gray-500 placeholder-gray-400 backdrop-blur-lg focus:outline-none focus:border-gray-600 mb-2" />
                    <input type="password"
                        placeholder="Yangi parolni kiriting"
                        className="w-full border border-gray-400 rounded-lg bg-white/5 p-2 text-gray-500 placeholder-gray-400 backdrop-blur-lg focus:outline-none focus:border-gray-600 mb-2" />
                    <input type="password"
                        placeholder="Yangi parolni tasdiqlang"
                        className="w-full border border-gray-400 rounded-lg bg-white/5 p-2 text-gray-500 placeholder-gray-400 backdrop-blur-lg focus:outline-none focus:border-gray-600 mb-2" />
                    <button type="button"
                        className="w-full border p-2 rounded-lg text-white  bg-blue-400 hover:bg-blue-500 active:scale-95 transition">
                        Parolni o'zgartirish
                    </button>
                </div>
            </div>
        </div>
      </section>
    }
   </>
)
}

export default AdminProfile