"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState } from "react"
import {
  Menu,
  X,
  Building2,
  Users,
  Bot
} from "lucide-react"

const allMenuItems = [
  { href: "/dashboard/company", icon: Building2, label: "Company Analytics", hideForIndividual: true },
  { href: "/dashboard/addins-analytics", icon: Users, label: "Add-ins Analytics", hideForIndividual: false },
  { href: "/dashboard/bot-analytics", icon: Bot, label: "Teams Analytics", hideForIndividual: false },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const role = session?.user?.role

  const menuItems = allMenuItems.filter(
    (item) => !(item.hideForIndividual && role === 'individual')
  )

  return (
    <>
      {/* Mobile Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-card text-foreground hover:bg-sidebar-accent hover:text-primary transition-colors shadow-lg border border-border"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          w-64 bg-sidebar border-r border-sidebar-border
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-start h-16 px-6 border-b border-sidebar-border">
            <Image
              src="/Logo.png"
              alt="Be-Inc Logo"
              width={120}
              height={42}
              priority
              className="object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center px-4 py-3 rounded-lg transition-colors
                        ${
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <p className="text-xs text-muted-foreground text-center">
              © 2025 Be-inc
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
