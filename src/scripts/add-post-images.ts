/**
 * Script to add featured images to blog posts
 *
 * Usage: npx ts-node --esm src/scripts/add-post-images.ts
 */

import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'

// Map post slugs/titles to image filenames
const POST_IMAGE_MAP: Record<string, string> = {
  'the-new-beginnings': 'IMG-107-new-beginnings-v6-1200x630.jpg',
  'coaching-circle-of-support': 'IMG-109-coaching-v6-1200x630.jpg',
  'jump-into-the-unknown': 'IMG-108-unknown-v6-1200x630.jpg',
  'cycling-passion': 'IMG-103-cycling-passion-v6-1200x630.jpg',
  'procrastination': 'IMG-102-procrastination-v6-1200x630.jpg',
  'my-first-blog-post': 'IMG-101-perfectionism-v6-1200x630.jpg',
  // Add more mappings as needed
}

// Fallback: map by title keywords
const TITLE_KEYWORD_MAP: Record<string, string> = {
  'perfectionism': 'IMG-101-perfectionism-v6-1200x630.jpg',
  'procrastination': 'IMG-102-procrastination-v6-1200x630.jpg',
  'cycling': 'IMG-103-cycling-passion-v6-1200x630.jpg',
  'passion': 'IMG-103-cycling-passion-v6-1200x630.jpg',
  'sleep': 'IMG-106-sleep-v6-1200x630.jpg',
  'beginning': 'IMG-107-new-beginnings-v6-1200x630.jpg',
  'unknown': 'IMG-108-unknown-v6-1200x630.jpg',
  'coaching': 'IMG-109-coaching-v6-1200x630.jpg',
  'soul': 'IMG-110-soul-v6-1200x630.jpg',
}

const MEDIA_DIR = path.join(process.cwd(), 'public', 'media')

async function addPostImages() {
  console.log('Starting to add images to posts...')

  const payload = await getPayload({ config })

  // Get all posts
  const posts = await payload.find({
    collection: 'posts',
    limit: 100,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  console.log(`Found ${posts.docs.length} published posts`)

  for (const post of posts.docs) {
    // Skip if post already has an image
    if (post.meta?.image) {
      console.log(`  Skipping "${post.title}" - already has image`)
      continue
    }

    // Find matching image
    let imageFilename: string | null = null

    // First try exact slug match
    if (post.slug && POST_IMAGE_MAP[post.slug]) {
      imageFilename = POST_IMAGE_MAP[post.slug]
    }

    // Then try title keyword match
    if (!imageFilename && post.title) {
      const titleLower = post.title.toLowerCase()
      for (const [keyword, filename] of Object.entries(TITLE_KEYWORD_MAP)) {
        if (titleLower.includes(keyword)) {
          imageFilename = filename
          break
        }
      }
    }

    // Fallback to site hero for unmatched posts
    if (!imageFilename) {
      imageFilename = 'IMG-002-site-hero-v6-1200x630.jpg'
    }

    const imagePath = path.join(MEDIA_DIR, imageFilename)

    if (!fs.existsSync(imagePath)) {
      console.log(`  Warning: Image not found: ${imagePath}`)
      continue
    }

    console.log(`  Processing "${post.title}" with image ${imageFilename}`)

    try {
      // Upload the image to Media collection
      const imageBuffer = fs.readFileSync(imagePath)

      // Create a file-like object for Payload
      const file = {
        data: imageBuffer,
        mimetype: 'image/jpeg',
        name: imageFilename,
        size: imageBuffer.length,
      }

      // Upload to media collection
      const uploadedMedia = await payload.create({
        collection: 'media',
        data: {
          alt: post.title || 'Blog post image',
        },
        file,
      })

      console.log(`    Uploaded media ID: ${uploadedMedia.id}`)

      // Update the post with the image
      await payload.update({
        collection: 'posts',
        id: post.id,
        data: {
          meta: {
            ...post.meta,
            image: uploadedMedia.id,
          },
        },
        context: {
          disableRevalidate: true,
        },
      })

      console.log(`    Updated post with image`)
    } catch (error) {
      console.error(`    Error processing "${post.title}":`, error)
    }
  }

  console.log('Done!')
  process.exit(0)
}

addPostImages().catch(console.error)
