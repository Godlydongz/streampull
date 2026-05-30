export interface VideoInfo {
  id: string
  url: string
  title: string
  thumbnail: string
  duration: string
  channel: string
  durationSeconds: number
}

export interface DownloadItem {
  id: string
  url: string
  title: string
  thumbnail: string
  channel: string
  duration: string
  durationSeconds: number
  quality: Quality
  status: DownloadStatus
  progress: number
  error?: string
  filePath?: string
}

export type Quality = '360p' | '720p' | '1080p' | 'best' | 'mp3'

export type DownloadStatus = 'waiting' | 'downloading' | 'completed' | 'failed'

export interface BulkInput {
  id: string
  url: string
}

export interface QueueState {
  items: DownloadItem[]
  isProcessing: boolean
  totalCompleted: number
  totalFailed: number
}
