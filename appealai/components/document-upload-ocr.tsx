"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Camera, Paperclip, Loader2, Check, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Tesseract from 'tesseract.js'

interface DocumentUploadOCRProps {
  onTextExtracted?: (extractedText: string, file: File) => void
  onUploadComplete?: (file: File, extractedText: string) => void
  acceptedTypes?: string[]
  maxSize?: number // in MB
}

interface OCRProgress {
  status: string
  progress: number
}

export function DocumentUploadOCR({
  onTextExtracted,
  onUploadComplete,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'application/pdf'],
  maxSize = 10
}: DocumentUploadOCRProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrProgress, setOcrProgress] = useState<OCRProgress>({ status: '', progress: 0 })
  const [extractedText, setExtractedText] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please upload: ${acceptedTypes.join(', ')}`
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `File size too large. Maximum size is ${maxSize}MB`
    }
    
    return null
  }

  const processOCR = useCallback(async (file: File) => {
    setIsProcessing(true)
    setError('')
    setOcrProgress({ status: 'Initializing OCR...', progress: 0 })

    try {
      // Create image URL for preview and processing
      const imageUrl = URL.createObjectURL(file)
      
      const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress({
              status: `Recognizing text... ${Math.round(m.progress * 100)}%`,
              progress: m.progress * 100
            })
          } else {
            setOcrProgress({
              status: m.status || 'Processing...',
              progress: (m.progress || 0) * 100
            })
          }
        }
      })

      // Clean up the blob URL
      URL.revokeObjectURL(imageUrl)
      
      const cleanedText = text.trim()
      setExtractedText(cleanedText)
      
      // Call callbacks
      onTextExtracted?.(cleanedText, file)
      onUploadComplete?.(file, cleanedText)
      
      setOcrProgress({ status: 'Text extraction completed!', progress: 100 })
      
    } catch (err) {
      console.error('OCR Error:', err)
      setError('Failed to extract text from the document. Please try again.')
      setOcrProgress({ status: 'Error occurred', progress: 0 })
    } finally {
      setIsProcessing(false)
    }
  }, [onTextExtracted, onUploadComplete])

  const handleFileSelect = useCallback(async (files: FileList) => {
    const file = files[0]
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setUploadedFile(file)
    setError('')
    setExtractedText('')
    
    // For PDF files, show a message that OCR works best with images
    if (file.type === 'application/pdf') {
      setError('Note: OCR works best with image files. For PDFs, consider converting to image first.')
      return
    }
    
    await processOCR(file)
  }, [processOCR])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files)
    }
  }, [handleFileSelect])

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const resetUpload = () => {
    setUploadedFile(null)
    setExtractedText('')
    setError('')
    setIsProcessing(false)
    setOcrProgress({ status: '', progress: 0 })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-serif flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Document for OCR Analysis
        </CardTitle>
        <p className="text-muted-foreground">
          Upload your document and we'll extract the text automatically using OCR technology
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : isProcessing
              ? 'border-muted bg-muted/20'
              : 'border-border hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={!isProcessing ? triggerFileSelect : undefined}
        >
          {isProcessing ? (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
              <div>
                <p className="font-semibold">{ocrProgress.status}</p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${ocrProgress.progress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round(ocrProgress.progress)}% complete
                </p>
              </div>
            </div>
          ) : uploadedFile && extractedText ? (
            <div className="space-y-4">
              <Check className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <h3 className="font-semibold text-green-700">Text Extracted Successfully!</h3>
                <p className="text-sm text-muted-foreground">
                  Found {extractedText.length} characters from {uploadedFile.name}
                </p>
                <div className="flex gap-2 justify-center mt-4">
                  <Button onClick={triggerFileSelect} variant="outline" size="sm">
                    Upload Another
                  </Button>
                  <Button onClick={resetUpload} variant="outline" size="sm">
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-semibold mb-2">Drop files here or click to upload</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports images (JPG, PNG, etc.) and PDF files up to {maxSize}MB
                </p>
                <Button>
                  <Paperclip className="mr-2 h-4 w-4" />
                  Choose Files
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* File Info */}
        {uploadedFile && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{uploadedFile.name}</span>
              <Badge variant="secondary" className="text-xs">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </Badge>
            </div>
          </div>
        )}

        {/* Extracted Text Preview */}
        {extractedText && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Extracted Text Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-32 overflow-y-auto p-3 bg-muted/50 rounded-md">
                <p className="text-sm whitespace-pre-wrap font-mono">
                  {extractedText.substring(0, 500)}
                  {extractedText.length > 500 && '...'}
                </p>
              </div>
              {extractedText.length > 500 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Showing first 500 characters of {extractedText.length} total characters
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* OCR Info */}
        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-md">
          <p className="font-medium mb-1">OCR Tips for best results:</p>
          <ul className="space-y-1">
            <li>• Use high-contrast, well-lit images</li>
            <li>• Ensure text is clearly readable and not skewed</li>
            <li>• Avoid blurry or low-resolution images</li>
            <li>• For PDFs, image-based files work better than text-based ones</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}