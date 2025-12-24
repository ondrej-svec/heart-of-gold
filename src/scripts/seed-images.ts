/**
 * Script to seed generated V6 images into Payload CMS Media collection
 *
 * Usage: node --loader ts-node/esm src/scripts/seed-images.ts
 */

import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'
import mime from 'mime-types'

const ASSETS_DIR = path.join(process.cwd(), 'generated-assets')
const PHASE_DIRS = ['phase-1-v6', 'phase-2-v6', 'phase-3-v6']

async function seedImages() {
  console.log('🚀 Starting image seeding...')

  const payload = await getPayload({ config })

  let successCount = 0
  let errorCount = 0
  const skippedCount = 0

  for (const phaseDir of PHASE_DIRS) {
    const fullDirPath = path.join(ASSETS_DIR, phaseDir)

    if (!fs.existsSync(fullDirPath)) {
      console.log(`⚠️  Directory not found: ${phaseDir}, skipping...`)
      continue
    }

    console.log(`\n📂 Processing directory: ${phaseDir}`)

    const files = fs
      .readdirSync(fullDirPath)
      .filter((file) => file.endsWith('.png') || file.endsWith('.webp') || file.endsWith('.jpg'))

    for (const file of files) {
      const filePath = path.join(fullDirPath, file)
      const fileName = file

      // Check if image already exists in Payload
      const existingMedia = await payload.find({
        collection: 'media',
        where: {
          filename: {
            equals: fileName,
          },
        },
      })

      if (existingMedia.docs.length > 0) {
        console.log(`   🔄 Updating existing image: ${fileName}`)
        try {
          const fileBuffer = fs.readFileSync(filePath)
          const mimeType = mime.lookup(filePath) || 'image/png'
          const stats = fs.statSync(filePath)

          await payload.update({
            collection: 'media',
            id: existingMedia.docs[0].id,
            data: {
              alt: fileName.replace(/-/g, ' ').replace(/\.[^/.]+$/, ''),
            },
            file: {
              data: fileBuffer,
              name: fileName,
              mimetype: mimeType,
              size: stats.size,
            },
          })
          console.log(`   ✅ Updated (ID: ${existingMedia.docs[0].id})`)
          successCount++
        } catch (error) {
          console.error(`   ❌ Error updating ${fileName}:`, error)
          errorCount++
        }
        continue
      }

      try {
        const fileBuffer = fs.readFileSync(filePath)
        const mimeType = mime.lookup(filePath) || 'image/png'
        const stats = fs.statSync(filePath)

        console.log(`   ⬆️  Uploading: ${fileName}`)

        const media = await payload.create({
          collection: 'media',
          data: {
            alt: fileName.replace(/-/g, ' ').replace(/\.[^/.]+$/, ''), // Simple alt text from filename
          },
          file: {
            data: fileBuffer,
            name: fileName,
            mimetype: mimeType,
            size: stats.size,
          },
        })

        console.log(`   ✅ Uploaded (ID: ${media.id})`)
        successCount++
      } catch (error) {
        console.error(`   ❌ Error uploading ${fileName}:`, error)
        errorCount++
      }
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✨ Image seeding complete!`)
  console.log(`   Uploaded: ${successCount}`)
  console.log(`   Skipped:  ${skippedCount}`)
  console.log(`   Errors:   ${errorCount}`)
  console.log('='.repeat(50))

  process.exit(0)
}

seedImages().catch((error) => {
  console.error('💥 Seeding failed:', error)
  process.exit(1)
})
