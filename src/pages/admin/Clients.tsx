import { ArrowDown, ArrowUp, ChevronDown, Eye, Mail, Phone, Search, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion'

const Clients = () => {
  const [clientsToDelete, setClientsToDelete] = useState<string | null>(null);
  const [deleteClientsModalOpen, setClientsDeleteModalOpen] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const limit = 10
  const [sortField, setSortField] = useState("full_name");
  const [sortDesc, setSortDesc] = useState(true);
  const [searchField, setSearchField] = useState("email");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')





  // Sort uchun select
  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortField(value);
    fetchClients(searchQuery, searchField, value, sortDesc);
  };

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSearchField(value);
    fetchClients(searchQuery, value, sortField, sortDesc);
  };

  // ASC/DESC toggle
  const toggleSortOrder = () => {
    const newOrder = !sortDesc;
    setSortDesc(newOrder);
    fetchClients(searchQuery, searchField, sortField, newOrder);
  };


  const fetchClients = async (
    searchValue = "",
    searchField = "email",
    sortField = "full_name",
    sortDesc = true,
    page = 1
  ) => {
    try {
      const token = localStorage.getItem("admin_access_token") || "";
      const offset = (page - 1) * limit;

      const params = new URLSearchParams({
        sort_field: sortField,
        sort_desc: String(sortDesc),
        limit: String(limit),
        offset: String(offset),
      });
      

      if (searchValue.trim()) {
        params.append("search_field", searchField);
        params.append("search_val", searchValue.trim());
      }

      const res = await fetch(
        `https://learnx-crm-production.up.railway.app/api/v1/clients/get-rich-list?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Ma'lumot yuklanmadi");

      const data = await res.json();
      const clientsData = Array.isArray(data.results) ? data.results : data;

      setClients(clientsData);
      setCurrentPage(page);
      setHasNextPage(clientsData.length === limit);

    } catch (err) {
      console.error("Xatolik:", err);
      setClients([]);
      setCurrentPage(1);
      setHasNextPage(false);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  // useEffect — dastlabki yuklash
  useEffect(() => {
    fetchClients();
  }, []);

  // search input o‘zgarganda API chaqirish
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchClients(value, searchField, sortField, sortDesc);
    navigate(`?search_val=${encodeURIComponent(value)}&search_field=${searchField}`, { replace: true });
  };


  const handleDeleteClientsClick = (id: string) => {
    setClientsToDelete(id);
    setClientsDeleteModalOpen(true);
  };

  const handleConfirmClientsDelete = async () => {
    if (!clientsToDelete) return;

    try {
      const token = localStorage.getItem('admin_access_token') || "";
      const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/clients/delete/${clientsToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        toast("Mijoz o'chirildi ")
        fetchClients(); // Ma'lumotlarni yangilash
        setClientsDeleteModalOpen(false);
        setClientsToDelete(null);
      } else {
        const errorData = await res.json();
        toast(`Xatolik yuz berdi: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Xizmatni o'chirishda xatolik:", error);
      toast("Xizmatni o'chirishda xatolik yuz berdi");
    }
  };



  // vaqtni hisoblash helper
  function getLastContact(createdAt: string): string {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffMs = now.getTime() - createdDate.getTime();

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffDays > 0) return `${diffDays} kun oldin`;
    if (diffHours > 0) return `${diffHours} soat oldin`;
    if (diffMinutes > 0) return `${diffMinutes} minut oldin`;
    return `${diffSeconds} sekund oldin`;
  }

  return (
    <div className="bg-white/10 border border-white/20 shadow-2xl mt-10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-500">Client List</h2>

        <div className="flex items-center space-x-4">
          {/* --- Sort va Filter UI --- */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-violet-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700"
            >
              Filtr <ChevronDown className="w-4 h-4" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl shadow-xl p-4 z-50 text-gray-700 space-y-3">
                <div className="relative">
                  <label className="text-sm text-gray-500 mb-1 block">Sort Field</label>
                  <select
                    value={sortField}
                    onChange={handleSortFieldChange}
                    className="mt-1 w-[90%] px-3 py-2 rounded-lg border border-gray-800  bg-white/10 text-gray-500"
                  >
                    <option value="full_name">Ism</option>
                    <option value="email">Email</option>
                    <option value="phone">Telefon</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-white pointer-events-none" />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Sort Order</span>
                  <button
                    onClick={toggleSortOrder}
                    className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 flex items-center gap-2"
                  >
                    {sortDesc ? <>DESC <ArrowDown className="w-4 h-4" /></> : <>ASC <ArrowUp className="w-4 h-4" /></>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search Field */}
          <div className="relative w-[120px] mr-2 ">
            <select
              value={searchField}
              onChange={handleSearchFieldChange}
              className="mt-1 w-full px-3 py-2  rounded-xl border-3 border"
            >
              <option className='bg-[#8a76ff] text-white' value="full_name">Ism</option>
              <option className='bg-[#8a76ff] text-white' value="email">Email</option>
              <option className='bg-[#8a76ff] text-white' value="phone">Telefon</option>
            </select>
            <ChevronDown className="absolute  top-4 w-4 h-4 text-white pointer-events-none" />
          </div>

          <div className="relative w-72">
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border-3 border bg-transparent   text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[66vh]">
        {clients.length > 0 ? (
          clients.map((client: any, index: number) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex justify-between items-center rounded-xl p-4 border  hover:bg-gray-100 transition-all duration-300"
            >
              {/* Chap qism: avatar va info */}
              <div className="flex items-center space-x-4">
                {client.avatar_url ? (
                  <img
                    src={client.avatar_url}
                    alt={client.full_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                    {client.full_name?.charAt(0)?.toUpperCase()}
                    {client.full_name?.split(" ")[1]?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-gray-600 font-semibold">{client.full_name}</h3>
                  <div className="flex items-center space-x-3 text-gray-400 text-sm">
                    <span className="flex items-center"><Mail className="w-4 h-4 mr-1" />{client.email || "—"}</span>
                    <span className="flex items-center"><Phone className="w-4 h-4 mr-1" />{client.phone || "—"}</span>
                  </div>
                </div>
              </div>

              {/* O'ng qism: oxirgi kontakt va action tugmalar */}
              <div className="flex items-center space-x-6">
                <div className="text-right text-gray-400 text-sm">
                  <p>{getLastContact(client.created_at)}</p>
                  <p className="text-gray-400 text-xs">Ro'yxatdan o'tgan</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/admin/clients/${client.id}`)}
                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300"
                  >
                    <Eye className="h-4 w-4" />
                  </button>


                  <button
                    onClick={() => handleDeleteClientsClick(client.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-400">Hech narsa topilmadi</p>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        {/* Oldingi tugma */}
        <button
          onClick={() => currentPage > 1 && fetchClients(searchQuery, searchField, sortField, sortDesc, currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${currentPage === 1
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-violet-500 text-white hover:bg-purple-700"
            }`}
        >
          Oldingi
        </button>

        <span className="text-gray-900">{currentPage}</span>

        {/* Keyingi tugma */}
        <button
          onClick={() => fetchClients(searchQuery, searchField, sortField, sortDesc, currentPage + 1)}
          disabled={!hasNextPage}
          className={`px-4 py-2 rounded-lg ${!hasNextPage
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-violet-500 text-white hover:bg-purple-700"
            }`}
        >
          Keyingi
        </button>
      </div>
      {deleteClientsModalOpen && (
        <div className='fixed inset-0 backdrop-blur-sm flex justify-center items-center rounded-md '>
          <div className='bg-gray-50 shadow-2xl p-6 rounded-lg  ml-24 max-w-[570px]'>
            <h1 className='text-2xl text-center text-gray-600 font-600 pb-4'>Haqiqatdan ham o'chirmoqchimisiz</h1>
            <div className='flex justify-center items-center gap-4 pt-4 ml-36'>
              <button
                onClick={() => setClientsDeleteModalOpen(false)}
                className='py-3 px-10 text-white bg-gray-500 rounded-lg font-[600] hover:bg-gray-600 duration-300'>Bekor qilish
              </button>
              <button
                onClick={handleConfirmClientsDelete}
                className='py-3 px-14 text-white bg-red-600 rounded-lg font-[600] hover:bg-red-700 duration-300'>O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clients