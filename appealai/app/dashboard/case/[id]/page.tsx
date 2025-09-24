"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Car,
  Building,
  DollarSign,
  Calendar,
  MapPin,
  FileText,
  MessageCircle,
  Camera,
  RefreshCw,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Lightbulb,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { SubmissionModal } from "@/components/submission-modal"

// Mock case data
const mockCase = {
  id: "CASE-001",
  type: "parking",
  title: "Parking Violation - Zone 4",
  amount: 75,
  status: "draft",
  createdAt: "2024-01-15",
  location: "Main St & 5th Ave",
  description: "Vehicle parked in restricted zone during prohibited hours",
  ticketNumber: "PV-2024-001234",
  issueDate: "2024-01-10",
  dueDate: "2024-02-10",
  issuingAuthority: "City Parking Authority",
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "submitted":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "draft":
      return <Clock className="h-4 w-4" />
    case "submitted":
      return <AlertCircle className="h-4 w-4" />
    case "resolved":
      return <CheckCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "parking":
      return <Car className="h-6 w-6 text-primary" />
    case "housing":
      return <Building className="h-6 w-6 text-primary" />
    default:
      return <FileText className="h-6 w-6 text-primary" />
  }
}

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false)

  const handleSubmitCase = () => {
    setIsSubmissionModalOpen(true)
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Header Card */}
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="p-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {getTypeIcon(mockCase.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-xl font-serif font-bold">{mockCase.title}</h1>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(mockCase.status)} flex items-center gap-1 capitalize`}
                        >
                          {getStatusIcon(mockCase.status)}
                          {mockCase.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {mockCase.id} • {mockCase.ticketNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-2xl font-bold">
                        <DollarSign className="h-6 w-6" />
                        {mockCase.amount}
                      </div>
                      <p className="text-sm text-muted-foreground">Fine Amount</p>
                    </div>

                    <div className="flex gap-2">
                      <Link href="/dashboard">
                        <Button variant="outline" size="sm">
                          Back to Dashboard
                        </Button>
                      </Link>
                      {mockCase.status === "draft" && (
                        <Button size="sm" onClick={handleSubmitCase}>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Case
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Case Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Issue Date:</span>
                    <span className="font-medium">{new Date(mockCase.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{mockCase.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-medium">{new Date(mockCase.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabbed Content */}
        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="letter" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="letter" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Letter
              </TabsTrigger>
              <TabsTrigger value="evidence" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Evidence
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat
              </TabsTrigger>
            </TabsList>

            {/* Letter Tab */}
            <TabsContent value="letter" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-serif">Dispute Letter</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground">AI-generated dispute letter based on your case details</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="min-h-[400px] font-mono text-sm"
                    defaultValue={`[Date]

City Parking Authority
Parking Violations Bureau
[Address]

Re: Formal Dispute - Ticket Number: PV-2024-001234
Vehicle License: [License Number]
Date of Violation: January 10, 2024

Dear Hearing Officer,

I am writing to formally dispute the parking violation cited above. After careful review of the circumstances surrounding this citation, I believe it was issued in error for the following reasons:

1. IMPROPER SIGNAGE: The parking restriction signs in the area were not clearly visible or were obscured at the time of parking. According to municipal code Section 12.3.4, parking restrictions must be clearly posted and visible to drivers.

2. TIMING DISCREPANCY: The citation indicates a violation during prohibited hours, however, I have evidence that the vehicle was legally parked during permitted hours. The time stamp on the citation appears to be inaccurate.

3. ZONE CLASSIFICATION: The cited location may have been incorrectly classified as a restricted zone. Recent changes to parking regulations may not have been properly updated in the enforcement system.

I respectfully request that this citation be dismissed based on the above grounds. I am prepared to provide additional documentation if required and would appreciate the opportunity for a hearing if necessary.

Thank you for your time and consideration of this matter.

Sincerely,
[Your Name]
[Contact Information]

Attachments:
- Photographs of parking location
- Time-stamped evidence
- Relevant municipal code references`}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evidence Tab */}
            <TabsContent value="evidence" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Uploaded Evidence */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Uploaded Evidence</CardTitle>
                    <p className="text-muted-foreground">Photos and documents supporting your case</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Mock evidence thumbnails */}
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                        >
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <Button variant="outline" className="w-full bg-transparent">
                        <Upload className="mr-2 h-4 w-4" />
                        Add More Evidence
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      AI Suggestions
                    </CardTitle>
                    <p className="text-muted-foreground">Strengthen your case with these recommendations</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Street View Photo",
                          description: "Take a photo showing the parking signs from your vehicle's perspective",
                          priority: "high",
                        },
                        {
                          title: "Time-stamped Receipt",
                          description: "Include any receipts or timestamps from nearby businesses",
                          priority: "medium",
                        },
                        {
                          title: "Weather Conditions",
                          description: "Document weather conditions that may have obscured signage",
                          priority: "low",
                        },
                      ].map((suggestion, index) => (
                        <div key={index} className="slide-up p-4 border border-border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                            <Badge
                              variant="outline"
                              className={
                                suggestion.priority === "high"
                                  ? "border-red-200 text-red-800"
                                  : suggestion.priority === "medium"
                                    ? "border-amber-200 text-amber-800"
                                    : "border-gray-200 text-gray-800"
                              }
                            >
                              {suggestion.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-serif font-semibold mb-2">AI Assistant</h2>
                  <p className="text-muted-foreground">
                    Ask questions to strengthen your dispute case. The AI will guide you through important details.
                  </p>
                </div>
                <ChatInterface />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Submission Modal */}
      <SubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        caseData={mockCase}
      />
    </div>
  )
}
