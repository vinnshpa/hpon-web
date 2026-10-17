import { useState } from 'react'

interface LogoProps {
  className?: string
  alt?: string
}

export default function Logo({ className = 'h-10 w-auto', alt = 'Logo Organisasi' }: LogoProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-blue-900 font-bold text-yellow-400 ring-1 ring-yellow-500/40 ${className}`}>
        ORG
      </div>
    )
  }

  return (
    <img
      src="/logo.svg"
      alt={alt}
      onError={() => setError(true)}
      className={`${className} object-contain drop-shadow-sm`}
    />
  )
}
