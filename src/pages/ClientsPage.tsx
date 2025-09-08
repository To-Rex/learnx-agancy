import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Calendar, User, FileText, Compass, Building } from "lucide-react";

interface Client {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  passport_number?: string;
  visa_type?: string;
  direction?: string;
  branch_id?: string;
  avatar_url?: string;
  created_at: string;
}

interface Application {
  id: string;
  status: string;
  service_id: string;
  created_at: string;
  client: {
    id: string;
    full_name: string;
    phone: string;
  };
}

interface Props {
  clientId: string;
}

const ClientDetailsPage: React.FC<Props> = ({ clientId }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingClient, setLoadingClient] = useState(true);
  const [loadingApp, setLoadingApp] = useState(false);

  useEffect(() => {
    if (!clientId) return;

    const fetchClient = async () => {
      setLoadingClient(true);
      try {
        const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/clients/get/${clientId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
          },
        });

        if (!res.ok) throw new Error("Client ma'lumotlari yuklanmadi");

        const data = await res.json();
        const clientData = data?.data || data;
        setClient(clientData);

        if (clientData?.id) localStorage.setItem("id", clientData.id);
      } catch (err) {
        console.error("Client yuklash xatolik:", err);
        setClient(null);
      } finally {
        setLoadingClient(false);
      }
    };

    fetchClient();
  }, [clientId]);

  useEffect(() => {
    if (!client) return;

    const fetchApplications = async () => {
      setLoadingApp(true);
      try {
        const params = new URLSearchParams({
          sort_field: "status",
          sort_desc: "true",
          limit: "10",
          offset: "0",
          client_id: client.id,
        });

        const res = await fetch(
          `https://learnx-crm-production.up.railway.app/api/v1/applications/get-rich-list?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
            },
          }
        );

        if (!res.ok) throw new Error("Application ma'lumotlari yuklanmadi");

        const data = await res.json();
        setApplications(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Application yuklash xatolik:", err);
        setApplications([]);
      } finally {
        setLoadingApp(false);
      }
    };

    fetchApplications();
  }, [client]);

  if (loadingClient) return <p className="text-gray-700 text-center mt-6">Client ma'lumotlari yuklanmoqda...</p>;
  if (!client) return <p className="text-red-500 text-center mt-6">Client topilmadi!</p>;

  return (
    <>
      {/* Client Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 max-w-3xl mx-auto mt-6"
      >
        <div className="flex items-center space-x-6 mb-8">
          {client.avatar_url ? (
            <img src={client.avatar_url} alt={client.full_name} className="w-20 h-20 rounded-full object-cover border-2 border-white/30" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-gray-600 text-3xl font-bold">
              {client.full_name?.split(" ").map(n => n[0].toUpperCase()).join("")}
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold text-gray-600">{client.full_name}</h2>
            <p className="text-gray-400 text-sm">ID: {client.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
          <div className="flex items-center space-x-3"><Mail className="w-5 h-5 text-gray-400" /><span>{client.email || "—"}</span></div>
          <div className="flex items-center space-x-3"><Phone className="w-5 h-5 text-gray-400" /><span>{client.phone || "—"}</span></div>
          <div className="flex items-center space-x-3"><FileText className="w-5 h-5 text-gray-400" /><span>Passport: {client.passport_number || "—"}</span></div>
          <div className="flex items-center space-x-3"><User className="w-5 h-5 text-gray-400" /><span>Visa: {client.visa_type || "—"}</span></div>
          <div className="flex items-center space-x-3"><Compass className="w-5 h-5 text-gray-400" /><span>Direction: {client.direction || "—"}</span></div>
          <div className="flex items-center space-x-3"><Building className="w-5 h-5 text-gray-400" /><span>Branch: {client.branch_id || "—"}</span></div>
          <div className="flex items-center space-x-3 col-span-2"><Calendar className="w-5 h-5 text-gray-400" /><span>Ro‘yxatdan o‘tgan: {client.created_at ? new Date(client.created_at).toLocaleDateString("uz-UZ") : "—"}</span></div>
        </div>
      </motion.div>

      {/* Applications */}
      {loadingApp ? (
        <p className="text-gray-600 text-center mt-4">Application ma'lumotlari yuklanmoqda...</p>
      ) : applications.length ? (
        <div className="mt-6 space-y-4">
          {applications.map(a => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 max-w-3xl mx-auto mt-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600">Ariza ID: {a.id.slice(0, 13)}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  a.status === "approved" ? "bg-green-500/20 text-green-400" :
                  a.status === "draft" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-gray-500/20 text-gray-400"}`}>
                  {a.status}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <p><span className="text-gray-400">Xizmat ID: </span>{a.service_id?.slice(0,12) || "—"}</p>
                <p><span className="text-gray-400">Raqami: </span>{a.client?.phone || "—"}</p>
                <p><span className="text-gray-400">Yaratilgan: </span>{new Date(a.created_at).toLocaleDateString("uz-UZ")}</p>
                <p><span className="text-gray-400">Mijoz: </span>{a.client?.full_name || "—"}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-6">Bu foydalanuvchi hali ariza yozmagan</p>
      )}
    </>
  );
};

export default ClientDetailsPage;
