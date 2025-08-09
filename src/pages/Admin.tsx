import React, { useState, useEffect } from 'react'
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
  Star
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import { editPartner } from '../functions/partnerfunctions'

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
import { Building, Download, Eye, Filter, Mail, Search, Sparkles } from 'lucide-react'

// Define Services interface for type safety
type Service = {
  id: string;
  title: { en: string };
  description: { en: string };
  icon: { name: string; color: string };
  price: string;
  features: { en: string }[];
};

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

  // Data states
  const [applications, setApplications] = useState([])
  const [users, setUsers] = useState([])
  const [services, setServices] = useState([])
  const [stories, setStories] = useState([])
  const [partners, setPartners] = useState([])
  const [contacts, setContacts] = useState([])

  // Modal states
  const [editingItem, setEditingItem] = useState(null)
  const [editingService, setEditingService] = useState(null)
  const [file, setFile] = useState<File | null>(null);

  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('uz');
  const [loading, setLoading] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const [serviceForm, setServiceForm] = useState({
    title: { en: "" },
    description: { en: "" },
    icon: { name: "Book", color: "orange" },
    price: "",
    features: [],
  });

  const handleAddService = () => {
    setEditingItem(null);
    setServiceForm({
      title: { en: "" },
      description: { en: "" },
      icon: { name: "Book", color: "orange" },
      price: "",
      features: [],
    });
    setShowServiceModal(true);
  };
  const handleEditService = (service: any) => {
    setServiceForm({
      title: service.title || { en: "" },
      description: service.description || { en: "" },
      icon: service.icon || { name: "Book", color: "orange" },
      price: service.price || "",
      features: Array.isArray(service.features)
        ? service.features.map((f: any) =>
          typeof f === "string" ? { en: f } : f
        )
        : [],
    });
    setEditingItem(service);
    setShowServiceModal(true);
  };

  const handleSaveService = async () => {
    try {
      const payload = {
        title: serviceForm.title,
        description: serviceForm.description,
        icon: serviceForm.icon,
        price: serviceForm.price,
        features: serviceForm.features,
      };

      let res;

      if (editingItem && editingItem.id) {
        // Update mavjud xizmat
        res = await fetch(`https://learnx-crm-production.up.railway.app/api/v1/services/update/${editingItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Yangi xizmat yaratish
        res = await fetch("https://learnx-crm-production.up.railway.app/api/v1/services/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setShowServiceModal(false);
        loadServices(); // ro'yxatni yangilash
      } else {
        const errorData = await res.json();
        console.error("Xatolik:", errorData.message || res.statusText);
        alert("Xizmatni saqlashda xatolik yuz berdi: " + (errorData.message || res.statusText));
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xizmatni saqlashda kutilmagan xatolik yuz berdi");
    }
  };
  //  Delete Service
  const handleDeleteServiceClick = (id: string) => {
    setServiceToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmServiceDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const token = localStorage.getItem("token") || "";
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
      alert("Xizmatni o'chirishda xatolik yuz berdi");
    }
  };
  // Load services
  const loadServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("api_access_token") || "";
      const res = await fetch(
        "https://learnx-crm-production.up.railway.app/api/v1/services/get-list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Xizmatlarni olishda xatolik");

      const servicesArray = Array.isArray(data) ? data : data.services || [];

      const normalizedData = servicesArray.map((item: any) => ({
        id: item.id || "",
        title: item.title || { en: "" },
        description: item.description || { en: "" },
        price: item.price || "",
        icon: {
          name: item.icon?.name || "FileText",
          color: item.icon?.color ? item.icon.color.toLowerCase() : "blue",
        }, features: Array.isArray(item.features)
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


  const [storyForm, setStoryForm] = useState({
    name: '',
    country: '',
    text: { uz: '', en: '', ru: '' },
    rating: 5,
    image: '',
    featured: false,
  });

  const [partnerForm, setPartnerForm] = useState<PartnerForm>({
    name: '',
    logo: '',
  });
  useEffect(() => {
    loadData()
    fetchPartners()
  }, [])
  // const [file, setFile ] = useState<File | null>(null)
  // 
  const loadData = async () => {
    try {
      // Load applications, users, stories, partners, contacts from Supabase
      const { data: appData, error: appError } = await supabase.from('applications').select('*');
      if (appError) throw appError;
      setApplications(appData);

      const { data: userData, error: userError } = await supabase.from('users').select('*');
      if (userError) throw userError;
      setUsers(userData);

      const { data: storyData, error: storyError } = await supabase.from('stories').select('*');
      if (storyError) throw storyError;
      setStories(storyData);

      const { data: partnerData, error: partnerError } = await supabase.from('partners').select('*');
      if (partnerError) throw partnerError;
      setPartners(partnerData);

      const { data: contactData, error: contactError } = await supabase.from('contact_submissions').select('*');
      if (contactError) throw contactError;
      setContacts(contactData);

      // Update stats
      setStats({
        totalApplications: appData.length,
        pendingApplications: appData.filter((app: any) => app.status === 'pending').length,
        approvedApplications: appData.filter((app: any) => app.status === 'approved').length,
        rejectedApplications: appData.filter((app: any) => app.status === 'rejected').length,
        totalUsers: userData.length,
        totalServices: services.length,
        totalStories: storyData.length,
        totalPartners: partnerData.length,
        totalContacts: contactData.length,
        monthlyGrowth: 0, // Implement logic as needed
        weeklyGrowth: 0, // Implement logic as needed
      });
    } catch (err) {
      console.error('Maʼlumotlarni yuklashda xato:', err);
    }
  };

  useEffect(() => {
    loadData();
    loadServices();
  }, []);

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId)

      if (error) throw error

      toast.success('Ariza holati yangilandi')
      loadData()
    } catch (error) {
      console.error('Status update error:', error)
      toast.error('Holatni yangilashda xatolik')
    }
  }
  const handleSaveStory = async () => {
    try {
      const storyData = {
        name: storyForm.name,
        country: storyForm.country,
        rating: storyForm.rating,
        image: storyForm.image,
        featured: storyForm.featured,
        text_translations: storyForm.text
      }

      if (editingItem) {
        const { error } = await supabase
          .from('stories')
          .update(storyData)
          .eq('id', editingItem)

        if (error) throw error
        toast.success('Hikoya yangilandi')
      } else {
        const { error } = await supabase
          .from('stories')
          .insert(storyData)

        if (error) throw error
        toast.success('Yangi hikoya qo\'shildi')
      }

      setShowStoryModal(false)
      setEditingItem(null)
      resetStoryForm()
      loadData()
    } catch (error) {
      console.error('Story save error:', error)
      toast.error('Hikoyani saqlashda xatolik')
    }
  }

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
  //         .eq('id', editingItem.id)
        
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
  //     loadData()
  //   } catch (error) {
  //     console.error('Partner save error:', error)
  //     toast.error('Hamkorni saqlashda xatolik')
  //   }
  // }

  const handleDeleteItem = async (table: string, id: number) => {
    const confirmed = window.confirm("Haqiqatan ham o'chirmoqchimisiz?");
    if (!confirmed) return;
  
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) fetchPartners();
  };

  const fetchPartners = async () => {
    const { data, error } = await supabase.from('partners').select('*');
    if (!error) setPartners(data);
  };

  const resetStoryForm = () => {
    setStoryForm({
      name: '',
      country: '',
      text: { uz: '', en: '', ru: '' },
      rating: 5,
      image: '',
      featured: false
    })
  }

  // const resetPartnerForm = () => {
  //   setEditingItem(null);
  //   setPartnerForm({
  //     name: { uz: '', en: '', ru: '' },
  //     description: { uz: '', en: '', ru: '' },
  //     logo: '',
  //     website: '',
  //     country: '',
  //     established: '',
  //     ranking: ''
  //   });
  //   setFile(null);
  // };
  
  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const tabs = [
    { id: 'dashboard', name: 'Boshqaruv paneli', icon: BarChart3, color: 'from-blue-500 to-purple-600' },
    { id: 'applications', name: 'Arizalar', icon: FileText, color: 'from-green-500 to-teal-600' },
    { id: 'services', name: 'Xizmatlar', icon: Settings, color: 'from-orange-500 to-red-600' },
    { id: 'stories', name: 'Hikoyalar', icon: MessageSquare, color: 'from-purple-500 to-pink-600' },
    { id: 'partners', name: 'Hamkorlar', icon: Building, color: 'from-indigo-500 to-blue-600' },
    { id: 'contacts', name: 'Murojatlar', icon: Mail, color: 'from-teal-500 to-cyan-600' }
  ]
  const handleAddPartners = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('partners').insert({
      name,
    })
    if (error) {
      console.error('Error adding partner:', error)
    } else {
      toast.success('Hamkor qo\'shildi')
    }
  }
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

  // const handleAddPartners = async (e) => {
  //   e.preventDefault()
  //   const {error} = await supabase.from('partners').insert({
  //     name,
  //   })
  //   if(error){
  //     console.error('Error adding partner:', error)
  //   }else {
  //     toast.success('Hamkor qo\'shildi')}
  // }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-8"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Ma'lumotlar yuklanmoqda...</h3>
          <p className="text-purple-200">Iltimos kuting</p>
        </div>
      </div>
    )
  }

  // partners uchun funksiyalar
  interface Partner {
    id: string;
    name: string;
    logo: string;
  }
  
  interface PartnerForm {
    name: string;
    logo: string;
  }

    const resetPartnerForm = () => {
      setEditingItem(null);
      setPartnerForm({ name: '', logo: '' });
      setFile(null);
    };
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null;
      setFile(selectedFile);
    };

    const handleInputChangeStory = (e) => {
      const { name, value, type, checked } = e.target;
      setStoryForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    };
    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from("story-images")
        .upload(fileName, file);
  
      if (!error) {
        const { data: publicUrl } = supabase.storage
          .from("story-images")
          .getPublicUrl(fileName);
  
        setStoryForm((prev) => ({ ...prev, image: publicUrl.publicUrl }));
      }
    };
    const deleteStory = async (id) => {
      const res = await fetch(`${API_BASE}/stories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Hikoyani o‘chirishda xatolik");
      return await res.json();
    };

    const addStory = async (story) => {
      const res = await fetch(`${API_BASE}/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(story),
      });
      if (!res.ok) throw new Error("Hikoya qo‘shishda xatolik");
      return await res.json();
    };

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
                      <div className="flex items-center space-x-3">
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
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
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
                              <span>{service.title.en}</span>
                            </h3>
                            <p className="text-purple-200 mb-2 text-sm leading-relaxed">
                              {service.description.en}
                            </p>

                            <p className="text-purple-300 mb-4 text-sm">
                              <strong>Features:</strong> {service.features.map(f => f.en).join(", ")}
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

                  {/* Modal oynasi */}
                  {showServiceModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-lg border border-white/20">
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
                            <label className="block text-white mb-1">Mavzu</label>
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
                            <label className="block text-white mb-1">Tavsif</label>
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
                            <label className="block text-white mb-1">Narx</label>
                            <input
                              type="text"
                              value={serviceForm.price}
                              onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                              className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-1">Xususiyat (vergul bilan)</label>
                            <input
                              type="text"
                              value={serviceForm.features.map((f) => f.en).join(", ")}
                              onChange={(e) =>
                                setServiceForm({
                                  ...serviceForm,
                                  features: e.target.value.split(",").map((f) => ({ en: f.trim() })),
                                })
                              }
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
                        onClick={() => {
                          resetStoryForm()
                          setShowStoryModal(true)
                        }}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Yangi hikoya</span>
                      </button>
                    </div>
                  </div>
                  {showStoryModal && (
                    <div className="fixed inset-0 -top-[460px] backdrop-blur-md z-50 flex items-center justify-center p-4">
                      <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-500 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
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
                              // value={formData.name}
                              // onChange={handleInputChange}
                              placeholder="Enter name"
                              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 backdrop-blur-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 transition-all duration-300"
                              required
                            />
                            <label className="block text-white text-sm font-semibold mt-4 my-2">Qaysi mamlakat</label>
                            <input type="text" placeholder='Enter country'
                              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 backdrop-blur-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 transition-all duration-300"
                              required/>
                          </div>
                          <div>
                            <label className="block text-white text-sm font-semibold mb-2">Tavsif</label>
                            <textarea
                              name="description"
                              // value={formData.description}
                              // onChange={handleInputChange}
                              placeholder="Xizmat haqida batafsil ma'lumot"
                              rows={2}
                              className="w-full px-3 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 backdrop-blur-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 transition-all duration-300 resize-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-white text-sm font-semibold mb-2">Rasm</label>
                            <input type="file" name="price"
                              // value={formData.price}
                              // onChange={handleInputChange}
                              placeholder="299" min="0"
                              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 backdrop-blur-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 transition-all duration-300"
                              required
                            />
                          </div>
                          {/* Form Buttons */}
                          <div className="flex gap-4 pt-2">
                            <button type="button" onClick={() => setShowStoryModal(false)}
                              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg font-semibold transition-all duration-300">
                              Bekor qilish
                            </button>
                            <button type="button" onClick={handleSaveStory}
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                              Saqlash
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
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
                                  onClick={() => {
                                    setEditingItem(story)
                                    setStoryForm({
                                      name: story.name,
                                      country: story.country,
                                      text: story.text_translations || { uz: story.text, en: '', ru: '' },
                                      rating: story.rating,
                                      image: story.image,
                                      featured: story.featured
                                    })
                                    setShowStoryModal(true)
                                  }}
                                  className="p-1 text-blue-400 hover:bg-blue-500/20 rounded"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem('stories', story.id)}
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
              </>
              )}

              {activeTab === 'partners' && (
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
                      onClick={() => {
                        resetPartnerForm();
                        setShowPartnerModal(true);
                      }}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Yangi hamkor</span>
                    </button>
                  </div>
                </div>
          
                {showPartnerModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-500 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-white">
                          {editingItem ? 'Hamkorni tahrirlash' : 'Yangi hamkor qo‘shish'}
                        </h2>
                        <button
                          onClick={() => setShowPartnerModal(false)}
                          className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
          
                      <div className="space-y-6">
                        <div>
                          <label className="block text-white text-sm font-semibold mb-2">Nomi (UZ)</label>
                          <input
                            type="text"
                            value={partnerForm.name}
                            onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                            placeholder="Nomi (UZ)"
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white"
                            required
                          />

                          </div>
                          <div>
                            <label className="block text-white text-sm font-semibold mb-2">Rasm</label>
                            <input
                              type="file"
                              accept="image/png,image/jpeg"
                              onChange={handleFileChange}
                              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 transition-all duration-300"
                            />
                            {partnerForm.logo && !file && (
                              <div className="mt-2">
                                <img
                                  src={partnerForm.logo}
                                  alt="Current logo"
                                  className="h-16 w-16 object-contain rounded"
                                />
                              </div>
                            )}
                          </div>
                          {/* Boshqa maydonlar uchun shunga o'xshash inputlar qo'shilishi mumkin */}
                          <div className="flex gap-4 pt-4">
                            <button
                              type="button"
                              onClick={() => setShowPartnerModal(false)}
                              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg font-semibold transition-all duration-300"
                            >
                              Bekor qilish
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                editingItem
                                  ? editPartner(supabase, partnerForm, editingItem, setShowPartnerModal, setPartnerForm, loadData)
                                  : savePartner(supabase, partnerForm, setShowPartnerModal, setPartnerForm, loadData)
                              }
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                              Saqlash
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
                            <h3 className="font-bold text-white text-lg group-hover:text-indigo-200 transition-colors">
                              {partner.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setEditingItem(partner);
                                  setPartnerForm({
                                    name: partner.name,
                                    logo: partner.logo,
                                  });
                                  setShowPartnerModal(true);
                                }}
                                className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deletePartner(supabase, partner.id, loadData)}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          {partner.logo && (
                            <div className="mb-4 h-32 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
                              <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain" />
                            </div>
                          )}
                          {partner.description && (
                            <p className="text-purple-200 text-sm mb-3 leading-relaxed">{partner.description}</p>
                          )}
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-indigo-300">{partner.country}</span>
                            {partner.ranking && (
                              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-semibold">
                                #{partner.ranking}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

              )}

              {activeTab === 'contacts' && (
                <motion.div
                  key="contacts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                >
                  <div className="p-8 border-b border-white/20">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Mail className="h-6 w-6 mr-3 text-teal-400" />
                      Murojatlar boshqaruvi
                    </h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          {['Ism', 'Email', 'Telefon', 'Xabar', 'Sana', 'Amallar'].map((header) => (
                            <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {contacts.map((contact: any, index) => (
                          <motion.tr
                            key={contact.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-white/5 transition-all duration-300"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white font-semibold text-sm">
                                    {contact.name?.charAt(0)?.toUpperCase()}
                                  </span>
                                </div>
                                <div className="font-semibold text-white">{contact.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-purple-200">{contact.email}</td>
                            <td className="px-6 py-4 text-purple-200">{contact.phone || '-'}</td>
                            <td className="px-6 py-4">
                              <div className="max-w-xs truncate text-purple-200">{contact.message}</div>
                            </td>
                            <td className="px-6 py-4 text-purple-200 text-sm">
                              {new Date(contact.created_at).toLocaleDateString('uz-UZ')}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem('contact_submissions', contact.id)}
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin