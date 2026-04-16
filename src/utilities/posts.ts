import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts')

const postSchema = z.object({
  title: z.string(),
  slug: z.string(),
  blogType: z.enum(['writing', 'wandering']),
  publishedAt: z.coerce.string(),
  draft: z.boolean().default(false),
  heroImage: z.string().optional(),
  meta: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    })
    .optional()
    .default({}),
  categories: z
    .array(z.union([z.string(), z.object({ title: z.string() }).transform((c) => c.title)]))
    .optional()
    .default([]),
  authors: z
    .array(z.object({ name: z.string() }))
    .optional()
    .default([{ name: 'Ondrej Svec' }]),
  relatedPosts: z.array(z.string()).optional().default([]),
})

export type Post = z.infer<typeof postSchema> & {
  content: string
}

let cachedPosts: Post[] | null = null

export function getAllPosts(): Post[] {
  if (cachedPosts) return cachedPosts

  if (!fs.existsSync(CONTENT_DIR)) {
    return []
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files
    .map((filename) => {
      const filePath = path.join(CONTENT_DIR, filename)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)

      const parsed = postSchema.safeParse(data)
      if (!parsed.success) {
        console.error(`Invalid frontmatter in ${filename}:`, parsed.error.format())
        return null
      }

      return {
        ...parsed.data,
        content,
      }
    })
    .filter((p): p is Post => p !== null)
    .filter((p) => {
      if (process.env.NODE_ENV === 'production') {
        return !p.draft
      }
      return true
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  cachedPosts = posts
  return posts
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export function getPostsByType(blogType: 'writing' | 'wandering'): Post[] {
  return getAllPosts().filter((p) => p.blogType === blogType)
}

export function getRecentPosts(limit: number = 5): Post[] {
  return getAllPosts().slice(0, limit)
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug)
}

export function getRelatedPosts(slugs: string[]): Post[] {
  const allPosts = getAllPosts()
  return slugs.map((s) => allPosts.find((p) => p.slug === s)).filter((p): p is Post => p !== null)
}
