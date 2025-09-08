import { useEffect, useState } from "react"
import { ArrowLeft, CreditCard, Globe, GraduationCap, Send, User } from "lucide-react"
// import { Calendar } from "../../../../components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Label } from "../../../../components/ui/label"
import { Input } from "../../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group"
// import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover"
import { Button } from "../../../../components/ui/button"
import toast from "react-hot-toast"
// import { cn } from "../../../../lib copy/utils"
// import {format} from 'date-fns'

interface FormData {
  leadName: string;
  leadPhone: string;
  studyType: string;
  country: string;
  service: string;
  transactionType: "online" | "offline";
  meetingDate?: Date;
  leadRegion?: string;
}

  interface leadType {
    id: string;
    name: string;
    phone: number;
    email: string;
    source: string;
    passport_number: string;
    region: string
  }
  
  const studyTypes = [
    { value: "master", label: "Master's Degree" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "professional", label: "Professional Training" },
    { value: "language", label: "Language Course" },
  ]
  
  const countries = [
    { value: "korea", label: "Korea" },
    { value: "australia", label: "Australia" },
    { value: "malaysia", label: "Malaysia" },
    { value: "singapore", label: "Singapore" },
    { value: "dubai", label: "Dubai" },
  ]
  
  const countryServices = {
    korea: ["master", "bachelor", "professional"],
    australia: ["language", "professional", "bachelor", "master"],
    malaysia: ["language", "professional", "bachelor", "master"],
    singapore: ["language", "professional", "bachelor", "master"],
    dubai: ["language", "bachelor", "master"],
  } 

const AgentFormPage = () => {
    const [leads, setLeads] = useState([])
    const [loading, setloading] = useState(false);
    const [selectedLead, setSelectedLead] = useState<leadType | null>(null);

    const fetchLeads = async () => {
        setloading(true)
        try{
            const res = await fetch('https://learnx-crm-production.up.railway.app/api/v1/leads/get-agent-leads', {
                method: 'GET',
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            console.log(data);
            setLeads(data || []);
        }catch(error){
            console.log(error);
        }
        finally{
            setloading(false)
        }
    }

    useEffect(() => {
        fetchLeads();
    }, [])

    const handleLeadSelect = (lead: leadType) => {
        setSelectedLead(lead);
        setFormData({
            leadName: lead.name || "",
            leadPhone: lead.phone || "",
            leadRegion: lead.region || "",
            studyType: "",
            country: "",
            service: "",
            transactionType: "online",
            // meetingDate: null
          });
      
    }

    const [formData, setFormData] = useState<FormData>({
      leadName: "",
      leadPhone: "",
      studyType: "",
      country: "",
      service: "",
      transactionType: "online",
      meetingDate: undefined,
    });
    
      const [isSubmitting, setIsSubmitting] = useState(false)
      const [submitted, setSubmitted] = useState(false)
    
      const availableServices = formData.country ? countryServices[formData.country as keyof typeof countryServices] : []
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLead?.id) {
          alert("Lead tanlanmadi!");
          return;
        }
      
        const payload = {
          id: selectedLead.id,
          name: formData.leadName || selectedLead.name,
          phone: formData.leadPhone || selectedLead.phone,
          email: selectedLead.email,
          source: selectedLead.source,
          passport_number: selectedLead.passport_number,
          note: "",
          service_id: formData.service || "",
          country: formData.country || "",
          meeting_type: formData.transactionType || "online",
          meeting_time: formData.meetingDate
            ? new Date(formData.meetingDate).toISOString()
            : "",
          region: formData.leadRegion || selectedLead.region,
          birth_year: selectedLead.birth_year,
          comments: null,
          call_agent_id: selectedLead.call_agent_id,
          consulting_agent_id: selectedLead.consulting_agent_id || "",
          document_agent_id: selectedLead.document_agent_id || "",
          current_agent_id: selectedLead.current_agent_id
        };
      
        try {
          const res = await fetch("https://learnx-crm-production.up.railway.app/api/v1/leads/complete-as-call-agent",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("admin_access_token") || ""}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(payload)
            }
          );
      
          const data = await res.json();
          if (!res.ok) {
            console.error("Xatolik:", data);
            alert(data.message || "Yuborishda xatolik yuz berdi");
          } else {
            toast.success("Forma muvaffaqiyatli yuborildi!");
            setSelectedLead(null);
            setFormData({
              leadName: "",
              leadPhone: "",
              studyType: "",
              country: "",
              service: "",
              transactionType: "online",
              meetingDate: undefined,
              leadRegion: ""
            });
          }
        } catch (error) {
          console.error(error);
        }
      };
    
      const handleCountryChange = (country: string) => {
        setFormData((prev) => ({
          ...prev,
          country,
          service: "", // Reset service when country changes
        }))
      }
    
      const isFormValid =
        formData.leadName &&
        formData.leadPhone &&
        formData.studyType &&
        formData.country &&
        formData.service &&
        (formData.transactionType === "online" || formData.meetingDate)
    
      if (submitted) {
        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="w-full max-w-md">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Form Submitted Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  The lead information has been sent to the consulting manager for review and scheduling.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({
                        leadName: "",
                        leadPhone: "",
                        studyType: "",
                        country: "",
                        service: "",
                        transactionType: "online",
                      })
                    }}
                    className="w-full"
                  >
                    Submit Another Form
                  </Button>
                  <Button  className="w-full bg-transparent">
                    <a href="/consulting-manager">View in Consulting Manager</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      }

  return (
    <section>
      <div className="min-h-screen bg-background max-w-[1200px] border rounded-xl shadow-sm mx-auto p-4">
        {/* Header */}
        <div className="mb-4 p-2 rounded-xl pl-6">
            <Button className="py-1 px-3 rounded-md bg-gray-200/20 hover:bg-gray-200">
              <a href="" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />Back to Call Manager
              </a>
            </Button>
            <h1 className="text-[28px] font-bold text-foreground">Lead Information Form</h1>
            <p className="text-muted-foreground text-sm">Complete the lead details for consulting assignment</p>
        </div>  

        <div className="flex justify-around gap-10">
            <div>
                <h2 className="text-gray-800 text-lg font-semibold mb-4">Leads ro'yxati</h2>
                <div className="border border-white/5 flex flex-col space-y-3">
                { loading ? <p className="loader flex justify-center items-center m-10"></p>  : leads && 
                leads.map((lead: leadType, index) => (
                    <div>
                        <div onClick={() => handleLeadSelect(lead)}
                  className={`cursor-pointer border border-gray-200 p-2 rounded-xl w-[500px] text-gray-700 transition 
                    ${selectedLead?.id === lead.id ? "bg-blue-100" : "bg-white/5 hover:bg-gray-300/30"}`}>
                        <p className="p-1 text-red-500 text-lg">{index+1}</p>
                          <span className="flex gap-2">
                            <h2>Ismi:</h2><h2>{lead.name || "nomalum"}</h2>
                          </span>
                          <span className="flex gap-1 ">
                            <p>Telefon raqami:</p>
                            <p>{lead.phone || 'nomalum'}</p>
                          </span>
                          <span className="flex gap-1 ">
                            <p>Email manzili:</p>
                            <p>{lead.email || 'nomalum'}</p>
                          </span>
                          <span className="flex gap-1 ">
                            <p>Manbasi:</p>
                            <p>{lead.source || 'nomalum'}</p>
                          </span>
                          <span className="flex gap-1 ">
                            <p className="font-semibold">Passport raqami:</p>
                            <p>{lead.passport_number || 'nomalum'}</p>
                          </span>
                          <span className="flex gap-1 ">
                            <p className="font-semibold">Manzili:</p>
                            <p>{lead.region || "nomalum"}</p>
                          </span>
                        </div>
                    </div>
                ))}
                </div>
            </div>

            {selectedLead ? (
            <form onSubmit={handleSubmit}>
            <div className="space-y-6 mt-10">
                {/* Lead Information */}
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 ">
                    <User className="w-5 h-5" />
                    Lead Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                    <Label htmlFor="leadName">Lead Name *</Label>
                    <Input
                        id="leadName"
                        value={formData.leadName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, leadName: e.target.value }))}
                        placeholder="Enter lead's full name"
                        required
                    />
                    </div>
                    <div>
                    <Label htmlFor="leadPhone">Phone Number *</Label>
                    <Input
                        id="leadPhone"
                        value={formData.leadPhone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, leadPhone: e.target.value }))}
                        placeholder="Enter phone number"
                        required
                    />
                    </div>
                    <div>
                        <Label htmlFor="leadRegion">Region</Label>
                        <Input type="text" 
                        id="leadRegion" 
                        placeholder="Enter lead region"
                        required
                        />
                    </div>
                </CardContent>
                </Card>

                {/* Study Information */}
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Study Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                    <Label>Type of Study *</Label>
                    <Select
                        value={formData.studyType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, studyType: value }))}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select study type" />
                        </SelectTrigger>
                        <SelectContent>
                        {studyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                            {type.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                </CardContent>
                </Card>

                {/* Country & Services */}
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Destination & Services
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                    <Label>Preferred Country *</Label>
                    <Select value={formData.country} onValueChange={handleCountryChange}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select destination country" />
                        </SelectTrigger>
                        <SelectContent>
                        {countries.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                            {country.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>

                    {formData.country && (
                    <div>
                        <Label>Available Services *</Label>
                        <Select
                        value={formData.service}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, service: value }))}
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Select available service" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableServices.map((service) => {
                            const serviceLabel = studyTypes.find((s) => s.value === service)?.label || service
                            return (
                                <SelectItem key={service} value={service}>
                                {serviceLabel}
                                </SelectItem>
                            )
                            })}
                        </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground mt-1">
                        Services available in {countries.find((c) => c.value === formData.country)?.label}
                        </p>
                    </div>
                    )}
                </CardContent>
                </Card>

                {/* Transaction Type */}
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Meeting Preference
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                    <Label>Transaction Type *</Label>
                    <RadioGroup
                        value={formData.transactionType}
                        onValueChange={(value: "online" | "offline") =>
                        setFormData((prev) => ({ ...prev, transactionType: value }))
                        }
                        className="mt-2">
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online">Online Consultation</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="offline" id="offline" />
                        <Label htmlFor="offline">Office Meeting</Label>
                        </div>
                    </RadioGroup>
                    </div>
                    {formData.transactionType === "offline" && (
  <div>
    <Label htmlFor="meetingDate">Meeting Date *</Label>
    <Input
      type="date"
      id="meetingDate"
      value={formData.meetingDate ? formData.meetingDate.toISOString().split("T")[0] : ""}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          meetingDate: e.target.value ? new Date(e.target.value) : undefined,
        }))
      }
      required
    />
  </div>
)}

                </CardContent>
                </Card>

                {/* Submit Button */}
                <Card>
                <CardContent className="p-6">
                    <Button type="submit" className="w-full" size="lg" disabled={!isFormValid || isSubmitting}>
                    {isSubmitting ? (
                        <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting to Consulting Manager...
                        </>
                    ) : (
                        <>
                        <Send className="w-4 h-4 mr-2" />
                        Register & Send to Consulting Manager
                        </>
                    )}
                    </Button>
                    {!isFormValid && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                        Please fill in all required fields to submit
                    </p>
                    )}
                </CardContent>
                </Card>
            </div>
            </form> ) : (
            <div className="flex items-center justify-center text-gray-400">
                Lead tanlang, so‘ngra forma to‘ldiring.
            </div>
            )}
        </div>
      </div>
    </section>
  )
}

export default AgentFormPage