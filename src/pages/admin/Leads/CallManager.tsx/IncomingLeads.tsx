import { Instagram } from "lucide-react";
import { useEffect, useState } from "react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  passport_number: string;
  stage: string;
  note: string;
  source: string;
  created_at: string;
  updated_at: string;
}

const IncomingLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true); // Loading state qo'shildi

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true); // API chaqirishdan oldin loading=true
      try {
        const token = localStorage.getItem("admin_access_token");
        const res = await fetch(
          "https://learnx-crm-production.up.railway.app/api/v1/leads/get-dashboard-list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.error("API xatolik:", res.status, res.statusText);
          setLeads([]);
          return;
        }

        const data = await res.json();
        setLeads(data.new || []);
      } catch (error) {
        console.error("Fetch xatolik:", error);
        setLeads([]);
      } finally {
        setLoading(false); // API tugagandan keyin loading=false
      }
    };

    fetchLeads();
  }, []);

  // Instagramdan kelgan leadlarni filtrlaymiz
  const instagramLeads = leads.filter(
    (lead) => lead.source.toLowerCase() === "insta"
  );

  return (
    <div className="border rounded-lg shadow-lg mt-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Instagram size={22} />
          <h2 className="text-xl mr-3 font-semibold ml-3">
            Incoming Leads from Instagram Targeting
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {instagramLeads.length > 0 ? (
            instagramLeads.map((lead) => (
              <div
                key={lead.id}
                className="border rounded-xl p-4 shadow-sm transition-all duration-200 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{lead.name}</h3>
                  <div className="bg-pink-300 text-white p-1 rounded-lg flex items-center text-sm">
                    <Instagram size={16} />
                  </div>
                </div>
                <p className="text-gray-600">{lead.source}</p>
                <p className="text-gray-500 text-sm">{lead.phone}</p>
                <span className="mt-2 w-[40px] inline-block px-2 py-1 text-xs bg-green-600 text-white rounded-md">
                  {lead.stage}
                </span>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Hech narsa topilmadi
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default IncomingLeads;
