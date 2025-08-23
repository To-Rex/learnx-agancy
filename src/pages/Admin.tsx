import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Users,
  FileText,
  MessageSquare,
  Settings,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  X,
  Home,
  Clock,
  CheckCircle,
  Crown,
  Shield,
  Activity,
  Star,
  Image,
  FilePenLine,
  Phone,
  MapPin,
  MoreHorizontal,
  ArrowDown,
  ArrowUp,
  ChevronDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import { Building, Download, Eye, Filter, Mail, Search, Sparkles } from 'lucide-react'
import ServiceInputEditor from '../components/service'
import ClientDetailsPage from './ClientsPage'


// Define Services interface for type safety
type Service = {
  id: string;
  title: { en: string };
  description: { en: string };
  icon: { name: string; color: string };
  price: string;
  features: { uz: string, en: string, ru: string }[];
};
type ServiceInput = {
  id: string;
  title: { en: string };
  description: { en: string };
};
interface Partner {
  id: string;
  image: string;
  name: {
    en: string;
    uz: string;
    ru: string;
  };
}

interface PartnerForm {
  name: {
    en: string;
    uz: string;
    ru: string;
  };
  image: string;
}
interface Client {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  created_at: string;
}

const Admin: React.FC = () => {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalUsers: 0,
    totalServices: 0,
    totalStories: 0,
    totalPartners: 0,
    totalContacts: 0,
    monthlyGrowth: 0,
    weeklyGrowth: 0,
  });

  const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    Users,
    FileText,
    MessageSquare,
    Settings,
    BarChart3,
    Plus,
    Edit,
    Trash2,
    Eye,
    Search,
    Filter,
    Download,
    X,
    Home,
    Clock,
    CheckCircle,
    Image,
    Sparkles,
    Crown,
    Shield,
    Activity,
  };

  // Data states
  const [applications, setApplications] = useState([])
  const [users, setUsers] = useState([])
  const [services, setServices] = useState([])
  const [servicesInput, setServicesInput] = useState([])
  const [stories, setStories] = useState([])
  const [partners, setPartners] = useState([])
  const [contacts, setContacts] = useState([])
  const [clients, setClients] = useState<any[]>([]); // default bo‘sh array
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false)




  // Modal states
  const [editingItem, setEditingItem] = useState(null)
  const [editingService, setEditingService] = useState(null)
  const [editingServiceInput, setEditingServiceInput] = useState(null)
  const [file, setFile] = useState<File | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState<boolean>(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showServiceInputModal, setShowServiceInputModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteClientsModalOpen, setClientsDeleteModalOpen] = useState(false);
  const [deleteClientsInputModalOpen, setClientsInputDeleteModalOpen] = useState(false);
  const [deleteInputModalOpen, setInputDeleteModalOpen] = useState(false);
  const [storyDeleteModal, setStoryDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [clientsToDelete, setClientsToDelete] = useState<string | null>(null);
  const [serviceInputToDelete, setServiceInputToDelete] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [active, setActive] = useState("connection");
  const limit = 10
  const [sortField, setSortField] = useState("full_name"); // default bo‘yicha ism bo‘yicha sortlash
  const [sortDesc, setSortDesc] = useState(true); // default bo‘yicha DESC
  const [searchField, setSearchField] = useState("email"); // qidiruv fieldi (agar kerak bo‘lsa)
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);




  // Contact get 
  const fetchContacts = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://learnx-crm-production.up.railway.app/api/v1/contact-msgs/get-list')
      if (!res.ok) throw new Error('API xatolik')
      const data = await res.json()
      const formatted = data.map((item: any) => ({
        ...item,
        message: item.text,
      }))
      setContacts(formatted)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const handleDeleteContactClick = (id: string) => {
    setContactToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmContactDelete = async () => {
    if (!contactToDelete) return;

    try {
      const token = localStorage.getItem("access_token") || "";
      const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/contact-msgs/delete/${contactToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        await fetchContacts(); // O'chirgandan keyin yangilash
        setDeleteModalOpen(false);
        setContactToDelete(null);
      } else {
        const errorData = await res.json();
        toast(`Xatolik yuz berdi: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      toast("Contactni o'chirishda xatolik yuz berdi");
    }
  };
  const [storyDelete, setStoryDelete] = useState<string | null>(null);
  const [partnerDeleteModal, setPartnerDeleteModal] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);
  const [partnerForm, setPartnerForm] = useState({
    name: {
      en: "",
      uz: "",
      ru: "",
    },
    image: '',
    image_file: null
  });

  // const loadData = async () => {
  //   try {
  //     // Load applications, users, stories, partners, contacts from Supabase
  //     const { data: appData, error: appError } = await supabase.from('applications').select('*');
  //     if (appError) throw appError;
  //     setApplications(appData);

  //     const { data: userData, error: userError } = await supabase.from('users').select('*');
  //     if (userError) throw userError;
  //     setUsers(userData);

  //     const { data: storyData, error: storyError } = await supabase.from('stories').select('*');
  //     if (storyError) throw storyError;
  //     setStories(storyData);

  //     const { data: partnerData, error: partnerError } = await supabase.from('partners').select('*');
  //     if (partnerError) throw partnerError;
  //     setPartners(partnerData);

  //     const { data: contactData, error: contactError } = await supabase.from('contact_submissions').select('*');
  //     if (contactError) throw contactError;
  //     setContacts(contactData);

  //     // Update stats
  //     setStats({
  //       totalApplications: appData.length,
  //       pendingApplications: appData.filter((app: any) => app.status === 'pending').length,
  //       approvedApplications: appData.filter((app: any) => app.status === 'approved').length,
  //       rejectedApplications: appData.filter((app: any) => app.status === 'rejected').length,
  //       totalUsers: userData.length,
  //       totalServices: services.length,
  //       totalStories: storyData.length,
  //       totalPartners: partnerData.length,
  //       totalContacts: contactData.length,
  //       monthlyGrowth: 0, // Implement logic as needed
  //       weeklyGrowth: 0, // Implement logic as needed
  //     });
  //   } catch (err) {
  //     console.error('Maʼlumotlarni yuklashda xato:', err);
  //   }
  // };


  // service 
  const [serviceForm, setServiceForm] = useState({
    title: { uz: "", en: "", ru: "" },
    description: { uz: "", en: "", ru: "" },
    icon: { name: "Book", color: "orange" },
    price: "",
    features: [],
  });

  // features uchun alohida tillar state
  const [featuresUz, setFeaturesUz] = useState("");
  const [featuresEn, setFeaturesEn] = useState("");
  const [featuresRu, setFeaturesRu] = useState("");

  // --- ADD SERVICE ---
  const handleAddService = () => {
    setEditingItem(null);
    setServiceForm({
      title: { uz: "", en: "", ru: "" },
      description: { uz: "", en: "", ru: "" },
      icon: { name: "Book", color: "orange" },
      price: "",
      features: [],
    });
    setFeaturesUz("");
    setFeaturesEn("");
    setFeaturesRu("");
    setShowServiceModal(true);
  };

  // --- EDIT SERVICE ---
  const handleEditService = (service: any) => {
    setServiceForm({
      title: service.title || { uz: "", en: "", ru: "" },
      description: service.description || { uz: "", en: "", ru: "" },
      icon: service.icon || { name: "Book", color: "orange" },
      price: service.price || "",
      features: service.features || [],
    });

    // Inputlarni to‘ldirish
    setFeaturesUz((service.features || []).map(f => f.uz).join(", "));
    setFeaturesEn((service.features || []).map(f => f.en).join(", "));
    setFeaturesRu((service.features || []).map(f => f.ru).join(", "));

    setEditingItem(service);
    setShowServiceModal(true);
  };

  // --- SAVE SERVICE ---
  const handleSaveService = async () => {
    // Inputlardan massivga yig‘ish
    const uzArr = featuresUz.split(",").map(f => f.trim());
    const enArr = featuresEn.split(",").map(f => f.trim());
    const ruArr = featuresRu.split(",").map(f => f.trim());

    const features = uzArr.map((_, i) => ({
      uz: uzArr[i] || "",
      en: enArr[i] || "",
      ru: ruArr[i] || ""
    }));

    const payload = {
      title: serviceForm.title,
      description: serviceForm.description,
      icon: serviceForm.icon,
      price: serviceForm.price,
      features
    };

    try {
      let res;
      if (editingItem && editingItem.id) {
        // update
        res = await fetch(
          `https://learnx-crm-production.up.railway.app/api/v1/services/update/${editingItem.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('admin_access_token') || ""}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // create
        res = await fetch(
          "https://learnx-crm-production.up.railway.app/api/v1/services/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('admin_access_token') || ""}`,
            },
            body: JSON.stringify(payload),
          }
        );
      }

      if (res.ok) {
        setShowServiceModal(false);
        loadServices();
      } else {
        const errorData = await res.json();
        alert("Xizmatni saqlashda xatolik: " + (errorData.message || res.statusText));
      }
    } catch (err) {
      console.error(err);
      alert("Kutilmagan xatolik yuz berdi");
    }
  };

  const handleDeleteServiceClick = (id: string) => {
    setServiceToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmServiceDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const token = localStorage.getItem('admin_access_token') || "";
      const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/services/delete/${serviceToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        loadServices(); // Ma'lumotlarni yangilash
        setDeleteModalOpen(false);
        setServiceToDelete(null);
      } else {
        const errorData = await res.json();
        alert(`Xatolik yuz berdi: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Xizmatni o'chirishda xatolik:", error);
      alert("Xizmatni o'chirishda xatolik yuz berdi");
    }
  };
  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://learnx-crm-production.up.railway.app/api/v1/services/get-list",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const firstId = data[0].id;
        localStorage.setItem('service_input', firstId);
        console.log(firstId);
      }
      if (!res.ok) throw new Error(data.message || "Xizmatlarni olishda xatolik")
      const servicesArray = Array.isArray(data) ? data : data.services || [];


      const normalizedData = servicesArray.map((item: any) => ({
        id: item.id || "",
        title: item.title || { uz: "", en: "", ru: "" },
        description: item.description || { uz: "", en: "", ru: "" },
        price: item.price || "",
        icon: {
          name: item.icon?.name || "FileText",
          color: item.icon?.color ? item.icon.color.toLowerCase() : "blue",
        },
        features: Array.isArray(item.features)
          ? item.features
          : [],
      }));


      setServices(normalizedData);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);



  // serviceInputs 
  const [serviceInputForm, setServiceInputForm] = useState({
    name: { uz: "", en: "", ru: "" },
    description: { uz: "", en: "", ru: "" },
  });


  // --- ADD SERVICEINPUT ---
  const handleAddServiceInput = () => {
    setEditingItem(null);
    setServiceInputForm({
      name: { uz: "", en: "", ru: "" },
      description: { uz: "", en: "", ru: "" }
    });
    setShowServiceInputModal(true);
  };

  // --- EDIT SERVICE ---
  const handleEditServiceInput = (item: any) => {
    setEditingItem(item);

    setServiceInputForm({
      name: {
        uz: item.name?.uz || "",
        en: item.name?.en || "",
        ru: item.name?.ru || "",
      },
      description: {
        uz: item.description?.uz || "",
        en: item.description?.en || "",
        ru: item.description?.ru || "",
      },
    });

    setShowServiceInputModal(true);
  };


  // --- SAVE SERVICE ---
  const handleSaveServiceInput = async (id?: string) => {
    // name qiymatini stringga olish
    const nameValue =
      serviceInputForm.name && typeof serviceInputForm.name === "string"
        ? serviceInputForm.name
        : serviceInputForm.name?.uz || "";

    if (!nameValue.trim()) {
      alert("Nom bo'sh bo'lishi mumkin emas");
      return;
    }

    const payload = {
      name: serviceInputForm.name, // object yoki string, backend kutyapti
      description: serviceInputForm.description || "",
    };

    try {
      let res;

      // PUT (update) yoki POST (create) tanlash
      if (editingItem?.id) {
        // id object bo‘lishi mumkin, shuning uchun .id yoki stringga o‘tkazamiz
        const inputId = typeof editingItem.id === "string" ? editingItem.id : editingItem.id?.toString();
        res = await fetch(
          `https://learnx-crm-production.up.railway.app/api/v1/service-inputs/update/${inputId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // CREATE
        res = await fetch(
          "https://learnx-crm-production.up.railway.app/api/v1/service-inputs/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
            },
            body: JSON.stringify(payload),
          }
        );
      }

      // Javobni xavfsiz tekshirish
      if (res.ok) {
        setShowServiceInputModal(false);
        toast('Xizmat saqlandi')
        loadServicesInput();
      } else {
        const text = await res.text();
        let errorData = null;
        try {
          errorData = text ? JSON.parse(text) : null;
        } catch {
          errorData = null;
        }
        toast("Xizmatni saqlashda xatolik: " + (errorData?.message || res.statusText));
      }
    } catch (err: any) {
      console.error(err);
      toast("Kutilmagan xatolik yuz berdi: " + err.message);
    }
  };

  const handleDeleteServiceInputClick = (id: string) => {
    setServiceInputToDelete(id);
    setInputDeleteModalOpen(true);
  };

  const handleConfirmServiceInputDelete = async () => {
    if (!serviceInputToDelete) return;
    console.log(serviceInputToDelete);


    try {
      const token = localStorage.getItem('admin_access_token') || "";
      const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/service-inputs/delete/${serviceInputToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        loadServicesInput(); // Ma'lumotlarni yangilash
        toast(`Ma'lumot o'chirildi`)
        setInputDeleteModalOpen(false);
        setServiceInputToDelete(null);
      } else {
        const errorData = await res.json();
        toast(`Xatolik yuz berdi: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Xizmatni o'chirishda xatolik:", error);
    }
  };
  const loadServicesInput = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://learnx-crm-production.up.railway.app/api/v1/service-inputs/get-list",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('admin_access_token') || ""}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Xizmatlarni olishda xatolik");

      const servicesInputArray = Array.isArray(data) ? data : data.serviceInput || [];

      const normalizedData = servicesInputArray.map((item: any) => ({
        id: item.id || "",
        name: item.name || { uz: "", en: "", ru: "" },
        description: item.description || { uz: "", en: "", ru: "" },
      }));

      setServicesInput(normalizedData);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServicesInput();
  }, []);




  //  load story
  const [storyForm, setStoryForm] = useState({
    name: '',
    country: '',
    text: '',
    rating: 5,
    image: '',
  });

  const loadStory = async () => {
    try {
      const res = await fetch("https://learnx-crm-production.up.railway.app/api/v1/client-stories/get-list") // API manzilini yozing
      const data = await res.json()

      if (data && data.length > 0) {
        const mappedStories = data.map((item: any) => ({
          id: item.id,
          name: item.name || "",
          country: item.country || "",
          text: item.text || "",
          rating: item.rating || 0,
          image: item.image_url || "",
          created_at: item.created_at
        }))
        setStories(mappedStories)
      } else {
        setStories([])
      }
    } catch (error) {
      console.error("Stories API load error:", error)
      setStories([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadStory();
  }, []);

  const handleDeleteStoryClick = (id: string) => {
    setStoryDelete(id);
    setStoryDeleteModal(true);
  };

  const handleConfirmStoryDelete = async () => {
    if (!storyDelete) return;

    try {
      const token = localStorage.getItem("your_access_token_key_here") || "";
      const res = await fetch(
        `https://learnx-crm-production.up.railway.app/api/v1/client-stories/delete/${storyDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        loadStory();
        setStoryDeleteModal(false);
        setStoryDelete(null);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || res.statusText);
      }
    } catch (error) {
      console.error(error);
      toast.error("Xizmatni o'chirishda xatolik yuz berdi");
    }
  };

  const handleAddStory = () => {
    setEditingItem(null);
    setStoryForm({
      name: '',
      country: '',
      text: '',
      rating: 5,
      image: '',
    });
    setShowStoryModal(true);
  };

  const handleEditStory = (story: any) => {
    setStoryForm({
      name: typeof story.name === "string" ? story.name : story.name?.en || "",
      country: story.country || '',
      text: story.text || '',
      rating: story.rating ?? 0,
      image: story.image || '',
    });

    setEditingItem(story);
    setShowStoryModal(true);
  };
  useEffect(() => {
    fetchPartners()
  }, [])

  const handleSaveStory = async () => {
    try {
      const token = localStorage.getItem("your_access_token_key_here") || "";

      if (!token) {
        alert("Token topilmadi. Iltimos, tizimga qaytadan kiring.");
        return;
      }

      // FormData ishlatamiz (fayl bo'lsa ham ishlaydi, matn bo'lsa ham)
      const formData = new FormData();
      console.log(JSON.stringify(storyForm));
      console.log(storyForm);


      formData.append("json_data", JSON.stringify({ name: storyForm.name, country: storyForm.country, text: storyForm.text, rating: storyForm.rating, }));
      formData.append("name", storyForm.name);
      formData.append("country", storyForm.country);
      formData.append("rating", String(storyForm.rating));
      formData.append("text", JSON.stringify(storyForm.text));

      console.log('storyForm.image::::::', storyForm.image);

      if (storyForm.image) {
        formData.append("file", storyForm.image);
      }
      let url = "https://learnx-crm-production.up.railway.app/api/v1/client-stories/create";
      let method = "POST";

      if (editingItem && editingItem.id) {
        url = `https://learnx-crm-production.up.railway.app/api/v1/client-stories/update/${editingItem.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let responseData = null;
      try {
        responseData = await res.json(); // JSON parse qilishga urinamiz
      } catch (error) {
        console.log(error);

        responseData = null; // bo'sh javob bo'lsa
      }

      if (res.ok) {
        toast.success("Muvaffaqiyatli saqlandi");
        setShowStoryModal(false);
        loadStory();
      } else {
        console.error("Xatolik:", responseData?.message || res.statusText);
        alert("Xizmatni saqlashda xatolik: " + (responseData?.message || res.statusText));
      }
    } catch (error) {
      console.error("Kutilmagan xatolik:", error);
      alert("Xizmatni saqlashda kutilmagan xatolik yuz berdi");
    }
  };


  // load partners 
  const loadPartners = async () => {
    try {
      const res = await fetch("https://learnx-crm-production.up.railway.app/api/v1/partners/get-list", {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem("your_access_token_key_here") || ""}`, }
      })
      const data = await res.json()
      if (data && data.length > 0) {
        const mappedPartners = data.map((item: any) => ({
          id: item.id || "",
          image: item.image_url || "",
          name: {
            en: item.name?.en || "",
            uz: item.name?.uz || "",
            ru: item.name?.ru || "",
          },
        }))
        setPartners(mappedPartners)
      } else {
        setPartners([])
      }
    } catch (error) {
      console.error("Hamkorlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadPartners();
  }, []);

  const handleDeletePartnerClick = (id: string) => {
    setPartnerToDelete(id);
    setPartnerDeleteModal(true);
  }

  const handleConfirmPartnerDelete = async () => {
    if (!partnerToDelete) return;

    try {
      const token = localStorage.getItem("your_access_token_key_here") || "";
      const res = await fetch(
        `https://learnx-crm-production.up.railway.app/api/v1/partners/delete/${partnerToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        loadPartners();
        setPartnerDeleteModal(false);
        setPartnerToDelete(null);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || res.statusText);
      }
    } catch (error) {
      console.error('Hamkorni o\'chirishda xatolik:', error);
      toast.error('Hamkorni o\'chirishda xatolik yuz berdi');
    }
  }

  const handleAddPartners = () => {
    setEditingItem(null);
    setPartnerForm({
      name: {
        en: '',
        uz: '',
        ru: '',
      },
      image: '',
    });
    setShowPartnerModal(true);
  };

  const handleEditPartners = (partner: any) => {
    setPartnerForm({
      name: {
        en: partner.name?.en || '',
        uz: partner.name?.uz || '',
        ru: partner.name?.ru || '',
      },
      image: partner.image || '',
    });
    setEditingItem(partner);
    setShowPartnerModal(true);
  };

  const handleSavePartners = async () => {
    try {
      const token = localStorage.getItem("your_access_token_key_here") || "";

      if (!token) {
        alert("Token topilmadi. Iltimos, tizimga qaytadan kiring.");
        return;
      }
      const formData = new FormData();
      // formData.append("name", JSON.stringify(partnerForm.name));
      formData.append("name_ru", partnerForm.name.ru || '');
      formData.append("name_uz", partnerForm.name.uz || '');
      formData.append("name_en", partnerForm.name.en || '');
      formData.append("json_data", JSON.stringify({ ...partnerForm, "image_url": partnerForm.image }));

      console.log(`partnerForm.image::::::`, partnerForm.image_file);

      if (partnerForm.image_file) {
        console.log(`partnerForm.image_file=========`, partnerForm.image_file);

        formData.append("file", partnerForm.image_file);
      }
      let url = "https://learnx-crm-production.up.railway.app/api/v1/partners/create";
      let method = "POST";

      if (editingItem && editingItem.id) {
        url = `https://learnx-crm-production.up.railway.app/api/v1/partners/update/${editingItem.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let responseData = '';
      try {
        responseData = await res.json(); // JSON parse qilishga urinamiz
      } catch (error) {
        console.log(error);

        responseData = ''; // bo'sh javob bo'lsa
      }

      if (res.ok) {
        toast.success("Muvaffaqiyatli saqlandi");
        setShowPartnerModal(false);
        loadPartners();
      } else {
        console.error("Xatolik:", responseData?.message || res.statusText);
        alert("Xizmatni saqlashda xatolik: " + (responseData?.message || res.statusText));
      }
    } catch (error) {
      console.error("Kutilmagan xatolik:", error);
      alert("Xizmatni saqlashda kutilmagan xatolik yuz berdi");
    }
  };

  useEffect(() => {
    loadServices();
    loadStory()
  }, []);

  // const handleUpdateApplicationStatus = async (applicationId: string, newStatus: string) => {
  //   try {
  //     const { error } = await supabase
  //       .from('applications')
  //       .update({ status: newStatus })
  //       .eq('id', applicationId)

  //     if (error) throw error

  //     toast.success('Ariza holati yangilandi')
  //   } catch (error) {
  //     console.error('Status update error:', error)
  //     toast.error('Holatni yangilashda xatolik')
  //   }
  // }

  // const handleSavePartner = async () => {
  //   try {
  //     const partnerData = {
  //       name: partnerForm.name,
  //       logo: partnerForm.logo,
  //       name_translations: partnerForm.name,
  //     }

  //     if (editingItem) {
  //       const { error } = await supabase
  //         .from('partners')
  //         .update(partnerData)
  //         .eq('id', editingItem?.id)

  //       if (error) throw error
  //       toast.success('Hamkor yangilandi')
  //     } else {
  //       const { error } = await supabase
  //         .from('partners')
  //         .insert(partnerData)

  //       if (error) throw error
  //       toast.success('Yangi hamkor qo\'shildi')
  //     }

  //     setShowPartnerModal(false)
  //     setEditingItem(null)
  //     resetPartnerForm()
  //   } catch (error) {
  //     console.error('Partner save error:', error)
  //     toast.error('Hamkorni saqlashda xatolik')
  //   }
  // }

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')

  }

  const fetchPartners = async () => {
    const { data, error } = await supabase.from('partners').select('*');
    if (!error) setPartners(data);
  };


  // Sort uchun select
  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortField(value);
    fetchClients(searchQuery, searchField, value, sortDesc);
  };
  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSearchField(value);
    fetchClients(searchQuery, value, sortField, sortDesc);
  };

  // ASC/DESC toggle
  const toggleSortOrder = () => {
    const newOrder = !sortDesc;
    setSortDesc(newOrder);
    fetchClients(searchQuery, searchField, sortField, newOrder);
  };


  const fetchClients = async (
    searchValue = "",
    searchField = "email",
    sortField = "full_name",
    sortDesc = true,
    page = 1
  ) => {
    try {
      const token = localStorage.getItem("admin_access_token") || "";
      const offset = (page - 1) * limit;

      const params = new URLSearchParams({
        sort_field: sortField,
        sort_desc: String(sortDesc),
        limit: String(limit),
        offset: String(offset),
      });

      if (searchValue.trim()) {
        params.append("search_field", searchField);
        params.append("search_val", searchValue.trim());
      }

      const res = await fetch(
        `https://learnx-crm-production.up.railway.app/api/v1/clients/get-rich-list?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Ma'lumot yuklanmadi");

      const data = await res.json();
      const clientsData = Array.isArray(data.results) ? data.results : data;

      setClients(clientsData);
      setCurrentPage(page);
      setHasNextPage(clientsData.length === limit); 

    } catch (err) {
      console.error("Xatolik:", err);
      setClients([]);
      setCurrentPage(1);
      setHasNextPage(false);
    }
  };








  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  // useEffect — dastlabki yuklash
  useEffect(() => {
    fetchClients();
  }, []);

  // search input o‘zgarganda API chaqirish
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchClients(value, searchField, sortField, sortDesc);
    navigate(`?search_val=${encodeURIComponent(value)}&search_field=${searchField}`, { replace: true });
  };


  const handleDeleteClientsClick = (id: string) => {
    setClientsToDelete(id);
    setClientsDeleteModalOpen(true);
  };

  const handleConfirmClientsDelete = async () => {
    if (!clientsToDelete) return;

    try {
      const token = localStorage.getItem('admin_access_token') || "";
      const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/clients/delete/${clientsToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        toast("Mijoz o'chirildi ")
        fetchClients(); // Ma'lumotlarni yangilash
        setClientsDeleteModalOpen(false);
        setClientsToDelete(null);
      } else {
        const errorData = await res.json();
        toast(`Xatolik yuz berdi: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Xizmatni o'chirishda xatolik:", error);
      toast("Xizmatni o'chirishda xatolik yuz berdi");
    }
  };



  // vaqtni hisoblash helper
  function getLastContact(createdAt: string): string {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffMs = now.getTime() - createdDate.getTime();

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffDays > 0) return `${diffDays} kun oldin`;
    if (diffHours > 0) return `${diffHours} soat oldin`;
    if (diffMinutes > 0) return `${diffMinutes} minut oldin`;
    return `${diffSeconds} sekund oldin`;
  }



  const tabs = [
    { id: 'dashboard', name: 'Boshqaruv paneli', icon: BarChart3, color: 'from-blue-500 to-purple-600' },
    { id: 'clients', name: 'Mijozlar', icon: Users, color: "from-violet-700 to-violet-400 " },
    { id: 'applications', name: 'Arizalar', icon: FileText, color: 'from-green-500 to-teal-600' },
    { id: 'services', name: 'Xizmatlar', icon: Settings, color: 'from-orange-500 to-red-600' },
    { id: 'stories', name: 'Hikoyalar', icon: MessageSquare, color: 'from-purple-500 to-pink-600' },
    { id: 'partners', name: 'Hamkorlar', icon: Building, color: 'from-indigo-500 to-blue-600' },
    { id: 'contacts', name: 'Murojatlar', icon: Mail, color: 'from-teal-500 to-cyan-600' },
    { id: 'service_inputs', name: 'Xizmatlar inputi', icon: FilePenLine, color: 'from-teal-300 to-cyan-600' }
  ];


  const getStatusColor = (status: string) => {
    
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Kutilmoqda'
      case 'approved':
        return 'Tasdiqlangan'
      case 'rejected':
        return 'Rad etilgan'
      default:
        return 'Noma\'lum'
    }
  }

  
  // APPLICATION
  const [application, setApplication] = useState([]);
  const [statusModal, setStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const getStatusColorApp = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'approved':
        return 'bg-green-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-transparent text-white';
    }
  }

  const getStatusLabelApp = (status: string) => {
    switch(status) {
      case 'pending':
        return 'Kutilmoqda';
      case 'approved':
        return 'Tasdiqlangan';
      case 'rejected':
        return 'Rad etilgan';
      default:
        return 'Noma\'lum';
    }
  }

  const handleOpenStatusModal = (id: string, currentStatus: string) => {
    setSelectedAppId(id);
    setSelectedStatus(currentStatus || 'tanlang');
    setStatusModal(true);
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedAppId) return;
  
    try {
      const res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/applications/update-status`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("admin_access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedAppId,
            status: newStatus,
          }),
        }
      );
  
      if (!res.ok) {
        throw new Error("Statusni yangilashda xatolik");
      }
  
      toast.success("Status muvaffaqiyatli yangilandi!");
  
      // Jadvalni yangilash
      setApplication((prev) => prev.map((app) => app.id === selectedAppId ? { ...app, status: newStatus } : app));
  
      setSelectedStatus(newStatus);
      setStatusModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Statusni yangilashda xatolik yuz berdi");
    }
  };
  
  const fetchApplications = async () => {
    try{
      const res = await fetch("https://learnx-crm-production.up.railway.app/api/v1/applications/get-rich-list", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("admin_access_token")}`,
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) {
        throw new Error("Arizalarni olishda xatolik");
      }
      const data = await res.json();
      setApplication(data);
      console.log("Arizalar muvaffaqiyatli olindi:", data);      
    }catch(error) {
      console.error("Arizalarni olishda xatolik:", error);
      toast.error("Arizalarni olishda xatolik yuz berdi");
    }
  }

  useEffect(() => {
    fetchApplications();
  }, [])

  const handleSearchApp = async (query: string) => {
    
  }

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="relative">
  //           <div className="w-32 h-32 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-8"></div>
  //           <div className="absolute inset-0 flex items-center justify-center">
  //             <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
  //           </div>
  //         </div>
  //         <h3 className="text-2xl font-bold text-white mb-2">Ma'lumotlar yuklanmoqda...</h3>
  //         <p className="text-purple-200">Iltimos kuting</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Toaster position="top-right" />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/10 backdrop-blur-md border-b border-white/20   top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  LearnX Admin
                </h1>
                <p className="text-purple-200 font-medium">Professional boshqaruv paneli</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-white font-medium">Admin</span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <Home className="h-4 w-4" />
                <span>Saytga qaytish</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <nav className="space-y-3">
                {tabs.map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-left transition-all duration-300 group ${activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl scale-105`
                      : 'text-white/80 hover:bg-white/10 hover:text-white hover:scale-102'
                      }`}
                  >
                    <div className={`p-2 rounded-lg ${activeTab === tab.id
                      ? 'bg-white/20'
                      : 'bg-white/10 group-hover:bg-white/20'
                      } transition-all duration-300`}>
                      <tab.icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">{tab.name}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        title: 'Jami arizalar',
                        value: stats.totalApplications,
                        icon: FileText,
                        color: 'from-blue-500 to-cyan-600',
                        trend: `+${stats.weeklyGrowth} bu hafta`
                      },
                      {
                        title: 'Kutilayotgan',
                        value: stats.pendingApplications,
                        icon: Clock,
                        color: 'from-yellow-500 to-orange-600',
                        trend: 'Jarayonda'
                      },
                      {
                        title: 'Tasdiqlangan',
                        value: stats.approvedApplications,
                        icon: CheckCircle,
                        color: 'from-green-500 to-emerald-600',
                        trend: `+${stats.monthlyGrowth} bu oy`
                      },
                      {
                        title: 'Hamkorlar',
                        value: stats.totalPartners,
                        icon: Building,
                        color: 'from-purple-500 to-pink-600',
                        trend: 'Universitetlar'
                      }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-105"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-purple-200">{stat.trend}</div>
                          </div>
                        </div>
                        <h3 className="text-white/90 font-semibold">{stat.title}</h3>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white flex items-center">
                        <Activity className="h-6 w-6 mr-3 text-purple-400" />
                        So'nggi faoliyat
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm font-medium">Jonli</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {applications.slice(0, 5).map((app: any, index) => (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-white">{app.full_name}</p>
                            <p className="text-sm text-purple-200">{app.program_type} - {app.country_preference}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                              {getStatusText(app.status)}
                            </span>
                            <p className="text-xs text-purple-200 mt-1">
                              {new Date(app.created_at).toLocaleDateString('uz-UZ')}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CLIENT LIST */}
              {activeTab === "clients" && (
                <div className="bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Client List</h2>

                    <div className="flex items-center space-x-4">
                      {/* --- Sort va Filter UI --- */}
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={() => setOpen(!open)}
                          className="flex items-center gap-2 bg-violet-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700"
                        >
                          Filtr <ChevronDown className="w-4 h-4" />
                        </button>

                        {open && (
                          <div className="absolute right-0 mt-2 w-56 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl shadow-xl p-4 z-50 text-white space-y-3">
                            <div className="relative">
                              <label className="text-sm text-white mb-1 block">Sort Field</label>
                              <select
                                value={sortField}
                                onChange={handleSortFieldChange}
                                className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 appearance-none"
                              >
                                <option value="full_name">Ism</option>
                                <option value="email">Email</option>
                                <option value="phone">Telefon</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-white pointer-events-none" />
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-300">Sort Order</span>
                              <button
                                onClick={toggleSortOrder}
                                className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 flex items-center gap-2"
                              >
                                {sortDesc ? <>DESC <ArrowDown className="w-4 h-4" /></> : <>ASC <ArrowUp className="w-4 h-4" /></>}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Search Field */}
                      <div className="relative w-[120px] mr-2">
                        <select
                          value={searchField}
                          onChange={handleSearchFieldChange}
                          className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 appearance-none"
                        >
                          <option value="full_name">Ism</option>
                          <option value="email">Email</option>
                          <option value="phone">Telefon</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-white pointer-events-none" />
                      </div>

                      <div className="relative w-72">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Qidirish..."
                          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 overflow-y-auto max-h-[70vh]">
                    {clients.length > 0 ? (
                      clients.map((client: any, index: number) => (
                        <motion.div
                          key={client.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex justify-between items-center rounded-xl p-4 border border-white/20 hover:bg-white/10 transition-all duration-300"
                        >
                          {/* Chap qism: avatar va info */}
                          <div className="flex items-center space-x-4">
                            {client.avatar_url ? (
                              <img
                                src={client.avatar_url}
                                alt={client.full_name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                                {client.full_name?.charAt(0)?.toUpperCase()}
                                {client.full_name?.split(" ")[1]?.charAt(0)?.toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h3 className="text-white font-semibold">{client.full_name}</h3>
                              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                                <span className="flex items-center"><Mail className="w-4 h-4 mr-1" />{client.email || "—"}</span>
                                <span className="flex items-center"><Phone className="w-4 h-4 mr-1" />{client.phone || "—"}</span>
                              </div>
                            </div>
                          </div>

                          {/* O'ng qism: oxirgi kontakt va action tugmalar */}
                          <div className="flex items-center space-x-6">
                            <div className="text-right text-white text-sm">
                              <p>{getLastContact(client.created_at)}</p>
                              <p className="text-gray-400 text-xs">Ro'yxatdan o'tgan</p>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => { setSelectedClientId(client.id); setActiveTab("clientDetails"); }}
                                className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteClientsClick(client.id)}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400">Hech narsa topilmadi</p>
                    )}
                  </div>

                  {/* PAGINATION */}
                  <div className="flex justify-center items-center mt-4 space-x-4">
                    {/* Oldingi tugma */}
                    <button
                      onClick={() => currentPage > 1 && fetchClients(searchQuery, searchField, sortField, sortDesc, currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg ${currentPage === 1
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-violet-500 text-white hover:bg-purple-700"
                        }`}
                    >
                      Oldingi
                    </button>

                    <span className="text-white">{currentPage}</span>

                    {/* Keyingi tugma */}
                    <button
                      onClick={() => fetchClients(searchQuery, searchField, sortField, sortDesc, currentPage + 1)}
                      disabled={!hasNextPage}
                      className={`px-4 py-2 rounded-lg ${!hasNextPage
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-violet-500 text-white hover:bg-purple-700"
                        }`}
                    >
                      Keyingi
                    </button>
                  </div>
                </div>
              )}





              {activeTab === 'applications' && (
                <motion.div
                  key="applications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                >
                  <div className="p-8 border-b border-white/20">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-white flex items-center">
                        <FileText className="h-6 w-6 mr-3 text-blue-400" />
                        Arizalar boshqaruvi
                      </h2>
                      <div>
                        <button 
                          className='bg-blue-700 text-white py-2 px-4 shadow-lg rounded-lg'>
                          + Ariza qo'shish
                        </button>
                      </div>
                      {/* <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300">
                          <Search className="h-4 w-4" />
                          <span>Qidirish</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300">
                          <Filter className="h-4 w-4" />
                          <span>Filtr</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg">
                          <Download className="h-4 w-4" />
                          <span>Eksport</span>
                        </button>
                      </div> */}
                    </div>
                  </div>

                  {/* <div className="overflow-x-auto ">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          {['Ism', 'Email', 'Dastur', 'Davlat', 'Holat', 'Sana', 'Amallar'].map((header) => (
                            <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {applications.map((app: any, index) => (
                          <motion.tr
                            key={app.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-white/5 transition-all duration-300"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-semibold text-sm">
                                    {app.full_name?.charAt(0)?.toUpperCase()}
                                  </span>
                                </div>
                                <div className="font-semibold text-white">{app.full_name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-purple-200">{app.email}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 text-xs font-semibold bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                                {app.program_type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-purple-200">{app.country_preference}</td>
                            <td className="px-6 py-4">
                              <select
                                value={app.status}
                                onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold border-0 ${getStatusColor(app.status)} cursor-pointer`}
                              >
                                <option value="pending">Kutilmoqda</option>
                                <option value="approved">Tasdiqlangan</option>
                                <option value="rejected">Rad etilgan</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-purple-200 text-sm">
                              {new Date(app.created_at).toLocaleDateString('uz-UZ')}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-all duration-300">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem('applications', app.id)}
                                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div> */}

                  <div className='flex justify-around items-center gap-10 my-3 p-3'>
                    <div 
                      className='w-[420px] flex items-center gap-2 text-white border border-gray-200 p-3 rounded-lg shadow-lg'>
                      <Search />
                      <input type="text" className='w-full focus:outline-none bg-transparent' placeholder='Ismi va raqami boyicha qidiring'/>
                    </div>
                    <div 
                      className='w-[200px] flex items-center gap-2 border border-gray-200 p-3 rounded-lg shadow-lg'>
                      <select 
                        className='outline-none bg-transparent text-gray-900'>
                        <option value="">Barcha statuslar</option>
                        <option value="">Kutilmoqda</option>
                        <option value="">Tasdiqlangan</option>
                        <option value="">Rad etildi</option>
                      </select>
                    </div>
                    <div className='text-4xl'>
                      <button>
                        <Trash2 className='text-red-500 text-4xl'/>
                      </button>
                    </div>
                  </div>

                  <div className='m-3 p-3 rounded-lg'>
                    <table className="w-full border border-gray-700 rounded-lg overflow-hidden shadow-md">
                      <thead className="bg-gradient-to-r from-slate-600 via-purple-600 to-slate-600 text-white text-sm uppercase tracking-wide">
                        <tr>
                          <th className="p-4 text-left font-semibold">#</th>
                          <th className="p-4 text-left font-semibold">Mijoz</th>
                          <th className="p-4 text-left font-semibold">Email</th>
                          <th className="p-4 text-left font-semibold">Telefon</th>
                          <th className="p-4 text-left font-semibold">Sana</th>
                          <th className="p-4 text-left font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {application.map((app: any, index: number) => (
                          <tr
                            key={app.id || index}
                            className="hover:bg-slate-400/50 transition-colors duration-200 text-white"
                          >
                            <td className="px-3 py-4">
                              <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-gray-400 cursor-pointer"
                              />
                            </td>
                            <td className="px-3 py-4 flex items-center gap-2">
                              <img
                                src={app.client?.avatar_url}
                                alt={app.client?.full_name}
                                className="rounded-full w-7 h-7 object-cover border border-gray-500"
                              />
                              <span className="font-medium">{app.client?.full_name || "—"}</span>
                            </td>
                            <td className="px-3 py-4 text-sm truncate max-w-[200px]">
                              {app.client?.email || "—"}
                            </td>
                            <td className="px-3 py-4">{app.client?.phone || "—"}</td>
                            <td className="px-3 py-4">
                              {new Date(app.created_at).toLocaleDateString()}
                            </td>
                            <td
                              className="px-3 py-4"
                              onClick={() => handleOpenStatusModal(app.id, app.status)}
                            >
                              <button
                                className={`rounded-2xl px-3 py-1 text-sm font-medium ${getStatusColorApp(
                                  app.status
                                )} shadow`}
                              >
                                {getStatusLabelApp(app.status)}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {statusModal && (
                      <div onClick={() => setStatusModal(false)}
                        className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50">
                        <div onClick={(e) => e.stopPropagation()}
                          className="bg-gradient-to-br from-slate-700 via-purple-700 to-slate-700 p-5 rounded-xl shadow-lg w-64 space-y-2">
                          <h3 className="text-white text-lg font-semibold mb-2">
                            Statusni tanlang
                          </h3>
                          {[
                            { label: "Kutilmoqda", value: "pending", color: "bg-yellow-300 text-yellow-700" },
                            { label: "Tasdiqlangan", value: "approved", color: "bg-green-300 text-green-700" },
                            { label: "Rad etildi", value: "rejected", color: "bg-red-300 text-red-700" },
                          ].map((item, i) => (
                            <label
                              key={i}
                              className={`flex items-center gap-2 rounded-md cursor-pointer font-medium p-2 ${item.color} hover:opacity-80`}>
                              <input
                                type="radio"
                                name="status"
                                value={item.value}
                                className="cursor-pointer"
                                checked={selectedStatus === item.value}
                                onChange={() => handleStatusChange(item.value)}
                              />
                              {item.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "services" && (
                <>
                  {/* Header va Yangi Xizmat tugmasi */}
                  <div className="p-8 border-b flex justify-between items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Settings className="h-6 w-6 mr-3 text-orange-400" />
                      Xizmatlar boshqaruvi
                    </h2>
                    <button
                      onClick={handleAddService} // Yangi xizmat qo‘shish funksiyasi
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Yangi xizmat</span>
                    </button>
                  </div>

                  {/* Services ro'yxati */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.length === 0 ? (
                      <p className="text-white">Hech qanday xizmat topilmadi</p>
                    ) : (
                      services.map((service, index) => {
                        // Icon componentni olish (iconMap dan yoki default)
                        const IconComponent = iconMap[service.icon.name] || FileText;
                        const iconColor = service.icon.color?.toLowerCase() || "blue";

                        return (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group hover:scale-105"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <IconComponent className={` h-5 w-5 text-${iconColor}-400`} />
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditService(service)}
                                  className=" text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300"
                                  aria-label="Tahrirlash"
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteServiceClick(service.id)}
                                  className=" text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                                  aria-label="O'chirish"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                            <h3 className={`font-bold  text-white text-lg group-hover:text-purple-200 transition-colors flex items-center space-x-2`}>
                              <span>{service.title.uz}</span>
                            </h3>
                            <p className="text-purple-200 mb-2 text-sm leading-relaxed">
                              {service.description.uz}
                            </p>

                            <p className="text-purple-300 mb-4 text-sm">
                              <strong>Features:</strong> {service.features.map(f => f.uz).join(", ")}
                            </p>


                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                {service.price}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold bg-${iconColor}-500/20 text-${iconColor}-300 border border-${iconColor}-500/30`}
                              >
                                {service.icon?.color}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>


                  {showServiceModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-xl border border-white/20 
                    max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold text-white">
                            {editingItem ? "Xizmatni tahrirlash" : "Yangi xizmat"}
                          </h2>
                          <button
                            onClick={() => setShowServiceModal(false)}
                            className="text-white"
                            aria-label="Modalni yopish"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-white mb-1">Mavzu (UZ)</label>
                            <input
                              type="text"
                              value={serviceForm.title.uz}
                              onChange={(e) =>
                                setServiceForm({
                                  ...serviceForm,
                                  title: { ...serviceForm.title, uz: e.target.value },
                                })
                              }
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"

                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1">Mavzu (EN)</label>
                            <input
                              type="text"
                              value={serviceForm.title.en}
                              onChange={(e) =>
                                setServiceForm({
                                  ...serviceForm,
                                  title: { ...serviceForm.title, en: e.target.value },
                                })
                              }
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"

                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1">Mavzu (RU)</label>
                            <input
                              type="text"
                              value={serviceForm.title.ru}
                              onChange={(e) =>
                                setServiceForm({
                                  ...serviceForm,
                                  title: { ...serviceForm.title, ru: e.target.value },
                                })
                              }
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"

                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1">Tavsif (UZ)</label>
                            <textarea
                              value={serviceForm.description.uz}
                              onChange={(e) =>
                                setServiceForm({
                                  ...serviceForm,
                                  description: { ...serviceForm.description, uz: e.target.value },
                                })
                              }
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1">Tavsif (EN)</label>
                            <textarea
                              value={serviceForm.description.en}
                              onChange={(e) =>
                                setServiceForm({
                                  ...serviceForm,
                                  description: { ...serviceForm.description, en: e.target.value },
                                })
                              }
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1">Tavsif (RU)</label>
                            <textarea
                              value={serviceForm.description.ru}
                              onChange={(e) =>
                                setServiceForm({
                                  ...serviceForm,
                                  description: { ...serviceForm.description, ru: e.target.value },
                                })
                              }
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1">Narx</label>
                            <input
                              type="text"
                              value={serviceForm.price}
                              onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1">Xususiyat (UZ, vergul bilan)</label>
                            <input
                              type="text"
                              value={featuresUz}
                              onChange={e => setFeaturesUz(e.target.value)}
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            />
                          </div>

                          <div>
                            <label className="block text-white mb-1">Xususiyat (EN, vergul bilan)</label>
                            <input
                              type="text"
                              value={featuresEn}
                              onChange={e => setFeaturesEn(e.target.value)}
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            />
                          </div>

                          <div>
                            <label className="block text-white mb-1">Xususiyat (RU, vergul bilan)</label>
                            <input
                              type="text"
                              value={featuresRu}
                              onChange={e => setFeaturesRu(e.target.value)}
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            />
                          </div>

                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setShowServiceModal(false)}
                              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Bekor qilish
                            </button>
                            <button
                              onClick={handleSaveService}
                              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Saqlash
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {deleteModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-sm w-full border border-white/20 text-white">
                        <h3 className="text-lg font-semibold mb-4">Haqiqatan ham o'chirmoqchimisiz?</h3>
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => setDeleteModalOpen(false)}
                            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                          >
                            Bekor qilish
                          </button>
                          <button
                            onClick={handleConfirmServiceDelete}
                            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                          >
                            O'chirish
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </>
              )}

              {activeTab === 'stories' && (
                <>
                  <motion.div
                    key="stories"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl"
                  >
                    <div className="p-8 border-b border-white/20">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                          <MessageSquare className="h-6 w-6 mr-3 text-purple-400" />
                          Hikoyalar boshqaruvi
                        </h2>
                        <button
                          onClick={handleAddStory}
                          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Yangi hikoya</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stories.map((story: any, index) => (
                          <motion.div
                            key={story.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group hover:scale-105"
                          >
                            {story.image && (
                              <div className="h-48 overflow-hidden">
                                <img
                                  src={story.image}
                                  alt={story.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                            )}
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-bold text-white">{story.name}</h3>
                                  <p className="text-sm text-purple-200">{story.country}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {story.featured && (
                                    <div className="p-1 bg-yellow-500/20 rounded-full">
                                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    </div>
                                  )}
                                  <button
                                    onClick={() => handleEditStory(story)}
                                    className="p-1 text-blue-400 hover:bg-blue-500/20 rounded"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStoryClick(story.id)}
                                    className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-purple-200 text-sm line-clamp-3 mb-3">{story.text}</p>
                              <div className="flex items-center">
                                {[...Array(story.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {storyDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-sm w-full border border-white/20 text-white">
                        <h3 className="text-lg font-semibold mb-4">Haqiqatan ham o'chirmoqchimisiz?</h3>
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => setStoryDeleteModal(false)}
                            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                          >
                            Bekor qilish
                          </button>
                          <button
                            onClick={handleConfirmStoryDelete}
                            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                          >
                            O'chirish
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {showStoryModal && (
                    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
                      <div className="backdrop-blur-3xl rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-2xl text-center font-bold text-white">
                            {editingService ? "Hikoyani tahrirlash" : "Yangi hikoya qo'shish"}
                          </h2>
                          <button onClick={() => setShowStoryModal(false)}
                            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300">
                            <X className="w-5 h-5 text-white" />
                          </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                          <div>
                            <label className="block text-white text-sm font-semibold mb-2">
                              Ismi, familiyasi
                            </label>
                            <input type="text" name="name"
                              value={storyForm.name || ''}
                              onChange={(e) =>
                                setStoryForm({
                                  ...storyForm,
                                  name: e.target.value, // ✅ yangi qiymatni yozish
                                })
                              }
                              placeholder="Enter name"
                              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 backdrop-blur-lg focus:outline-none focus:border-white focus:ring-2 focus:ring-white transition-all duration-300"
                              required
                            />
                            <label className="block text-white text-sm font-semibold mt-4 my-2">Qaysi mamlakat</label>
                            <input type="text"
                              name="country"
                              value={storyForm.country || ''}
                              onChange={(e) =>
                                setStoryForm({
                                  ...storyForm,
                                  country: e.target.value, // ✅ yangi qiymatni yozish 
                                })
                              } placeholder='Enter country'
                              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 backdrop-blur-lg focus:outline-none focus:border-white focus:ring-2 focus:ring-white transition-all duration-300"
                              required />
                          </div>
                          <div>
                            <label className="block text-white text-sm font-semibold mb-2">Tavsif</label>
                            <textarea
                              name="description"
                              value={storyForm.text || ''}
                              onChange={(e) =>
                                setStoryForm({
                                  ...storyForm,
                                  text: e.target.value
                                })
                              }
                              placeholder="Xizmat haqida batafsil ma'lumot"
                              rows={2}
                              className="w-full px-3 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 backdrop-blur-lg focus:outline-none focus:border-white focus:ring-2 focus:ring-white transition-all duration-300 resize-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-white text-sm font-semibold mb-2">Rasm</label>
                            <input
                              type="file"
                              onChange={(e) =>
                                setStoryForm({
                                  ...storyForm,
                                  image: e.target.files?.[0] // File object
                                })
                              }
                              className='border w-full rounded-lg py-2 text-white'
                            />

                          </div>
                          {/* Form Buttons */}
                          <div className="flex gap-4 pt-2">
                            <button type="button" onClick={() => setShowStoryModal(false)}
                              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg font-semibold transition-all duration-300">
                              Bekor qilish
                            </button>
                            <button type="button" onClick={handleSaveStory}
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-95">
                              Saqlash
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'partners' && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl"
                  >
                    <div className="p-8 border-b border-white/20">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                          <Building className="h-6 w-6 mr-3 text-indigo-400" />
                          Hamkorlar boshqaruvi
                        </h2>
                        <button
                          onClick={handleAddPartners}
                          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Yangi hamkor</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {partners.map((partner: Partner, index: number) => (
                          <motion.div
                            key={partner.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group hover:scale-105"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className='flex flex-col items-center'>
                                <h3 className="font-semibold text-white text-lg group-hover:text-indigo-200 transition-colors">{partner.name.en}</h3>
                                <h3 className="font-semibold text-white text-lg group-hover:text-indigo-200 transition-colors">{partner.name.ru}</h3>
                                <h3 className="font-semibold text-white text-lg group-hover:text-indigo-200 transition-colors">{partner.name.uz}</h3>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button onClick={() => handleEditPartners(partner)}
                                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDeletePartnerClick(partner.id)}
                                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div >
                            {
                              partner.image && (
                                <div className="h-48 overflow-hidden">
                                  <img src={partner.image} alt={partner.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                              )
                            }
                          </motion.div >
                        ))}
                      </div >
                    </div >
                  </motion.div >

                  {partnerDeleteModal && (
                    <div className='fixed inset-0  bg-black/40 flex justify-center items-center rounded-md '>
                      <div className='backdrop-blur-xl p-6 rounded-lg bg-white/20 ml-24 max-w-[570px]'>
                        <h1 className='text-2xl text-center text-white font-600 pb-4'>Haqiqatdan ham o'chirmoqchimisiz</h1>
                        <div className='flex justify-center items-center gap-4 pt-4 ml-36'>
                          <button
                            onClick={() => setPartnerDeleteModal(false)}
                            className='py-3 px-10 text-white bg-green-600 rounded-lg font-[600] hover:bg-green-700 duration-300'>Bekor qilish
                          </button>
                          <button
                            onClick={handleConfirmPartnerDelete}
                            className='py-3 px-14 text-white bg-red-600 rounded-lg font-[600] hover:bg-red-700 duration-300'>O'chirish
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {
                    showPartnerModal && (
                      <div className="fixed inset-0 z-100 flex -top- bg-black/30 items-center justify-center p-4">
                        <div className="backdrop-blur-xl rounded-xl mt-32 ml-32 p-6 w-full max-w-xl max-h-[80vh] border border-white/20 shadow-xl">
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">
                              {editingItem ? 'Hamkorni tahrirlash' : 'Yangi hamkor qo‘shish'}
                            </h2>
                            <button onClick={() => setShowPartnerModal(false)}
                              className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300">
                              <X className="w-5 h-5 text-white" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-white text-sm font-semibold mb-2">Hamkor nomi (En)</label>
                              <input type="text" name="name_en"
                                value={partnerForm.name.en}
                                onChange={(e) => setPartnerForm({ ...partnerForm, name: { ...partnerForm.name, en: e.target.value } })}
                                className="w-full px-4 py-2 outline-none bg-white/10 border border-white/30 rounded-lg text-white focus:border-white focus:ring-2 focus:ring-white" />
                            </div>
                            <div>
                              <label className="block text-white text-sm font-semibold mb-2">Hamkor nomi (Ru)</label>
                              <input type="text" name="name_ru"
                                value={partnerForm.name.ru}
                                onChange={(e) => setPartnerForm({ ...partnerForm, name: { ...partnerForm.name, ru: e.target.value } })}
                                className="w-full px-4 py-2 outline-none bg-white/10 border border-white/30 rounded-lg text-white focus:border-white focus:ring-2 focus:ring-white" />
                            </div>
                            <div>
                              <label className="block text-white text-sm font-semibold mb-2">Hamkor nomi (Uz)</label>
                              <input type="text" name="name_uz"
                                value={partnerForm.name.uz}
                                onChange={((e) => setPartnerForm({ ...partnerForm, name: { ...partnerForm.name, uz: e.target.value } }))}
                                className="w-full px-4 py-2 outline-none bg-white/10 border border-white/30 rounded-lg text-white focus:border-white focus:ring-2 focus:ring-white" />
                            </div>
                            <div>
                              <label className="block text-white text-sm font-semibold mb-2">Rasm</label>
                              <input accept="image/png,image/jpeg, image/jpg, image/webp, image/svg"
                                type="file"
                                onChange={(e) =>
                                  setPartnerForm({ ...partnerForm, image_file: e.target.files?.[0] || null, })
                                }

                                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white focus:ring-2 focus:ring-white transition-all duration-300" />
                              {partnerForm.image && !file && (
                                <div className="mt-2">
                                  <img src={partnerForm.image} alt="Current image"
                                    className="h-16 w-16 object-contain rounded" />
                                </div>
                              )}
                            </div>
                            <div className="flex gap-4 pt-4">
                              <button
                                type="button"
                                onClick={() => setShowPartnerModal(false)}
                                className="flex-1 px-6 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg font-semibold transition-all duration-300"
                              >
                                Bekor qilish
                              </button>
                              <button
                                onClick={handleSavePartners}
                                type="button"
                                className="flex-1 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-95"
                              >
                                Saqlash
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                </>
              )}

              {
                activeTab === 'contacts' && (
                  <motion.div
                    key="contacts"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/10  rounded-2xl border border-white/20 shadow-2xl overflow-hidden max-h-[550px] flex flex-col"
                  >
                    <div className="p-8 border-b border-white/20 flex-shrink-0">
                      <h2 className="text-2xl font-bold text-white flex items-center">
                        <Mail className="h-6 w-6 mr-3 text-teal-400" />
                        Murojatlar boshqaruvi
                      </h2>
                    </div>

                    {/* Bu yerda scrollable qism */}
                    <div className="overflow-y-auto flex-grow px-6 pb-6">
                      {loading ? (
                        <div className="p-4 text-white">Yuklanmoqda...</div>
                      ) : (
                        <table className="w-full">
                          <thead className="bg-white/5">
                            <tr>
                              {['№', 'Ism', 'Email', 'Telefon', 'Xabar', 'Sana', 'Amallar'].map((header) => (
                                <th
                                  key={header}
                                  className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10 text-center">
                            {contacts.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="text-center text-purple-200 py-8">
                                  Ma'lumot topilmadi
                                </td>
                              </tr>
                            ) : (
                              contacts.map((contact, index) => (
                                <motion.tr
                                  key={contact.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="hover:bg-white/5 transition-all duration-300"
                                >
                                  <td className=' text-white font-bold'>{index + 1}</td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center">
                                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-white font-semibold text-sm">
                                          {contact.name?.charAt(0)?.toUpperCase() || '-'}
                                        </span>
                                      </div>
                                      <div className="font-semibold text-white">{contact?.name || '-'}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-purple-200">{contact?.email || '-'}</td>
                                  <td className="px-6 py-4 text-purple-200">{contact?.phone || '-'}</td>
                                  <td className="px-6 py-4  ">
                                    <div className="w-[250px] trun text-purple-200">{contact?.message || '-'}</div>
                                  </td>
                                  <td className="px-6 py-4 text-purple-200 text-sm">
                                    {contact?.created_at
                                      ? new Date(contact?.created_at).toLocaleDateString('uz-UZ')
                                      : '-'}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                      <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300">
                                        <Eye className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteContactClick(contact.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </motion.tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      )}
                      {deleteModalOpen && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-sm w-full border border-white/20 text-white">
                            <h3 className="text-lg font-semibold mb-4">Haqiqatan ham o'chirmoqchimisiz?</h3>
                            <div className="flex justify-end space-x-4">
                              <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                              >
                                Bekor qilish
                              </button>
                              <button
                                onClick={handleConfirmContactDelete}
                                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                              >
                                O'chirish
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                )
              }
              {activeTab === "service_inputs" && (
                <div className="border border-white/10 rounded-2xl p-6">
                  {/* Header */}
                  <div className="p-5 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <FilePenLine className="h-6 w-6 mr-3 text-teal-400" />
                      Xizmat inputlari boshqaruvi
                    </h2>
                    <button
                      onClick={handleAddServiceInput}
                      className="flex items-center space-x-2 px-6 py-3 bg-teal-400 text-white rounded-xl hover:text-emerald-200 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Yangi xizmat input</span>
                    </button>
                  </div>

                  {/* Tab Buttons */}
                  <div className='flex items-center p-6 space-x-4'>
                    <button
                      onClick={() => setActive("connection")}
                      className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-300 
          ${active === "connection"
                          ? "bg-gradient-to-r from-teal-400 to-emerald-500 text-white shadow-lg scale-105"
                          : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                    >
                      connection
                    </button>

                    <button
                      onClick={() => setActive("all-inputs")}
                      className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-300 
          ${active === "all-inputs"
                          ? "bg-gradient-to-r from-teal-400 to-emerald-500 text-white shadow-lg scale-105"
                          : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                    >
                      all inputs
                    </button>
                  </div>

                  {/* Connection tab */}
                  {active === "connection" && (
                    <div className="flex w-full gap-4">
                      {/* Left table */}
                      <div className={`flex-1 ${selectedService ? 'w-[25%]' : 'w-full'}`}>
                        <table className="w-full">
                          <thead className="bg-white/5">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">
                                Hammasi
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {services.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="text-center text-purple-200 py-8">
                                  Ma'lumot topilmadi
                                </td>
                              </tr>
                            ) : (
                              services.map((service) => (
                                <motion.tr
                                  key={service.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.05 }}
                                  className="hover:bg-white/5 transition-all duration-300 cursor-pointer"
                                >
                                  <td className="px-6 py-4">
                                    <div
                                      className="font-semibold text-white cursor-pointer"
                                      onClick={() => {
                                        setSelectedService(service);
                                        localStorage.setItem('service_input', service.id);
                                      }}
                                    >
                                      {service?.title.uz || "-"}
                                    </div>
                                  </td>
                                </motion.tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Editor pane */}
                      {selectedService && (
                        <div className="w-[65%] bg-white/5 rounded-xl p-6 shadow-lg">
                          <ServiceInputEditor
                            service={selectedService}
                            onClose={() => setSelectedService(null)}
                            onSave={() => setSelectedService(null)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* All Inputs tab */}
                  {active === "all-inputs" && (
                    <div className="w-full max-h-[35vh] overflow-y-auto">
                      <table className="w-full table-fixed">
                        <thead className="bg-white/5">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">
                              All inputs
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {servicesInput.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center text-purple-200 py-8">
                                Ma'lumot topilmadi
                              </td>
                            </tr>
                          ) : (
                            servicesInput.map((service_input) => (
                              <motion.tr
                                key={service_input.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                                className="hover:bg-white/5 transition-all duration-300 cursor-pointer"
                              // onClick={() => {
                              //   handleEditServiceInput(service_input); // Bosilganda modal ochiladi
                              // }}
                              >
                                <td className="px-6 py-4 flex justify-between items-center font-semibold text-white">
                                  <h1>{service_input?.name.uz || "-"}</h1>
                                  <div className="flex items-center gap-2">
                                    <button className="text-green-400 hover:bg-green-500/20 p-2 rounded transition-all duration-300">
                                      {/* icon yoki text */}
                                    </button>
                                    <button
                                      onClick={() => handleEditServiceInput(service_input)}
                                      className="text-blue-400 hover:bg-blue-500/20 p-2 rounded transition-all duration-300"
                                    >
                                      <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteServiceInputClick(service_input.id)}
                                      className="text-red-400 hover:bg-red-500/20 p-2 rounded transition-all duration-300"
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {deleteInputModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-sm w-full border border-white/20 text-white">
                        <h3 className="text-lg font-semibold mb-4">Haqiqatan ham o'chirmoqchimisiz?</h3>
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => setInputDeleteModalOpen(false)}
                            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                          >
                            Bekor qilish
                          </button>
                          <button
                            onClick={handleConfirmServiceInputDelete}
                            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                          >
                            O'chirish
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modal for Add/Edit */}
                  {showServiceInputModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto border border-white/20">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold text-white">
                            {editingItem ? "Xizmat inputini tahrirlash" : "Yangi xizmat inputi"}
                          </h2>
                          <button
                            onClick={() => setShowServiceInputModal(false)}
                            className="text-white hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-500/20"
                            aria-label="Modalni yopish"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          {/* Name fields */}
                          <div>
                            <label className="block text-white mb-1">Nomi (UZ)</label>
                            <input
                              type="text"
                              value={serviceInputForm.name.uz}
                              onChange={(e) =>
                                setServiceInputForm({
                                  ...serviceInputForm,
                                  name: { ...serviceInputForm.name, uz: e.target.value },
                                })
                              }
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1">Nomi (EN)</label>
                            <input
                              type="text"
                              value={serviceInputForm.name.en}
                              onChange={(e) =>
                                setServiceInputForm({
                                  ...serviceInputForm,
                                  name: { ...serviceInputForm.name, en: e.target.value },
                                })
                              }
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1">Nomi (RU)</label>
                            <input
                              type="text"
                              value={serviceInputForm.name.ru}
                              onChange={(e) =>
                                setServiceInputForm({
                                  ...serviceInputForm,
                                  name: { ...serviceInputForm.name, ru: e.target.value },
                                })
                              }
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            />
                          </div>

                          {/* Description fields */}
                          <div>
                            <label className="block text-white mb-1">Tavsif (UZ)</label>
                            <textarea
                              value={serviceInputForm.description.uz}
                              onChange={(e) =>
                                setServiceInputForm({
                                  ...serviceInputForm,
                                  description: { ...serviceInputForm.description, uz: e.target.value },
                                })
                              }
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1">Tavsif (EN)</label>
                            <textarea
                              value={serviceInputForm.description.en}
                              onChange={(e) =>
                                setServiceInputForm({
                                  ...serviceInputForm,
                                  description: { ...serviceInputForm.description, en: e.target.value },
                                })
                              }
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1">Tavsif (RU)</label>
                            <textarea
                              value={serviceInputForm.description.ru}
                              onChange={(e) =>
                                setServiceInputForm({
                                  ...serviceInputForm,
                                  description: { ...serviceInputForm.description, ru: e.target.value },
                                })
                              }
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            />
                          </div>

                          {/* Action buttons */}
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setShowServiceInputModal(false)}
                              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Bekor qilish
                            </button>
                            <button
                              onClick={handleSaveServiceInput}
                              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Saqlash
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "clientDetails" && (
                <ClientDetailsPage clientId={selectedClientId} />
              )}

            </AnimatePresence >
          </div >
        </div >
      </div >
    </div >
  )
}

export default Admin