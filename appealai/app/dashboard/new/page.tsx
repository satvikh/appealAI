"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Camera, Paperclip } from "lucide-react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DocumentUploadOCR } from "@/components/document-upload-ocr"
import { OCRResultsDisplay } from "@/components/ocr-results-display" // Add this import

export default function NewCasePage() {
  const [extractedText, setExtractedText] = useState<string>('')
  const [uploadedFileName, setUploadedFileName] = useState<string>('')
  const [showResults, setShowResults] = useState(false)

  const handleTextExtracted = (extractedText: string, file: File) => {
    console.log('Text extracted from', file.name, ':', extractedText)
    setExtractedText(extractedText)
    setUploadedFileName(file.name)
  }

  const handleUploadComplete = (file: File, extractedText: string) => {
    console.log('Upload completed:', { fileName: file.name, textLength: extractedText.length })
    setShowResults(true)
  }

  const handleContinueWithCase = (extractedInfo: any) => {
    console.log('Continuing with extracted info:', extractedInfo)
    // Here you would typically navigate to the next step
    // For now, we'll just log the information
    alert('Case information extracted! Ready to proceed to next step.')
  }

  const resetUpload = () => {
    setExtractedText('')
    setUploadedFileName('')
    setShowResults(false)
  }

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
            {!showResults ? (
              <>
                {/* OCR Upload Component */}
                <div className="mb-8">
                  <DocumentUploadOCR
                    onTextExtracted={handleTextExtracted}
                    onUploadComplete={handleUploadComplete}
                    acceptedTypes={[
                      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
                      'image/bmp', 'image/webp', 'application/pdf'
                    ]}
                    maxSize={10}
                  />
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
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
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">What happens next?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• AI will automatically extract text from your uploaded document using OCR</li>
                    <li>• The system will analyze the extracted content and identify key information</li>
                    <li>• You'll answer a few questions to strengthen your case</li>
                    <li>• We'll generate a professional dispute letter based on the extracted data</li>
                    <li>• Review and submit directly to the issuing authority</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                {/* OCR Results Display */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif font-bold">Document Processing Complete</h2>
                    <Button variant="outline" onClick={resetUpload}>
                      Upload Another Document
                    </Button>
                  </div>
                  <OCRResultsDisplay
                    extractedText={extractedText}
                    fileName={uploadedFileName}
                    onContinue={handleContinueWithCase}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
