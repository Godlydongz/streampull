const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
const YOUTUBE_WATCH = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]{11}/
const YOUTUBE_SHORT = /^(https?:\/\/)?youtu\.be\/[\w-]{11}/

export function isValidYouTubeUrl(url: string): boolean {
  if (!url || !url.trim()) return false
  const trimmed = url.trim()
  return YOUTUBE_REGEX.test(trimmed) && (YOUTUBE_WATCH.test(trimmed) || YOUTUBE_SHORT.test(trimmed) || trimmed.includes('youtube.com'))
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function parseBulkUrls(text: string): string[] {
  return text
    .split(/[\n,;]/)
    .map(u => u.trim())
    .filter(u => u.length > 0)
}

export function getUniqueUrls(urls: string[]): string[] {
  return [...new Set(urls.map(u => u.trim()).filter(Boolean))]
}
