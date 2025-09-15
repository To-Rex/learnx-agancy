import React from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  FileText,
  Settings,
  MessageSquare,
  Building,
  Mail,
  FilePenLine,
  PhoneIncoming,
  ShieldUser,
  Shield,
  GraduationCap,
} from "lucide-react";

const tabs = [
  // { id: 'dashboard', name: 'Boshqaruv paneli', icon: BarChart3 },
  { id: "client", name: "Mijozlar", icon: Users },
  { id: "applications", name: "Arizalar", icon: FileText },
  { id: "services", name: "Xizmatlar", icon: Settings },
  { id: "stories", name: "Hikoyalar", icon: MessageSquare },
  { id: "partners", name: "Hamkorlar", icon: Building },
  { id: "contacts", name: "Murojatlar", icon: Mail },
  { id: "service_inputs", name: "Xizmatlar inputi", icon: FilePenLine },
  { id: "leads", name: "Leads", icon: PhoneIncoming },
  { id: "user", name: "Adminlar", icon: ShieldUser },
  { id: "profile", name: "Admin profil", icon: Shield },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed z-50  w-64 h-full bg-gray-900 text-gray-200 flex flex-col">
      <div className="flex items-center space-x-4 px-6 py-4 text-2xl font-bold border-b border-gray-700">
        <div className="relative">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <GraduationCap className="h-7 w-7 text-blue-50" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-white">
          UnoGroup
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-[6px] px-2 py-4">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <NavLink
                to={`/admin/${tab.id === "dashboard" ? "" : tab.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-700 text-gray-300"
                  }`
                }
                end={tab.id === "dashboard"}
              >
                <tab.icon size={18} />
                {tab.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
