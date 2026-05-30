'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import URLInputList from './URLInputList'
import VideoPreviewCard from './VideoPreviewCard'
import DownloadQueue from './DownloadQueue'
import QualitySelector from './QualitySelector'
import { useDownloadQueue } from '@/hooks/useDownloadQueue'
import { fetchVideoInfo } from '@/services/api'
import { isValidYouTubeUrl } from '@/utils/validation'
import type { Quality } from '@/types'

export default function DownloaderCard() {
  const [quality, setQuality] = useState<Quality>('720p')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const {
    items,
    isProcessing,
    totalCompleted,
    totalFailed,
    addItems,
    removeItem,
    clearCompleted,
    processQueue,
    retryFailed,
  } = useDownloadQueue()

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const handleAddUrls = useCallback(async (urls: string[]) => {
    const validUrls = urls.filter(isValidYouTubeUrl)

    if (validUrls.length === 0) {
      showToast('No valid YouTube URLs found', 'error')
      return
    }

    const itemsToAdd = validUrls.map(url => ({
      url,
      title: '',
      thumbnail: '',
      channel: '',
      duration: '',
      durationSeconds: 0,
      quality,
    }))

    addItems(itemsToAdd)
    showToast(`Added ${validUrls.length} video${validUrls.length > 1 ? 's' : ''}`, 'success')

    for (const item of itemsToAdd) {
      try {
        const info = await fetchVideoInfo(item.url)
        const index = items.findIndex(i => i.url === item.url)
        if (index >= 0) {
          const updated = [...items]
          updated[index] = { ...updated[index], ...info }
        }
      } catch {
        // preview fetch failed, continue
      }
    }
  }, [items, quality, addItems, showToast])

  return (
    <section className="relative mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="overflow-hidden rounded-3xl border border-gray-200 bg-white/40 backdrop-blur-2xl dark:border-white/10 dark:bg-black/40"
      >
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Download Videos</h2>
              <p className="mt-1 text-sm text-gray-500">Paste YouTube URLs below to get started</p>
            </div>
            <QualitySelector value={quality} onChange={setQuality} />
          </div>

          <URLInputList onAddUrls={handleAddUrls} />
        </div>
      </motion.div>

      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-3"
          >
            <h3 className="text-sm font-semibold text-gray-400">PREVIEWS</h3>
            <AnimatePresence mode="popLayout">
              {items.map(item => (
                <VideoPreviewCard
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6">
        <DownloadQueue
          items={items}
          onStart={processQueue}
          isProcessing={isProcessing}
          totalCompleted={totalCompleted}
          totalFailed={totalFailed}
          onRetryFailed={retryFailed}
          onClearCompleted={clearCompleted}
        />
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-2xl ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
