import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, FileText, Clock, CheckCircle, Plus, Home, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Active Cases",
    href: "/dashboard",
    icon: Clock,
    count: 2,
    active: true,
  },
  {
    title: "Past Cases",
    href: "/dashboard/past",
    icon: CheckCircle,
    count: 5,
  },
  {
    title: "All Cases",
    href: "/dashboard/all",
    icon: FileText,
    count: 7,
  },
]

const bottomItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
]

export function DashboardSidebar() {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-sidebar-primary" />
          <span className="text-lg font-serif font-semibold text-sidebar-foreground">AI Dispute Assistant</span>
        </Link>
      </div>

      {/* New Case Button */}
      <div className="p-4">
        <Link href="/dashboard/new">
          <Button className="w-full gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Start New Case
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </div>
                {item.count && (
                  <Badge variant="secondary" className="h-5 text-xs">
                    {item.count}
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="space-y-1">
          {bottomItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                <item.icon className="h-4 w-4" />
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
