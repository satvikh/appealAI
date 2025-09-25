"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, CheckCircle, AlertCircle, Copy, Eye, EyeOff } from "lucide-react"

interface OCRResultsDisplayProps {
  extractedText: string
  fileName: string
  onContinue: (extractedInfo: any) => void
}

export function OCRResultsDisplay({ extractedText, fileName, onContinue }: OCRResultsDisplayProps) {
  const [showFullText, setShowFullText] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const extractedInfo = {
    fileName,
    textLength: extractedText.length,
    wordCount: extractedText.split(/\s+/).length,
    hasContent: extractedText.trim().length > 0
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">OCR Processing Complete</CardTitle>
              <p className="text-sm text-muted-foreground">Text successfully extracted from {fileName}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{extractedInfo.textLength}</div>
              <div className="text-xs text-muted-foreground">Characters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{extractedInfo.wordCount}</div>
              <div className="text-xs text-muted-foreground">Words</div>
            </div>
            <div className="text-center">
              <Badge variant={extractedInfo.hasContent ? "default" : "destructive"}>
                {extractedInfo.hasContent ? "Success" : "No Text"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extracted Text Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Extracted Text
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFullText(!showFullText)}
              >
                {showFullText ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showFullText ? "Hide" : "Show Full Text"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {extractedInfo.hasContent ? (
            <div className="bg-muted/50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {showFullText 
                  ? extractedText 
                  : extractedText.substring(0, 500) + (extractedText.length > 500 ? "..." : "")
                }
              </pre>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No text could be extracted from this document.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please try uploading a clearer image or a different document format.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Continue Button */}
      {extractedInfo.hasContent && (
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={() => onContinue(extractedInfo)}
            className="px-8"
          >
            Continue with Case Creation
          </Button>
        </div>
      )}
    </div>
  )
}