import React from "react";
import { Outlet } from "react-router-dom";
import Headers from "./Headers";

const Leads: React.FC = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <Headers />

      {/* Nested page (Call Manager / Agent Form / Consulting Manager) */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Leads;
