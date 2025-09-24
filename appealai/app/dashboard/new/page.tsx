import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Camera, Paperclip } from "lucide-react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function NewCasePage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-serif font-bold">Start New Case</h1>
              <p className="text-muted-foreground">Upload your ticket or notice to begin</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto">
            {/* Upload Area */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-serif">Upload Document</CardTitle>
                <p className="text-muted-foreground">
                  Upload your parking ticket, housing notice, or any document you'd like to dispute
                </p>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Drop files here or click to upload</h3>
                  <p className="text-sm text-muted-foreground mb-4">Supports PDF, JPG, PNG files up to 10MB</p>
                  <Button>
                    <Paperclip className="mr-2 h-4 w-4" />
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Camera className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold">Take Photo</h3>
                      <p className="text-sm text-muted-foreground">Use your camera to capture the document</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold">Manual Entry</h3>
                      <p className="text-sm text-muted-foreground">Enter case details manually</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AI will analyze your document and extract key information</li>
                <li>• You'll answer a few questions to strengthen your case</li>
                <li>• We'll generate a professional dispute letter</li>
                <li>• Review and submit directly to the issuing authority</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
