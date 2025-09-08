import { motion } from 'framer-motion'
import { Edit, Eye, Mail, Phone, Plus, Shield, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';


const Admins = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [usersToDelete, setUsersToDelete] = useState<string | null>(null);
  const [deleteUsersModalOpen, setUsersDeleteModalOpen] = useState(false);
  const [roles, setRoles] = useState<string[]>(["super_admin", "admin", "manager", "call_operator"]);


  const [usersForm, setUsersForm] = useState({
    id: "",
    full_name: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    percentage_share: "",
    branch_id: ""
  });

  // --- API dan foydalanuvchilarni olish ---
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("admin_access_token") || "";
      const res = await fetch(
        "https://learnx-crm-production.up.railway.app/api/v1/users/get-list",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setUsers(Array.isArray(data.results) ? data.results : data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };



  useEffect(() => {
    fetchUsers();
  }, []);

  // console.log(users); // state har doim yangilanadimi tekshirish


  const handleAddUsers = () => {
    setEditingItem(null);
    setUsersForm({
      id: "",
      full_name: "",
      username: "",
      email: "",
      phone: "",
      role: "",
      percentage_share: "",
      branch_id: ""
    });
    setShowUsersModal(true);
  };

  // --- Mavjud userni tahrirlash ---
  const handleEditUsers = (user: any) => {
    setUsersForm({
      id: user.id || "",
      full_name: user.full_name || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "",
      percentage_share: "",
      branch_id: ""
    });
    setEditingItem(user);
    setShowUsersModal(true);
  };

  // --- Saqlash (yangi yoki update) ---
  const handleSaveUsers = async () => {
    try {
      const token = localStorage.getItem("admin_access_token") || "";
      const payload = {
        id: usersForm.id,
        full_name: usersForm.full_name,
        username: usersForm.username,
        email: usersForm.email || "",
        phone: usersForm.phone,
        role: usersForm.role
      };

      let url = "https://learnx-crm-production.up.railway.app/api/v1/users/create";
      let method = "POST";

      if (editingItem && editingItem.id) {
        url = `https://learnx-crm-production.up.railway.app/api/v1/users/update/${editingItem.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("User muvaffaqiyatli saqlandi");
        setUsers(prev =>
          prev.map(u => u.id === editingItem.id ? { ...u, ...payload } : u)
        );
        setShowUsersModal(false);
      }
      else {
        console.error("Xatolik:", data?.message);
        toast("Userni saqlashda xatolik: " + (data?.message));
      }
    } catch (error) {
      console.error("Kutilmagan xatolik:", error);
      toast("Userni saqlashda kutilmagan xatolik yuz berdi");
    }
  };
  const handleDeleteUsersClick = (id: string) => {
    setUsersToDelete(id);
    setUsersDeleteModalOpen(true);
  };

  const handleConfirmUsersDelete = async () => {
    if (!usersToDelete) return;

    try {
      const token = localStorage.getItem('admin_access_token') || "";
      const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/users/delete/${usersToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        toast.success("Mijoz o'chirildi");
        setUsers(prev => prev.filter(u => u.id !== usersToDelete));
        setUsersDeleteModalOpen(false);
        setUsersToDelete(null);
      }
      else {
        const errorData = await res.json();
        toast(`Xatolik yuz berdi: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Xizmatni o'chirishda xatolik:", error);
      toast("Xizmatni o'chirishda xatolik yuz berdi");
    }
  };
  return (
    <>
      <div className="bg-white/10 border  shadow-2xl mt-10 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700 text-center sm:text-left">
            Users List
          </h2>
          <button
            onClick={handleAddUsers}
            className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <Plus className="h-4 w-4" />
            <span>Yangi admin</span>
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[70vh] sm:max-h-[69vh] pr-1">
          {users.length > 0 ? (
            users.map((user: any, index: number) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 cursor-pointer  hover:bg-gray-100   sm:gap-0 rounded-xl p-3 border border-gray-300  transition-all duration-300"
              >
                {/* Chap qism */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/30"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm sm:text-lg font-bold">
                      {user.full_name?.charAt(0)?.toUpperCase()}
                      {user.full_name?.split(" ")[1]?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-gray-600 font-semibold text-sm sm:text-base">{user.full_name}</h3>
                    <h3 className="text-gray-500 font-medium text-xs sm:text-sm">{user.username}</h3>
                    <div className="  mt-2 text-gray-400 text-xs sm:text-sm">
                      <span className="flex items-center"><Mail className="w-4 h-4 mr-1" />{user.email || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* O'ng qism */}
                <div className="flex flex-wrap justify-between sm:justify-end items-center sm:space-x-6 gap-3">
                  <div className='block '>
                    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-1 sm:py-2 cursor-pointer hover:bg-white/20 text-xs sm:text-sm">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mr-1" />
                      <span className="text-gray-400 font-medium">{user.role}</span>
                    </div>
                    <span className="flex items-center text-gray-400"><Phone className="w-4 h-4 mr-1" />{user.phone || "—"}</span>

                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditUsers(user)}
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUsersClick(user.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-sm sm:text-base">Hech narsa topilmadi</p>
          )}
        </div>
        {showUsersModal && (
          <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-center font-bold text-gray-800">
                  {editingItem ? "Adminni tahrirlash" : "Yangi admin qo'shish"}
                </h2>
                <button onClick={() => setShowUsersModal(false)}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300">
                  <X className="w-5 h-5 text-gray-800" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-800 text-sm font-semibold mb-2">
                    Ismi, familiyasi
                  </label>
                  <input type="text"
                    name="full_name"
                    value={usersForm.full_name || ''}
                    onChange={(e) =>
                      setUsersForm({
                        ...usersForm,
                        full_name: e.target.value, // ✅ yangi qiymatni yozish
                      })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-gray-400 rounded-lg text-gray-500 placeholder-gray-400 backdrop-blur-lg  transition-all duration-300"
                    required
                  />
                  <label className="block text-gray-800 text-sm font-semibold mb-2">
                    Username
                  </label>
                  <input type="text" name="username"
                    value={usersForm.username || ''}
                    onChange={(e) =>
                      setUsersForm({
                        ...usersForm,
                        username: e.target.value, // ✅ yangi qiymatni yozish
                      })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-gray-400 rounded-lg text-gray-500 placeholder-gray-400 backdrop-blur-lg  transition-all duration-300"
                    required
                  />
                  <label className="block text-gray-800 text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input type="email" name="email"
                    value={usersForm.email || ''}
                    onChange={(e) =>
                      setUsersForm({
                        ...usersForm,
                        email: e.target.value, // ✅ yangi qiymatni yozish
                      })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-gray-400 rounded-lg text-gray-500 placeholder-gray-400 backdrop-blur-lg  transition-all duration-300"
                    required
                  />
                  <label className="block text-gray-800 text-sm font-semibold mt-4 my-2">Telefon raqam </label>
                  <input type="text"
                    name="phone"
                    value={usersForm.phone || ''}
                    onChange={(e) =>
                      setUsersForm({
                        ...usersForm,
                        phone: e.target.value, // ✅ yangi qiymatni yozish 
                      })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-gray-400 rounded-lg text-gray-500 placeholder-gray-400 backdrop-blur-lg  transition-all duration-300"
                    required />
                </div>
                <div>
                  <label className="block text-gray-800 text-sm font-semibold mb-2">Role</label>
                  <select
                    name="role"
                    value={usersForm.role || ""}
                    onChange={(e) =>
                      setUsersForm({ ...usersForm, role: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-gray-400 rounded-lg text-gray-500 placeholder-gray-400 backdrop-blur-lg  transition-all duration-300"
                    required
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setShowUsersModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white border rounded-lg font-semibold transition-all duration-300">
                    Bekor qilish
                  </button>
                  <button type="button" onClick={handleSaveUsers}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-500 hover:to-blue-400 rounded-lg font-semibold transition-all duration-300 transform hover:scale-95">
                    Saqlash
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {deleteUsersModalOpen && (
          <div className='fixed inset-0 backdrop-blur-sm flex justify-center items-center rounded-md '>
            <div className='bg-gray-50 shadow-2xl p-6 rounded-lg  ml-24 max-w-[570px]'>
              <h1 className='text-2xl text-center text-gray-600 font-600 pb-4'>Haqiqatdan ham o'chirmoqchimisiz</h1>
              <div className='flex justify-center items-center gap-4 pt-4 ml-36'>
                <button
                  onClick={() => setUsersDeleteModalOpen(false)}
                  className='py-3 px-10 text-white bg-gray-500 rounded-lg font-[600] hover:bg-gray-600 duration-300'>Bekor qilish
                </button>
                <button
                  onClick={handleConfirmUsersDelete}
                  className='py-3 px-14 text-white bg-red-600 rounded-lg font-[600] hover:bg-red-700 duration-300'>O'chirish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Admins