'use client'

import { motion } from 'framer-motion'
import type { DownloadItem } from '@/types'
import { formatDuration } from '@/utils/format'

interface VideoPreviewCardProps {
  item: DownloadItem
  onRemove: (id: string) => void
}

export default function VideoPreviewCard({ item, onRemove }: VideoPreviewCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/50 p-4 transition-all hover:border-gray-300 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
    >
      <div className="flex gap-4">
        <div className="relative h-20 w-36 flex-shrink-0 overflow-hidden rounded-xl">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-white/5">
              <svg className="h-8 w-8 text-gray-400 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
              </svg>
            </div>
          )}
          <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-white">
            {formatDuration(item.durationSeconds || 0)}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">{item.title || 'Loading...'}</h3>
          <p className="mt-0.5 text-xs text-gray-500">{item.channel || 'Unknown'}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-md border border-gray-200 px-2 py-0.5 text-[10px] text-gray-500 dark:border-white/10 dark:text-gray-400">
              {item.quality}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] ${
              item.status === 'completed' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
              item.status === 'downloading' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
              item.status === 'failed' ? 'bg-red-500/20 text-red-600 dark:text-red-400' :
              'bg-gray-500/20 text-gray-600 dark:text-gray-400'
            }`}>
              {item.status === 'waiting' && (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  Waiting
                </>
              )}
              {item.status === 'downloading' && (
                <>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                  {item.progress}%
                </>
              )}
              {item.status === 'completed' && (
                <>
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Done
                </>
              )}
              {item.status === 'failed' && (
                <>
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Failed
                </>
              )}
            </span>
          </div>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 opacity-0 transition-all hover:border-red-500/50 hover:text-red-400 group-hover:opacity-100 dark:border-white/10"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {item.status === 'downloading' && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${item.progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-red-600 to-purple-600"
          />
        </div>
      )}

      {item.error && (
        <p className="mt-2 text-xs text-red-500 dark:text-red-400">{item.error}</p>
      )}
    </motion.div>
  )
}
