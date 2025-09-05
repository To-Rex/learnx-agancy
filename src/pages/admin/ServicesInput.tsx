import { Edit, FilePenLine, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from 'framer-motion'
import ServiceInputEditor from "../../components/serviceInputCopmonent";


const ServicesInput = () => {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showServiceInputModal, setShowServiceInputModal] = useState(false);
  const [deleteInputModalOpen, setInputDeleteModalOpen] = useState(false);
  const [serviceInputToDelete, setServiceInputToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true)
  const [servicesInput, setServicesInput] = useState([])
  const [active, setActive] = useState("connection");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [services, setServices] = useState([])
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

  // serviceInputs 
  const [serviceInputForm, setServiceInputForm] = useState({
    name: { uz: "", en: "", ru: "" },
    description: { uz: "", en: "", ru: "" },
  });


  // --- ADD SERVICEINPUT ---
  const handleAddServiceInput = () => {
    setEditingItem(null);
    setServiceInputForm({
      name: { uz: "", en: "", ru: "" },
      description: { uz: "", en: "", ru: "" }
    });
    setShowServiceInputModal(true);
  };

  // --- EDIT SERVICE ---
  const handleEditServiceInput = (item: any) => {
    setEditingItem(item);

    setServiceInputForm({
      name: {
        uz: item.name?.uz || "",
        en: item.name?.en || "",
        ru: item.name?.ru || "",
      },
      description: {
        uz: item.description?.uz || "",
        en: item.description?.en || "",
        ru: item.description?.ru || "",
      },
    });

    setShowServiceInputModal(true);
  };


  // --- SAVE SERVICE ---
  const handleSaveServiceInput = async (id?: string) => {
    // name qiymatini stringga olish
    const nameValue =
      serviceInputForm.name && typeof serviceInputForm.name === "string"
        ? serviceInputForm.name
        : serviceInputForm.name?.uz || "";

    if (!nameValue.trim()) {
      alert("Nom bo'sh bo'lishi mumkin emas");
      return;
    }

    const payload = {
      name: serviceInputForm.name, // object yoki string, backend kutyapti
      description: serviceInputForm.description || "",
    };

    try {
      let res;

      // PUT (update) yoki POST (create) tanlash
      if (editingItem?.id) {
        // id object bo‘lishi mumkin, shuning uchun .id yoki stringga o‘tkazamiz
        const inputId = typeof editingItem.id === "string" ? editingItem.id : editingItem.id?.toString();
        res = await fetch(
          `https://learnx-crm-production.up.railway.app/api/v1/service-inputs/update/${inputId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // CREATE
        res = await fetch(
          "https://learnx-crm-production.up.railway.app/api/v1/service-inputs/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
            },
            body: JSON.stringify(payload),
          }
        );
      }

      // Javobni xavfsiz tekshirish
      if (res.ok) {
        setShowServiceInputModal(false);
        toast('Xizmat saqlandi')
        loadServicesInput();
      } else {
        const text = await res.text();
        let errorData = null;
        try {
          errorData = text ? JSON.parse(text) : null;
        } catch {
          errorData = null;
        }
        toast("Xizmatni saqlashda xatolik: " + (errorData?.message || res.statusText));
      }
    } catch (err: any) {
      console.error(err);
      toast("Kutilmagan xatolik yuz berdi: " + err.message);
    }
  };

  const handleDeleteServiceInputClick = (id: string) => {
    setServiceInputToDelete(id);
    setInputDeleteModalOpen(true);
  };

  const handleConfirmServiceInputDelete = async () => {
    if (!serviceInputToDelete) return;
    console.log(serviceInputToDelete);


    try {
      const token = localStorage.getItem('admin_access_token') || "";
      const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/service-inputs/delete/${serviceInputToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        loadServicesInput(); // Ma'lumotlarni yangilash
        toast(`Ma'lumot o'chirildi`)
        setInputDeleteModalOpen(false);
        setServiceInputToDelete(null);
      } else {
        const errorData = await res.json();
        toast(`Xatolik yuz berdi: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Xizmatni o'chirishda xatolik:", error);
    }
  };
  const loadServicesInput = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://learnx-crm-production.up.railway.app/api/v1/service-inputs/get-list",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('admin_access_token') || ""}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Xizmatlarni olishda xatolik");

      const servicesInputArray = Array.isArray(data) ? data : data.serviceInput || [];

      const normalizedData = servicesInputArray.map((item: any) => ({
        id: item.id || "",
        name: item.name || { uz: "", en: "", ru: "" },
        description: item.description || { uz: "", en: "", ru: "" },
      }));

      setServicesInput(normalizedData);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServicesInput();
  }, []);


  return (
    <>
      <div className="border  rounded-2xl p-6">
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FilePenLine className="h-6 w-6 mr-3 text-blue-400" />
            Xizmat inputlari boshqaruvi
          </h2>
          <button
            onClick={handleAddServiceInput}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            <span>Yangi xizmat input</span>
          </button>
        </div>

        {/* Tab Buttons */}
        <div className='flex items-center p-6 space-x-4'>
          <button
            onClick={() => setActive("connection")}
            className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-300 
          ${active === "connection"
                ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg scale-105"
                : "border border-gray-500 text-gray-600  hover:bg-gray-500 hover:text-white"
              }`}
          >
            connection
          </button>

          <button
            onClick={() => setActive("all-inputs")}
            className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-300 
          ${active === "all-inputs"
                ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg scale-105"
                : "border border-gray-500 text-gray-600  hover:bg-gray-500 hover:text-white"
              }`}
          >
            all inputs
          </button>
        </div>

        {/* Connection tab */}
        {active === "connection" && (
          <div className="flex w-full gap-4">
            {/* Left table */}
            <div className={`flex-1 ${selectedService ? 'w-[25%]' : 'w-full'}`}>
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Hammasi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-700 py-8">
                        Ma'lumot topilmadi
                      </td>
                    </tr>
                  ) : (
                    services.map((service) => (
                      <motion.tr
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className=" text-gray-900 transition-all duration-300 cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div
                            className="font-semibold text-gray-700 cursor-pointer border rounded-md p-3"
                            onClick={() => {
                              setSelectedService(service);
                              localStorage.setItem('service_input', service.id);
                            }}
                          >
                            {service?.title.uz || "-"}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Editor pane */}
            {selectedService && (
              <div className="w-[65%]  rounded-xl p-6 shadow-lg">
                <ServiceInputEditor
                  service={selectedService}
                  onClose={() => setSelectedService(null)}
                  onSave={() => setSelectedService(null)}
                />
              </div>
            )}
          </div>
        )}

        {/* All Inputs tab */}
        {active === "all-inputs" && (
          <div className="w-full max-h-[35vh] overflow-y-auto">
            <table className="w-full table-fixed">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    All inputs
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {servicesInput.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-700 py-8">
                      Ma'lumot topilmadi
                    </td>
                  </tr>
                ) : (
                  servicesInput.map((service_input) => (
                    <motion.tr
                      key={service_input.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="hover:bg-white/5 transition-all duration-300 cursor-pointer"
                    >
                      <td className="p-2 mt-3 rounded-lg flex justify-between items-center font-semibold text-gray-700 border border-gray-400 ">
                        <h1>{service_input?.name.uz || "-"}</h1>
                        <div className="flex items-center gap-2">
                          <button className="text-green-400 hover:bg-green-500/20 p-2 rounded transition-all duration-300">
                            {/* icon yoki text */}
                          </button>
                          <button
                            onClick={() => handleEditServiceInput(service_input)}
                            className="text-blue-400 hover:bg-blue-500/20 p-2 rounded transition-all duration-300"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteServiceInputClick(service_input.id)}
                            className="text-red-400 hover:bg-red-500/20 p-2 rounded transition-all duration-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {deleteInputModalOpen && (
          <div className='fixed inset-0 backdrop-blur-sm flex justify-center items-center rounded-md '>
            <div className='bg-gray-50 shadow-2xl p-6 rounded-lg  ml-24 max-w-[570px]'>
              <h1 className='text-2xl text-center text-gray-600 font-600 pb-4'>Haqiqatdan ham o'chirmoqchimisiz</h1>
              <div className='flex justify-center items-center gap-4 pt-4 ml-36'>
                <button
                  onClick={() => setInputDeleteModalOpen(false)}
                  className='py-3 px-10 text-white bg-gray-500 rounded-lg font-[600] hover:bg-gray-600 duration-300'>Bekor qilish
                </button>
                <button
                  onClick={handleConfirmServiceInputDelete}
                  className='py-3 px-14 text-white bg-red-600 rounded-lg font-[600] hover:bg-red-700 duration-300'>O'chirish
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal for Add/Edit */}
        {showServiceInputModal && (
          <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center  z-50">
            <div className="bg-gray-50 shadow-2xl  rounded-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingItem ? "Xizmat inputini tahrirlash" : "Yangi xizmat inputi"}
                </h2>
                <button
                  onClick={() => setShowServiceInputModal(false)}
                  className="text-gray-800 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-500/20"
                  aria-label="Modalni yopish"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name fields */}
                <div>
                  <label className="block text-gray-800 mb-1">Nomi (UZ)</label>
                  <input
                    type="text"
                    value={serviceInputForm.name.uz}
                    onChange={(e) =>
                      setServiceInputForm({
                        ...serviceInputForm,
                        name: { ...serviceInputForm.name, uz: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded bg-white/10 placeholder:text-gray-400 text-gray-800 border border-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-800 mb-1">Nomi (EN)</label>
                  <input
                    type="text"
                    value={serviceInputForm.name.en}
                    onChange={(e) =>
                      setServiceInputForm({
                        ...serviceInputForm,
                        name: { ...serviceInputForm.name, en: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded bg-white/10 placeholder:text-gray-400 text-gray-800 border border-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-800 mb-1">Nomi (RU)</label>
                  <input
                    type="text"
                    value={serviceInputForm.name.ru}
                    onChange={(e) =>
                      setServiceInputForm({
                        ...serviceInputForm,
                        name: { ...serviceInputForm.name, ru: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded bg-white/10 placeholder:text-gray-400 text-gray-800 border border-gray-800"
                  />
                </div>

                {/* Description fields */}
                <div>
                  <label className="block text-gray-800 mb-1">Tavsif (UZ)</label>
                  <textarea
                    value={serviceInputForm.description.uz}
                    onChange={(e) =>
                      setServiceInputForm({
                        ...serviceInputForm,
                        description: { ...serviceInputForm.description, uz: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded bg-white/10 placeholder:text-gray-400 text-gray-800 border border-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-800 mb-1">Tavsif (EN)</label>
                  <textarea
                    value={serviceInputForm.description.en}
                    onChange={(e) =>
                      setServiceInputForm({
                        ...serviceInputForm,
                        description: { ...serviceInputForm.description, en: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded bg-white/10 placeholder:text-gray-400 text-gray-800 border border-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-800 mb-1">Tavsif (RU)</label>
                  <textarea
                    value={serviceInputForm.description.ru}
                    onChange={(e) =>
                      setServiceInputForm({
                        ...serviceInputForm,
                        description: { ...serviceInputForm.description, ru: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded bg-white/10 placeholder:text-gray-400 text-gray-800 border border-gray-800"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowServiceInputModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleSaveServiceInput}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Saqlash
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ServicesInput