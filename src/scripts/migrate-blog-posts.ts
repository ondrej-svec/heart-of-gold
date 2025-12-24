/**
 * Migration script to import Ondrej's blog posts from Markdown files
 * into Payload CMS as editable posts
 *
 * Usage: node --loader ts-node/esm src/scripts/migrate-blog-posts.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { markdownToLexical, extractTitle, generateSlug, extractDescription } from '../utilities/markdownToLexical'

const BLOG_DIR = path.join(process.cwd(), '..') // /Users/ondrejsvec/Projects/Bobo/blog
const CATEGORY_NAME = 'Personal Blog'

async function migrateBlogPosts() {
  console.log('🚀 Starting blog post migration...')

  const payload = await getPayload({ config })

  console.log('📁 Reading markdown files from:', BLOG_DIR)

  // Get all markdown files
  const files = fs.readdirSync(BLOG_DIR)
    .filter(file => file.endsWith('.md'))
    .sort() // Sort by filename to maintain chronological order

  console.log(`📝 Found ${files.length} markdown files`)

  // Create or get category
  console.log('📂 Creating/finding category:', CATEGORY_NAME)
  let category
  try {
    const existingCategories = await payload.find({
      collection: 'categories',
      where: {
        title: {
          equals: CATEGORY_NAME,
        },
      },
    })

    if (existingCategories.docs.length > 0) {
      category = existingCategories.docs[0]
      console.log('   ✓ Category already exists')
    } else {
      category = await payload.create({
        collection: 'categories',
        data: {
          title: CATEGORY_NAME,
          slug: 'personal-blog',
        },
      })
      console.log('   ✓ Category created')
    }
  } catch (error) {
    console.error('❌ Error creating category:', error)
    throw error
  }

  // Get current user (or create a default author)
  console.log('👤 Finding/creating author...')
  let author
  try {
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (users.docs.length > 0) {
      author = users.docs[0]
      console.log(`   ✓ Using existing user: ${author.email}`)
    } else {
      author = await payload.create({
        collection: 'users',
        data: {
          name: 'Ondrej Svec',
          email: 'ondrej@example.com',
          password: 'changeme123',
        },
      })
      console.log('   ✓ Created default author')
    }
  } catch (error) {
    console.error('❌ Error getting author:', error)
    throw error
  }

  // Process each markdown file
  let successCount = 0
  let errorCount = 0

  for (const file of files) {
    console.log(`\n📄 Processing: ${file}`)

    try {
      const filePath = path.join(BLOG_DIR, file)
      const markdownContent = fs.readFileSync(filePath, 'utf-8')

      // Extract metadata
      let title = extractTitle(markdownContent, file.replace('.md', ''))

      // If title is invalid (e.g., "?"), use a better fallback
      if (!title || title.trim() === '?' || title.trim().length === 0) {
        // Use first paragraph as title or filename
        const firstPara = extractDescription(markdownContent, 60)
        title = firstPara !== 'No description available'
          ? firstPara.replace(/\.\.\.$/, '')
          : file.replace('.md', '')
      }

      const slug = generateSlug(title)
      const description = extractDescription(markdownContent)
      const lexicalContent = markdownToLexical(markdownContent)

      // Get file stats for publish date
      const stats = fs.statSync(filePath)
      const publishedAt = stats.mtime.toISOString()

      console.log(`   Title: ${title}`)
      console.log(`   Slug: ${slug}`)
      console.log(`   Published: ${publishedAt}`)

      // Check if post already exists
      const existingPosts = await payload.find({
        collection: 'posts',
        where: {
          slug: {
            equals: slug,
          },
        },
      })

      if (existingPosts.docs.length > 0) {
        console.log('   ⚠️  Post already exists, skipping...')
        continue
      }

      // Create the post
      const post = await payload.create({
        collection: 'posts',
        data: {
          title,
          slug,
          blogType: 'writing',
          _status: 'published',
          authors: [author.id],
          content: lexicalContent as any,
          categories: [category.id],
          publishedAt,
          meta: {
            title,
            description,
          },
        },
        context: {
          disableRevalidate: true,
        },
      })

      console.log(`   ✅ Created post (ID: ${post.id})`)
      successCount++

    } catch (error) {
      console.error(`   ❌ Error processing ${file}:`, error)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✨ Migration complete!`)
  console.log(`   Success: ${successCount} posts`)
  console.log(`   Errors: ${errorCount} posts`)
  console.log('='.repeat(50))

  process.exit(0)
}

// Run the migration
migrateBlogPosts().catch((error) => {
  console.error('💥 Migration failed:', error)
  process.exit(1)
})
