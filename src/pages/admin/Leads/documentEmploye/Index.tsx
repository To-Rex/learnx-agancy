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
import { FileText, Upload, Download, CheckCircle, User, Calendar, FileCheck, Archive } from "lucide-react"

interface DocumentTask {
  id: number
  documentId: number
  documentTitle: string
  clientName: string
  assignedBy: string
  taskType: "prepare" | "get_signature" | "scan" | "archive"
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_progress" | "completed"
  dueDate: string
  createdAt: string
  notes?: string
}

interface Document {
  id: number
  title: string
  type: string
  clientName: string
  status: "draft" | "ready_for_signature" | "signed" | "archived"
  filePath?: string
  uploadedAt?: string
}

export default function DocumentEmployeePage() {
  const [activeTab, setActiveTab] = useState("tasks")
  const [selectedTask, setSelectedTask] = useState<DocumentTask | null>(null)
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [taskNotes, setTaskNotes] = useState("")
  const [newStatus, setNewStatus] = useState("")

  // Sample data for current employee (Alice Brown)
  const currentEmployee = "Alice Brown"

  const [tasks, setTasks] = useState<DocumentTask[]>([
    {
      id: 1,
      documentId: 1,
      documentTitle: "Study Abroad Contract - Korea University",
      clientName: "John Smith",
      assignedBy: "Manager Smith",
      taskType: "prepare",
      title: "Prepare Korea University Contract",
      description:
        "Prepare contract documents for student enrollment in Korea University program. Include all necessary terms and conditions.",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-18",
      createdAt: "2024-01-16",
    },
    {
      id: 2,
      documentId: 4,
      documentTitle: "Visa Application Documents - Australia",
      clientName: "Emma Johnson",
      assignedBy: "Manager Smith",
      taskType: "get_signature",
      title: "Get Client Signature for Visa Documents",
      description:
        "Arrange meeting with client to sign visa application documents. Ensure all forms are properly filled.",
      priority: "urgent",
      status: "in_progress",
      dueDate: "2024-01-17",
      createdAt: "2024-01-15",
      notes: "Client scheduled for tomorrow at 2 PM",
    },
    {
      id: 3,
      documentId: 5,
      documentTitle: "Language Course Certificate - Malaysia",
      clientName: "David Wilson",
      assignedBy: "Manager Smith",
      taskType: "scan",
      title: "Scan and Process Certificate",
      description: "Scan the signed language course certificate and upload to system.",
      priority: "medium",
      status: "completed",
      dueDate: "2024-01-15",
      createdAt: "2024-01-14",
      notes: "Scanned and uploaded successfully. High quality PDF created.",
    },
    {
      id: 4,
      documentId: 6,
      documentTitle: "Professional Training Agreement - Dubai",
      clientName: "Sarah Ahmed",
      assignedBy: "Manager Smith",
      taskType: "archive",
      title: "Archive Training Agreement",
      description: "Archive the completed professional training agreement in the document management system.",
      priority: "low",
      status: "pending",
      dueDate: "2024-01-20",
      createdAt: "2024-01-16",
    },
  ])

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      title: "Study Abroad Contract - Korea University",
      type: "contract",
      clientName: "John Smith",
      status: "draft",
    },
    {
      id: 4,
      title: "Visa Application Documents - Australia",
      type: "visa",
      clientName: "Emma Johnson",
      status: "ready_for_signature",
    },
    {
      id: 5,
      title: "Language Course Certificate - Malaysia",
      type: "certificate",
      clientName: "David Wilson",
      status: "signed",
      filePath: "/documents/malaysia_cert_wilson.pdf",
      uploadedAt: "2024-01-15",
    },
    {
      id: 6,
      title: "Professional Training Agreement - Dubai",
      type: "agreement",
      clientName: "Sarah Ahmed",
      status: "signed",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
      case "ready_for_signature":
        return "bg-blue-100 text-blue-800"
      case "completed":
      case "signed":
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

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case "prepare":
        return FileText
      case "get_signature":
        return FileCheck
      case "scan":
        return Upload
      case "archive":
        return Archive
      default:
        return FileText
    }
  }

  const handleUpdateTaskStatus = (task: DocumentTask, status: string, notes: string) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: status as any, notes: notes } : t)))
    setIsUpdateStatusOpen(false)
    setTaskNotes("")
    setNewStatus("")
  }

  const handleUploadDocument = (documentId: number, fileName: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === documentId
          ? { ...d, filePath: `/documents/${fileName}`, uploadedAt: new Date().toISOString().split("T")[0] }
          : d,
      ),
    )
    setIsUploadOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Employee Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentEmployee}. Manage your assigned document tasks.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="completed">Completed Work</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Assigned Tasks</h2>
              <div className="flex gap-2">
                <Badge variant="outline">{tasks.filter((t) => t.status === "pending").length} pending</Badge>
                <Badge variant="outline">{tasks.filter((t) => t.status === "in_progress").length} in progress</Badge>
              </div>
            </div>

            <div className="grid gap-4">
              {tasks
                .filter((t) => t.status !== "completed")
                .map((task) => {
                  const TaskIcon = getTaskIcon(task.taskType)
                  return (
                    <Card key={task.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <TaskIcon className="w-5 h-5 mt-1 text-gray-500" />
                            <div>
                              <CardTitle className="text-lg">{task.title}</CardTitle>
                              <CardDescription>
                                {task.documentTitle} • Client: {task.clientName}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                            <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600">{task.description}</p>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              Assigned by: {task.assignedBy}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Due: {task.dueDate}
                            </div>
                            <span>Task Type: {task.taskType.replace("_", " ")}</span>
                          </div>

                          {task.notes && (
                            <div className="p-2 bg-blue-50 rounded text-sm">
                              <strong>Notes:</strong> {task.notes}
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            {task.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateTaskStatus(task, "in_progress", "Started working on task")}
                              >
                                Start Task
                              </Button>
                            )}

                            <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setSelectedTask(task)}>
                                  Update Status
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Task Status</DialogTitle>
                                  <DialogDescription>
                                    Update the status and add notes for: {selectedTask?.title}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="status">New Status</Label>
                                    <Select value={newStatus} onValueChange={setNewStatus}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select new status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                      id="notes"
                                      placeholder="Add notes about the task progress or completion"
                                      value={taskNotes}
                                      onChange={(e) => setTaskNotes(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsUpdateStatusOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      selectedTask && handleUpdateTaskStatus(selectedTask, newStatus, taskNotes)
                                    }
                                    disabled={!newStatus}
                                  >
                                    Update Status
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            {(task.taskType === "scan" || task.taskType === "archive") && (
                              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Upload className="w-4 h-4 mr-1" />
                                    Upload
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Upload Document</DialogTitle>
                                    <DialogDescription>
                                      Upload the processed document for: {task.documentTitle}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="file">Select File</Label>
                                      <Input id="file" type="file" accept=".pdf,.doc,.docx,.jpg,.png" />
                                    </div>
                                    <div>
                                      <Label htmlFor="uploadNotes">Upload Notes</Label>
                                      <Textarea id="uploadNotes" placeholder="Add notes about the uploaded document" />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleUploadDocument(
                                          task.documentId,
                                          `${task.clientName.replace(" ", "_")}_${task.documentId}.pdf`,
                                        )
                                      }
                                    >
                                      Upload Document
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Document Management</h2>
              <Badge variant="outline">{documents.length} total documents</Badge>
            </div>

            <div className="grid gap-4">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <CardDescription>
                          {doc.type} • Client: {doc.clientName}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(doc.status)}>{doc.status.replace("_", " ")}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {doc.uploadedAt && <span>Uploaded: {doc.uploadedAt}</span>}
                        {doc.filePath && <span className="ml-4">File: {doc.filePath.split("/").pop()}</span>}
                      </div>
                      <div className="flex gap-2">
                        {doc.filePath && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Upload className="w-4 h-4 mr-1" />
                          Upload New Version
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Completed Work</h2>
              <Badge variant="outline">{tasks.filter((t) => t.status === "completed").length} completed tasks</Badge>
            </div>

            <div className="grid gap-4">
              {tasks
                .filter((t) => t.status === "completed")
                .map((task) => {
                  const TaskIcon = getTaskIcon(task.taskType)
                  return (
                    <Card key={task.id} className="border-green-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <TaskIcon className="w-5 h-5 mt-1 text-green-600" />
                            <div>
                              <CardTitle className="text-lg">{task.title}</CardTitle>
                              <CardDescription>
                                {task.documentTitle} • Client: {task.clientName}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Completed on: {task.dueDate}</span>
                            <span>Task Type: {task.taskType.replace("_", " ")}</span>
                          </div>
                          {task.notes && (
                            <div className="p-2 bg-green-50 rounded text-sm">
                              <strong>Completion Notes:</strong> {task.notes}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {tasks.filter((t) => t.status === "completed").length}
                    </div>
                    <p className="text-sm text-gray-500">Tasks Completed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {tasks.filter((t) => t.status === "in_progress").length}
                    </div>
                    <p className="text-sm text-gray-500">In Progress</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {tasks.filter((t) => t.status === "pending").length}
                    </div>
                    <p className="text-sm text-gray-500">Pending Tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
