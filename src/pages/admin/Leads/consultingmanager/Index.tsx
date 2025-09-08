import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Lead tipini aniqlaymiz
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

// Agent tipini aniqlaymiz
interface Agent {
  id: string;
  full_name: string;
  phone: string;
  username: string;
  CurrentLeads: number;
}

const ConsultingManager: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [assigned, setAssigned] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingAgents, setLoadingAgents] = useState(true);

  // Default qiymatlar
  const [stage, setStage] = useState<string>("consulting");
  const [status, setStatus] = useState<string>("new");
  const [agentRole, agentSetRole] = useState<string>("consulting_agent");

  // Leadlarni olish funksiyasi
  const fetchLeads = async () => {
    const params = new URLSearchParams({ stage_in: stage, status_in: status });
    setLoadingLeads(true);

    try {
      const token = localStorage.getItem("admin_access_token");
      const res = await fetch(
        `https://learnx-crm-production.up.railway.app/api/v1/leads/get-list?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        console.error("Failed to fetch leads:", res.status, res.statusText);
        setLeads([]);
        return;
      }

      const data = await res.json();
      setLeads(data || []);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setLeads([]);
    } finally {
      setLoadingLeads(false);
    }
  };

  // Agentlarni olish funksiyasi
  const fetchAgents = async () => {
    setLoadingAgents(true);

    try {
      const token = localStorage.getItem("admin_access_token");
      const res = await fetch(
        `https://learnx-crm-production.up.railway.app/api/v1/users/get-angets?role=${agentRole}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        console.error("Failed to fetch agents:", res.status, res.statusText);
        setAgents([]);
        return;
      }

      const data = await res.json();
      setAgents(data || []);
    } catch (err) {
      console.error("Error fetching agents:", err);
      setAgents([]);
    } finally {
      setLoadingAgents(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchAgents();
  }, []);

  // Checkbox tanlash funksiyasi
  const handleCheckboxChange = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Assign tugmasi bosilganda
  const handleAssignClick = () => {
    if (selected.length === 0) {
      toast("Iltimos, biror lead tanlang!");
      return;
    }
    setAssigned(true);
  };

  // Leadlarni agentga biriktirish funksiyasi
  const handleAssignToAgent = async (agent: Agent) => {
    try {
      const token = localStorage.getItem("admin_access_token");
      const res = await fetch(
        "https://learnx-crm-production.up.railway.app/api/v1/users/assign-leads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            agent_id: agent.id,
            lead_ids: selected,
            role: "call_agent",
          }),
        }
      );

      if (!res.ok) {
        toast.error("Biriktirishda xatolik!");
        return;
      }

      toast.success(`${selected.length} ta lead ${agent.full_name} ga biriktirildi!`);

      // Backenddan qayta olish
      await fetchLeads();
      await fetchAgents();

      setSelected([]);
      setAssigned(false);
    } catch {
      toast.error("Server bilan bog‘lanishda xatolik!");
    }
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">Consulting Manager Dashboard</h1>
        <p className="text-md font-medium text-gray-500">
          Manage lead workflow from Instagram targeting to agent assignment
        </p>
      </div>
      <div className="border rounded-lg shadow-lg mt-3 p-4">
        {loadingLeads || loadingAgents ? (
          <div className="flex justify-center items-center mt-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400"></div>
          </div>
        ) : !assigned ? (
          <>
            <div className="mt-5">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className={`border rounded-xl w-full p-4 mt-5 shadow-sm flex items-center justify-between transition-all duration-200 ${selected.includes(lead.id)
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-gray-400"
                    }`}
                >
                  <div>
                    <h1 className="font-semibold">{lead.name}</h1>
                    <h2 className="font-medium text-gray-400 text-sm">{lead.email}</h2>
                    <span
                      className={`mt-2 inline-block px-2 py-1 text-xs rounded-md ${lead.stage === "assigned" ? "bg-blue-600 text-white" : "bg-green-600 text-white"
                        }`}
                    >
                      {lead.stage}
                    </span>
                    <p className="text-gray-600">{lead.source}</p>
                    <p className="text-gray-500 text-sm">{lead.phone}</p>
                  </div>

                  <input
                    type="checkbox"
                    checked={selected.includes(lead.id)}
                    onChange={() => handleCheckboxChange(lead.id)}
                    className="w-5 h-5"
                    disabled={lead.stage === "assigned"}
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={handleAssignClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Assign Leads
              </button>
            </div>
          </>
        ) : (
          <div className="mt-5 flex gap-10">
            <div className="w-1/2">
              <h2 className="font-semibold mb-3">Selected Leads</h2>
              {leads
                .filter((lead) => selected.includes(lead.id))
                .map((lead) => (
                  <div
                    key={lead.id}
                    className="border rounded-xl w-full p-4 mt-3 shadow-sm bg-green-50"
                  >
                    <h1 className="font-semibold">{lead.name}</h1>
                    <p className="text-gray-500 text-sm">{lead.email}</p>
                  </div>
                ))}
            </div>

            <div className="w-1/2">
              <h2 className="font-semibold mb-3">Agents</h2>
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => handleAssignToAgent(agent)}
                  className="border rounded-xl w-full p-4 mt-3 shadow-sm cursor-pointer hover:bg-blue-50 transition-all"
                >
                  {agent.full_name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultingManager;
