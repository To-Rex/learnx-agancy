// src/pages/admin/Leads.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Home, Calendar, FileText } from "lucide-react";

const Headers: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/admin/leads", label: "Call Manager", icon: Home },
    { path: "/admin/leads/agent-form", label: "Agent Form", icon: FileText },
    { path: "/admin/leads/consulting-manager", label: "Consulting Manager", icon: Calendar },
    { path: "/admin/leads/document-manager", label: "Document-manager", icon: FileText },
    { path: "/admin/leads/document-employee", label: "Document-employee", icon: FileText }
  ];

  return (
    <div className="flex items-center justify-between mt-4 ">
      <div className="flex items-center ">
        <Users className="text-blue-600 mr-3" size={22} />
        <h1 className="text-lg font-semibold">Lead Management System</h1>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1  rounded-md text-sm  font-medium transition ${isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-600 hover:text-white"
                }`}
            >
              <Icon size={12} />
              {label}
            </Link>
          );
        })}

        {/* Workflow info */}
        <div className="ml-auto">
          <span className="px-3 py-1 text-sm text-gray-600 border rounded-md bg-gray-50">
            Workflow: Agent → Manager → Consultant
          </span>
        </div>
      </div>
    </div>
  );
};

export default Headers;
