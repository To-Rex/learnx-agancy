import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Calendar, User, FileText, Compass, Building } from "lucide-react";

const ClientDetailsPage = ({ clientId }: { clientId: string }) => {
  const [client, setClient] = useState<any>(null);
  const [app, setApp] = useState<any>(null);
  const [loadingClient, setLoadingClient] = useState(true);
  const [loadingApp, setLoadingApp] = useState(true);
  const Id = localStorage.getItem("id")




  useEffect(() => {
    const fetchClient = async () => {
      setLoadingClient(true);
      try {
        const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/clients/get/${clientId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
          },
        });
        if (!res.ok) throw new Error("Ma'lumot yuklanmadi");
        const data = await res.json();
        setClient(data?.data || data);
        console.log('idddd', data.id);
        localStorage.setItem("id", data.id)
      } catch (err) {
        console.error("Xatolik:", err);
        setClient(null);
      } finally {
        setLoadingClient(false);
      }
    };
    if (clientId) fetchClient();
  }, [clientId]);

  useEffect(() => {
    if (!client) return;
    console.log('salommmm', client.id);


    const fetchApp = async (extraParams: Record<string, string | number | boolean> = {}) => {
      setLoadingApp(true);
      try {
        const defaultParams: Record<string, string | number | boolean> = {
          sort_field: "status",
          sort_desc: true,
          limit: 10,
          offset: 0,
          client_id: client.id,
        };

        const params = new URLSearchParams({
          ...Object.fromEntries(
            Object.entries({ ...defaultParams, ...extraParams }).map(([k, v]) => [k, String(v)])
          ),
        });

        const res = await fetch(
          `https://learnx-crm-production.up.railway.app/api/v1/applications/get-rich-list?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
            },
          }
        );

        if (!res.ok) throw new Error("Ma'lumot yuklanmadi");
        const data = await res.json();
        console.log("Application data:", data);

        // ✅ har ikki holatni qo‘llab-quvvatlaydi
        setApp(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Xatolik:", err);
        setApp([]);
      } finally {
        setLoadingApp(false);
      }
    };



    // oddiy chaqirish
    fetchApp();
  }, [client]);


  if (loadingClient) {
    return <p className="text-gary-700 text-center">Client ma'lumotlari yuklanmoqda...</p>;
  }

  if (!client) {
    return <p className="text-red-400 text-center">Client topilmadi!</p>;
  }


  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 max-w-3xl mx-auto mt-6"
      >
        {/* Avatar & Name */}
        <div className="flex items-center space-x-6 mb-8">
          {client && client.avatar_url ? (
            <img
              src={client.avatar_url}
              alt={client.full_name}
              className="w-20 h-20 rounded-full object-cover border-2 border-white/30"
            />
          ) : client ? (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-gray-600 text-3xl font-bold">
              {client.full_name?.charAt(0)?.toUpperCase()}
              {client.full_name?.split(" ")[1]?.charAt(0)?.toUpperCase()}
            </div>
          ) : null}


          <div>
            <h2 className="text-3xl font-bold text-gray-600">{client.full_name}</h2>
            <p className="text-gray-400 text-sm">ID: {client.id}</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span>{client.email || "—"}</span>
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span>{client.phone || "—"}</span>
          </div>

          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <span>Passport: {client.passport_number || "—"}</span>
          </div>

          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <span>Visa: {client.visa_type || "—"}</span>
          </div>

          <div className="flex items-center space-x-3">
            <Compass className="w-5 h-5 text-gray-400" />
            <span>Direction: {client.direction || "—"}</span>
          </div>

          <div className="flex items-center space-x-3">
            <Building className="w-5 h-5 text-gray-400" />
            <span>Branch: {client.branch_id || "—"}</span>
          </div>

          <div className="flex items-center space-x-3 col-span-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span>
              Ro‘yxatdan o‘tgan:{" "}
              {client.created_at
                ? new Date(client.created_at).toLocaleDateString("uz-UZ")
                : "—"}
            </span>
          </div>
        </div>
      </motion.div>
      {loadingApp ? (
        <p className="text-gray-600 text-center mt-4">Application yuklanmoqda...</p>
      ) : app && app.length > 0 ? (
        <div className="mt-6 space-y-4">
          {app.map((a: any) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 max-w-3xl mx-auto mt-6"
            >
              {/* Status */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600">Ariza ID: {a.id.slice(0, 13)}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${a.status === "approved"
                    ? "bg-green-500/20 text-green-400"
                    : a.status === "draft"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-gray-500/20 text-gray-400"
                    }`}
                >
                  {a.status}
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <p>
                  <span className="text-gray-400 w-full">Xizmat ID: </span>
                  {a.service_id.slice(0 , 12) || "—"}
                </p>
                <p>
                  <span className="text-gray-400">Raqami: </span>
                  {a.client.phone || "—"}
                </p>
                <p>
                  <span className="text-gray-400">Yaratilgan: </span>
                  {new Date(a.created_at).toLocaleDateString("uz-UZ")}
                </p>
                <p className="text-gray-800">
                  <span className="text-gray-400">Mijoz: </span>
                  {a.client?.full_name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-6">
          Bu foydalanuvchi hali ariza yozmagan
        </p>
      )}
    </>
  );
};

export default ClientDetailsPage;
