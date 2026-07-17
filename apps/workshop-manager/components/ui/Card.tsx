interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {title && <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>}
      {children}
    </div>
  )
}
