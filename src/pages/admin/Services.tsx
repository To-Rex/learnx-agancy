import { Edit, FileText, Plus, Settings, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from 'framer-motion'



const Services = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [services, setServices] = useState([])
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true)


  const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    Plus,
    Edit,
    Trash2,
    X,
    FileText,

  };



  const [features, setFeatures] = useState<{ uz: string; en: string; ru: string }[]>([]);
  const [newFeatures, setNewFeatures] = useState<{ uz: string; en: string; ru: string }[]>([]);
  const [serviceForm, setServiceForm] = useState({
    title: { uz: "", en: "", ru: "" },
    description: { uz: "", en: "", ru: "" },
    icon: { name: "Book", color: "orange" },
    price: "",
    features: [],
  });


  // --- ADD SERVICE ---
  const handleAddService = () => {
    setEditingItem(null);
    setServiceForm({
      title: { uz: "", en: "", ru: "" },
      description: { uz: "", en: "", ru: "" },
      icon: { name: "Book", color: "orange" },
      price: "",
      features: [],
    });
    setFeatures([]); // <- bu yerda alohida uz/en/ru yo'q
    setNewFeatures([]);
    setShowServiceModal(true);
  };

  const handleDeleteFeature = async (idx: number, isNew = false) => {
    if (isNew) {
      // Agar yangi element bo‘lsa, indeksni features.length dan ayirib olish kerak
      const newIdx = idx - features.length;
      setNewFeatures(prev => prev.filter((_, i) => i !== newIdx));
      return; // serverga so‘rov yubormaymiz
    }

    // Eski element bo‘lsa, serverdan o‘chiramiz
    const updatedFeatures = features.filter((_, i) => i !== idx);
    setFeatures(updatedFeatures);

    try {
      if (editingItem?.id) {
        await fetch(
          `https://learnx-crm-production.up.railway.app/api/v1/services/update/${editingItem.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('admin_access_token') || ""}`,
            },
            body: JSON.stringify({
              title: serviceForm.title,
              description: serviceForm.description,
              icon: serviceForm.icon,
              price: serviceForm.price,
              features: updatedFeatures,
            }),
          }
        );
      }
    } catch (error) {
      console.error("Serverdan o‘chirishda xatolik:", error);
    }
  };



  // --- EDIT SERVICE ---
  const handleEditService = (service: any) => {
    setServiceForm({
      title: service.title || { uz: "", en: "", ru: "" },
      description: service.description || { uz: "", en: "", ru: "" },
      icon: service.icon || { name: "Book", color: "orange" },
      price: service.price || "",
      features: service.features || [],
    });

    // Inputlarni to‘ldirish
    setFeatures(service.features || []); // <- bu yerda alohida uz/en/ru yo'q
    setNewFeatures([]); // yangi qo‘shilayotganlar bo‘sh
    setEditingItem(service);
    setShowServiceModal(true);
  };



  // Inputlardan massivga yig‘ish
  const handleSaveService = async () => {
    const allFeatures = [...features, ...newFeatures]; // hamma xususiyatlar bir arrayda

    const payload = {
      ...serviceForm,
      features: allFeatures
    };


    try {
      let res;
      if (editingItem && editingItem.id) {
        // update
        res = await fetch(
          `https://learnx-crm-production.up.railway.app/api/v1/services/update/${editingItem.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('admin_access_token') || ""}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // create
        res = await fetch(
          "https://learnx-crm-production.up.railway.app/api/v1/services/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('admin_access_token') || ""}`,
            },
            body: JSON.stringify(payload),
          }
        );
      }

      if (res.ok) {
        setShowServiceModal(false);
        loadServices();
      } else {
        const errorData = await res.json();
        alert("Xizmatni saqlashda xatolik: " + (errorData.message || res.statusText));
      }
    } catch (err) {
      console.error(err);
      alert("Kutilmagan xatolik yuz berdi");
    }
  };

  const handleDeleteServiceClick = (id: string) => {
    setServiceToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmServiceDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const token = localStorage.getItem('admin_access_token') || "";
      const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/services/delete/${serviceToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        loadServices(); // Ma'lumotlarni yangilash
        setDeleteModalOpen(false);
        setServiceToDelete(null);
      } else {
        const errorData = await res.json();
        alert(`Xatolik yuz berdi: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Xizmatni o'chirishda xatolik:", error);
      alert("Xizmatni o'chirishda xatolik yuz berdi");
    }
  };
  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://learnx-crm-production.up.railway.app/api/v1/services/get-list",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const firstId = data[0].id;
        localStorage.setItem('service_input', firstId);
        console.log(firstId);
      }
      if (!res.ok) throw new Error(data.message || "Xizmatlarni olishda xatolik")
      const servicesArray = Array.isArray(data) ? data : data.services || [];


      const normalizedData = servicesArray.map((item: any) => ({
        id: item.id || "",
        title: item.title || { uz: "", en: "", ru: "" },
        description: item.description || { uz: "", en: "", ru: "" },
        price: item.price || "",
        icon: {
          name: item.icon?.name || "FileText",
          color: item.icon?.color ? item.icon.color.toLowerCase() : "blue",
        },
        features: Array.isArray(item.features)
          ? item.features
          : [],
      }));


      setServices(normalizedData);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);



  const getStatusColor = (status: string) => {

  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Kutilmoqda'
      case 'approved':
        return 'Tasdiqlangan'
      case 'rejected':
        return 'Rad etilgan'
      default:
        return 'Noma\'lum'
    }
  }
  return (
    <>
      {/* Header va Yangi Xizmat tugmasi */}
      <div className="p-8 border-b flex justify-between items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-gray-600 flex items-center">
          <Settings className="h-6 w-6 mr-3 text-blue-400" />
          Xizmatlar boshqaruvi
        </h2>
        <button
          onClick={handleAddService}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r bg-blue-500 text-white rounded-xl  hover:bg-blue-700-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-4 w-4" />
          <span>Yangi xizmat</span>
        </button>
      </div>

      {/* Services ro'yxati */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <p className="text-gray-500">Hech qanday xizmat topilmadi</p>
        ) : (
          services.map((service, index) => {
            const IconComponent = iconMap[service.icon.name] || FileText;
            const iconColor = service.icon.color?.toLowerCase() || "blue";

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border shadow-md rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group hover:scale-105"
              >
                <div className="flex justify-end items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditService(service)}
                      className=" text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300"
                      aria-label="Tahrirlash"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteServiceClick(service.id)}
                      className=" text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                      aria-label="O'chirish"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-500 text-lg group-hover:text-gray-600 transition-colors flex items-center space-x-2">
                  <span>{service.title.uz}</span>
                </h3>
                <p className="text-gray-500 mb-2 text-sm leading-relaxed">
                  {service.description.uz}
                </p>
                <p className="text-gray-500 mb-4 text-sm">
                  <strong>Features:</strong> {service.features.map(f => f.uz).join(", ")}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold bg-gradient-to-r text-gray-400 bg-clip-text text-transparent">
                    {service.price}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${iconColor}-500/20 text-${iconColor}-300 border border-${iconColor}-500/30`}>
                    {service.icon?.color}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0  backdrop-blur-sm  flex items-center justify-center z-50">
          <div className="bg-gray-50 shadow-lg   rounded-2xl p-8 w-full max-w-xl border  max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? "Xizmatni tahrirlash" : "Yangi xizmat"}
              </h2>
              <button onClick={() => setShowServiceModal(false)} className="text-gray-900" aria-label="Modalni yopish">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              {["uz", "en", "ru"].map((lang) => (
                <div key={lang}>
                  <label className="block text-gray-900 text-md font-medium mb-1">Mavzu ({lang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={serviceForm.title[lang]}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, title: { ...serviceForm.title, [lang]: e.target.value } })
                    }
                    className="w-full p-2 rounded bg-white/10 text-gray-500 border border-gray-400"
                  />
                </div>
              ))}

              {/* Description */}
              {["uz", "en", "ru"].map((lang) => (
                <div key={lang}>
                  <label className="block text-gray-900 text-md font-medium  mb-1">Tavsif ({lang.toUpperCase()})</label>
                  <textarea
                    value={serviceForm.description[lang]}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, description: { ...serviceForm.description, [lang]: e.target.value } })
                    }
                    className="w-full p-2 rounded bg-white/10 text-gray-500 border border-gray-400"
                  />
                </div>
              ))}

              {/* Price */}
              <div>
                <label className="block text-gray-900 text-md font-medium  mb-1">Narx</label>
                <input
                  type="text"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  className="w-full p-2 rounded bg-white/10 text-gray-500 border border-gray-400"
                />
              </div>

              {/* Features */}
              <div className="border rounded p-5 mt-5">
                <h1 className="text-gray-900 text-center font-bold text-xl">Xususiyatlar</h1>
                <div className="mt-5">
                  {features.concat(newFeatures).map((f, idx) => (
                    <div key={idx} className="w-full gap-2 mb-2">
                      <div className='w-full flex items-center justify-between mt-5'>
                        <h1 className="text-gray-900  font-medium text-md">Xususiyat (UZ)</h1>
                        <button
                          className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                          onClick={() => handleDeleteFeature(idx, idx >= features.length)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>


                      </div>
                      <input
                        value={f.uz}
                        onChange={(e) => {
                          const arr = [...features, ...newFeatures];
                          arr[idx].uz = e.target.value;
                          if (idx < features.length) setFeatures(arr.slice(0, features.length));
                          else setNewFeatures(arr.slice(features.length));
                        }}
                        className="w-full mt-1 p-2 rounded bg-white/10 text-gray-500 border border-gray-400"
                      />
                      <input
                        value={f.en}
                        onChange={(e) => {
                          const arr = [...features, ...newFeatures];
                          arr[idx].en = e.target.value;
                          if (idx < features.length) setFeatures(arr.slice(0, features.length));
                          else setNewFeatures(arr.slice(features.length));
                        }}
                        className="w-full mt-1 p-2 rounded bg-white/10 text-gray-500 border border-gray-400"
                      />
                      <input
                        value={f.ru}
                        onChange={(e) => {
                          const arr = [...features, ...newFeatures];
                          arr[idx].ru = e.target.value;
                          if (idx < features.length) setFeatures(arr.slice(0, features.length));
                          else setNewFeatures(arr.slice(features.length));
                        }}
                        className="w-full mt-1 p-2 rounded bg-white/10 text-gray-500 border border-gray-400"
                      />
                    </div>
                  ))}

                  <button
                    onClick={() => setNewFeatures([...newFeatures, { uz: "", en: "", ru: "" }])}
                    className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                  >
                    + Qo‘shish
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => setShowServiceModal(false)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                  Bekor qilish
                </button>
                <button onClick={handleSaveService} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteModalOpen && (
        <div className='fixed inset-0 backdrop-blur-sm flex justify-center items-center rounded-md '>
          <div className='bg-gray-50 shadow-2xl p-6 rounded-lg  ml-24 max-w-[570px]'>
            <h1 className='text-2xl text-center text-gray-600 font-600 pb-4'>Haqiqatdan ham o'chirmoqchimisiz</h1>
            <div className='flex justify-center items-center gap-4 pt-4 ml-36'>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className='py-3 px-10 text-white bg-gray-500 rounded-lg font-[600] hover:bg-gray-600 duration-300'>Bekor qilish
              </button>
              <button
                onClick={handleConfirmServiceDelete}
                className='py-3 px-14 text-white bg-red-600 rounded-lg font-[600] hover:bg-red-700 duration-300'>O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Services