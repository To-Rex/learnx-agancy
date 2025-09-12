import React, { useState } from "react";
import { BsPeople } from "react-icons/bs";
import { Instagram } from "lucide-react";
import Footer from "./Footer";
import CallManager from "./CallManager";


const CallManagerPage: React.FC = () => {
    const [active, setActive] = useState("incoming");


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
                {/* <div className="flex display-none items-center justify-between w-[35%]">
                    <div className="border border-gray-300 rounded-lg flex items-center gap-2 p-2 text-sm">
                        <Instagram className="text-gray-600" size={14} />
                        150 New from Instagram
                    </div>
                    <div className="border border-gray-300 rounded-lg flex items-center gap-3 p-2">
                        <BsPeople className="text-gray-600" size={14} />
                        4 Active Agents
                    </div>
                </div> */}
            </div>
            <CallManager/>
            <Footer />
        </>
    );
};

export default CallManagerPage;
