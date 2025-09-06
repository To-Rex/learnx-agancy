import React, { useState } from "react";

interface Lead {
  id: number;
  name: string;
  company: string;
  phone: string;
  status: string;
}

const leadsData: Lead[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Lead ${i + 1}`,
  company: `Company ${i + 1}`,
  phone: `+1-555-000${i + 1}`,
  status: "new",
}));

const LeadsAssignment: React.FC = () => {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleLead = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Select Leads for Assignment</h2>

      {/* Counter + Confirm */}
      <div className="flex justify-end items-center gap-2 mb-4">
        <span className="px-3 py-1 border rounded-lg">
          {selected.length} / 150
        </span>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
          Confirm
        </button>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {leadsData.map((lead) => (
          <div
            key={lead.id}
            onClick={() => toggleLead(lead.id)}
            className={`cursor-pointer border rounded-xl p-4 shadow-sm transition-all duration-200 ${
              selected.includes(lead.id)
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <h3 className="font-semibold">{lead.name}</h3>
            <p className="text-gray-600">{lead.company}</p>
            <p className="text-gray-500 text-sm">{lead.phone}</p>
            <span className="mt-2 inline-block px-2 py-1 text-xs bg-green-600 text-white rounded-md">
              {lead.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadsAssignment;
