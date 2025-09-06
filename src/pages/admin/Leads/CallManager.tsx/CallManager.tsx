import React from "react";
import LeadsAssignment from "./LeadsAssigment";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CallManager: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: "/admin/leads/agent-form", label: "Agent Form", icon: ArrowRight },
        { path: "/admin/leads/consulting-manager", label: "Consulting Manager", icon: ArrowRight },
    ];
    return (
        <>
            <div className="mt-5 border-b border-gray-400 mb-5">

            </div>
            <div className="flex items-center justify-between mt-4">
                {/* Title */}
                <div className=" ">
                    <h1 className="text-3xl font-bold">Call Manager Dashboard</h1>
                    <p className="text-lg font-medium">Manage lead workflow from Instagram targeting to agent assignment</p>
                </div>

                {/* Navigation buttons */} 
                <div className="rounded-md bg-[#dfdfdf8d] p-1 text-sm flex items-center gap-3">
                    Workflow:
                    <div className="flex items-center gap-3">
                        {navItems.map(({ path, label, icon: Icon }) => {
                            const isActive = location.pathname === path;
                            return (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`flex items-center gap-2 p-1 rounded-md  font-medium transition ${isActive
                                        ? "bg-trasparent border border-gray-500 text-black"
                                        : "text-gray-700 hover:bg-blue-600 hover:text-white"
                                        }`}
                                >
                                    <Icon size={14} />
                                    {label}
                                </Link>
                            );
                        })}

                    </div>
                </div>

            </div>
            <LeadsAssignment />
            

        </>
    )
};

export default CallManager;
