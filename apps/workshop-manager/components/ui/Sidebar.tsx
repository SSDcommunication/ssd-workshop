'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  icon?: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Ateliers', href: '/workshops', icon: '📅' },
  { label: 'Inscrits', href: '/attendees', icon: '👥' },
  { label: 'Tâches', href: '/tasks', icon: '✅' },
  { label: 'Programme', href: '/workshop-program', icon: '🕐' },
  { label: 'Réseaux sociaux', href: '/social-media', icon: '📱' },
  { label: 'Emails', href: '/email-campaigns', icon: '✉️' },
  { label: 'Budget', href: '/budget', icon: '💰' },
  { label: 'Témoignages', href: '/testimonials', icon: '🎤' },
  { label: 'Prospection', href: '/outreach', icon: '🤝' },
  { label: 'Landing page', href: '/landing-page', icon: '🌐' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-[#4dd1e3]">Workshop Manager</h1>
        <p className="text-xs text-gray-600 mt-1">SSD Communication</p>
      </div>

      <nav className="px-3 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#4dd1e3]/10 text-[#4dd1e3] font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-200">
        <Link href="/settings" className="text-sm text-gray-600 hover:text-gray-900">
          ⚙️ Paramètres
        </Link>
      </div>
    </aside>
  )
}
