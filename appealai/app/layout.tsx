import type React from "react"
import type { Metadata } from "next"
import { Inter, Spectral } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-spectral",
})

export const metadata: Metadata = {
  title: "AI Dispute Assistant",
  description: "Contest unfair charges in minutes with AI-powered assistance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spectral.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
