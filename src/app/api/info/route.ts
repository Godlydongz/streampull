import { NextResponse } from 'next/server'
import { fetchVideoInfo } from '@/services/downloadManager'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const data = await fetchVideoInfo(url)

    return NextResponse.json({
      id: data.id,
      url,
      title: data.title || 'Unknown',
      thumbnail: data.thumbnail || '',
      duration: formatDuration((data.duration as number) || 0),
      channel: (data.channel || data.uploader || 'Unknown') as string,
      durationSeconds: (data.duration as number) || 0,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch video info'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}
