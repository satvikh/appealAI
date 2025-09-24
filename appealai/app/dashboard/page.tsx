import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Car, Building, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

// Mock data for demonstration
const mockCases = [
  {
    id: "CASE-001",
    type: "parking",
    title: "Parking Violation - Zone 4",
    amount: 75,
    status: "draft",
    createdAt: "2024-01-15",
    location: "Main St & 5th Ave",
  },
  {
    id: "CASE-002",
    type: "housing",
    title: "Late Fee Charge",
    amount: 150,
    status: "submitted",
    createdAt: "2024-01-10",
    location: "Apartment Complex",
  },
  {
    id: "CASE-003",
    type: "parking",
    title: "Meter Violation",
    amount: 45,
    status: "resolved",
    createdAt: "2024-01-05",
    location: "Downtown District",
  },
  {
    id: "CASE-004",
    type: "housing",
    title: "Maintenance Fee Dispute",
    amount: 200,
    status: "draft",
    createdAt: "2024-01-12",
    location: "Residential Building",
  },
]

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
      return <Clock className="h-3 w-3" />
    case "submitted":
      return <AlertCircle className="h-3 w-3" />
    case "resolved":
      return <CheckCircle className="h-3 w-3" />
    default:
      return <Clock className="h-3 w-3" />
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "parking":
      return <Car className="h-5 w-5 text-primary" />
    case "housing":
      return <Building className="h-5 w-5 text-primary" />
    default:
      return <FileText className="h-5 w-5 text-primary" />
  }
}

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-serif font-bold">Active Cases</h1>
              <p className="text-muted-foreground">Manage your dispute cases</p>
            </div>
            <Link href="/dashboard/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Start New Case
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {mockCases.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-serif font-semibold mb-2">No cases yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Upload your first ticket or notice to get started with disputing unfair charges.
              </p>
              <Link href="/dashboard/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Start Your First Case
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCases.map((case_) => (
                <Link key={case_.id} href={`/dashboard/case/${case_.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            {getTypeIcon(case_.type)}
                          </div>
                          <div>
                            <CardTitle className="text-base font-serif group-hover:text-primary transition-colors">
                              {case_.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{case_.id}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(case_.status)} flex items-center gap-1 capitalize`}
                        >
                          {getStatusIcon(case_.status)}
                          {case_.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Fine Amount</span>
                          <div className="flex items-center gap-1 font-semibold">
                            <DollarSign className="h-4 w-4" />
                            {case_.amount}
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <p className="truncate">{case_.location}</p>
                          <p className="mt-1">Created {new Date(case_.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="pt-2 border-t border-border">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Next step:</span>
                            <span className="font-medium">
                              {case_.status === "draft" && "Complete dispute letter"}
                              {case_.status === "submitted" && "Awaiting response"}
                              {case_.status === "resolved" && "Case closed"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
