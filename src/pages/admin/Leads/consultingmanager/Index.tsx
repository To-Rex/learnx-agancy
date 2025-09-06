import { useState } from "react"
import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar"
import { Calendar } from "../../../../components/ui/calendar"
import { ScrollArea } from "../../../../components/ui/scroll-area"
import {
  User,
  GraduationCap,
  Globe,
  CalendarIcon,
  Clock,
  Phone,
  CheckCircle,
  Users,
  MapPin,
  ArrowLeft,
} from "lucide-react"
import { format, addDays, isSameDay } from "date-fns"

interface SubmittedForm {
  id: number
  leadName: string
  leadPhone: string
  studyType: string
  country: string
  service: string
  transactionType: "online" | "offline"
  meetingDate?: Date
  submittedBy: string
  submittedAt: Date
  status: "pending" | "assigned" | "scheduled"
  assignedConsultant?: number
}

interface ConsultingAgent {
  id: number
  name: string
  specialization: string[]
  initials: string
  availableSlots: Date[]
  bookedSlots: Date[]
  currentLoad: number
  maxLoad: number
}

const mockForms: SubmittedForm[] = [
  {
    id: 1,
    leadName: "John Smith",
    leadPhone: "+1-555-0101",
    studyType: "master",
    country: "australia",
    service: "master",
    transactionType: "offline",
    meetingDate: addDays(new Date(), 3),
    submittedBy: "Makhamdaliev_Mukhriddin",
    submittedAt: new Date(),
    status: "pending",
  },
  {
    id: 2,
    leadName: "Sarah Johnson",
    leadPhone: "+1-555-0102",
    studyType: "bachelor",
    country: "korea",
    service: "bachelor",
    transactionType: "online",
    submittedBy: "Johnson_Sarah",
    submittedAt: addDays(new Date(), -1),
    status: "pending",
  },
  {
    id: 3,
    leadName: "David Chen",
    leadPhone: "+1-555-0103",
    studyType: "language",
    country: "singapore",
    service: "language",
    transactionType: "offline",
    meetingDate: addDays(new Date(), 5),
    submittedBy: "Chen_David",
    submittedAt: addDays(new Date(), -2),
    status: "assigned",
    assignedConsultant: 1,
  },
]

const mockConsultingAgents: ConsultingAgent[] = [
  {
    id: 1,
    name: "Dr. Emily Watson",
    specialization: ["australia", "singapore", "malaysia"],
    initials: "EW",
    availableSlots: [addDays(new Date(), 1), addDays(new Date(), 2), addDays(new Date(), 4), addDays(new Date(), 7)],
    bookedSlots: [addDays(new Date(), 3), addDays(new Date(), 5)],
    currentLoad: 8,
    maxLoad: 15,
  },
  {
    id: 2,
    name: "Prof. Michael Kim",
    specialization: ["korea", "singapore"],
    initials: "MK",
    availableSlots: [addDays(new Date(), 1), addDays(new Date(), 3), addDays(new Date(), 6), addDays(new Date(), 8)],
    bookedSlots: [addDays(new Date(), 2), addDays(new Date(), 4)],
    currentLoad: 6,
    maxLoad: 12,
  },
  {
    id: 3,
    name: "Ms. Fatima Al-Rashid",
    specialization: ["dubai", "singapore"],
    initials: "FR",
    availableSlots: [addDays(new Date(), 2), addDays(new Date(), 4), addDays(new Date(), 6), addDays(new Date(), 9)],
    bookedSlots: [addDays(new Date(), 1), addDays(new Date(), 7)],
    currentLoad: 5,
    maxLoad: 10,
  },
]

const studyTypeLabels = {
  master: "Master's Degree",
  bachelor: "Bachelor's Degree",
  professional: "Professional Training",
  language: "Language Course",
}

const countryLabels = {
  korea: "Korea",
  australia: "Australia",
  malaysia: "Malaysia",
  singapore: "Singapore",
  dubai: "Dubai",
}

export default function ConsultingManagerPage() {
  const [forms, setForms] = useState<SubmittedForm[]>(mockForms)
  const [selectedAgent, setSelectedAgent] = useState<ConsultingAgent | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedForm, setSelectedForm] = useState<SubmittedForm | null>(null)

  const handleAgentSelect = (agentId: number) => {
    const agent = mockConsultingAgents.find((a) => a.id === agentId)
    setSelectedAgent(agent || null)
  }

  const handleScheduleAppointment = (form: SubmittedForm, agentId: number, appointmentDate: Date) => {
    const updatedForms = forms.map((f) =>
      f.id === form.id
        ? { ...f, status: "scheduled" as const, assignedConsultant: agentId, meetingDate: appointmentDate }
        : f,
    )
    setForms(updatedForms)

    // Update agent's booked slots
    const agent = mockConsultingAgents.find((a) => a.id === agentId)
    if (agent) {
      agent.bookedSlots.push(appointmentDate)
      agent.availableSlots = agent.availableSlots.filter((slot) => !isSameDay(slot, appointmentDate))
    }

    setSelectedForm(null)
  }

  const isDateAvailable = (date: Date) => {
    if (!selectedAgent) return false
    return selectedAgent.availableSlots.some((slot) => isSameDay(slot, date))
  }

  const isDateBooked = (date: Date) => {
    if (!selectedAgent) return false
    return selectedAgent.bookedSlots.some((slot) => isSameDay(slot, date))
  }

//   const getDateStatus = (date: Date) => {
//     if (isDateBooked(date)) return "booked"
//     if (isDateAvailable(date)) return "available"
//     return "unavailable"
//   }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-4">
              <a href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Call Manager
              </a>
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Consulting Manager Dashboard</h1>
            <p className="text-muted-foreground">Review submitted forms and schedule consulting appointments</p>
          </div>

          {/* Consulting Agents Selection */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Select Consulting Agent:</div>
            <div className="flex gap-2">
              {mockConsultingAgents.map((agent) => (
                <Button
                  key={agent.id}
                  variant={selectedAgent?.id === agent.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAgentSelect(agent.id)}
                  className="flex items-center gap-2"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">{agent.initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{agent.name.split(" ")[1]}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {selectedAgent ? `${selectedAgent.name}'s Schedule` : "Select an Agent"}
              </CardTitle>
              {selectedAgent && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-200 rounded-full"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-200 rounded-full"></div>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                    <span>Unavailable</span>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {selectedAgent ? (
                <div className="space-y-4">
                  {/* Agent Info */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar>
                        <AvatarFallback>{selectedAgent.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedAgent.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Specializes in:{" "}
                          {selectedAgent.specialization
                            .map((s) => countryLabels[s as keyof typeof countryLabels])
                            .join(", ")}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>
                        Current Load: {selectedAgent.currentLoad}/{selectedAgent.maxLoad}
                      </span>
                      <span>{Math.round((selectedAgent.currentLoad / selectedAgent.maxLoad) * 100)}% capacity</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(selectedAgent.currentLoad / selectedAgent.maxLoad) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Calendar */}
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    modifiers={{
                      available: (date) => isDateAvailable(date),
                      booked: (date) => isDateBooked(date),
                    }}
                    modifiersStyles={{
                      available: { backgroundColor: "#dcfce7", color: "#166534" },
                      booked: { backgroundColor: "#fecaca", color: "#dc2626" },
                    }}
                    className="rounded-md border"
                  />

                  {/* Time Slots for Selected Date */}
                  {selectedDate && isDateAvailable(selectedDate) && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Available Time Slots for {format(selectedDate, "PPP")}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {["09:00", "10:30", "14:00", "15:30"].map((time) => (
                          <Button
                            key={time}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (selectedForm && selectedAgent) {
                                const appointmentDate = new Date(selectedDate)
                                const [hours, minutes] = time.split(":").map(Number)
                                appointmentDate.setHours(hours, minutes)
                                handleScheduleAppointment(selectedForm, selectedAgent.id, appointmentDate)
                              }
                            }}
                            disabled={!selectedForm}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                      {!selectedForm && (
                        <p className="text-sm text-muted-foreground">Select a form to schedule an appointment</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a consulting agent to view their schedule</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Side - Forms List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Submitted Forms ({forms.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {forms.map((form) => (
                    <Card
                      key={form.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedForm?.id === form.id ? "ring-2 ring-primary" : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedForm(form)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Form Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">
                                  {form.leadName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{form.leadName}</div>
                                <div className="text-xs text-muted-foreground">{form.leadPhone}</div>
                              </div>
                            </div>
                            <Badge
                              variant={
                                form.status === "pending"
                                  ? "secondary"
                                  : form.status === "assigned"
                                    ? "default"
                                    : "outline"
                              }
                              className="text-xs"
                            >
                              {form.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                              {form.status === "scheduled" && <CheckCircle className="w-3 h-3 mr-1" />}
                              {form.status}
                            </Badge>
                          </div>

                          {/* Form Details */}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-3 h-3 text-muted-foreground" />
                              <span>{studyTypeLabels[form.studyType as keyof typeof studyTypeLabels]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Globe className="w-3 h-3 text-muted-foreground" />
                              <span>{countryLabels[form.country as keyof typeof countryLabels]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span>{form.transactionType === "online" ? "Online" : "Office Meeting"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              <span>By: {form.submittedBy.split("_")[1]}</span>
                            </div>
                          </div>

                          {/* Meeting Date */}
                          {form.meetingDate && (
                            <div className="text-xs text-muted-foreground">
                              {form.transactionType === "offline" ? "Requested Date: " : "Scheduled: "}
                              {format(form.meetingDate, "PPP")}
                            </div>
                          )}

                          {/* Assigned Consultant */}
                          {form.assignedConsultant && (
                            <div className="text-xs">
                              <span className="text-muted-foreground">Assigned to: </span>
                              <span className="font-medium">
                                {mockConsultingAgents.find((a) => a.id === form.assignedConsultant)?.name}
                              </span>
                            </div>
                          )}

                          {/* Action Buttons */}
                          {form.status === "pending" && selectedAgent && (
                            <div className="pt-2 border-t">
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (selectedDate && isDateAvailable(selectedDate)) {
                                    const appointmentDate = new Date(selectedDate)
                                    appointmentDate.setHours(10, 0) // Default time
                                    handleScheduleAppointment(form, selectedAgent.id, appointmentDate)
                                  }
                                }}
                                disabled={!selectedDate || !isDateAvailable(selectedDate)}
                              >
                                Schedule with {selectedAgent.name.split(" ")[1]}
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{forms.filter((f) => f.status === "pending").length}</div>
                  <div className="text-xs text-muted-foreground">Pending Forms</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{forms.filter((f) => f.status === "assigned").length}</div>
                  <div className="text-xs text-muted-foreground">Assigned</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{forms.filter((f) => f.status === "scheduled").length}</div>
                  <div className="text-xs text-muted-foreground">Scheduled</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{mockConsultingAgents.length}</div>
                  <div className="text-xs text-muted-foreground">Active Consultants</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
