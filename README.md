# Heart of Gold

Personal website and blog at [ondrejsvec.com](https://www.ondrejsvec.com).

Built with Next.js 15 (App Router) + MDX. No CMS, no database — posts are `.mdx` files in `content/posts/`.

## Stack

- **Next.js 15** with App Router and RSC
- **MDX** for post content (`next-mdx-remote/rsc`)
- **gray-matter** for YAML frontmatter parsing
- **Zod** for frontmatter schema validation
- **Tailwind CSS** with a monospace (JetBrains Mono) design system
- **Vercel** for hosting (auto-deploys on push to `main`)

## Local development

```bash
pnpm install
pnpm dev
```

The site runs on `http://localhost:3000` (or next available port).

## Adding a post

Create a new `.mdx` file in `content/posts/`:

```mdx
---
title: "Your Post Title"
slug: your-post-slug
blogType: writing  # or "wandering"
publishedAt: 2026-04-16
draft: false
meta:
  title: "Your Post Title | Heart of Gold"
  description: "Short SEO description."
categories:
  - Personal Blog
authors:
  - name: Ondrej Svec
---

Your content here. Standard markdown plus custom components:

<AudioBlock src="/audio/narration.mp3" title="Listen to this post" />

<Banner style="info">
Something worth highlighting.
</Banner>
```

Then `git push` and Vercel deploys.

## Publishing

`git push` → Vercel builds → live in ~1 minute.

Drafts (`draft: true`) are hidden in production but visible in dev and preview deployments.

## Project structure

```
content/posts/          # MDX blog posts
public/images/          # Post images
public/audio/           # Post audio files
src/app/(frontend)/     # Next.js pages
src/utilities/posts.ts  # Content loader with Zod validation
src/mdx-components.tsx  # Custom MDX components
```

## Scripts

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm lint` — ESLint
