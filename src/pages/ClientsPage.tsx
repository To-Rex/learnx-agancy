import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Calendar, User, FileText, Compass, Building } from "lucide-react";

const ClientDetailsPage = ({ clientId }: { clientId: string }) => {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(
          `https://learnx-crm-production.up.railway.app/api/v1/clients/get/${clientId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
            },
          }
        );

        if (!res.ok) throw new Error("Ma'lumot yuklanmadi");
        const data = await res.json();
        setClient(data?.data || data);
      } catch (err) {
        console.error("Xatolik:", err);
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) fetchClient();
  }, [clientId]);

  if (loading) {
    return <p className="text-white text-center">Yuklanmoqda...</p>;
  }

  if (!client) {
    return <p className="text-red-400 text-center">Client topilmadi!</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 max-w-3xl mx-auto mt-6"
    >
      {/* Avatar & Name */}
      <div className="flex items-center space-x-6 mb-8">
        {client.avatar_url ? (
          <img
            src={client.avatar_url}
            alt={client.full_name}
            className="w-20 h-20 rounded-full object-cover border-2 border-white/30"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
            {client.full_name?.charAt(0)?.toUpperCase()}
            {client.full_name?.split(" ")[1]?.charAt(0)?.toUpperCase()}
          </div>
        )}

        <div>
          <h2 className="text-3xl font-bold text-white">{client.full_name}</h2>
          <p className="text-gray-400 text-sm">ID: {client.id}</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
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
  );
};

export default ClientDetailsPage;
