/**
 * Publish a blog post to Payload CMS via REST API.
 *
 * Usage:
 *   cd blog/heart-of-gold
 *   npx tsx src/scripts/publish-post.ts --post-dir ../../blog/<slug>/ [--draft]
 *
 * Requires: ~/.claude/secrets/payload.json with { "api_key": "...", "api_url": "..." }
 */

import * as fs from 'fs'
import * as path from 'path'
import { markdownToLexical, extractTitle, extractDescription, generateSlug } from '../utilities/markdownToLexical'

// --- Config ---

interface PayloadSecrets {
  api_key: string
  api_url: string
}

function loadSecrets(): PayloadSecrets {
  const secretsPath = path.join(
    process.env.HOME || process.env.USERPROFILE || '',
    '.claude',
    'secrets',
    'payload.json',
  )
  if (!fs.existsSync(secretsPath)) {
    console.error(`Error: Payload secrets not found at ${secretsPath}`)
    console.error('Create it with:')
    console.error(`  echo '{"api_key": "your-key", "api_url": "https://ondrejsvec.com/api"}' > ${secretsPath}`)
    process.exit(1)
  }
  return JSON.parse(fs.readFileSync(secretsPath, 'utf-8'))
}

function parseArgs(): { postDir: string; draft: boolean } {
  const args = process.argv.slice(2)
  let postDir = ''
  let draft = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--post-dir' && args[i + 1]) {
      postDir = args[++i]
    } else if (args[i] === '--draft') {
      draft = true
    }
  }

  if (!postDir) {
    console.error('Usage: npx tsx src/scripts/publish-post.ts --post-dir <path> [--draft]')
    process.exit(1)
  }

  return { postDir: path.resolve(postDir), draft }
}

// --- API helpers ---

async function apiRequest(
  apiUrl: string,
  apiKey: string,
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = `${apiUrl}${endpoint}`
  const headers = new Headers(options.headers || {})
  headers.set('Authorization', `users API-Key ${apiKey}`)

  const resp = await fetch(url, { ...options, headers })
  return resp
}

async function apiJson(
  apiUrl: string,
  apiKey: string,
  endpoint: string,
  options: RequestInit = {},
): Promise<any> {
  const resp = await apiRequest(apiUrl, apiKey, endpoint, options)
  const body = await resp.json()
  if (!resp.ok) {
    console.error(`API error ${resp.status} at ${endpoint}:`, JSON.stringify(body, null, 2))
    throw new Error(`API error ${resp.status}: ${body.errors?.[0]?.message || resp.statusText}`)
  }
  return body
}

async function verifyAuth(apiUrl: string, apiKey: string): Promise<void> {
  console.log('Verifying API authentication...')
  const resp = await apiRequest(apiUrl, apiKey, '/users/me')
  if (!resp.ok) {
    const body = await resp.text()
    console.error(`Authentication failed (${resp.status}): ${body}`)
    process.exit(1)
  }
  console.log('  Authenticated successfully.')
}

// --- Media upload ---

async function uploadMedia(
  apiUrl: string,
  apiKey: string,
  filePath: string,
  alt: string,
): Promise<string> {
  const filename = path.basename(filePath)
  const fileBuffer = fs.readFileSync(filePath)
  const ext = path.extname(filename).toLowerCase()

  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.mp3': 'audio/mpeg',
  }
  const mimeType = mimeTypes[ext] || 'application/octet-stream'

  const formData = new FormData()
  formData.append('file', new Blob([fileBuffer], { type: mimeType }), filename)
  formData.append('alt', alt)

  console.log(`  Uploading ${filename} (${(fileBuffer.length / 1024).toFixed(0)} KB)...`)

  const result = await apiJson(apiUrl, apiKey, '/media', {
    method: 'POST',
    body: formData,
  })

  console.log(`  Uploaded → media ID: ${result.doc.id}`)
  return result.doc.id
}

// --- AudioBlock ---

function createAudioBlockNode(mp3MediaId: string): Record<string, any> {
  // Payload Lexical block node shape.
  // Verified against Payload CMS v3 REST API response format.
  return {
    type: 'block',
    version: 2,
    fields: {
      id: crypto.randomUUID(),
      blockType: 'audioBlock',
      blockName: '',
      audio: mp3MediaId,
      title: 'Listen to this post',
    },
  }
}

// --- Main ---

async function main() {
  const { postDir, draft } = parseArgs()
  const secrets = loadSecrets()
  const { api_key: apiKey, api_url: apiUrl } = secrets

  // Validate post directory
  const postMdPath = path.join(postDir, 'post.md')
  if (!fs.existsSync(postMdPath)) {
    console.error(`Error: post.md not found in ${postDir}`)
    process.exit(1)
  }

  // Read post content
  const markdown = fs.readFileSync(postMdPath, 'utf-8')
  const title = extractTitle(markdown, path.basename(postDir))
  const description = extractDescription(markdown)
  const slug = generateSlug(title)

  console.log(`\nPublishing: "${title}"`)
  console.log(`  Slug: ${slug}`)
  console.log(`  Mode: ${draft ? 'draft' : 'published'}`)
  console.log()

  // Verify authentication
  await verifyAuth(apiUrl, apiKey)

  // Find media files
  const heroExtensions = ['.jpg', '.jpeg', '.png', '.webp']
  const heroFile = heroExtensions
    .map((ext) => path.join(postDir, `hero${ext}`))
    .find((p) => fs.existsSync(p))

  const mp3File = path.join(postDir, 'speech.mp3')
  const hasMp3 = fs.existsSync(mp3File)

  if (!heroFile) {
    console.log('  Warning: No hero image found (hero.jpg/png/webp)')
  }
  if (!hasMp3) {
    console.log('  Warning: No speech.mp3 found — skipping audio block')
  }

  // Upload media
  let heroMediaId: string | undefined
  let mp3MediaId: string | undefined

  if (heroFile) {
    try {
      heroMediaId = await uploadMedia(apiUrl, apiKey, heroFile, `${title} — hero image`)
    } catch (err) {
      console.error('  Hero image upload failed:', err)
      console.error('  Aborting to prevent orphaned state.')
      process.exit(1)
    }
  }

  if (hasMp3) {
    try {
      mp3MediaId = await uploadMedia(apiUrl, apiKey, mp3File, `${title} — audio narration`)
    } catch (err) {
      console.error('  MP3 upload failed:', err)
      if (heroMediaId) {
        console.error(`  Note: Hero image was uploaded (media ID: ${heroMediaId}). Manual cleanup may be needed.`)
      }
      console.error('  Aborting to prevent orphaned state.')
      process.exit(1)
    }
  }

  // Build Lexical content
  console.log('\nConverting markdown to Lexical...')
  const lexicalContent = markdownToLexical(markdown)

  // Insert AudioBlock at the top of content if MP3 was uploaded
  if (mp3MediaId) {
    const audioBlockNode = createAudioBlockNode(mp3MediaId)
    ;(lexicalContent.root.children as any[]).unshift(audioBlockNode)
    console.log('  Inserted AudioBlock at top of content.')
  }

  // Check for existing post by slug
  console.log('\nChecking for existing post...')
  const existingResult = await apiJson(apiUrl, apiKey, `/posts?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`)
  const existingPost = existingResult.docs?.[0]

  // Build post data
  const postData: Record<string, any> = {
    title,
    slug,
    content: lexicalContent,
    blogType: 'writing',
    _status: draft ? 'draft' : 'published',
    meta: {
      title,
      description,
      ...(heroMediaId ? { image: heroMediaId } : {}),
    },
  }

  if (heroMediaId) {
    postData.heroImage = heroMediaId
  }

  let postId: string

  if (existingPost) {
    // Update existing post
    console.log(`  Found existing post (ID: ${existingPost.id}). Updating...`)
    // Preserve publishedAt and relatedPosts from existing post
    if (existingPost.relatedPosts) {
      postData.relatedPosts = existingPost.relatedPosts
    }

    const result = await apiJson(apiUrl, apiKey, `/posts/${existingPost.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    })
    postId = result.doc.id
    console.log(`  Updated post ID: ${postId}`)
  } else {
    // Create new post
    console.log('  No existing post found. Creating...')
    postData.publishedAt = new Date().toISOString()

    const result = await apiJson(apiUrl, apiKey, '/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    })
    postId = result.doc.id
    console.log(`  Created post ID: ${postId}`)
  }

  // Verify
  console.log('\nVerifying...')
  if (draft) {
    console.log(`  Draft preview: ${apiUrl.replace('/api', '')}/admin/collections/posts/${postId}`)
  } else {
    const publicUrl = `${apiUrl.replace('/api', '')}/posts/${slug}`
    try {
      const resp = await fetch(publicUrl)
      if (resp.ok) {
        console.log(`  Live at: ${publicUrl}`)
      } else {
        console.log(`  Published but public URL returned ${resp.status}: ${publicUrl}`)
        console.log(`  Admin: ${apiUrl.replace('/api', '')}/admin/collections/posts/${postId}`)
      }
    } catch {
      console.log(`  Could not verify public URL. Check: ${publicUrl}`)
    }
  }

  console.log('\nDone!')
}

main().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})
