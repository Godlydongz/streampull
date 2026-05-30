'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { v4 as uuid } from 'uuid'
import { isValidYouTubeUrl, parseBulkUrls } from '@/utils/validation'
import type { BulkInput } from '@/types'

interface URLInputListProps {
  onAddUrls: (urls: string[]) => void
}

export default function URLInputList({ onAddUrls }: URLInputListProps) {
  const [inputs, setInputs] = useState<BulkInput[]>([{ id: uuid(), url: '' }])
  const [bulkText, setBulkText] = useState('')
  const [showBulk, setShowBulk] = useState(false)

  const addInput = useCallback(() => {
    setInputs(prev => [...prev, { id: uuid(), url: '' }])
  }, [])

  const removeInput = useCallback((id: string) => {
    setInputs(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateUrl = useCallback((id: string, url: string) => {
    setInputs(prev => prev.map(i => i.id === id ? { ...i, url } : i))
  }, [])

  const handleBulkSubmit = useCallback(() => {
    const urls = parseBulkUrls(bulkText).filter(isValidYouTubeUrl)
    if (urls.length > 0) {
      onAddUrls(urls)
      setBulkText('')
    }
  }, [bulkText, onAddUrls])

  const handleSubmitAll = useCallback(() => {
    const urls = inputs
      .map(i => i.url.trim())
      .filter(url => url.length > 0 && isValidYouTubeUrl(url))
    if (urls.length > 0) {
      onAddUrls(urls)
      setInputs([{ id: uuid(), url: '' }])
    }
  }, [inputs, onAddUrls])

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {inputs.map((input, index) => (
          <motion.div
            key={input.id}
            layout
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-600/20">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
              </svg>
            </div>
            <div className="relative flex-1">
              <input
                type="url"
                placeholder={`YouTube URL #${index + 1}`}
                value={input.url}
                onChange={(e) => updateUrl(input.id, e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-red-500/50 focus:bg-white focus:ring-1 focus:ring-red-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 dark:focus:bg-white/10"
              />
              {input.url && isValidYouTubeUrl(input.url) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </div>
            {inputs.length > 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => removeInput(input.id)}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-red-500/50 hover:text-red-400 dark:border-white/10"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addInput}
          className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-500 transition-all hover:border-gray-400 hover:text-gray-700 dark:border-white/10 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add More
        </motion.button>

        <button
          onClick={() => setShowBulk(!showBulk)}
          className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-500 transition-all hover:border-gray-400 hover:text-gray-700 dark:border-white/10 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          Paste Multiple
        </button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmitAll}
          className="ml-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:shadow-xl hover:shadow-red-600/30"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download All
        </motion.button>
      </div>

      <AnimatePresence>
        {showBulk && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
              <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                Paste multiple YouTube links (one per line)
              </label>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={5}
                placeholder="https://youtube.com/watch?v=...&#10;https://youtu.be/...&#10;https://youtube.com/watch?v=..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {bulkText ? parseBulkUrls(bulkText).filter(isValidYouTubeUrl).length : 0} valid URLs found
                </span>
                <button
                  onClick={handleBulkSubmit}
                  disabled={!bulkText.trim()}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 disabled:opacity-50"
                >
                  Add URLs
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
