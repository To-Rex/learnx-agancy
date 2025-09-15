import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Upload, CheckCircle, FileIcon } from "lucide-react";

interface LeadFileUploadProps {
  leadId: string;
  serviceInputId: string;
  label: string;
  required: boolean;
  currentFile: string;
  onUploaded: (url: string) => void;
  onClose?: () => void;        // ✅ optional
  refreshLeads?: () => void;   // ✅ optional qilib qo‘ydim
}

export default function LeadFileUpload({
  leadId,
  serviceInputId,
  label,
  required,
  currentFile,
  onUploaded,
  onClose,
}: LeadFileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
        `https://learnx-crm-production.up.railway.app/api/v1/leads/upload-doc/${leadId}/${serviceInputId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Yuklashda xatolik!");
      const data = await res.json();
      const fileUrl = data?.file_url || "";

      toast.success(`${label} hujjati yuklandi!`);
      onUploaded(fileUrl);

      // ✅ inputni tozalash
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      // ✅ FileUpload yopiladi (agar berilgan bo‘lsa)
      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error("Faylni yuklashda muammo!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border rounded-2xl shadow p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </h4>
        {currentFile && (
          <a
            href={currentFile}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-green-600 text-sm"
          >
            <CheckCircle size={16} /> Yuklangan faylni ochish
          </a>
        )}
      </div>

      <label
        htmlFor={`file-${serviceInputId}`}
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
      >
        <Upload size={28} className="text-blue-500 mb-2" />
        <span className="text-gray-600 text-sm">
          {file ? file.name : "Faylni shu yerga tashlang yoki tanlang"}
        </span>
        <input
          id={`file-${serviceInputId}`}
          ref={inputRef}
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </label>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full py-2 rounded-xl bg-blue-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
      >
        {uploading ? "⏳ Yuklanmoqda..." : (<><FileIcon size={18} /> Yuklash</>)}
      </button>
    </div>
  );
}
 