// API client utilities for frontend components

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
  }

  // Document API methods
  async getDocuments(filters?: { status?: string; leadId?: number }) {
    const params = new URLSearchParams()
    if (filters?.status) params.append("status", filters.status)
    if (filters?.leadId) params.append("leadId", filters.leadId.toString())

    const response = await fetch(`${this.baseUrl}/documents?${params}`)
    if (!response.ok) throw new Error("Failed to fetch documents")
    return response.json()
  }

  async createDocument(data: {
    leadId: number
    documentType: string
    title: string
    createdBy: number
  }) {
    const response = await fetch(`${this.baseUrl}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create document")
    return response.json()
  }

  async updateDocument(
    id: number,
    data: {
      status?: string
      filePath?: string
      fileName?: string
    },
  ) {
    const response = await fetch(`${this.baseUrl}/documents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update document")
    return response.json()
  }

  // Document Task API methods
  async getDocumentTasks(filters?: {
    assignedTo?: string
    status?: string
    assignedBy?: number
  }) {
    const params = new URLSearchParams()
    if (filters?.assignedTo) params.append("assignedTo", filters.assignedTo)
    if (filters?.status) params.append("status", filters.status)
    if (filters?.assignedBy) params.append("assignedBy", filters.assignedBy.toString())

    const response = await fetch(`${this.baseUrl}/document-tasks?${params}`)
    if (!response.ok) throw new Error("Failed to fetch document tasks")
    return response.json()
  }

  async createDocumentTask(data: {
    documentId: number
    assignedBy: number
    assignedTo: string
    taskType: string
    title: string
    description: string
    priority?: string
    dueDate?: string
  }) {
    const response = await fetch(`${this.baseUrl}/document-tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create document task")
    return response.json()
  }

  async updateDocumentTask(
    id: number,
    data: {
      status?: string
      notes?: string
    },
  ) {
    const response = await fetch(`${this.baseUrl}/document-tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update document task")
    return response.json()
  }

  // Lead API methods
  async getLeadsReadyForDocuments() {
    const response = await fetch(`${this.baseUrl}/leads/ready-for-documents`)
    if (!response.ok) throw new Error("Failed to fetch leads")
    return response.json()
  }

  async updateLeadStatus(id: number, status: string) {
    const response = await fetch(`${this.baseUrl}/leads/ready-for-documents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) throw new Error("Failed to update lead status")
    return response.json()
  }

  // File upload method
  async uploadFile(file: File, documentId: string, uploadType: string) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("documentId", documentId)
    formData.append("uploadType", uploadType)

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: "POST",
      body: formData,
    })
    if (!response.ok) throw new Error("Failed to upload file")
    return response.json()
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// React hooks for API integration
export function useDocuments(filters?: { status?: string; leadId?: number }) {
  // In a real app, you would use SWR or React Query here
  // return useSWR(['documents', filters], () => apiClient.getDocuments(filters))

  // Mock implementation for demonstration
  return {
    data: null,
    error: null,
    isLoading: false,
    mutate: () => {},
  }
}

export function useDocumentTasks(filters?: {
  assignedTo?: string
  status?: string
  assignedBy?: number
}) {
  // In a real app, you would use SWR or React Query here
  // return useSWR(['document-tasks', filters], () => apiClient.getDocumentTasks(filters))

  // Mock implementation for demonstration
  return {
    data: null,
    error: null,
    isLoading: false,
    mutate: () => {},
  }
}
