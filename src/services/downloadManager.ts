import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'
import { v4 as uuid } from 'uuid'
import AdmZip from 'adm-zip'

const execAsync = promisify(exec)
const DOWNLOADS_DIR = path.join(process.cwd(), 'tmp', 'downloads')
const CLEANUP_AFTER_MS = 30 * 60 * 1000
const YTDLP_BIN = '/tmp/yt-dlp'

export interface DownloadResult {
  filePath: string
  fileName: string
  title: string
}

const USER_AGENT = 'com.google.android.youtube/19.09.37 (Linux; U; Android 14)'
const EXTRACTOR_ARGS = 'youtube:player_client=android'

function getQualityFormat(quality: string): string {
  switch (quality) {
    case '360p': return 'worst[height<=360]'
    case '720p': return 'best[height<=720]'
    case '1080p': return 'best[height<=1080]'
    case 'best': return 'bestvideo[height<=2160]+bestaudio/best[height<=2160]'
    case 'mp3': return 'bestaudio/best'
    default: return 'best'
  }
}

function getExtension(quality: string): string {
  return quality === 'mp3' ? 'mp3' : 'mp4'
}

export async function ensureTempDir(): Promise<void> {
  await fs.mkdir(DOWNLOADS_DIR, { recursive: true })
}

export async function downloadVideo(url: string, quality: string): Promise<DownloadResult> {
  await ensureTempDir()
  const id = uuid()
  const ext = getExtension(quality)
  const outputTemplate = path.join(DOWNLOADS_DIR, `${id}.%(ext)s`)
  const format = getQualityFormat(quality)

  const baseArgs = [
    YTDLP_BIN,
    '--no-check-certificates',
    `--user-agent "${USER_AGENT}"`,
    `--extractor-args "${EXTRACTOR_ARGS}"`,
    '--no-playlist',
    '-o', `"${outputTemplate}"`,
    `"${url}"`,
  ]

  let cmd: string
  if (quality === 'mp3') {
    cmd = [...baseArgs, '-x', '--audio-format', 'mp3'].join(' ')
  } else {
    cmd = [...baseArgs, '-f', `"${format}"`, '--merge-output-format', 'mp4'].join(' ')
  }

  const { stdout, stderr } = await execAsync(cmd, { timeout: 600000, maxBuffer: 50 * 1024 * 1024 })

  const combinedOutput = stdout + stderr
  const titleMatch = combinedOutput.match(/\[download\] Destination: (.+)/)
  const title = titleMatch ? path.basename(titleMatch[1], path.extname(titleMatch[1])) : `video_${id}`

  const finalPath = path.join(DOWNLOADS_DIR, `${id}.${ext}`)

  return { filePath: finalPath, fileName: `${title}.${ext}`, title }
}

export async function fetchVideoInfo(url: string): Promise<Record<string, unknown>> {
  const cmd = `${YTDLP_BIN} --no-check-certificates --extractor-args "${EXTRACTOR_ARGS}" --user-agent "${USER_AGENT}" --dump-json --no-download "${url}"`
  const { stdout } = await execAsync(cmd, { timeout: 30000 })
  if (!stdout) throw new Error('Failed to fetch video info')
  return JSON.parse(stdout.trim().split('\n')[0])
}

export async function cleanupOldFiles(): Promise<void> {
  try {
    const files = await fs.readdir(DOWNLOADS_DIR)
    const now = Date.now()
    for (const file of files) {
      const filePath = path.join(DOWNLOADS_DIR, file)
      const stat = await fs.stat(filePath)
      if (now - stat.mtimeMs > CLEANUP_AFTER_MS) {
        await fs.unlink(filePath)
      }
    }
  } catch {
    // ignore
  }
}

export async function createZip(files: string[]): Promise<string> {
  await ensureTempDir()
  const zipPath = path.join(DOWNLOADS_DIR, `bulk-${uuid()}.zip`)
  const zip = new AdmZip()

  for (const file of files) {
    zip.addLocalFile(file)
  }

  zip.writeZip(zipPath)
  return zipPath
}
