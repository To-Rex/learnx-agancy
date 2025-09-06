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

const ClassifyLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadClassification, setLeadClassification] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true); // Loading state qo'shildi


  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
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
          return;
        }

        const data = await res.json();
        setLeads(data.new || [])

      } catch (error) {
        console.error("Fetch xatolik:", error);
      } finally {
        setLoading(false); // API tugagandan keyin loading=false
      }
    };

    fetchLeads();
  }, []);

  const handleClassificationChange = (leadId: string, value: string) => {
    setLeadClassification((prev) => ({
      ...prev,
      [leadId]: value,
    }));
  };

  return (
    <div className="border rounded-lg shadow-lg mt-3 p-4">
      {/* Title */}
      <div className="">
        <h2 className="text-xl font-semibold">Classify Leads</h2>
        <h2 className="text-md text-gray-400">Review and categorize incoming leads</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="border rounded-xl p-4 shadow-sm transition-all duration-200 flex flex-col gap-2"
            >
              <h3 className="font-semibold text-gray-700">{lead.name}</h3>
              <p className="text-gray-600">{lead.source}</p>
              <p className="text-gray-500 text-sm">{lead.phone}</p>

              {/* Select o'rniga stage */}
              <select
                value={leadClassification[lead.id] || ""}
                onChange={(e) => handleClassificationChange(lead.id, e.target.value)}
                className="mt-2 border rounded-md px-2 py-1 text-sm"
              >
                <option value="" disabled hidden>
                  Classify Lead
                </option>
                <option value="Lect">Keep as New</option>
                <option value="Needs callback">Needs callback</option>
                <option value="Reject">Reject</option>
              </select>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassifyLeads;
