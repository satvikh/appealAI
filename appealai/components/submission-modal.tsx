"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Send, FileText, Calendar, MapPin, DollarSign, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  caseData: {
    id: string
    title: string
    amount: number
    type: string
    location: string
    dueDate: string
  }
}

export function SubmissionModal({ isOpen, onClose, caseData }: SubmissionModalProps) {
  const [step, setStep] = useState<"review" | "submitting" | "success">("review")
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (step === "success") {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [step])

  const handleSubmit = () => {
    setStep("submitting")
    // Simulate submission process
    setTimeout(() => {
      setStep("success")
    }, 2000)
  }

  const handleClose = () => {
    setStep("review")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-60">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-2 h-2 confetti",
                i % 4 === 0 && "bg-green-500",
                i % 4 === 1 && "bg-blue-500",
                i % 4 === 2 && "bg-yellow-500",
                i % 4 === 3 && "bg-purple-500",
              )}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        {step === "review" && (
          <>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-xl">Review & Submit Case</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground">
                Please review your case details before submitting to the issuing authority.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Case Summary */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-serif font-semibold mb-3">Case Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Case:</span>
                    <span className="font-medium">{caseData.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">${caseData.amount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{caseData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-medium">{new Date(caseData.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Submission Details */}
              <div className="space-y-4">
                <h3 className="font-serif font-semibold">What happens next?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Immediate Submission</p>
                      <p className="text-sm text-muted-foreground">
                        Your dispute letter will be sent directly to the City Parking Authority
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Processing Period</p>
                      <p className="text-sm text-muted-foreground">
                        The authority typically responds within 14-30 business days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Notification</p>
                      <p className="text-sm text-muted-foreground">
                        We'll notify you immediately when there's an update on your case
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">Important Notice</h4>
                <p className="text-sm text-amber-700">
                  By submitting this dispute, you acknowledge that this service provides assistance with document
                  preparation only and does not constitute legal advice. Always consult with a qualified attorney for
                  legal matters.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Dispute
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === "submitting" && (
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Send className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-semibold mb-2">Submitting Your Case</h2>
                <p className="text-muted-foreground">
                  Please wait while we send your dispute letter to the issuing authority...
                </p>
              </div>
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-primary rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-primary rounded-full typing-dot"></div>
                </div>
              </div>
            </div>
          </CardContent>
        )}

        {step === "success" && (
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              {/* Large Green Checkmark */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>

              <div>
                <h2 className="text-2xl font-serif font-bold text-green-800 mb-2">Case Submitted Successfully!</h2>
                <p className="text-muted-foreground mb-4">
                  Your dispute has been sent to the City Parking Authority. We'll notify you when there's an update.
                </p>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Case ID: {caseData.id}
                </Badge>
              </div>

              {/* Success Details */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-left">
                <h4 className="font-semibold text-green-800 mb-2">What's Next?</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Your case status has been updated to "Submitted"</li>
                  <li>• You'll receive email notifications for any updates</li>
                  <li>• Expected response time: 14-30 business days</li>
                  <li>• You can track progress in your dashboard</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  View Dashboard
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Start New Case
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
