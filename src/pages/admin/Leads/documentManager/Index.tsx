import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog"
import { FileText, Plus, Clock, CheckCircle, AlertCircle, User, Download, Upload } from "lucide-react"

interface Lead {
  id: number
  clientName: string
  studyType: string
  country: string
  services: string[]
  meetingDate: string
  status: "ready_for_documents" | "documents_prepared" | "signed" | "archived"
  consultingAgent: string
}

interface Document {
  id: number
  leadId: number
  type: string
  title: string
  status: "draft" | "ready_for_signature" | "signed" | "archived"
  createdAt: string
  filePath?: string
}

interface DocumentTask {
  id: number
  documentId: number
  assignedTo: string
  taskType: "prepare" | "get_signature" | "scan" | "archive"
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_progress" | "completed"
  dueDate: string
  notes?: string
}

export default function DocumentManagerPage() {
  const [activeTab, setActiveTab] = useState("leads")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isCreateDocumentOpen, setIsCreateDocumentOpen] = useState(false)
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false)

  // Sample data
  const [leads] = useState<Lead[]>([
    {
      id: 1,
      clientName: "John Smith",
      studyType: "Master's Degree",
      country: "Korea",
      services: ["University Application", "Visa Support"],
      meetingDate: "2024-01-15",
      status: "ready_for_documents",
      consultingAgent: "Sarah Kim",
    },
    {
      id: 2,
      clientName: "Emma Johnson",
      studyType: "Bachelor's Degree",
      country: "Australia",
      services: ["University Application", "Accommodation"],
      meetingDate: "2024-01-14",
      status: "documents_prepared",
      consultingAgent: "Mike Chen",
    },
    {
      id: 3,
      clientName: "David Wilson",
      studyType: "Language Course",
      country: "Malaysia",
      services: ["Course Enrollment"],
      meetingDate: "2024-01-13",
      status: "signed",
      consultingAgent: "Lisa Wang",
    },
  ])

  const [documents] = useState<Document[]>([
    {
      id: 1,
      leadId: 1,
      type: "contract",
      title: "Study Abroad Contract - Korea University",
      status: "draft",
      createdAt: "2024-01-16",
    },
    {
      id: 2,
      leadId: 2,
      type: "agreement",
      title: "Service Agreement - Australia Program",
      status: "ready_for_signature",
      createdAt: "2024-01-15",
    },
    {
      id: 3,
      leadId: 3,
      type: "certificate",
      title: "Enrollment Certificate - Malaysia",
      status: "signed",
      createdAt: "2024-01-14",
    },
  ])

  const [tasks] = useState<DocumentTask[]>([
    {
      id: 1,
      documentId: 1,
      assignedTo: "Alice Brown",
      taskType: "prepare",
      title: "Prepare Korea University Contract",
      description: "Prepare contract documents for student enrollment",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-18",
    },
    {
      id: 2,
      documentId: 2,
      assignedTo: "Bob Davis",
      taskType: "get_signature",
      title: "Get Client Signature for Australia Program",
      description: "Arrange meeting with client to sign agreement",
      priority: "urgent",
      status: "in_progress",
      dueDate: "2024-01-17",
    },
    {
      id: 3,
      documentId: 3,
      assignedTo: "Carol White",
      taskType: "archive",
      title: "Archive Malaysia Certificate",
      description: "Scan and archive completed certificate",
      priority: "low",
      status: "completed",
      dueDate: "2024-01-15",
    },
  ])

  const employees = ["Alice Brown", "Bob Davis", "Carol White", "David Green"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready_for_documents":
      case "draft":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "documents_prepared":
      case "ready_for_signature":
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "signed":
      case "completed":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Manager Dashboard</h1>
          <p className="text-gray-600">Manage contracts, documents, and employee tasks</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100/60">
            <TabsTrigger value="leads">Ready Leads</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Leads Ready for Documents</h2>
              <Badge variant="outline">{leads.filter((l) => l.status === "ready_for_documents").length} pending</Badge>
            </div>

            <div className="grid gap-4">
              {leads.map((lead) => (
                <Card key={lead.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{lead.clientName}</CardTitle>
                        <CardDescription>
                          {lead.studyType} • {lead.country} • Meeting: {lead.meetingDate}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(lead.status)}>{lead.status.replace("_", " ")}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <User className="w-4 h-4 inline mr-1" />
                          Consulting Agent: {lead.consultingAgent}
                        </p>
                        <p className="text-sm text-gray-600">Services: {lead.services.join(", ")}</p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog open={isCreateDocumentOpen} onOpenChange={setIsCreateDocumentOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setSelectedLead(lead)}
                              disabled={lead.status !== "ready_for_documents"}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Create Document
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create Document for {selectedLead?.clientName}</DialogTitle>
                              <DialogDescription>
                                Prepare contract and necessary documents for this lead.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="docType">Document Type</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select document type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="contract">Study Contract</SelectItem>
                                    <SelectItem value="agreement">Service Agreement</SelectItem>
                                    <SelectItem value="certificate">Enrollment Certificate</SelectItem>
                                    <SelectItem value="visa">Visa Documents</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="docTitle">Document Title</Label>
                                <Input id="docTitle" placeholder="Enter document title" />
                              </div>
                              <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea id="notes" placeholder="Additional notes or requirements" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsCreateDocumentOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={() => setIsCreateDocumentOpen(false)}>Create Document</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Document Management</h2>
              <div className="flex gap-2">
                <Badge variant="outline">{documents.filter((d) => d.status === "draft").length} drafts</Badge>
                <Badge variant="outline">
                  {documents.filter((d) => d.status === "ready_for_signature").length} ready
                </Badge>
              </div>
            </div>

            <div className="grid gap-4">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <CardDescription>
                          {doc.type} • Created: {doc.createdAt}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(doc.status)}>{doc.status.replace("_", " ")}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Lead ID: {doc.leadId} • Client: {leads.find((l) => l.id === doc.leadId)?.clientName}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Upload className="w-4 h-4 mr-1" />
                          Upload
                        </Button>
                        <Dialog open={isAssignTaskOpen} onOpenChange={setIsAssignTaskOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Plus className="w-4 h-4 mr-1" />
                              Assign Task
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Task</DialogTitle>
                              <DialogDescription>Assign a document task to an employee.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="employee">Assign to Employee</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select employee" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {employees.map((emp) => (
                                      <SelectItem key={emp} value={emp}>
                                        {emp}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="taskType">Task Type</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select task type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="prepare">Prepare Documents</SelectItem>
                                    <SelectItem value="get_signature">Get Signature</SelectItem>
                                    <SelectItem value="scan">Scan Documents</SelectItem>
                                    <SelectItem value="archive">Archive Documents</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="priority">Priority</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="taskTitle">Task Title</Label>
                                <Input id="taskTitle" placeholder="Enter task title" />
                              </div>
                              <div>
                                <Label htmlFor="taskDesc">Description</Label>
                                <Textarea id="taskDesc" placeholder="Task description and requirements" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsAssignTaskOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={() => setIsAssignTaskOpen(false)}>Assign Task</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Task Monitoring</h2>
              <div className="flex gap-2">
                <Badge variant="outline">{tasks.filter((t) => t.status === "pending").length} pending</Badge>
                <Badge variant="outline">{tasks.filter((t) => t.status === "in_progress").length} in progress</Badge>
                <Badge variant="outline">{tasks.filter((t) => t.status === "completed").length} completed</Badge>
              </div>
            </div>

            <div className="grid gap-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <CardDescription>
                          Assigned to: {task.assignedTo} • Due: {task.dueDate}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Task Type: {task.taskType.replace("_", " ")}</span>
                        <span>Document ID: {task.documentId}</span>
                        {task.status === "pending" && (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Clock className="w-4 h-4" />
                            Waiting
                          </div>
                        )}
                        {task.status === "in_progress" && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <AlertCircle className="w-4 h-4" />
                            In Progress
                          </div>
                        )}
                        {task.status === "completed" && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </div>
                        )}
                      </div>
                      {task.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>Notes:</strong> {task.notes}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <h2 className="text-xl font-semibold">Document Process Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ready Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {leads.filter((l) => l.status === "ready_for_documents").length}
                  </div>
                  <p className="text-xs text-gray-500">Awaiting documents</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {documents.filter((d) => d.status === "draft" || d.status === "ready_for_signature").length}
                  </div>
                  <p className="text-xs text-gray-500">In preparation</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {tasks.filter((t) => t.status === "pending" || t.status === "in_progress").length}
                  </div>
                  <p className="text-xs text-gray-500">Assigned to employees</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {documents.filter((d) => d.status === "signed" || d.status === "archived").length}
                  </div>
                  <p className="text-xs text-gray-500">Signed & archived</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Workload</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {employees.map((emp) => {
                      const empTasks = tasks.filter((t) => t.assignedTo === emp)
                      const pendingTasks = empTasks.filter(
                        (t) => t.status === "pending" || t.status === "in_progress",
                      ).length
                      return (
                        <div key={emp} className="flex justify-between items-center">
                          <span className="font-medium">{emp}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{pendingTasks} active</Badge>
                            <Badge variant="secondary">{empTasks.length} total</Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Malaysia Certificate archived by Carol White</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-500" />
                      <span>Australia Agreement signature in progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span>Korea Contract preparation assigned to Alice Brown</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>New lead from John Smith ready for documents</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
