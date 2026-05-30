'use client'

import { useState, useCallback, useRef } from 'react'
import type { DownloadItem, DownloadStatus, Quality } from '@/types'
import { v4 as uuid } from 'uuid'

interface UseDownloadQueueReturn {
  items: DownloadItem[]
  isProcessing: boolean
  totalCompleted: number
  totalFailed: number
  addItems: (items: Omit<DownloadItem, 'id' | 'status' | 'progress'>[]) => void
  removeItem: (id: string) => void
  clearCompleted: () => void
  updateItemStatus: (id: string, status: DownloadStatus, progress?: number, error?: string, filePath?: string) => void
  updateItemProgress: (id: string, progress: number) => void
  processQueue: () => Promise<void>
  retryFailed: () => void
}

export function useDownloadQueue(): UseDownloadQueueReturn {
  const [items, setItems] = useState<DownloadItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const processingRef = useRef(false)

  const totalCompleted = items.filter(i => i.status === 'completed').length
  const totalFailed = items.filter(i => i.status === 'failed').length

  const addItems = useCallback((newItems: Omit<DownloadItem, 'id' | 'status' | 'progress'>[]) => {
    const mapped: DownloadItem[] = newItems.map(item => ({
      ...item,
      id: uuid(),
      status: 'waiting' as DownloadStatus,
      progress: 0,
    }))
    setItems(prev => [...prev, ...mapped])
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setItems(prev => prev.filter(i => i.status !== 'completed' && i.status !== 'failed'))
  }, [])

  const updateItemStatus = useCallback((id: string, status: DownloadStatus, progress = 0, error?: string, filePath?: string) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, status, progress, error, filePath } : i
    ))
  }, [])

  const updateItemProgress = useCallback((id: string, progress: number) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, progress } : i
    ))
  }, [])

  const processQueue = useCallback(async () => {
    if (processingRef.current) return
    processingRef.current = true
    setIsProcessing(true)

    const waiting = items.filter(i => i.status === 'waiting')
    for (const item of waiting) {
      updateItemStatus(item.id, 'downloading', 0)
      try {
        const response = await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: item.url, quality: item.quality }),
        })
        if (!response.ok) throw new Error('Download failed')
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${item.title}.mp4`
        a.click()
        URL.revokeObjectURL(url)
        updateItemStatus(item.id, 'completed', 100)
      } catch (err) {
        updateItemStatus(item.id, 'failed', 0, err instanceof Error ? err.message : 'Download failed')
      }
    }

    processingRef.current = false
    setIsProcessing(false)
  }, [items, updateItemStatus])

  const retryFailed = useCallback(() => {
    setItems(prev => prev.map(i =>
      i.status === 'failed' ? { ...i, status: 'waiting', progress: 0, error: undefined } : i
    ))
  }, [])

  return {
    items,
    isProcessing,
    totalCompleted,
    totalFailed,
    addItems,
    removeItem,
    clearCompleted,
    updateItemStatus,
    updateItemProgress,
    processQueue,
    retryFailed,
  }
}
