import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle, CircleDashed } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useForm } from "react-hook-form";
import FileUpload from "../components/FileUpload";

type UploadedDoc = {
  id: string;
  file_url: string;
  uploaded_at: string;
  application_id: string;
  service_input_id: string;
};

type ChecklistItem = {
  service_input_id: string;
  name: { uz?: string; en?: string; ru?: string;[k: string]: string | undefined };
  description?: { uz?: string; en?: string; ru?: string;[k: string]: string | undefined };
  uploaded_doc?: UploadedDoc | null;
  required?: boolean; // agar backendda bo'lsa
};

type FullApplication = {
  id: string;
  service_id: string;
  status: string;
  checklist: ChecklistItem[];
};

export default function UserFilesPage() {
  const { id } = useParams(); // application_id
  const { t } = useLanguage();
  const { handleSubmit } = useForm();
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fullApp, setFullApp] = useState<FullApplication | null>(null);

  useEffect(() => {
    if (!id) {
      toast.error("Application ID topilmadi");
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/applications/get-full/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("api_access_token")}`,
          },
        });
        if (!res.ok)
          throw new Error(`GET FULL failed: ${res.status}`);
        const data: FullApplication = await res.json();
        setFullApp(data);
      } catch (error) {
        console.error(error);
        toast.error("Ma'lumotlarni yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const checklist = useMemo(() => fullApp?.checklist ?? [], [fullApp]);

  const onSubmitAll = async () => {
    if (!id) {
      toast.error("Application ID yo‘q");
      return;
    }
    try {
      setSubmitting(true);
      toast.success("Yuklangan hujjatlar tekshirildi (demo)");
    } catch (e) {
      console.error(e);
      toast.error("Yakuniy yuborishda xatolik");
    } finally {
      setSubmitting(false);
    }
  };

  const sendDocuments = async () => {
    if (!fullApp || !id) {
      toast.error("Application ID yoki ma'lumotlar mavjud emas");
      return;
    }

    const notUploaded = fullApp.checklist.filter(
      (item) => item.required && !item.uploaded_doc?.file_url
    );

    if (notUploaded.length > 0) {
      toast.error("Hamma hujjatlarni yuklash shart ❗");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/applications/submit/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("api_access_token")}`,
          },
          body: JSON.stringify({ checklist: fullApp.checklist }),
        }
      );

      if (!response.ok) {
        throw new Error(`Yuborishda xatolik: ${response.status}`);
      }
      toast.success("Hujjatlar muvaffaqiyatli yuborildi");
      navigate('/profile')
    } catch (error) {
      console.error(error);
      toast.error("Hujjatlarni yuborishda xatolik");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4">
          </div>
          <span>{t("apply.loading") ?? "Yuklanmoqda..."}</span>
        </div>
      </div>
    );
  }

  if (!fullApp) {
    return <div className="p-6 text-red-600">Ma'lumot topilmadi</div>;
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-900 mb-1">{t("apply.docs.title") ?? "Hujjatlar haqida"}</h3>
        <p className="text-blue-700 text-sm">
          Barcha hujjatlar PDF, JPG, PNG, DOC yoki DOCX formatida bo'lishi kerak. Maksimal fayl hajmi: 10MB
        </p>
      </div>

      <div className="space-y-6 ">
        {checklist.map((item) => {
          const label = item.name?.uz || item.name?.en || item.name?.ru || "Nomsiz hujjat";
          const currentFile = item.uploaded_doc?.file_url || "";
          return (
            <div key={item.service_input_id} className="border border-gray-200 rounded-lg p-4">
              <FileUpload
                label={`${label}${item.required ? " *" : ""}`}
                applicationId={id ?? ""}
                serviceInputId={item.service_input_id}
                currentFile={currentFile}
                acceptedTypes={[".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]}
                maxSize={10}
                required={!!item.required}
                onFileUploaded={(fileUrl) => {
                  setFullApp((prev) =>
                    !prev
                      ? prev
                      : {
                        ...prev,
                        checklist: prev.checklist.map((c) =>
                          c.service_input_id === item.service_input_id
                            ? {
                              ...c,
                              uploaded_doc: {
                                id: "local-temp",
                                file_url: fileUrl,
                                uploaded_at: new Date().toISOString(),
                                application_id: fullApp.id,
                                service_input_id: item.service_input_id,
                                client_id: "",
                              } as UploadedDoc,
                            }
                            : c
                        ),
                      }
                  );
                  toast.success(`${label} yuklandi`);
                }}
              />
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmitAll)} className="flex justify-end mt-6">
        <button type="submit" onClick={sendDocuments}
          disabled={submitting}
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 font-semibold">
          {submitting ? (
            <>
              <CircleDashed className="h-5 w-5 animate-spin" />
              <span>{t("apply.uploading") ?? "Yuklanmoqda..."}</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>{t("apply.submit") ?? "Yakunlash"}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
