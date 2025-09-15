import { Edit, Edit2, Edit2Icon, FileText, Search, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import adminlogo from '../../../public/76.jpg'

const Applications = () => {

  // APPLICATION
  const [application, setApplication] = useState<any[]>([]);
  const [statusModal, setStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [appCurrentPage, setAppCurrentPage] = useState(1);
  const [appHasNextPage, setAppHasNextPage] = useState(false);
  //   const [filteredApplications, setFilteredApplications] = useState<any[]>([]); // Qidiruv natijasi
  const [editAppModal, setEditAppModal] = useState(false);
  const [isEditingApp, setIsEditingApp] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isEditingAppName, setIsEditingAppName] = useState(false);
  const [nameQuery, setNameQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{ id: string; full_name: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [deleteAppModalOpen, setDeleteAppModalOpen] = useState(false); // 🔹 qo‘shildi
  const [addAppModalOpen, setAddAppModalOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);



  const statuses = [
    { label: "Barcha statuslar", value: "" },
    { label: "Kutilmoqda", value: "pending" },
    { label: "Tasdiqlangan", value: "approved" },
    { label: "Rad etildi", value: "rejected" },
  ];

  const handleSelect = (value: string) => {
    setSelectedStatus(value);
    setIsOpen(false);
  };

  const getStatusColorApp = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-transparent text-white";
    }
  };

  const getStatusLabelApp = (status: string) => {
    switch (status) {
      case "pending":
        return "Kutilmoqda";
      case "approved":
        return "Tasdiqlangan";
      case "rejected":
        return "Rad etilgan";
      default:
        return "Noma'lum";
    }
  };
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("https://learnx-crm-production.up.railway.app/api/v1/services/get-list");
        const data = await res.json();
        setServices(data); // API'dan kelgan xizmatlarni saqlash
      } catch (error) {
        console.error("Xizmatlarni olishda xatolik:", error);
      }
    };

    fetchServices();
  }, []);

  const handleOpenStatusModal = (id: string, currentStatus: string) => {
    setSelectedAppId(id);
    setSelectedStatus(currentStatus || "pending");
    setStatusModal(true);
  };

  const fetchApplications = async (
    appPage = 1,
    appLimit = 6,
    sort_field = "",
    sort_desc = true,
    service_id = "",
    client_id = "", // filtr uchun (ixtiyoriy)
    status = "",
    partner_id = ""
  ) => {
    try {
      const offsetValue = (appPage - 1) * appLimit;

      const params = new URLSearchParams({
        sort_field: sort_field,
        sort_desc: String(sort_desc),
        service_id: service_id,
        client_id: client_id,
        status: status,
        partner_id: partner_id,
        limit: String(appLimit),
        offset: String(offsetValue),
      });

      const res = await fetch(
        `https://learnx-crm-production.up.railway.app/api/v1/applications/get-rich-list?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Arizalarni olishda xatolik");

      const data = await res.json();

      // API ba’zida { results: [...] } qaytarsa ham qo‘llab-quvvatlaymiz
      const rows = Array.isArray(data) ? data : data.results || [];
      setApplication(rows);

      // hasNextPage — qaytgan elementlar soni limitga teng bo‘lsa, keyingi sahifa bo‘lishi mumkin
      setAppHasNextPage(rows.length === appLimit);
      console.log("Arizalar muvaffaqiyatli olindi:", data);
    } catch (error) {
      console.error("Arizalarni olishda xatolik:", error);
      toast.error("Arizalarni olishda xatolik yuz berdi");
    }
  };

  useEffect(() => {
    fetchApplications(
      appCurrentPage,
      6,
      "",
      true,
      "",
      selectedClient?.id || "",
      "", // statusni backendga jo‘natmayapmiz; frontda filter qilayapmiz
      ""
    );

    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [appCurrentPage, selectedClient]);

  const filterApp = application.filter((app) => {
    const name = app.client?.full_name?.toLowerCase() || "";
    const phone = app.client?.phone?.toLowerCase() || "";
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      name.includes(searchTerm) || phone.includes(searchTerm);
    const matchesStatus = selectedStatus ? app?.status === selectedStatus : true;

    return matchesSearch && matchesStatus;
  });

  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // DELETE HANDLER
  const handleDeleteApp = async () => {
    if (selectedIds.length === 0) return;

    try {
      for (const id of selectedIds) {
        const res = await fetch(
          `https://learnx-crm-production.up.railway.app/api/v1/applications/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Delete xatolik: ${res.status}`);
        }
      }

      // 🔄 Frontend state’dan ham o‘chirish
      setApplication((prev: any[]) =>
        prev.filter((app) => !selectedIds.includes(app.id))
      );

      toast.success("Tanlangan arizalar muvaffaqiyatli o‘chirildi!");
      setDeleteAppModalOpen(false);
      setSelectedIds([]);
      fetchApplications()
    } catch (err) {
      console.error("Delete xatolik:", err);
      toast.error("O‘chirishda xatolik yuz berdi");
    }
  };


  const [newApp, setNewApp] = useState({ client_id: "", service_id: "", status: "pending" });

  const handleAddApp = async () => {
    try {
      const res = await fetch(
        `https://learnx-crm-production.up.railway.app/api/v1/applications/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newApp),
        }
      );

      if (!res.ok) throw new Error("Ariza qo‘shishda xatolik");

      const data = await res.json();
      setApplication((prev) => [data, ...prev]); // yangi arizani ro‘yxatga qo‘shamiz
      toast.success("Yangi ariza qo‘shildi!");
      setAddAppModalOpen(false);
      setNewApp({ client_id: "", service_id: "", status: "pending" });
      fetchApplications()
    } catch (err) {
      console.error(err);
      toast.error("Qo‘shishda xatolik");
    }
  };



  const handleAppPrevPage = () => {
    setAppCurrentPage((p) => (p > 1 ? p - 1 : p));
  };

  const handleAppNextPage = () => {
    setAppCurrentPage((p) => (appHasNextPage ? p + 1 : p));
  };

  const handleSearchAppClients = async (query: string) => {
    setNameQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://learnx-crm-production.up.railway.app/api/v1/clients/get-list?query=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Qidiruvda xatolik");
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Qidiruvda xatolik:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveApp = async () => {
    if (!selectedApp?.id) {
      console.error("ID topilmadi!", selectedApp);
      return;
    }

    try {
      const updateId = selectedApp.id;

      const res = await fetch(
        `https://learnx-crm-production.up.railway.app/api/v1/applications/update/${updateId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedApp.id,
            client_id: selectedApp.client_id,
            service_id: selectedApp.service_id,
            status: selectedApp.status,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`Xatolik yuz berdi: ${res.status}`);
      }

      const updated = await res.json();

      toast.success("Ariza muvaffaqiyatli yangilandi!");

      // 🔄 UI yangilash
      setApplication((prev: any[]) =>
        prev.map((app) => (app.id === updateId ? updated : app))
      );
      fetchApplications()
      setEditAppModal(false);
      setSelectedApp(null);
    } catch (err) {
      console.error("Arizani yangilashda xatolik:", err);
      toast.error("Arizani yangilashda xatolik yuz berdi");
    }
  };


  const handleStatusChange = async (newStatus: string) => {
    if (!selectedAppId) return;

    try {
      const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/applications/update-status`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("admin_access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedAppId,
            status: newStatus,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Statusni yangilashda xatolik");
      }

      toast.success("Status muvaffaqiyatli yangilandi!");

      // Jadvalni yangilash
      setApplication((prev) => prev.map((app) => app.id === selectedAppId ? { ...app, status: newStatus } : app));

      setSelectedStatus(newStatus);
      setStatusModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Statusni yangilashda xatolik yuz berdi");
    }
  };

  return (
    <section className="bg-gray-50 rounded-xl my-3 pb-1">
      <div className="pt-6 px-8 border-b border-white/20">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-600 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-blue-400" /> Arizalar boshqaruvi
          </h2>
          <div>
            <button
              onClick={() => setAddAppModalOpen(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              + Ariza qo'shish
            </button>

          </div>
        </div>
      </div>

      <div className="flex justify-around items-center gap-10 my-2 p-3">
        <div className="w-[420px] bg-white flex items-center gap-2 text-gray-500 border border-gray-600 p-3 rounded-lg">
          <Search />
          <input type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full focus:outline-none bg-transparent"
            placeholder="Ismi va raqami bo‘yicha qidiring" />
        </div>

        <div className="flex justify-center bg-white items-center gap-2 w-[170px] border  border-3 p-3 text-center rounded-lg relative"
          ref={dropdownRef}>
          <div onClick={() => setIsOpen(!isOpen)}
            className="flex justify-center items-center gap-2 w-[200px] text-center rounded-lg cursor-pointer text-gray-500">
            <span>
              {statuses.find((s) => s.value === selectedStatus)?.label || "Barcha statuslar"}
            </span>
            <div className="text-gray-500 text-sm">▼</div>
          </div>

          {isOpen && (
            <div className="absolute top-full  left-0 bg-gradient-to-br from-blue-300 via-blue-400 to-blue-300 text-white rounded-lg shadow-lg overflow-hidden w-full z-50">
              {statuses.map((status) => (
                <div
                  key={status.value}
                  onClick={() => handleSelect(status.value)}
                  className="p-2 hover:bg-slate-300/20 cursor-pointer">
                  {status.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-4xl">
          <button
            onClick={selectedIds.length > 0 ? handleDeleteApp : undefined}
            className={`${selectedIds.length > 0
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-400 cursor-not-allowed"
              } p-2 rounded-lg`}
            disabled={selectedIds.length === 0}>
            <Trash2 className="text-white text-4xl" />
          </button>
        </div>
      </div>

      <div className="m-4 overflow-hidden border-gray-300 rounded-lg border">
        <table className="w-full">
          <thead className="bg-gradient-to-r  text-gray-400 text-sm uppercase tracking-wide">
            <tr>
              <th className="p-4 text-left font-semibold text-lg">#</th>
              <th className="p-4 text-left font-semibold">Mijoz</th>
              <th className="p-4 text-left font-semibold">Email</th>
              <th className="p-4 text-left font-semibold">Telefon</th>
              <th className="p-4 text-left font-semibold">Sana</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500 text-sm">
            {filterApp.map((app: any, index: number) => (
              <tr
                key={app.id || index}
                className="hover:bg-gray-400/10 transition-colors duration-200 text-gray-600">
                <td className="px-3 py-4">
                  <input type="checkbox" checked={selectedIds.includes(app.id)}
                    onChange={() => handleCheckboxChange(app.id)}
                    className="w-5 h-5 rounded-lg appearance-none border checked:bg-blue-700 checked:border-gray-100 transition-all duration-200 relative before:content-['✔'] before:absolute before:-top-[1px] before:text-sm before:left-[4px] before:text-white before:opacity-0 checked:before:opacity-100 border-gray-400 cursor-pointer" />
                </td>

                <td className="px-3 py-4 flex items-center gap-2">
                  {app.client?.avatar_url ? (
                    <img
                      src={app.client.avatar_url}
                      alt={app.client?.full_name || "Foydalanuvchi"}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/30" />
                  ) : app.client?.full_name ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                      {app.client.full_name
                        ?.split(" ")
                        .map((w: string) => w.charAt(0).toUpperCase())
                        .join("")}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                      FN
                    </div>
                  )}
                  <span className="font-medium">
                    {app.client?.full_name || "Full_Name"}
                  </span>
                </td>

                <td className="px-3 py-4 text-sm truncate max-w-[200px]">
                  {app.client?.email || "—"}
                </td>

                <td className="px-3 py-4">{app.client?.phone || "Phone"}</td>

                <td className="px-3 py-4">
                  {new Date(app.created_at).toLocaleDateString()}
                </td>

                <td
                  className="px-3 py-4"
                  onClick={() => handleOpenStatusModal(app.id, app.status)}
                >
                  <button
                    className={`rounded-2xl px-3 py-1 text-sm font-medium ${getStatusColorApp(
                      app.status
                    )} shadow`}
                  >
                    {getStatusLabelApp(app.status)}
                  </button>
                </td>

                <td
                  className=" text-yellow-500 w-4"
                  onClick={() => {
                    setEditAppModal(true);
                    setSelectedApp(app);
                    setIsEditingAppName(false);
                    setSearchResults([]);
                    setNameQuery("");
                  }}
                >
                  <Edit className="text-center mx-auto cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(editAppModal || addAppModalOpen) && (
          <div
            onClick={() => {
              setEditAppModal(false);
              setAddAppModalOpen(false);
              setSelectedApp(null);
              setNewApp({ client_id: "", service_id: "", status: "pending" });
            }}
            className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-6 rounded-lg shadow-lg w-[450px] space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-700">
                {selectedApp ? "Arizani tahrirlash" : "Yangi ariza qo‘shish"}
              </h2>

              {/* Client qidirish */}
              <div>
                <input
                  type="text"
                  value={nameQuery}
                  onChange={(e) => handleSearchAppClients(e.target.value)}
                  placeholder="Mijozni qidiring..."
                  className="w-full border rounded-lg p-2"
                />
                {isSearching && <p className="text-sm text-gray-500">Qidirilmoqda...</p>}
                {searchResults.length > 0 && (
                  <div className="border rounded-lg mt-2 max-h-40 overflow-y-auto">
                    {searchResults.map((client) => (
                      <div
                        key={client.id}
                        onClick={() => {
                          if (selectedApp) {
                            setSelectedApp((prev: any) => ({
                              ...prev,
                              client_id: client.id,
                              client,
                            }));
                          } else {
                            setNewApp((prev) => ({
                              ...prev,
                              client_id: client.id,
                            }));
                          }
                          setSelectedClient(client);
                          setSearchResults([]);
                          setNameQuery(client.full_name);
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {client.full_name} ({client.phone})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Service select */}
              <select
                value={selectedApp ? selectedApp.service_id : newApp.service_id}
                onChange={(e) => {
                  if (selectedApp) {
                    setSelectedApp((prev: any) => ({
                      ...prev,
                      service_id: e.target.value,
                    }));
                  } else {
                    setNewApp((prev) => ({
                      ...prev,
                      service_id: e.target.value,
                    }));
                  }
                }}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Xizmatni tanlang</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title.uz}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setEditAppModal(false);
                    setAddAppModalOpen(false);
                    setSelectedApp(null);
                  }}
                  className="bg-gray-400 px-4 py-2 rounded-lg text-white"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={selectedApp ? handleSaveApp : handleAddApp}
                  className="bg-blue-600 px-4 py-2 rounded-lg text-white"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        )}





        {deleteAppModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-gray-50 shadow-2xl p-6 rounded-lg max-w-[570px]">
              <h1 className="text-2xl text-center text-gray-600 font-semibold pb-4">
                {selectedIds.length} ta arizani o‘chirilsinmi?
              </h1>
              <div className="flex justify-center items-center gap-4 pt-4">
                <button
                  onClick={() => setDeleteAppModalOpen(false)}
                  className="py-3 px-10 text-white bg-gray-500 rounded-lg font-semibold hover:bg-gray-600 duration-300"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleConfirmAppDelete}
                  className="py-3 px-14 text-white bg-red-600 rounded-lg font-semibold hover:bg-red-700 duration-300"
                >
                  O‘chirish
                </button>
              </div>
            </div>
          </div>
        )}


        {statusModal && (
          <div onClick={() => setStatusModal(false)}
            className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-gradient-to-br from-slate-700 via-purple-700 to-slate-700 p-5 rounded-xl shadow-lg w-64 space-y-2">
              <h3 className="text-white text-lg font-semibold mb-2">
                Statusni tanlang
              </h3>
              {[
                {
                  label: "Kutilmoqda",
                  value: "pending",
                  color: "bg-yellow-300 text-yellow-700",
                },
                {
                  label: "Tasdiqlangan",
                  value: "approved",
                  color: "bg-green-300 text-green-700",
                },
                {
                  label: "Rad etildi",
                  value: "rejected",
                  color: "bg-red-300 text-red-700",
                },
                {
                  label: "Noma'lum",
                  value: "uknown",
                  color: "bg-yellow-300 text-white",
                },
              ].map((item, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-2 rounded-md cursor-pointer font-medium p-2 ${item.color} hover:opacity-80`}
                >
                  <input type="radio" name="status" value={item.value} className="cursor-pointer"
                    checked={selectedStatus === item.value}
                    onChange={() => handleStatusChange(item.value)} />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center my-4">
        <button onClick={handleAppPrevPage}
          disabled={appCurrentPage === 1}
          className={`px-6 py-2 font-semibold text-white rounded-lg ${appCurrentPage === 1
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-400  cursor-pointer"
            }`}
        >
          Oldingi
        </button>
        <span className="text-gray-800 mx-4">{appCurrentPage}</span>
        <button
          onClick={handleAppNextPage}
          disabled={!appHasNextPage}
          className={`px-6 py-2 font-semibold text-white rounded-lg ${appHasNextPage ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-700 cursor-not-allowed"
            }`}
        >
          Keyingi
        </button>
      </div>
    </section>
  )
}

export default Applications