import { useState } from "react"
import { ArrowLeft, Calendar, CalendarIcon, CreditCard, Globe, GraduationCap, Send, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Label } from "../../../../components/ui/label"
import { Input } from "../../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover"
import { Button } from "../../../../components/ui/button"
import { cn } from "../../../../lib copy/utils"
import {format} from 'date-fns'

interface FormData {
    leadName: string
    leadPhone: string
    studyType: string
    country: string
    service: string
    transactionType: "online" | "offline"
    meetingDate?: Date
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

    const [formData, setFormData] = useState<FormData>({
        leadName: "",
        leadPhone: "",
        studyType: "",
        country: "",
        service: "",
        transactionType: "online",
      })
      const [isSubmitting, setIsSubmitting] = useState(false)
      const [submitted, setSubmitted] = useState(false)
    
      const availableServices = formData.country ? countryServices[formData.country as keyof typeof countryServices] : []
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
    
        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500))
    
        setSubmitted(true)
        setIsSubmitting(false)
      }
    
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
        <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 p-2 rounded-xl">
          <Button className="py-1 px-3 rounded-md bg-gray-200/20 hover:bg-gray-200">
            <a href="" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Call Manager
            </a>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Lead Information Form</h1>
          <p className="text-muted-foreground">Complete the lead details for consulting assignment</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
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
                    className="mt-2"
                  >
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
                    <Label>Meeting Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.meetingDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.meetingDate ? format(formData.meetingDate, "PPP") : "Select meeting date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.meetingDate}
                          onSelect={(date) => setFormData((prev) => ({ ...prev, meetingDate: date }))}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Card>
              <CardContent className="p-6">
                <Button type="submit" className="w-full border cursor-pointer " disabled={!isFormValid || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 cursor-pointer border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
        </form>
      </div>
    </div>
    </section>
  )
}

export default AgentFormPage