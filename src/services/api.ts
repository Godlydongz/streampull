import axios from 'axios'
import type { VideoInfo } from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  const { data } = await api.post('/info', { url })
  return data
}

export async function validateUrls(urls: string[]): Promise<{ valid: string[]; invalid: string[] }> {
  const { data } = await api.post('/validate', { urls })
  return data
}

export async function downloadVideo(url: string, quality: string, onProgress?: (pct: number) => void): Promise<Blob> {
  const { data } = await api.post('/download', { url, quality }, {
    responseType: 'blob',
    onDownloadProgress(progressEvent) {
      if (progressEvent.total && onProgress) {
        onProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100))
      }
    },
  })
  return data
}

export async function createZipFile(files: string[]): Promise<Blob> {
  const { data } = await api.post('/zip', { files }, { responseType: 'blob' })
  return data
}
