import { useState } from "react";
import toast from "react-hot-toast";

interface LeadInput {
  service_input_id: string;
  name: { en: string; ru: string; uz: string };
  description: { en: string; ru: string; uz: string };
  uploaded_doc: string | null;
}

export default function LeadFileUpload({
  leadId,
  input,
}: {
  leadId: string;
  input: LeadInput;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Iltimos, fayl tanlang!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `https://learnx-crm-production.up.railway.app/api/v1/leads/upload-doc/${leadId}/${input.service_input_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Yuklashda xatolik!");

      toast.success(`${input.name.uz} hujjati yuklandi!`);
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Faylni yuklashda muammo!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h4 className="font-medium mb-2">{input.name.uz}</h4>
      <p className="text-sm text-gray-500 mb-2">{input.description.uz}</p>

      {input.uploaded_doc && (
        <p className="text-green-600 text-sm mb-2">
          ✅ Yuklangan: {input.uploaded_doc}
        </p>
      )}

      <div className="flex gap-2 items-center">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border rounded p-1"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {uploading ? "⏳ Yuklanmoqda..." : "⬆️ Yuklash"}
        </button>
      </div>
    </div>
  );
}
 