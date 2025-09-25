"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Car, 
  AlertTriangle,
  Copy,
  Check
} from "lucide-react"

interface ExtractedInfo {
  amount?: string
  date?: string
  location?: string
  violationType?: string
  ticketNumber?: string
  vehicleInfo?: string
  dueDate?: string
  issueDate?: string
  authority?: string
}

interface OCRResultsDisplayProps {
  extractedText: string
  fileName: string
  onContinue?: (extractedInfo: ExtractedInfo) => void
}

export function OCRResultsDisplay({ 
  extractedText, 
  fileName, 
  onContinue 
}: OCRResultsDisplayProps) {
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [copied, setCopied] = useState(false)

  // Basic pattern matching for common document types
  const analyzeText = async () => {
    setIsAnalyzing(true)
    
    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const info: ExtractedInfo = {}
      
      // Extract monetary amounts
      const amountMatches = extractedText.match(/\$\d+\.?\d*/g) || 
                           extractedText.match(/\d+\.?\d*\s*(?:dollars?|USD|\$)/gi)
      if (amountMatches && amountMatches.length > 0) {
        info.amount = amountMatches[0]
      }
      
      // Extract dates
      const datePatterns = [
        /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
        /\b\d{1,2}-\d{1,2}-\d{2,4}\b/g,
        /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{2,4}\b/gi
      ]
      
      for (const pattern of datePatterns) {
        const dates = extractedText.match(pattern)
        if (dates && dates.length > 0) {
          if (!info.date) info.date = dates[0]
          if (dates.length > 1 && !info.dueDate) info.dueDate = dates[1]
        }
      }
      
      // Extract ticket/case numbers
      const ticketNumbers = extractedText.match(/(?:ticket|citation|case|ref)[\s#:]*([A-Z0-9]{6,})/gi)
      if (ticketNumbers && ticketNumbers.length > 0) {
        info.ticketNumber = ticketNumbers[0]
      }
      
      // Extract location information
      const locationKeywords = ['street', 'avenue', 'road', 'blvd', 'drive', 'lane', 'way']
      const lines = extractedText.split('\n')
      for (const line of lines) {
        for (const keyword of locationKeywords) {
          if (line.toLowerCase().includes(keyword)) {
            info.location = line.trim()
            break
          }
        }
        if (info.location) break
      }
      
      // Extract violation types
      const violationKeywords = [
        'parking', 'speeding', 'overtime', 'expired meter', 'no parking', 
        'handicap', 'fire hydrant', 'loading zone', 'residential permit'
      ]
      
      for (const keyword of violationKeywords) {
        if (extractedText.toLowerCase().includes(keyword)) {
          info.violationType = keyword.charAt(0).toUpperCase() + keyword.slice(1)
          break
        }
      }
      
      // Extract vehicle information
      const licenseMatch = extractedText.match(/(?:license|plate)[\s:]*([A-Z0-9]{3,8})/gi)
      if (licenseMatch) {
        info.vehicleInfo = licenseMatch[0]
      }
      
      // Extract issuing authority
      const authorityKeywords = ['city', 'county', 'police', 'department', 'authority', 'agency']
      for (const line of lines) {
        for (const keyword of authorityKeywords) {
          if (line.toLowerCase().includes(keyword) && line.length < 50) {
            info.authority = line.trim()
            break
          }
        }
        if (info.authority) break
      }
      
      setExtractedInfo(info)
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleContinue = () => {
    if (onContinue && extractedInfo) {
      onContinue(extractedInfo)
    }
  }

  return (
    <div className="space-y-6">
      {/* Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Analysis Results
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Extracted from: {fileName}
          </p>
        </CardHeader>
        <CardContent>
          {!extractedInfo ? (
            <div className="text-center py-8">
              <Button 
                onClick={analyzeText} 
                disabled={isAnalyzing}
                className="mb-4"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing Document...
                  </>
                ) : (
                  'Analyze Extracted Text'
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                Click to extract key information from the document
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {extractedInfo.amount && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fine Amount</p>
                    <p className="font-semibold">{extractedInfo.amount}</p>
                  </div>
                </div>
              )}
              
              {extractedInfo.date && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Issue Date</p>
                    <p className="font-semibold">{extractedInfo.date}</p>
                  </div>
                </div>
              )}
              
              {extractedInfo.location && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold text-xs">{extractedInfo.location}</p>
                  </div>
                </div>
              )}
              
              {extractedInfo.violationType && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Violation Type</p>
                    <p className="font-semibold">{extractedInfo.violationType}</p>
                  </div>
                </div>
              )}
              
              {extractedInfo.ticketNumber && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ticket Number</p>
                    <p className="font-semibold">{extractedInfo.ticketNumber}</p>
                  </div>
                </div>
              )}
              
              {extractedInfo.vehicleInfo && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Car className="h-4 w-4 text-indigo-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Vehicle Info</p>
                    <p className="font-semibold">{extractedInfo.vehicleInfo}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {extractedInfo && (
            <div className="mt-6 flex gap-3">
              <Button onClick={handleContinue} className="flex-1">
                Continue with Case
              </Button>
              <Button variant="outline" onClick={analyzeText}>
                Re-analyze
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Raw Text Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Raw Extracted Text</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="ml-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Text
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm font-mono p-4 bg-muted/50 rounded-lg">
              {extractedText}
            </pre>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {extractedText.length} characters
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {extractedText.split('\n').length} lines
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {extractedText.split(' ').filter(word => word.length > 0).length} words
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}