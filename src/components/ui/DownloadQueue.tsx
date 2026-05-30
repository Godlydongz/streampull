'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { DownloadItem } from '@/types'

interface DownloadQueueProps {
  items: DownloadItem[]
  onStart: () => void
  isProcessing: boolean
  totalCompleted: number
  totalFailed: number
  onRetryFailed: () => void
  onClearCompleted: () => void
}

export default function DownloadQueue({
  items,
  onStart,
  isProcessing,
  totalCompleted,
  totalFailed,
  onRetryFailed,
  onClearCompleted,
}: DownloadQueueProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const waiting = items.filter(i => i.status === 'waiting').length
  const hasItems = items.length > 0

  if (!hasItems) return null

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/30 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.02]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Download Queue</h3>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-white/10 dark:text-gray-400">
            {items.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-3 text-xs text-gray-500">
            <span className="text-green-600 dark:text-green-400">{totalCompleted} done</span>
            {totalFailed > 0 && <span className="text-red-600 dark:text-red-400">{totalFailed} failed</span>}
            {waiting > 0 && <span>{waiting} waiting</span>}
          </div>
          <svg
            className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-200 px-4 py-3 dark:border-white/10">
              {!isProcessing && waiting > 0 && (
                <button
                  onClick={onStart}
                  className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:shadow-xl"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download {waiting} Video{waiting > 1 ? 's' : ''}
                </button>
              )}

              {isProcessing && (
                <div className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-blue-500/10 py-3 text-sm text-blue-600 dark:text-blue-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
                  Processing downloads...
                </div>
              )}

              <div className="space-y-2">
                {items.map(item => (
                  <DownloadQueueItem key={item.id} item={item} />
                ))}
              </div>

              {(totalCompleted > 0 || totalFailed > 0) && (
                <div className="mt-3 flex gap-2">
                  {totalFailed > 0 && (
                    <button
                      onClick={onRetryFailed}
                      className="flex-1 rounded-lg border border-gray-200 py-2 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-white/10 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-white"
                    >
                      Retry Failed
                    </button>
                  )}
                  <button
                    onClick={onClearCompleted}
                    className="flex-1 rounded-lg border border-gray-200 py-2 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-white/10 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-white"
                  >
                    Clear Completed
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DownloadQueueItem({ item }: { item: DownloadItem }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-50/50 p-2 dark:bg-white/[0.02]">
      <div className="h-10 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-4 w-4 text-gray-400 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
            </svg>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-gray-900 dark:text-white">{item.title || 'Video'}</p>
        <p className="text-[10px] text-gray-500">{item.quality}</p>
      </div>
      <div className="flex items-center gap-2">
        {item.status === 'downloading' && (
          <div className="flex items-center gap-1">
            <div className="h-1 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                className="h-full rounded-full bg-gradient-to-r from-red-600 to-purple-600"
              />
            </div>
            <span className="text-[10px] text-gray-500">{item.progress}%</span>
          </div>
        )}
        {item.status === 'completed' && (
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {item.status === 'failed' && (
          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )}
      </div>
    </div>
  )
}
