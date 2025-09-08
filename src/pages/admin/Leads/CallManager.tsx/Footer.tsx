import React, { useEffect, useState } from "react";
import {
    BsPeople,
    BsCheckCircle,
    BsXCircle,
    BsClock,
    BsCardChecklist,
    BsCalendar,
} from "react-icons/bs";

const Footer: React.FC = () => {
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("admin_access_token"); 

                const res = await fetch(
                    `https://learnx-crm-production.up.railway.app/api/v1/leads/statistics`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`, 
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("API dan noto‘g‘ri javob keldi");
                }

                const data = await res.json();
                const obj = data[0] || {};

                const preparedStats = [
                    {
                        label: "New",
                        value: (obj.consulting?.new || 0) + (obj.documenting?.new || 0),
                        icon: BsPeople,
                        color: "bg-blue-100 text-blue-500",
                    },
                    {
                        label: "Callback",
                        value: obj.initial?.needs_call || 0,
                        icon: BsClock,
                        color: "bg-yellow-100 text-yellow-500",
                    },
                    {
                        label: "Rejected",
                        value: obj.initial?.rejected || 0,
                        icon: BsXCircle,
                        color: "bg-red-100 text-red-500",
                    },
                    {
                        label: "Selected",
                        value: obj.initial?.selected || 0,
                        icon: BsCheckCircle,
                        color: "bg-green-100 text-green-500",
                    },
                    {
                        label: "Assigned",
                        value: obj.documenting?.new || 0,
                        icon: BsCardChecklist,
                        color: "bg-purple-100 text-purple-500",
                    },
                    {
                        label: "Meetings",
                        value: obj.initial?.meetings || 0,
                        icon: BsCalendar,
                        color: "bg-pink-100 text-pink-500",
                    },
                ];

                setStats(preparedStats);
            } catch (error) {
                console.error("Statistikani olishda xato:", error);
            }
        };

        fetchStats();
    }, []);


    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="bg-white shadow-md rounded-lg p-8"
                    >
                        <div className="flex items-center justify-around">
                            <div className={`mb-1 p-2 rounded-full ${stat.color}`}>
                                <Icon className="text-xl" />
                            </div>
                            <div className="text-center">
                                <span className="text-xl font-bold">{stat.value}</span>
                                <span className="block text-gray-600">{stat.label}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Footer;
