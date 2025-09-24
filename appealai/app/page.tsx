import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, MessageCircle, FileText, Send, Shield, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-serif font-semibold">AI Dispute Assistant</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-balance leading-tight">
                Dispute unfair charges in minutes
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Contest parking tickets and housing charges with AI-powered assistance. Professional dispute letters
                generated instantly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Ticket/Notice
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-transparent">
                Watch Demo
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <Shield className="inline h-4 w-4 mr-2" />
                Not legal advice. Demo only. Always consult with a qualified attorney for legal matters.
              </p>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative">
            <Card className="p-8 bg-card/50 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <div className="h-2 bg-primary/30 rounded w-full mb-2"></div>
                    <div className="h-2 bg-primary/30 rounded w-2/3"></div>
                  </div>

                  <div className="bg-secondary/10 rounded-lg p-3">
                    <div className="h-2 bg-secondary/30 rounded w-4/5 mb-2"></div>
                    <div className="h-2 bg-secondary/30 rounded w-3/5"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">AI Assistant</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-primary rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-primary rounded-full typing-dot"></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section id="how-it-works" className="bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Simple 4-step process</h2>
            <p className="text-xl text-muted-foreground">From upload to submission in minutes</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Upload,
                title: "Upload",
                description: "Upload your ticket or notice",
                step: "01",
              },
              {
                icon: MessageCircle,
                title: "Chat",
                description: "Answer AI questions about your case",
                step: "02",
              },
              {
                icon: FileText,
                title: "Generate",
                description: "AI creates professional dispute letter",
                step: "03",
              },
              {
                icon: Send,
                title: "Submit",
                description: "Send directly to the issuing authority",
                step: "04",
              },
            ].map((item, index) => (
              <Card key={index} className="p-6 text-center relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Why choose AI Dispute Assistant?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Save Time",
                description: "Generate professional dispute letters in minutes, not hours",
              },
              {
                icon: Shield,
                title: "Expert Knowledge",
                description: "AI trained on successful dispute cases and legal precedents",
              },
              {
                icon: CheckCircle,
                title: "Higher Success Rate",
                description: "Structured approach increases your chances of a successful dispute",
              },
            ].map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Ready to dispute that unfair charge?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands who have successfully contested their tickets
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6">
              <Upload className="mr-2 h-5 w-5" />
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-serif font-semibold">AI Dispute Assistant</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
