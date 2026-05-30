import { NextResponse } from 'next/server'

const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
const YOUTUBE_WATCH = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]{11}/
const YOUTUBE_SHORT = /^(https?:\/\/)?youtu\.be\/[\w-]{11}/

function isValidYouTubeUrl(url: string): boolean {
  if (!url || !url.trim()) return false
  const trimmed = url.trim()
  return YOUTUBE_REGEX.test(trimmed) && (YOUTUBE_WATCH.test(trimmed) || YOUTUBE_SHORT.test(trimmed) || trimmed.includes('youtube.com'))
}

export async function POST(request: Request) {
  try {
    const { urls } = await request.json()

    if (!Array.isArray(urls)) {
      return NextResponse.json({ error: 'URLs array is required' }, { status: 400 })
    }

    const valid: string[] = []
    const invalid: string[] = []

    for (const url of urls) {
      if (isValidYouTubeUrl(url)) {
        valid.push(url)
      } else if (url.trim()) {
        invalid.push(url)
      }
    }

    return NextResponse.json({ valid, invalid })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
