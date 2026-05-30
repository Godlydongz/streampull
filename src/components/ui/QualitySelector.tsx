'use client'

import type { Quality } from '@/types'

const options: { value: Quality; label: string }[] = [
  { value: '360p', label: '360p' },
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
  { value: 'best', label: 'Best' },
  { value: 'mp3', label: 'MP3' },
]

interface QualitySelectorProps {
  value: Quality
  onChange: (quality: Quality) => void
}

export default function QualitySelector({ value, onChange }: QualitySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
            value === opt.value
              ? 'border-red-500 bg-red-500/20 text-red-600 shadow-lg shadow-red-500/10 dark:text-red-400'
              : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
