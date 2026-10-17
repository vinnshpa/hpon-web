import { useState } from 'react'

interface AvatarProps {
  name?: string | null
  url?: string | null
  className?: string
  position?: 'top' | 'center' | 'bottom' | string
}

export default function Avatar({
  name,
  url,
  className = 'h-16 w-16',
  position = 'top',
}: AvatarProps) {
  const [imgError, setImgError] = useState(false)

  const cleanName = name?.trim() || 'P'
  const initials = cleanName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase() || 'P'

  const getObjectPosition = (pos?: string): string => {
    if (!pos) return '50% 20%'
    if (pos === 'top') return '50% 20%'
    if (pos === 'center') return '50% 50%'
    if (pos === 'bottom') return '50% 80%'
    return pos
  }

  if (url && !imgError) {
    return (
      <img
        src={url}
        alt={cleanName}
        loading="lazy"
        onError={() => setImgError(true)}
        style={{ objectPosition: getObjectPosition(position) }}
        className={`${className} shrink-0 rounded-full object-cover ring-2 ring-yellow-500/50 shadow-xs`}
      />
    )
  }

  return (
    <div
      className={`${className} shrink-0 flex items-center justify-center rounded-full bg-blue-950 font-bold text-yellow-400 ring-2 ring-yellow-500/40 shadow-xs`}
      title={cleanName}
    >
      <span className="text-sm tracking-wider">{initials}</span>
    </div>
  )
}
