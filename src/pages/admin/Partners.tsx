import { Building, Edit, Plus, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast";

interface Partner {
    id: string;
    image: string;
    name: {
      en: string;
      uz: string;
      ru: string;
    };
}

const Partners = () => {
    const [partners, setPartners] = useState([])
    const [showPartnerModal, setShowPartnerModal] = useState<boolean>(false);
    const [partnerDeleteModal, setPartnerDeleteModal] = useState(false);
    const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [loading, setLoading] = useState(false)

    const [partnerForm, setPartnerForm] = useState({
      name: {
        en: "",
        uz: "",
        ru: "",
      },
      image: '',
      image_file: null
    });



    const loadPartners = async () => {
        try {
          const res = await fetch("https://learnx-crm-production.up.railway.app/api/v1/partners/get-list", {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${localStorage.getItem("your_access_token_key_here") || ""}`, }
          })
          const data = await res.json()
          if (data && data.length > 0) {
            const mappedPartners = data.map((item: any) => ({
              id: item.id || "",
              image: item.image_url || "",
              name: {
                en: item.name?.en || "",
                uz: item.name?.uz || "",
                ru: item.name?.ru || "",
              },
            }))
            setPartners(mappedPartners)
          } else {
            setPartners([])
          }
        } catch (error) {
          console.error("Hamkorlarni yuklashda xatolik:", error);
        } finally {
          setLoading(false);
        }
      }
    
      useEffect(() => {
        loadPartners();
      }, []);
    
      const handleDeletePartnerClick = (id: string) => {
        setPartnerToDelete(id);
        setPartnerDeleteModal(true);
      }
    
      const handleConfirmPartnerDelete = async () => {
        if (!partnerToDelete) return;
    
        try {
          const token = localStorage.getItem("admin_access_token") || "";
          const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/partners/delete/${partnerToDelete}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (res.ok) {
            loadPartners();
            setPartnerDeleteModal(false);
            setPartnerToDelete(null);
          } else {
            const errorData = await res.json();
            toast.error(errorData.message || res.statusText);
          }
        } catch (error) {
          console.error('Hamkorni o\'chirishda xatolik:', error);
          toast.error('Hamkorni o\'chirishda xatolik yuz berdi');
        }
      }
    
      const handleAddPartners = () => {
        setEditingItem(null);
        setPartnerForm({
          name: {
            en: '',
            uz: '',
            ru: '',
          },
          image: '',
          image_file: null
        });
        setShowPartnerModal(true);
      };
    
      const handleEditPartners = (partner: any) => {
        setPartnerForm({
          name: {
            en: partner.name?.en || '',
            uz: partner.name?.uz || '',
            ru: partner.name?.ru || '',
          },
          image: partner.image || '',
          image_file: partner.image_url || null,
        });
        setEditingItem(partner);
        setShowPartnerModal(true);
      };
    
      const handleSavePartners = async () => {
        try {
          const token = localStorage.getItem("admin_access_token") || "";
    
          if (!token) {
            alert("Token topilmadi. Iltimos, tizimga qaytadan kiring.");
            return;
          }
          const formData = new FormData();
          // formData.append("name", JSON.stringify(partnerForm.name));
          formData.append("name_ru", partnerForm.name.ru || '');
          formData.append("name_uz", partnerForm.name.uz || '');
          formData.append("name_en", partnerForm.name.en || '');
          formData.append("json_data", JSON.stringify({ ...partnerForm, "image_url": partnerForm.image }));
    
          console.log(`partnerForm.image::::::`, partnerForm.image_file);
    
          if (partnerForm.image_file) {
            console.log(`partnerForm.image_file=========`, partnerForm.image_file);
    
            formData.append("file", partnerForm.image_file);
          }
          let url = "https://learnx-crm-production.up.railway.app/api/v1/partners/create";
          let method = "POST";
    
          if (editingItem && editingItem.id) {
            url = `https://learnx-crm-production.up.railway.app/api/v1/partners/update/${editingItem.id}`;
            method = "PUT";
          }
    
          const res = await fetch(url, {
            method,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
    
          let responseData = '';
          try {
            responseData = await res.json(); // JSON parse qilishga urinamiz
          } catch (error) {
            console.log(error);
    
            responseData = ''; // bo'sh javob bo'lsa
          }
    
          if (res.ok) {
            toast.success("Muvaffaqiyatli saqlandi");
            setShowPartnerModal(false);
            loadPartners();
          } else {
            console.error("Xatolik:", responseData?.message || res.statusText);
            alert("Xizmatni saqlashda xatolik: " + (responseData?.message || res.statusText));
          }
        } catch (error) {
          console.error("Kutilmagan xatolik:", error);
          alert("Xizmatni saqlashda kutilmagan xatolik yuz berdi");
        }
      };

  return (
    <section className="my-3 border border-white/5 bg-gray-100 shadow-sm overflow-hidden rounded-xl">
        <div className="py-4 px-6 shadow-sm  border-b border-white/5">
            <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Building className="h-6 w-6 mr-3 text-indigo-400" />
                Hamkorlar boshqaruvi
            </h2>
            <button onClick={handleAddPartners}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 shadow-sm">
                <Plus className="h-4 w-4" />
                <span>Yangi hamkor</span>
            </button>
            </div>
        </div>

        <div className="p-4 m-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? <span className='loader'></span> :
              partners &&  partners.map((partner: Partner, index: number) => (
                <div className="bg-gray-200/30 border border-black/10 rounded-xl p-4 transition-all duration-300 group ">
                    {partner.image && (
                      <div className="h-48 overflow-hidden rounded-xl">
                        <img src={partner.image} alt={partner.name}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-400"/>
                      </div>)}
                    <div className="flex justify-between items-start mb-4 p-2">
                        <div className='flex flex-col items-center'>
                            <h3 className="font-semibold text-gray-700 text-lg group-hover:text-gary-800 transition-colors">{partner.name.en}</h3>
                            <h3 className="font-semibold text-gray-700 text-lg group-hover:text-gary-800 transition-colors">{partner.name.ru}</h3>
                            <h3 className="font-semibold text-gray-700 text-lg group-hover:text-gary-800 transition-colors">{partner.name.uz}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handleEditPartners(partner)}
                                className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300">
                                <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeletePartnerClick(partner.id)}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div >
                </div >
            ))}
            </div >
        </div>

           {partnerDeleteModal && (
            <div className='fixed inset-0  bg-black/40 flex justify-center items-center rounded-md '>
                <div className='backdrop-blur-xl py-6 px-4 rounded-lg bg-white/20 ml-24 max-w-[570px]'>
                <h1 className='text-2xl text-center text-white font-600 pb-4'>Haqiqatdan ham o'chirmoqchimisiz</h1>
                <div className='flex justify-center items-center gap-4 pt-4 ml-36'>
                    <button onClick={() => setPartnerDeleteModal(false)}
                       className='py-3 px-10 text-white bg-green-600 rounded-lg font-[600] hover:bg-green-700 duration-300'>
                       Bekor qilish
                    </button>
                    <button onClick={handleConfirmPartnerDelete}
                       className='py-3 px-14 text-white bg-red-600 rounded-lg font-[600] hover:bg-red-700 duration-300'>
                       O'chirish
                    </button>
                </div>
                </div>
            </div>
            )}

          {showPartnerModal && (
            <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4">
                <div className="backdrop-blur-2xl bg-black/10 ml-24 rounded-xl p-6 w-full max-w-xl border border-white/20 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {editingItem ? 'Hamkorni tahrirlash' : 'Yangi hamkor qo‘shish'}
                    </h2>
                    <button onClick={() => setShowPartnerModal(false)}
                        className="w-9 h-9 bg-white/10 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300">
                        <X className="w-5 h-5 text-white" />
                    </button>
                    </div>

                    <div className="space-y-4">
                    <div>
                        <label className="block text-white text-sm font-semibold mb-2">Hamkor nomi (En)</label>
                        <input type="text" name="name_en" value={partnerForm.name.en}
                            onChange={(e) => setPartnerForm({ ...partnerForm, name: { ...partnerForm.name, en: e.target.value } })}
                            className="w-full px-4 py-2 outline-none bg-white/10 border border-white/80 rounded-lg text-white focus:bg-white/5 focus:border-white/5 focus:ring-1 focus:ring-white" />
                    </div>
                    <div>
                        <label className="block text-white text-sm font-semibold mb-2">Hamkor nomi (Ru)</label>
                        <input type="text" name="name_ru" value={partnerForm.name.ru}
                            onChange={(e) => setPartnerForm({ ...partnerForm, name: { ...partnerForm.name, ru: e.target.value } })}
                            className="w-full px-4 py-2 outline-none bg-white/10 border border-white/80 rounded-lg text-white focus:bg-white/5 focus:border-white/5 focus:ring-1 focus:ring-white" />
                    </div>
                    <div>
                        <label className="block text-white text-sm font-semibold mb-2">Hamkor nomi (Uz)</label>
                        <input type="text" name="name_uz" value={partnerForm.name.uz}
                            onChange={((e) => setPartnerForm({ ...partnerForm, name: { ...partnerForm.name, uz: e.target.value } }))}
                            className="w-full px-4 py-2 outline-none bg-white/10 border border-white/80 rounded-lg text-white focus:bg-white/5 focus:border-white/5 focus:ring-1 focus:ring-white" />
                    </div>
                    <div>
                        <label className="block text-white text-sm font-semibold mb-2">Rasm</label>
                        <input accept="image/png,image/jpeg, image/jpg, image/webp, image/svg" type="file"
                            onChange={(e) =>
                                setPartnerForm({ ...partnerForm, image_file: e.target.files?.[0] || null, })
                            }

                            className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white focus:ring-2 focus:ring-white transition-all duration-300" />
                        {partnerForm.image  && (
                        <div className="mt-2">
                            <img src={partnerForm.image} alt="Current image"
                            className="h-16 w-16 object-contain rounded" />
                        </div>
                        )}
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setShowPartnerModal(false)}
                            className="flex-1 px-6 py-2 bg-red-600 hover:bg-red-400 text-white border border-white/30 rounded-lg font-semibold transition-all duration-300">
                            Bekor qilish
                        </button>
                        <button onClick={handleSavePartners} type="button"
                            className="flex-1 px-6 py-2 bg-blue-700 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all duration-500">
                            Saqlash
                        </button>
                    </div>
                    </div>
                </div>
            </div>
            )}
    </section>
)
}

export default Partners