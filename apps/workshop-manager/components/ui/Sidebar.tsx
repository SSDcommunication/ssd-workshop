'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { label: 'Vue d\'ensemble', href: '/dashboard', icon: '🏠' },
  { label: 'Types d\'ateliers', href: '/workshop-types', icon: '📚' },
  { label: 'Ateliers', href: '/workshops', icon: '📅' },
  { label: 'Événements', href: '/workshops/events', icon: '📅' },
  { label: 'Participants', href: '/attendees', icon: '👥' },
  { label: 'Documents', href: '/documents', icon: '📎' },
  { label: 'Tâches', href: '/tasks', icon: '✅' },
  { label: 'Programme', href: '/workshop-program', icon: '🕐' },
  { label: 'Réseaux sociaux', href: '/social-media', icon: '📱' },
  { label: 'Emails', href: '/email-campaigns', icon: '✉️' },
  { label: 'Budget', href: '/budget', icon: '💰' },
  { label: 'Témoignages', href: '/testimonials', icon: '🎤' },
  { label: 'Prospection', href: '/outreach', icon: '🤝' },
  { label: 'Landing page', href: '/landing-page', icon: '🌐' },
  { label: 'Paramètres', href: '/settings', icon: '⚙️' },
  { label: 'Debug', href: '/debug', icon: '🐛' },
  { label: 'Test API', href: '/test-api', icon: '🧪' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">SSD - WORKSHOP MANAGER</h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                isActive
                  ? 'bg-[#4dd1e3]/10 text-[#4dd1e3] font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded transition-colors text-sm">
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
