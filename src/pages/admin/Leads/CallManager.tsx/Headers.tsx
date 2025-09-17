// src/pages/admin/Leads.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Home, Calendar, FileText } from "lucide-react";

const Headers: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/admin/leads", label: "Call Manager", icon: Home },
    { path: "/admin/leads/call-agent", label: "Call Agent", icon: FileText },
    {
      path: "/admin/leads/consulting-manager",
      label: "Consulting Manager",
      icon: Calendar,
    },
    {
      path: "/admin/leads/consulting-agent",
      label: "Consulting Agent",
      icon: Users,
    },
    {
      path: "/admin/leads/document-manager",
      label: "Document-manager",
      icon: FileText,
    },

    {
      path: "/admin/leads/document-agent",
      label: "Document-agent",
      icon: FileText,
    },
  ];

  return (
    <div className="flex items-center justify-between mt-4 ">

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1 px-2 py-[4px] rounded-md font-medium transition ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon size={12} />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Headers;
