import { Edit, MessageSquare, Plus, Star, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminStories = () => {

    const [storyForm, setStoryForm] = useState({
        name: '',
        country: '',
        text: '',
        rating: 5,
        image: '',
      });
      const [editingItem, setEditingItem] = useState(null)
      const [showStoryModal, setShowStoryModal] = useState(false);
      const [storyDeleteModal, setStoryDeleteModal] = useState(false);
      const [storyDelete, setStoryDelete] = useState<string | null>(null);
      const [stories, setStories] = useState([])
      const [editingService, setEditingService] = useState(null)

      const loadStory = async () => {
        try {
          const res = await fetch("https://learnx-crm-production.up.railway.app/api/v1/client-stories/get-list") 
          const data = await res.json()
    
          if (data && data.length > 0) {
            const mappedStories = data.map((item: any) => ({
              id: item.id,
              name: item.name || "",
              country: item.country || "",
              text: item.text || "",
              rating: item.rating || 0,
              image: item.image_url || "",
              created_at: item.created_at
            }))
            setStories(mappedStories)
          } else {
            setStories([])
          }
        } catch (error) {
          console.error("Stories API load error:", error)
          setStories([])
        } 
      }
    
      useEffect(() => {
        loadStory();
      }, []);
    
      const handleDeleteStoryClick = (id: string) => {
        setStoryDelete(id);
        setStoryDeleteModal(true);
      };
    
      const handleConfirmStoryDelete = async () => {
        if (!storyDelete) return;
    
        try {
          const token = localStorage.getItem("admin_access_token") || "";
          const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/client-stories/delete/${storyDelete}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          if (res.ok) {
            loadStory();
            setStoryDeleteModal(false);
            setStoryDelete(null);
          } else {
            const errorData = await res.json();
            toast.error(errorData.message || res.statusText);
          }
        } catch (error) {
          console.error(error);
          toast.error("Xizmatni o'chirishda xatolik yuz berdi");
        }
      };
    
      const handleAddStory = () => {
        setEditingItem(null);
        setStoryForm({
          name: '',
          country: '',
          text: '',
          rating: 5,
          image: '',
        });
        setShowStoryModal(true);
      };
    
      const handleEditStory = (story: any) => {
        setStoryForm({
          name: typeof story.name === "string" ? story.name : story.name?.en || "",
          country: story.country || '',
          text: story.text || '',
          rating: story.rating ?? 0,
          image: story.image || '',
        });
    
        setEditingItem(story);
        setShowStoryModal(true);
      };
    
      const handleSaveStory = async () => {
        try {
          const token = localStorage.getItem("admin_access_token") || "";
    
          if (!token) {
            alert("Token topilmadi. Iltimos, tizimga qaytadan kiring.");
            return;
          }
    
          // FormData ishlatamiz (fayl bo'lsa ham ishlaydi, matn bo'lsa ham)
          const formData = new FormData();
          console.log(JSON.stringify(storyForm));
          console.log(storyForm);
    
    
          formData.append("json_data", JSON.stringify({ name: storyForm.name, country: storyForm.country, text: storyForm.text, rating: storyForm.rating, }));
          formData.append("name", storyForm.name);
          formData.append("country", storyForm.country);
          formData.append("rating", String(storyForm.rating));
          formData.append("text", JSON.stringify(storyForm.text));
    
          console.log('storyForm.image::::::', storyForm.image);
    
          if (storyForm.image) {
            formData.append("file", storyForm.image);
          }
          let url = "https://learnx-crm-production.up.railway.app/api/v1/client-stories/create";
          let method = "POST";
    
          if (editingItem && editingItem.id) {
            url = `https://learnx-crm-production.up.railway.app/api/v1/client-stories/update/${editingItem.id}`;
            method = "PUT";
          }
    
          const res = await fetch(url, {
            method,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
    
          let responseData = null;
          try {
            responseData = await res.json(); // JSON parse qilishga urinamiz
          } catch (error) {
            console.log(error);
    
            responseData = null; // bo'sh javob bo'lsa
          }
    
          if (res.ok) {
            toast.success("Muvaffaqiyatli saqlandi");
            setShowStoryModal(false);
            loadStory();
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
    <section>
        <div className="bg-gray-100 rounded-xl border shadow-sm my-3">
          <div className="px-8 py-4 border-b border-gray-400/60">
            <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="h-6 w-6 mr-3 text-blue-400" />
                Hikoyalar boshqaruvi
            </h2>
            <button onClick={handleAddStory}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm">
                <Plus className="h-4 w-4" />
                <span>Yangi hikoya</span>
            </button>
          </div>
          </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story: any) => (
                <div className="bg-white/5  shadow-sm border-2 border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group">
                {story.image && (
                    <div className="h-48 overflow-hidden">
                    <img
                        src={story.image}
                        alt={story.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                    </div>
                )}
                <div className="p-6 ">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="font-bold text-gray-900">{story.name}</h3>
                            <p className="text-sm text-gray-700">{story.country}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {story.featured && (
                            <div className="p-1 bg-yellow-500/20 rounded-full">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            </div>
                            )}
                            <button onClick={() => handleEditStory(story)}
                                className="p-1 text-blue-400 hover:bg-blue-500/20 rounded">
                                <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteStoryClick(story.id)}
                                className="p-1 text-red-400 hover:bg-red-500/20 rounded">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-3">{story.text}</p>
                    <div className="flex items-center">
                    {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    </div>
                </div>
                </div>
            ))}
          </div>
        </div>
      </div>

        {storyDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-sm w-full border border-white/20 text-white">
            <h3 className="text-lg font-semibold mb-4">Haqiqatan ham o'chirmoqchimisiz?</h3>
            <div className="flex justify-end space-x-4">
                <button onClick={() => setStoryDeleteModal(false)}
                    className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">
                    Bekor qilish
                </button>
                <button onClick={handleConfirmStoryDelete}
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">
                    O'chirish
                </button>
            </div>
         </div>
        </div>
        )}

        {showStoryModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
            <div className="bg-gray-300/5 backdrop-blur-md rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-center font-bold text-white">
                  {editingService ? "Hikoyani tahrirlash" : "Yangi hikoya qo'shish"}
                </h2>
                <button onClick={() => setShowStoryModal(false)}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300">
                  <X className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Form */}
            <div className="space-y-6">
             <div>
                <label className="block text-white text-sm font-semibold mb-2">
                    Ismi, familiyasi
                </label>
                <input type="text" name="name" value={storyForm.name || ''} onChange={(e) =>
                    setStoryForm({
                        ...storyForm,
                        name: e.target.value, // ✅ yangi qiymatni yozish
                    })
                    }
                    placeholder="Enter name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 backdrop-blur-lg focus:outline-none focus:border-white focus:ring-2 focus:ring-white transition-all duration-300"
                    required/>
                <label className="block text-white text-sm font-semibold mt-4 my-2">Qaysi mamlakat</label>
                <input type="text" name="country" value={storyForm.country || ''} onChange={(e) =>
                    setStoryForm({
                        ...storyForm,
                        country: e.target.value, // ✅ yangi qiymatni yozish 
                    })
                    } placeholder='Enter country'
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 backdrop-blur-lg focus:outline-none focus:border-white focus:ring-2 focus:ring-white transition-all duration-300"
                    required />
                </div>
                <div>
                <label className="block text-white text-sm font-semibold mb-2">Tavsif</label>
                <textarea
                    name="description"
                    value={storyForm.text || ''}
                    onChange={(e) =>
                    setStoryForm({
                        ...storyForm,
                        text: e.target.value
                    })
                    }
                    placeholder="Xizmat haqida batafsil ma'lumot"
                    rows={2}
                    className="w-full px-3 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 backdrop-blur-lg focus:outline-none focus:border-white focus:ring-2 focus:ring-white transition-all duration-300 resize-none"
                    required
                />
                </div>

                <div>
                <label className="block text-white text-sm font-semibold mb-2">Rasm</label>
                <input type="file" onChange={(e) =>
                    setStoryForm({
                        ...storyForm,
                        image: e.target.files?.[0] // File object
                    })
                    }
                    className='border w-full rounded-lg py-2 text-white'
                />

                </div>
                {/* Form Buttons */}
                <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowStoryModal(false)}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg font-semibold transition-all duration-300">
                    Bekor qilish
                </button>
                <button type="button" onClick={handleSaveStory}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-95">
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

export default AdminStories