
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const IMAGE_FILENAME = 'IMG-104-tech-lead-v6.png'
const POST_TITLE = 'First month as Tech Lead'

async function ensureTechLead() {
    const payload = await getPayload({ config })

    // 1. Find the image
    const media = await payload.find({
        collection: 'media',
        where: { filename: { equals: IMAGE_FILENAME } }
    })

    if (media.docs.length === 0) {
        console.error(`❌ Image not found: ${IMAGE_FILENAME}`)
        return
    }
    const imageId = media.docs[0].id
    console.log(`✅ Found image: ${imageId}`)

    // 2. Find or Create Post
    const posts = await payload.find({
        collection: 'posts',
        where: { title: { equals: POST_TITLE } }
    })

    let post
    if (posts.docs.length > 0) {
        post = posts.docs[0]
        console.log(`✅ Found existing post: ${post.title} (slug: ${post.slug})`)
    } else {
        console.log(`⚠️ Post not found. Creating...`)
        // Create new post logic here if needed, but for now just reporting
        // Actually, let's create it to be sure
        post = await payload.create({
            collection: 'posts',
            data: {
                title: POST_TITLE,
                slug: 'tech-lead', // Explicit slug
                blogType: 'writing',
                _status: 'published',
                publishedAt: new Date().toISOString(),
                content: { root: { children: [], direction: null, format: '', indent: 0, type: 'root', version: 1 } },
                authors: [] // assigning no author for now
            }
        })
        console.log(`✅ Created post: ${post.title} (slug: ${post.slug})`)
    }

    // 3. Link Image
    await payload.update({
        collection: 'posts',
        id: post.id,
        data: {
            heroImage: imageId,
            meta: {
                ...post.meta,
                description: 'Reflections on stepping into a leadership role.',
                image: imageId
            }
        }
    })
    console.log(`✅ Linked image to post.`)
    console.log(`   URL: http://localhost:3001/posts/${post.slug}`)
    process.exit(0)
}

ensureTechLead()
