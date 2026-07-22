'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface NavItem {
  label: string
  href: string
  icon?: string
}

interface NavSection {
  label: string
  icon: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    label: 'Tableau de bord',
    icon: '📊',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    ],
  },
  {
    label: 'Ateliers & Événements',
    icon: '🎓',
    items: [
      { label: 'Types d\'ateliers', href: '/workshop-types', icon: '📚' },
      { label: 'Ateliers', href: '/workshops', icon: '⚙️' },
      { label: 'Événements', href: '/workshops/events', icon: '📅' },
    ],
  },
  {
    label: 'Gestion & Opérations',
    icon: '🛠️',
    items: [
      { label: 'Inscrits', href: '/attendees', icon: '👥' },
      { label: 'Tâches', href: '/tasks', icon: '✅' },
      { label: 'Programme', href: '/workshop-program', icon: '🕐' },
      { label: 'Documents', href: '/documents', icon: '📄' },
    ],
  },
  {
    label: 'Marketing & Communication',
    icon: '📢',
    items: [
      { label: 'Réseaux sociaux', href: '/social-media', icon: '📱' },
      { label: 'Emails', href: '/email-campaigns', icon: '✉️' },
      { label: 'Landing page', href: '/landing-page', icon: '🌐' },
    ],
  },
  {
    label: 'Analyse & Finances',
    icon: '📈',
    items: [
      { label: 'Budget', href: '/budget', icon: '💰' },
      { label: 'Témoignages', href: '/testimonials', icon: '🎤' },
    ],
  },
  {
    label: 'Développement commercial',
    icon: '🚀',
    items: [
      { label: 'Prospection', href: '/outreach', icon: '🤝' },
    ],
  },
]

interface SectionMenuProps {
  section: NavSection
  isOpen: boolean
  onToggle: () => void
  pathname: string
}

function SectionMenu({ section, isOpen, onToggle, pathname }: SectionMenuProps) {
  const isActive = section.items.some((item) => pathname === item.href)

  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive
            ? 'bg-[#4dd1e3]/10 text-[#4dd1e3] font-semibold'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span>{section.icon}</span>
        <span className="flex-1 text-left text-sm font-medium">{section.label}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-1 ml-6 space-y-1 border-l border-gray-200 pl-3">
          {section.items.map((item) => {
            const isItemActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                  isItemActive
                    ? 'bg-[#4dd1e3]/20 text-[#4dd1e3] font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Tableau de bord': true,
    'Ateliers & Événements': true,
    'Gestion & Opérations': true,
  })

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  return (
    <aside className="w-80 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-[#4dd1e3]">Workshop Manager</h1>
        <p className="text-xs text-gray-600 mt-1">SSD Communication</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <SectionMenu
            key={section.label}
            section={section}
            isOpen={openSections[section.label] || false}
            onToggle={() => toggleSection(section.label)}
            pathname={pathname}
          />
        ))}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <span>⚙️</span>
          <span className="text-sm">Paramètres</span>
        </Link>
      </div>
    </aside>
  )
}
