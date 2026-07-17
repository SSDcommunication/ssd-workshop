import Link from 'next/link'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <Link href="/dashboard" className="text-[#4dd1e3] hover:underline">
            ← Retour au dashboard
          </Link>
        </div>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
    </header>
  )
}
