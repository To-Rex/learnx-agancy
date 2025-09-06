import { Edit, Trash2 } from "lucide-react";
import { VscDebugDisconnect } from "react-icons/vsc";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ServiceInputEditorProps {
    service: any;
    onClose: () => void;
}

const ServiceInputEditor: React.FC<ServiceInputEditorProps> = ({ service, onClose }) => {
    const [inputs, setInputs] = useState<{ id: string; title: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [availableInputs, setAvailableInputs] = useState<any[]>([]);
    const [selectedInputs, setSelectedInputs] = useState<string[]>([]);
    const [inputToDelete, setInputToDelete] = useState<string | null>(null);

    const service_input = localStorage.getItem("service_input");

    const loadInputs = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://learnx-crm-production.up.railway.app/api/v1/service-inputs/get-list-by-service/${service_input}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("admin_access_token")}` } }
            );
            const data = await res.json();
            const list = Array.isArray(data) ? data : data.serviceInput || [];
            setInputs(list.map((i: any) => ({ id: i.id, title: i.name?.uz || "No title" })));
        } catch (err: any) {
            toast.error(err.message || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    // --- Toggle input ---
    const toggleInput = (id: string) => {
        const isSelected = selectedInputs.includes(id);

        if (isSelected) {
            setSelectedInputs(prev => prev.filter(i => i !== id));
            setInputs(prev => prev.filter(i => i.id !== id));
        } else {
            const input = availableInputs.find(i => i.id === id);
            if (input) {
                setSelectedInputs(prev => [...prev, id]);
                setInputs(prev => [...prev, { id: input.id, title: input.name?.uz || "No title" }]);
            }
        }

        // Serverga so‘rovni async tarzda yuboramiz
        (async () => {
            try {
                await fetch(isSelected
                    ? "https://learnx-crm-production.up.railway.app/api/v1/service-inputs/disconnect"
                    : "https://learnx-crm-production.up.railway.app/api/v1/service-inputs/connect",
                    {
                        method: isSelected ? "DELETE" : "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
                        },
                        body: JSON.stringify({ service_id: service_input, input_id: id }),
                    }
                );
            } catch (err: any) {
                toast.error(err.message || "Xatolik yuz berdi");
                // Xatolik bo‘lsa state ni tiklash mumkin
                loadInputs();
            }
        })();
    };



    // --- Open add modal ---
    const openAddModal = async () => {
        setShowAddModal(true);
        if (availableInputs.length === 0) {  // faqat birinchi ochishda fetch qilamiz
            try {
                const resAll = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/service-inputs/get-list`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("admin_access_token")}` },
                });
                const dataAll = await resAll.json();
                setAvailableInputs(Array.isArray(dataAll) ? dataAll : dataAll.serviceInput || []);
            } catch (err: any) {
                toast.error(err.message || "Xatolik yuz berdi");
            }
        }
        setSelectedInputs(inputs.map(i => i.id)); // serverdan emas, state dan
    };


    // --- Delete input ---
    const deleteInput = async (id: string) => {
        try {
            await fetch("https://learnx-crm-production.up.railway.app/api/v1/service-inputs/disconnect", {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("admin_access_token")}` },
                body: JSON.stringify({ service_id: service_input, input_id: id }),
            });
            setInputs(prev => prev.filter(i => i.id !== id));
            setInputToDelete(null);
            toast.success("Input o‘chirildi");
        } catch (err: any) {
            toast.error(err.message || "Xatolik yuz berdi");
        }
    };

    useEffect(() => {
        loadInputs();
    }, [service]);

    if (loading) return <div className="p-4 text-gray-600">Yuklanmoqda...</div>;

    return (
        <div className="text-gray-600 ">
            {/* Inputs list */}
            <div className="space-y-2">
                {inputs.length === 0 ? (
                    <p className="text-gray-600">Inputlar mavjud emas</p>
                ) : (
                    inputs.map(input => (
                        <div key={input.id} className="flex justify-between items-center p-2 border border-gray-400 rounded-lg hover:bg-white/5 transition">
                            <h1>{input.title}</h1>
                            <div className="flex items-center space-x-2">
                                <button className="text-blue-400"><Edit className="h-5 w-5" /></button>
                                <button onClick={() => setInputToDelete(input.id)} className="text-red-400">
                                    <VscDebugDisconnect className="h-6 w-7" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add button */}
            <div className="flex justify-center mt-4">
                <button onClick={openAddModal} className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600">Qo'shish</button>
            </div>

            {/* Delete modal */}
            {inputToDelete && (
                <div className='fixed inset-0 backdrop-blur-sm flex justify-center items-center rounded-md '>
                    <div className='bg-gray-50 shadow-2xl p-6 rounded-lg  ml-24 max-w-[570px]'>
                        <h1 className='text-2xl text-center text-gray-600 font-600 pb-4'>Haqiqatdan ham o'chirmoqchimisiz</h1>
                        <div className='flex justify-center items-center gap-4 pt-4 ml-36'>
                            <button onClick={() => setInputToDelete(null)} className="px-4 py-2 bg-gray-600 text-white rounded">Bekor qilish</button>
                            <button onClick={() => deleteInput(inputToDelete)} className="px-4 py-2 bg-red-600 text-white rounded">O'chirish</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Add modal */}
            {showAddModal && (
                <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-50 shadow-2xl p-6 rounded-lg max-h-[80vh] overflow-y-auto w-full max-w-md">
                        <h2 className="text-gray-800 mb-4">Inputlarni tanlang</h2>
                        <div className="space-y-2">
                            {availableInputs.map(input => (
                                <label key={input.id} className="flex items-center space-x-2 text-gray-600 border p-2 rounded">
                                    <input
                                        type="checkbox"
                                        checked={selectedInputs.includes(input.id)}
                                        onChange={() => toggleInput(input.id)}
                                        className="accent-green-500 text-white"
                                    />
                                    <span>{input.name?.uz || "No title"}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-red-500 text-white rounded">Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceInputEditor;
