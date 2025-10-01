import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LeadFileUpload from "./LeadFileUpload";

interface LeadType {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  status: string;
  region: string;
  source: string;
}

interface ChecklistItem {
  service_input_id: string;
  name: { uz?: string; en?: string; ru?: string };
  required?: boolean;
  uploaded_doc?: { file_url: string } | null;
}

const DocumentAgentPage = () => {
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadType | null>(null);
  const [checklistData, setChecklistData] = useState<ChecklistItem[]>([]);
  const [checklistLoading, setChecklistLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://learnx-crm-production.up.railway.app/api/v1/leads/get-agent-leads?stage_in=documenting",
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("admin_access_token") || ""
            }`,
          },
        }
      );
      if (!res.ok) throw new Error("Leadlarni olishda xatolik");
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Leadlarni olishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadChecklist = async (leadId: string) => {
    setChecklistLoading(true);
    try {
      const res = await fetch(
        `https://learnx-crm-production.up.railway.app/api/v1/leads/get-doc-intputs/${leadId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("admin_access_token") || ""
            }`,
          },
        }
      );

      if (!res.ok) throw new Error("Checklist topilmadi");
      const data = await res.json();

      console.log("📌 API dan qaytgan inputlar:", data);

      // ✅ Formatni tekshirib olish
      if (Array.isArray(data)) {
        setChecklistData(data);
      } else if (Array.isArray(data.inputs)) {
        setChecklistData(data.inputs);
      } else if (Array.isArray(data.checklist)) {
        setChecklistData(data.checklist);
      } else {
        setChecklistData([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Checklistni olishda xatolik yuz berdi");
      setChecklistData([]);
    } finally {
      setChecklistLoading(false);
    }
  };

  const handleLeadSelect = (lead: LeadType) => {
    setSelectedLead(lead);
    fetchLeadChecklist(lead.id);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">📂 Document Agent</h1>

      <div className="flex gap-8">
        {/* 🚀 Leadlar paneli */}
        <div className="w-1/3 border rounded-lg p-4 bg-white shadow">
          <h2 className="text-lg font-semibold mb-4">Leadlar</h2>
          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          ) : leads.length === 0 ? (
            <p className="text-gray-500">Leadlar topilmadi</p>
          ) : (
            <div className="space-y-2">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => handleLeadSelect(lead)}
                  className={`p-3 rounded cursor-pointer border transition ${
                    selectedLead?.id === lead.id
                      ? "bg-blue-100 border-blue-500"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <p className="font-semibold">{lead.name}</p>
                  <p className="text-sm text-gray-600">{lead.phone}</p>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                  <p className="text-sm text-gray-500">{lead.source}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🚀 Hujjatlar paneli */}
        <div className="flex-1 border rounded-lg p-4 bg-white shadow">
          <h2 className="text-lg font-semibold mb-4">Hujjatlar</h2>
          {selectedLead ? (
            checklistLoading ? (
              <p className="text-gray-500">Hujjatlar ro‘yxati yuklanmoqda...</p>
            ) : checklistData.length > 0 ? (
              <div className="space-y-4">
                {checklistData.map((item) => {
                  console.log("📋 Checklist item:", {
                    service_input_id: item.service_input_id,
                    leadId: selectedLead.id,
                    label: item.name.uz,
                  });

                  return (
                    <LeadFileUpload
                      key={item.service_input_id}
                      leadId={selectedLead.id}
                      serviceInputId={item.service_input_id}
                      label={item.name.uz || "Hujjat"}
                      required={item.required || false}
                      currentFile={item.uploaded_doc?.file_url || ""}
                      onUploaded={(url) => {
                        console.log("✅ Yangi file URL:", url);
                        fetchLeads(); // chap panelni qayta yuklash
                        setSelectedLead(null); // ong panelni yopish
                      }}
                      onClose={() => setSelectedLead(null)}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">❌ Bu lead uchun hujjat topilmadi</p>
            )
          ) : (
            <p className="text-gray-500">Iltimos, chapdan leadni tanlang</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DocumentAgentPage;
