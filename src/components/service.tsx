import { Edit, Trash2, X, Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ServiceInputEditorProps {
    service: any;
    onClose: () => void;
    onSave: (updatedService: any) => void;
}

const ServiceInputEditor: React.FC<ServiceInputEditorProps> = ({ service, onClose, onSave }) => {
    const [loading, setLoading] = useState(true);
    const [inputs, setInputs] = useState<{ id: string; title: string }[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [newInput, setNewInput] = useState<string>(""); // <-- yangi input nomi uchun state
    const service_input = localStorage.getItem("service_input");

    const loadServiceInputs = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://learnx-crm-production.up.railway.app/api/v1/service-inputs/get-list-by-service/${service_input}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Xizmat inputlarini olishda xatolik");

            const serviceInputs = Array.isArray(data) ? data : data.serviceInput || [];
            setInputs(
                serviceInputs.map((item: any) => ({
                    id: item.id,
                    title: item.name?.uz || item.title?.uz || "No title",
                }))
            );
        } catch (err: any) {
            toast.error(err.message || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id: string) => {
        if (!editValue.trim()) {
            toast.error("Nom bo'sh bo'lishi mumkin emas");
            return;
        }

        try {
            const res = await fetch(
                `https://learnx-crm-production.up.railway.app/api/v1/service-inputs/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
                    },
                    body: JSON.stringify({
                        title: { uz: editValue },
                    }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Tahrirlashda xatolik");

            toast.success("Input tahrirlandi");
            setEditingId(null);
            setInputs((prev) =>
                prev.map((item) => (item.id === id ? { ...item, title: editValue } : item))
            );
        } catch (err: any) {
            toast.error(err.message || "Xatolik yuz berdi");
        }
    };
    const service_id = localStorage.getItem('service_input')
    const handleDelete = async (id: string) => {
        if (!toast("Xizmat inputi o'chirildi?")) return;
        try {
            const res = await fetch(
                `https://learnx-crm-production.up.railway.app/api/v1/service-inputs/delete/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
                    },
                }
            );

            if (!res.ok) throw new Error("O'chirishda xatolik");
            toast.success("Input o'chirildi");
            setInputs((prev) => prev.filter((item) => item.id !== id));
        } catch (err: any) {
            toast.error(err.message || "Xatolik yuz berdi");
        }
    };

    // Yangi input qo'shish
    const handleAdd = async () => {
        if (!newInput.trim()) {
            toast.error("Nom bo'sh bo'lishi mumkin emas");
            return;
        }

        try {
            const res = await fetch(
                `https://learnx-crm-production.up.railway.app/api/v1/service-inputs/create/${service_input}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
                    },
                    body: JSON.stringify({
                        service: service_input,
                        name: { uz: newInput },
                    }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Qo'shishda xatolik");

            toast.success("Yangi input qo'shildi");
            setInputs((prev) => [...prev, { id: data.id, title: newInput }]);
            setNewInput(""); // inputni tozalash
        } catch (err: any) {
            toast.error(err.message || "Xatolik yuz berdi");
        }
    };

    useEffect(() => {
        loadServiceInputs();
    }, [service]);

    if (loading) return <div className="p-4 text-white">Yuklanmoqda...</div>;

    return (
        <div className="text-white">
            <div className="space-y-2">
                {inputs.length === 0 ? (
                    <p className="text-white/70">Inputlar mavjud emas</p>
                ) : (
                    inputs.map((input) => (
                        <div
                            key={input.id}
                            className="text-white p-4 border border-white/20 rounded-lg flex justify-between items-center hover:bg-white/5 transition-all duration-300"
                        >
                            {editingId === input.id ? (
                                <input
                                    // value={editValue}
                                    // onChange={(e) => setEditValue(e.target.value)}
                                    className="bg-transparent border-b border-white/40 flex-1 mr-4 outline-none text-white"
                                    autoFocus
                                />
                            ) : (
                                <h1>{input.title}</h1>
                            )}
                            <div className="flex justify-around items-center">
                                <button
                                    // onClick={() => {
                                    //     setEditingId(input.id);
                                    //     setEditValue(input.title);
                                    // }}
                                    className="text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300"
                                >
                                    <Edit className="h-5 w-5" />
                                </button>

                                <button
                                    onClick={() => handleDelete(input.id)}
                                    className="text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300 ml-5"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Yangi input qo'shish formasi */}
            <div className="flex items-center justify-center space-x-2 pt-4">
                <button
                    // onClick={handleAdd}
                    className="px-4 py-2 w-1/3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                    Qo'shish
                </button>
            </div>
        </div>
    );
};

export default ServiceInputEditor;
