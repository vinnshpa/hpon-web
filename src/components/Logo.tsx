import { useState } from 'react'

interface LogoProps {
  className?: string
  alt?: string
}

export default function Logo({ className = 'h-10 w-auto', alt = 'Logo Haga Pendidikan Ono Niha' }: LogoProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-blue-900 font-bold text-yellow-400 ring-2 ring-yellow-400/50 ${className}`}>
        HPON
      </div>
    )
  }

  return (
    <img
      src="/logo.png"
      alt={alt}
      onError={() => setError(true)}
      className={`${className} object-contain rounded-full drop-shadow-sm transition-transform duration-300 hover:scale-105`}
    />
  )
}
