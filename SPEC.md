# Personal Blog & Site Specification

## Project Overview
A personal blog and portfolio site covering multiple interests and serving as a professional presence online.

## Content Pillars

### 1. Van Life & Travel
- Van build documentation and progress
- Travel stories and experiences
- Tips and lessons learned
- Photo galleries from travels

### 2. Modern Software Engineering
- AI-assisted development practices
- Changing work styles in the AI era
- Technical insights and tutorials
- Industry observations

### 3. Psychology & Coaching
- Personal development insights
- Coaching perspectives
- Mental frameworks
- Professional coaching services (future)

### 4. Triathlon & Cycling
- Training logs and insights
- Race reports
- Equipment reviews
- Fitness philosophy

### 5. About Me
- Professional background
- Personal story
- Contact information
- Current projects

## Design Direction

### Visual Style (Inspired by instrument.com)
- **Color Palette**: Deep, rich backgrounds (dark purple/blue tones) with high contrast text
- **Typography**: Large, elegant serif headings with excellent readability
- **Layout**: Bold, full-width hero sections with centered content
- **Spacing**: Generous whitespace, breathing room between sections
- **Interactive Elements**: Subtle animations, smooth scrolling, refined hover states
- **Media**: Large, impactful images and video backgrounds where appropriate
- **Navigation**: Clean, minimal navigation with pill-style active states

### Key Design Principles
1. **Bold & Confident**: Large typography, strong visual hierarchy
2. **Minimalist**: Remove anything unnecessary, focus on content
3. **Elegant**: Refined details, smooth transitions, thoughtful micro-interactions
4. **Readable**: Excellent typography with optimal line length and spacing
5. **Responsive**: Beautiful on all devices, mobile-first approach
6. **Performance**: Fast loading, optimized images, smooth animations

## Technical Stack

### Framework
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript** (following [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html))
- **Bun** as package manager and runtime

### Content Management
- **Payload CMS 3.0** - Modern headless CMS
  - Built-in admin UI at `/admin`
  - TypeScript-first
  - Flexible content modeling
  - Rich text editor with Lexical
  - Media management with uploads
  - Built-in authentication
  - Version control for content
  - Draft/publish workflow

### Database
- **PostgreSQL** (recommended) or **MongoDB**
- Connection via Payload's built-in adapters
- Local development with Docker or local DB
- Production: Vercel Postgres, Supabase, or Railway

### Styling
- **Tailwind CSS** for utility-first styling
- Custom design system aligned with the dark, elegant aesthetic
- CSS animations for smooth transitions

### Additional Libraries
- **Framer Motion** for animations
- **next/image** for optimized images (integrated with Payload media)
- **next/font** for optimized font loading
- **Reading time calculation** for blog posts
- **Syntax highlighting** for code blocks in rich text

## Site Structure

```
/
├── / (home)
│   ├── Hero section with introduction
│   ├── Featured content preview
│   └── Recent posts from both blogs
│
├── /about
│   ├── Professional background
│   ├── Personal story
│   ├── Current projects
│   └── Contact information
│
├── /writing
│   ├── Mixed blog: engineering, psychology, coaching, sports
│   ├── All posts with tags for filtering
│   └── /writing/[slug] - Individual post
│
└── /wandering
    ├── Van life & travel blog
    ├── Van build documentation
    ├── Travel stories
    ├── Photo galleries
    └── /wandering/[slug] - Individual post
```

### Navigation
- **Home** - Landing page with hero and recent content
- **About** - Personal and professional background
- **Writing** - Thoughts on engineering, psychology, coaching, and sports
- **Wandering** - Van life adventures and travel stories

## Content Features

### Blog Posts
- **Metadata**: Title, date, blog type (writing/wandering), tags, excerpt, featured image, reading time
- **Tags**: Free-form tagging for filtering and cross-referencing (e.g., "AI", "coaching", "bike-packing", "van-build")
- **Featured Posts**: Ability to pin important posts on homepage
- **Series**: Group related posts into series (e.g., "Van Build Saga", "AI Development Series")
- **Draft Mode**: Work on posts before publishing

### Media
- **High-quality images** with lazy loading
- **Photo galleries** with lightbox functionality
- **Video embeds** (YouTube, Vimeo)
- **Code syntax highlighting** with copy button

### Interactive Elements
- **Table of Contents** for long posts
- **Reading progress indicator**
- **Share buttons** (Twitter, LinkedIn, Email)
- **Newsletter signup** (future integration)
- **Comments** (future - possibly using a service like Giscus)

## SEO & Performance

### SEO
- Semantic HTML
- Open Graph meta tags
- Twitter Card meta tags
- Sitemap generation
- RSS feed
- Structured data (JSON-LD)

### Performance
- Static generation where possible
- Image optimization with next/image
- Font optimization
- Code splitting
- Minimal JavaScript
- Fast loading times (< 2s initial load)

## Accessibility
- WCAG 2.1 Level AA compliance
- Semantic HTML
- Proper heading hierarchy
- Alt text for all images
- Keyboard navigation
- Focus indicators
- Screen reader friendly

## Development Phases

### Phase 1: Foundation (MVP)
- [ ] Setup Next.js 15 project with TypeScript
- [ ] Install and configure Payload CMS 3.0
- [ ] Setup PostgreSQL (local + production)
- [ ] Configure Payload collections (Posts, Media, Pages)
- [ ] Design system (colors, typography, spacing) with Tailwind
- [ ] Core layout components (Header, Footer, Navigation)
- [ ] Homepage with hero and introduction
- [ ] Blog listing pages (/writing and /wandering)
- [ ] Individual blog post template
- [ ] About page (can be CMS-managed or static)
- [ ] Responsive design
- [ ] Admin authentication setup

### Phase 2: Content & Polish
- [ ] Tag filtering functionality
- [ ] Featured posts section on homepage
- [ ] Reading time calculation
- [ ] Tags system implementation
- [ ] Improved navigation and UX

### Phase 3: Enhanced Features
- [ ] Photo galleries
- [ ] Table of contents for long posts
- [ ] Reading progress indicator
- [ ] Social sharing
- [ ] Related posts
- [ ] Series functionality

### Phase 4: Polish & Optimization
- [ ] Animations and transitions (Framer Motion)
- [ ] SEO optimization (metadata, sitemap, RSS)
- [ ] Performance optimization
- [ ] Analytics integration
- [ ] Newsletter signup form
- [ ] Contact form

### Phase 5: Future Enhancements
- [ ] Comments system
- [ ] Search functionality
- [ ] Dark/light mode toggle (if needed beyond dark default)
- [ ] Multi-language support (Czech/English)
- [ ] CMS integration (if needed)

## Content Strategy

### Initial Content Plan
- 2-3 "About Me" pieces (professional, personal, philosophy)
- 3-5 engineering articles (AI development, modern practices)
- Van build introduction post
- 1-2 training/sports posts
- 1 coaching/psychology post

### Publishing Cadence
- **Target**: 2-4 posts per month
- **Mix**: Rotate between content pillars
- **Quality over quantity**: Well-researched, valuable content

## Brand Voice
- **Authentic**: Personal experiences and genuine insights
- **Thoughtful**: Well-considered perspectives
- **Accessible**: Technical topics explained clearly
- **Passionate**: Enthusiasm for the topics covered
- **Professional yet personal**: Expert knowledge with human touch

## Success Metrics
- Fast loading times (< 2s)
- High readability scores
- Good SEO rankings for target keywords
- Growing readership (analytics)
- Engagement (future - comments, shares)
- Professional opportunities generated

## Technical Considerations

### Performance Targets
- Lighthouse score: 90+ across all categories
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1

### Browser Support
- Modern browsers (last 2 versions)
- Progressive enhancement approach
- Graceful degradation for older browsers

### Hosting & Deployment
- **Vercel** (recommended for Next.js)
  - Automatic deployments from git
  - Preview deployments for branches
  - Custom domain setup
- **Database Hosting Options:**
  - Vercel Postgres (integrated with Vercel)
  - Supabase (generous free tier, good DX)
  - Railway (simple, developer-friendly)
  - Neon (serverless Postgres)

### Version Control
- Git with semantic commits
- Feature branches
- Clear commit messages
- Regular commits with small, focused changes

## Design System Specifications

### Colors
```
Primary Background: #1a0d2e (deep purple)
Secondary Background: #0f0818 (darker purple)
Text Primary: #ffffff (white)
Text Secondary: #b8b8d1 (light gray-purple)
Accent: #7c3aed (purple) or similar for CTAs
```

### Typography
```
Headings: Playfair Display, Georgia, serif (or similar elegant serif)
Body: Inter, system-ui, sans-serif
Code: JetBrains Mono, monospace
```

### Spacing Scale
```
xs: 0.5rem (8px)
sm: 1rem (16px)
md: 1.5rem (24px)
lg: 2rem (32px)
xl: 3rem (48px)
2xl: 4rem (64px)
3xl: 6rem (96px)
```

### Breakpoints
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## Notes
- Start simple, iterate based on usage and feedback
- Focus on content quality over technical complexity
- Keep the codebase clean and maintainable
- Document design decisions
- Regular updates to keep content fresh
