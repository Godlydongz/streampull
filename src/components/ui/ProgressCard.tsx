'use client'

import { motion } from 'framer-motion'
import type { DownloadItem } from '@/types'

interface ProgressCardProps {
  item: DownloadItem
}

export default function ProgressCard({ item }: ProgressCardProps) {
  const getStatusColor = () => {
    switch (item.status) {
      case 'downloading': return 'from-blue-500 to-purple-500'
      case 'completed': return 'from-green-500 to-emerald-500'
      case 'failed': return 'from-red-500 to-pink-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mb-2 flex items-center justify-between">
        <span className="truncate text-sm text-gray-900 dark:text-white">{item.title || 'Video'}</span>
        <span className="text-xs text-gray-500">{item.quality}</span>
      </div>

      <div className="relative h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${item.progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${getStatusColor()}`}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className={`${
          item.status === 'completed' ? 'text-green-600 dark:text-green-400' :
          item.status === 'failed' ? 'text-red-600 dark:text-red-400' :
          item.status === 'downloading' ? 'text-blue-600 dark:text-blue-400' :
          'text-gray-500'
        }`}>
          {item.status === 'waiting' && 'Waiting...'}
          {item.status === 'downloading' && `${item.progress}%`}
          {item.status === 'completed' && 'Completed'}
          {item.status === 'failed' && 'Failed'}
        </span>
        {item.error && <span className="text-red-600 dark:text-red-400">{item.error}</span>}
      </div>
    </div>
  )
}
