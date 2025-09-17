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
  const [loading, setLoading] = useState(false)

  // Rollar ro‘yxati
  const [roles] = useState<string[]>([
    "super_admin",
    "admin",
    "manager",
    "finance",
    "client",
    "call_manager",
    "call_agent",
    "consulting_manager",
    "consulting_agent",
    "document_manager",
    "document_agent",
  ]);

  const [usersForm, setUsersForm] = useState({
    id: "",
    full_name: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    has_access: [] as string[],
    percentage_share: "",
    branch_id: ""
  });

  const fetchUsers = async () => {
    setLoading(true)
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
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUsers = () => {
    setEditingItem(null);
    setUsersForm({
      id: "",
      full_name: "",
      username: "",
      email: "",
      phone: "",
      role: "",
      has_access: [],
      percentage_share: "",
      branch_id: ""
    });
    setShowUsersModal(true);
  };

  const handleEditUsers = (user: any) => {
    setUsersForm({
      id: user.id || "",
      full_name: user.full_name || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "",
      has_access: user.has_access || [],
      percentage_share: "",
      branch_id: ""
    });
    setEditingItem(user);
    setShowUsersModal(true);
  };

  const handleSaveUsers = async () => {
    try {
      const token = localStorage.getItem("admin_access_token") || "";
      const payload = {
        id: usersForm.id,
        full_name: usersForm.full_name,
        username: usersForm.username,
        email: usersForm.email || "",
        phone: usersForm.phone,
        role: usersForm.role,
        has_access: usersForm.has_access
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
        setUsers(prev => {
          if (editingItem && editingItem.id) {
            return prev.map(u => u.id === editingItem.id ? { ...u, ...payload } : u);
          } else {
            return [...prev, data];
          }
        });
        setShowUsersModal(false);
      } else {
        console.error("Xatolik:", data?.message);
        toast.error("Userni saqlashda xatolik: " + (data?.message || "Noma’lum xatolik"));
      }
    } catch (error) {
      console.error("Kutilmagan xatolik:", error);
      toast.error("Userni saqlashda kutilmagan xatolik yuz berdi");
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
      const res = await fetch(
        `https://learnx-crm-production.up.railway.app/api/v1/users/delete/${usersToDelete}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        toast.success("Admin o‘chirildi");
        setUsers(prev => prev.filter(u => u.id !== usersToDelete));
        setUsersDeleteModalOpen(false);
        setUsersToDelete(null);
      } else {
        const errorData = await res.json();
        toast.error(`Xatolik: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Userni o‘chirishda xatolik:", error);
      toast.error("Userni o‘chirishda xatolik yuz berdi");
    }
  };

  return (
    <>
      <div className="bg-white/10 border shadow-md mt-10 rounded-2xl p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700">Users List</h2>
          <button onClick={handleAddUsers}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"> 
            <Plus className="h-4 w-4" />
            <span>Yangi admin</span>
          </button>
        </div>

        {/* Users list */}
        <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
          {loading ? <p className='loader1'></p> : 
          users.length > 0 ? (
            users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:bg-gray-100 rounded-xl p-3 border border-gray-300"
              >
                {/* Chap qism */}
                <div className="flex items-center space-x-3">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {user.full_name?.charAt(0)?.toUpperCase()}
                      {user.full_name?.split(" ")[1]?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-gray-600 font-semibold">{user.full_name}</h3>
                    <p className="text-gray-500 text-sm">{user.username}</p>
                    <span className="flex items-center text-gray-400 text-sm"><Mail className="w-4 h-4 mr-1" />{user.email || "—"}</span>
                  </div>
                </div>

                {/* O‘ng qism */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-white/10 rounded-xl px-3 py-1">
                    <Shield className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-gray-500">{user.role}</span>
                  </div>
                  <span className="flex items-center text-gray-400"><Phone className="w-4 h-4 mr-1" />{user.phone || "—"}</span>
                  <button onClick={() => handleEditUsers(user)} className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDeleteUsersClick(user.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-400">Hech narsa topilmadi</p>
          )}
        </div>

        {/* Modal */}
        {showUsersModal && (
          <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingItem ? "Adminni tahrirlash" : "Yangi admin qo‘shish"}
                </h2>
                <button onClick={() => setShowUsersModal(false)} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-gray-800" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Ismi, familiyasi</label>
                  <input type="text" value={usersForm.full_name}
                    onChange={e => setUsersForm({ ...usersForm, full_name: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Username</label>
                  <input type="text" value={usersForm.username}
                    onChange={e => setUsersForm({ ...usersForm, username: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input type="email" value={usersForm.email}
                    onChange={e => setUsersForm({ ...usersForm, email: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Telefon raqam</label>
                  <input type="text" value={usersForm.phone}
                    onChange={e => setUsersForm({ ...usersForm, phone: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Role (asosiy)</label>
                  <select value={usersForm.role}
                    onChange={e => setUsersForm({ ...usersForm, role: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg" required>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* Qo‘shimcha rollar */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Qo‘shimcha rollar (has_access)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map(r => (
                      <label key={r} className="flex items-center space-x-2 border p-2 rounded cursor-pointer">
                        <input type="checkbox"
                          checked={usersForm.has_access.includes(r)}
                          onChange={() => {
                            if (usersForm.has_access.includes(r)) {
                              setUsersForm({ ...usersForm, has_access: usersForm.has_access.filter(item => item !== r) });
                            } else {
                              setUsersForm({ ...usersForm, has_access: [...usersForm.has_access, r] });
                            }
                          }}
                          className="accent-blue-500"
                        />
                        <span>{r}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setShowUsersModal(false)} className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg">Bekor qilish</button>
                  <button type="button" onClick={handleSaveUsers} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg">Saqlash</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteUsersModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-gray-50 shadow-2xl p-6 rounded-lg">
              <h1 className="text-2xl text-center text-gray-600 font-semibold pb-4">Haqiqatdan ham o‘chirmoqchimisiz?</h1>
              <div className="flex justify-center gap-4">
                <button onClick={() => setUsersDeleteModalOpen(false)} className="px-6 py-2 bg-gray-500 text-white rounded-lg">Bekor qilish</button>
                <button onClick={handleConfirmUsersDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg">O‘chirish</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Admins;
