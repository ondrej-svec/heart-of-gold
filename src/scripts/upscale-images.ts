/**
 * Script to upscale images using Replicate API (Real-ESRGAN)
 *
 * Prerequisites:
 * 1. Get an API token from https://replicate.com/account
 * 2. Add REPLICATE_API_TOKEN=your_token_here to .env
 * 3. Run: npm install replicate
 *
 * Usage: npx tsx src/scripts/upscale-images.ts
 */

import 'dotenv/config'
import Replicate from 'replicate'
import * as fs from 'fs'
import * as path from 'path'
import https from 'https'

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN
const ASSETS_DIR = path.join(process.cwd(), 'generated-assets')
// Target directories to scan
const TARGET_DIRS = ['phase-1-v6', 'phase-2-v6', 'phase-3-v6', 'phase-4-v6']
// Minimum width to trigger upscale (e.g. if width < 1920)
const MIN_WIDTH_TARGET = 1920

if (!REPLICATE_API_TOKEN) {
  console.error('❌ REPLICATE_API_TOKEN is missing in .env')
  console.log('   Please sign up at replicate.com and add your token.')
  process.exit(1)
}

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
})

async function upscaleImages() {
  console.log('🚀 Starting Image Upscaling Routine...')

  for (const dir of TARGET_DIRS) {
    const fullDirPath = path.join(ASSETS_DIR, dir)
    if (!fs.existsSync(fullDirPath)) continue

    console.log(`\n📂 Scanning: ${dir}`)
    const files = fs.readdirSync(fullDirPath).filter((f) => f.endsWith('.png'))

    for (const file of files) {
      const filePath = path.join(fullDirPath, file)

      // We'll use a simple check or just attempt upscale if filename suggests it needs it?
      // Better: we can check dimensions if we import 'sharp' or similar,
      // but to keep dependencies low, we might just process specific files or all.
      // For now, let's assume we want to upscale EVERYTHING in these V6 folders
      // ensuring high-def.

      console.log(`   ✨ Upscaling: ${file}...`)

      try {
        const fileBuffer = fs.readFileSync(filePath)
        // Convert to base64 for upload/passing
        const base64Image = `data:image/png;base64,${fileBuffer.toString('base64')}`

        // Using separate output to avoid overwriting immediately in case of failure
        const output = await replicate.run(
          'nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73ab41547220556570783',
          {
            input: {
              image: base64Image,
              scale: 2, // 2x upscale (1024 -> 2048)
              face_enhance: false, // Set true if upscaling portraits
            },
          },
        )

        if (output) {
          // output is usually a URL
          const url = output as unknown as string
          console.log(`      ⬇️ Downloading result...`)
          await downloadFile(url, filePath) // Overwrite
          console.log(`      ✅ Upscaled & Saved!`)
        }
      } catch (error) {
        console.error(`      ❌ Failed to upscale ${file}:`, error)
      }
    }
  }
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https
      .get(url, (response) => {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {})
        reject(err)
      })
  })
}

upscaleImages()
