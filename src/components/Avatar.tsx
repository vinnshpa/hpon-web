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

  const posClass =
    position === 'center'
      ? 'object-center'
      : position === 'bottom'
      ? 'object-bottom'
      : position === 'top'
      ? 'object-[center_20%]'
      : position

  if (url && !imgError) {
    return (
      <img
        src={url}
        alt={cleanName}
        loading="lazy"
        onError={() => setImgError(true)}
        className={`${className} shrink-0 rounded-full object-cover ${posClass} ring-2 ring-yellow-500/50 shadow-xs`}
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
