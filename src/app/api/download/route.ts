import { NextResponse } from 'next/server'
import { downloadVideo, ensureTempDir, cleanupOldFiles } from '@/services/downloadManager'
import fs from 'fs/promises'

export async function POST(request: Request) {
  try {
    const { url, quality = '720p' } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    await ensureTempDir()
    cleanupOldFiles().catch(() => {})

    const result = await downloadVideo(url, quality)

    const fileBuffer = await fs.readFile(result.filePath)
    const ext = quality === 'mp3' ? 'mp3' : 'mp4'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': quality === 'mp3' ? 'audio/mpeg' : 'video/mp4',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(result.fileName || `video.${ext}`)}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Download failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
