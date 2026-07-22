'use client'

interface FormErrorProps {
  error?: string
  className?: string
}

export default function FormError({ error, className = '' }: FormErrorProps) {
  if (!error) return null

  return (
    <p className={`text-sm text-red-600 mt-1 ${className}`} role="alert">
      {error}
    </p>
  )
}
