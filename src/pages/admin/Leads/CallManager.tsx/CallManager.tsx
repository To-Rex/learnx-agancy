import React, { useState } from "react";
import LeadsAssignment from "./SelectAssigment";
import { BsPeople } from "react-icons/bs";
import { Instagram } from "lucide-react";
import IncomingLeads from "./IncomingLeads";
import ClassifyLeads from "./ClassifyLeads";
import MonitorCalls from "./MonitorCalls";
import ResultsMeetings from "./ResultsMeetings";
import Footer from "./Footer";


const CallManager: React.FC = () => {
    const [active, setActive] = useState("incoming");

    const tabs = [
        { id: "incoming", label: "1. Incoming Leads" },
        { id: "classify", label: "2. Classify Leads" },
        { id: "select", label: "3. Select & Assign" },
        { id: "monitor", label: "4. Monitor Calls" },
        { id: "results", label: "5. Results & Meetings" },
    ];

    return (
        <>
            {/* Header */}
            <div className="mt-5 border-b border-gray-400 mb-5"></div>
            <div className="flex items-center justify-between mt-4">
                <div>
                    <h1 className="text-3xl font-bold">Call Manager Dashboard</h1>
                    <p className="text-md font-medium text-gray-500">
                        Manage lead workflow from Instagram targeting to agent assignment
                    </p>
                </div>
                <div className="flex items-center justify-between w-[35%]">
                    <div className="border border-gray-300 rounded-lg flex items-center gap-2 p-2 text-sm">
                        <Instagram className="text-gray-600" size={14} />
                        150 New from Instagram
                    </div>
                    <div className="border border-gray-300 rounded-lg flex items-center gap-3 p-2">
                        <BsPeople className="text-gray-600" size={14} />
                        4 Active Agents
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className=" pt-5">
                <div className="flex items-center justify-between p-2  space-x-10  border rounded-lg bg-[#d7d7d784]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActive(tab.id)}
                            className={`relative p-1 rounded-lg font-medium text-sm transition-all duration-300
                      ${active === tab.id
                                    ? "bg-[#fff] text-gray-800 shadow-lg scale-105"
                                    : " text-gray-900"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="mt-6">
                {active === "incoming" && <IncomingLeads />}
                {active === "classify" && <ClassifyLeads />}
                {active === "select" && <LeadsAssignment />}
                {active === "monitor" && <MonitorCalls />}
                {active === "results" && <ResultsMeetings />}
            </div>
            <Footer/>
        </>
    );
};

export default CallManager;
