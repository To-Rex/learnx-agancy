import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";

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

const SelectAssignment: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [showCounter, setShowCounter] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [counterValue, setCounterValue] = useState<number>(0);
  const [loading, setLoading] = useState(true); // Loading state qo‘shildi

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

  const handleCounterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value) || 0;
    if (value < 0) value = 0;
    if (value > leads.length) value = leads.length;
    setCounterValue(value);

    // selected array ni avtomatik counterga moslash
    const newSelected = leads.slice(0, value).map((lead) => lead.id);
    setSelected(newSelected);
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <div className="border rounded-lg shadow-lg mt-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl mr-3 font-semibold">Select Leads for Assignment</h2>

          {!showCounter && !confirmed && (
            <div
              onClick={() => setShowCounter(true)}
              className="bg-gray-950 p-2 rounded-lg cursor-pointer"
            >
              <Plus size={20} className="text-white" />
            </div>
          )}
        </div>

        {!showCounter && !confirmed ? (
          <span className="text-gray-600 font-medium">{leads.length} Available</span>
        ) : !confirmed ? (
          <div className="flex justify-end items-center gap-2 mb-4">
            <input
              type="number"
              min={0}
              max={leads.length}
              value={counterValue}
              onChange={handleCounterChange}
              className="px-3 py-1 border rounded-lg w-20 text-center"
            />
            <span className="px-3 py-1 border rounded-lg">/ {leads.length}</span>
            <button
              onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Confirm
            </button>
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      ) : !confirmed ? (
        <div className=" w-1/2  mt-5">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className={`border rounded-xl w-full p-4 mt-5 shadow-sm transition-all duration-200 ${selected.includes(lead.id)
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-gray-400"
                }`}
            >
             <div>
               <div>
                <h3 className="font-semibold">{lead.name}</h3>
                <span className="mt-2 inline-block px-2 py-1 text-xs bg-green-600 text-white rounded-md">
                  {lead.stage}
                </span>
              </div>
              <div>
                <p className="text-gray-600">{lead.source}</p>
                <p className="text-gray-500 text-sm">{lead.phone}</p>
              </div>
             </div>
            </div>
          ))}
        </div>
      ) : (
        <h1>agents</h1>
      )}
    </div>
  );
};

export default SelectAssignment;
