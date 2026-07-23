interface KPICardProps {
  label: string
  value: string | number
  change?: number
  icon?: React.ReactNode
}

export default function KPICard({ label, value, change, icon }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        {icon && <div className="text-[#4dd1e3] text-3xl">{icon}</div>}
      </div>
    </div>
  )
}
