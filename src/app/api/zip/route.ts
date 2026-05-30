import { NextResponse } from 'next/server'
import { createZip, ensureTempDir } from '@/services/downloadManager'
import fs from 'fs/promises'

export async function POST(request: Request) {
  try {
    const { files } = await request.json()

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'Files array is required' }, { status: 400 })
    }

    await ensureTempDir()
    const zipPath = await createZip(files)
    const fileBuffer = await fs.readFile(zipPath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="streampull-bulk-download.zip"',
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'ZIP creation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
