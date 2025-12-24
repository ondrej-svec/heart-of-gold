/**
 * Script to link seeded images to Content (Users, Pages, Posts)
 *
 * Usage: npx tsx src/scripts/link-content.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

// Mapping of Content Title (or Slug-like string) to Image Filename
const POST_MAPPINGS = {
    'My first Blog post': 'IMG-101-perfectionism-v6.png',
    'Procrastination': 'IMG-102-procrastination-v6.png',
    'The new beginnings': 'IMG-107-new-beginnings-v6.png',
    'Cycling Passion': 'IMG-103-cycling-passion-v6.png',
    'Need for Speed Sleep': 'IMG-106-sleep-v6.png',
    'Jump into the Unknown': 'IMG-108-unknown-v6.png',
    'Coaching circle of support': 'IMG-109-coaching-v6.png',
    'What to do to Accept ourselves as we are': 'IMG-110-soul-v6.png',
    'Tech Lead': 'IMG-104-tech-lead-v6.png',
}

const AUTHOR_IMAGE = 'IMG-001-author-portrait-v6.png'
const HERO_IMAGE = 'IMG-002-site-hero-v6.png'
const WRITING_CATEGORY_IMAGE = 'IMG-003-writing-v6.png'

async function linkContent() {
    console.log('🚀 Starting content linking...')

    const payload = await getPayload({ config })

    // --- 1. Link Author Portrait ---
    console.log('\n👤 Updating Author Profile...')
    try {
        const authorMedia = await payload.find({
            collection: 'media',
            where: { filename: { equals: AUTHOR_IMAGE } },
        })

        if (authorMedia.docs.length > 0) {
            const users = await payload.find({ collection: 'users' }) // Update all users or specific one
            if (users.docs.length > 0) {
                for (const user of users.docs) {
                    await payload.update({
                        collection: 'users',
                        id: user.id,
                        data: { photo: authorMedia.docs[0].id },
                    })
                    console.log(`   ✅ Updated user: ${user.email}`)
                }
            } else {
                console.log('   ⚠️ No users found to update.')
            }
        } else {
            console.log(`   ❌ Author image not found: ${AUTHOR_IMAGE}`)
        }
    } catch (e) {
        console.error('   ❌ Error updating author:', e)
    }

    // --- 2. Link Site Hero (Homepage) ---
    console.log('\n🏠 Updating Homepage Hero...')
    try {
        const heroMedia = await payload.find({
            collection: 'media',
            where: { filename: { equals: HERO_IMAGE } },
        })

        if (heroMedia.docs.length > 0) {
            // Find 'home' page or create it
            const pages = await payload.find({
                collection: 'pages',
                where: { slug: { equals: 'home' } }
            })

            let homePage;
            if (pages.docs.length > 0) {
                homePage = pages.docs[0]
            } else {
                // Create home page if it doesn't exist
                console.log('   Creating new Home page...')
                homePage = await payload.create({
                    collection: 'pages',
                    data: {
                        title: 'Home',
                        slug: 'home',
                        hero: { type: 'highImpact', media: heroMedia.docs[0].id, richText: { root: { children: [], direction: null, format: '', indent: 0, type: 'root', version: 1 } } as any },
                        layout: [
                            {
                                blockType: 'archive',
                                introContent: { root: { children: [], direction: null, format: '', indent: 0, type: 'root', version: 1 } } as any,
                                populateBy: 'collection',
                                relationTo: 'posts',
                            }
                        ]
                    }
                })
            }

            // Update existing home page
            if (pages.docs.length > 0) {
                await payload.update({
                    collection: 'pages',
                    id: homePage.id,
                    data: {
                        hero: {
                            type: 'highImpact',
                            media: heroMedia.docs[0].id,
                            richText: homePage.hero?.richText || { root: { children: [], direction: null, format: '', indent: 0, type: 'root', version: 1 } } as any
                        }
                    }
                })
            }
            console.log(`   ✅ Updated Home page: ${homePage.title}`)

        } else {
            console.log(`   ❌ Hero image not found: ${HERO_IMAGE}`)
        }
    } catch (e) {
        console.error('   ❌ Error updating homepage:', e)
    }

    // --- 3. Link Blog Posts ---
    console.log('\n📝 Updating Blog Posts...')
    for (const [titleFragment, filename] of Object.entries(POST_MAPPINGS)) {
        try {
            const media = await payload.find({
                collection: 'media',
                where: { filename: { equals: filename } },
            })

            if (media.docs.length === 0) {
                console.log(`   ❌ Image not found: ${filename}`)
                continue;
            }

            const posts = await payload.find({
                collection: 'posts',
                where: { title: { contains: titleFragment } }
            })

            if (posts.docs.length > 0) {
                const post = posts.docs[0]
                await payload.update({
                    collection: 'posts',
                    id: post.id,
                    data: {
                        heroImage: media.docs[0].id,
                        meta: {
                            ...post.meta,
                            image: media.docs[0].id
                        }
                    }
                })
                console.log(`   ✅ Updated post "${post.title}" with ${filename}`)
            } else {
                console.log(`   ⚠️ Post not found for fragment: "${titleFragment}"`)
            }

        } catch (e) {
            console.error(`   ❌ Error updating post for ${titleFragment}:`, e)
        }
    }

    // --- 4. Link Category Headers ---
    console.log('\n🗂 Updating Categories...')
    try {
        const writingMedia = await payload.find({
            collection: 'media',
            where: { filename: { equals: WRITING_CATEGORY_IMAGE } },
        })

        if (writingMedia.docs.length > 0) {
            // Find 'Personal Blog' or 'Writing' category
            const categories = await payload.find({
                collection: 'categories',
                where: { title: { contains: 'Personal' } } // Assuming "Personal Blog" from migration script
            })

            if (categories.docs.length > 0) {
                // Check if category has media field first (handled in separate tool call if needed)
                // For now assuming we might have added it or will add it.
                // If field doesn't exist, this payload update might just ignore it or throw error based on strict mode.
                // We'll try to update 'media' field assuming we added it.
                await payload.update({
                    collection: 'categories',
                    id: categories.docs[0].id,
                    data: { media: writingMedia.docs[0].id }
                })
                console.log(`   ✅ Updated category "${categories.docs[0].title}"`)
            }
        }
    } catch (e) {
        console.error('   ❌ Error updating category:', e)
    }


    console.log('\n✅ Content linking complete!')
    process.exit(0)
}

linkContent().catch((error) => {
    console.error('💥 Linking failed:', error)
    process.exit(1)
})
