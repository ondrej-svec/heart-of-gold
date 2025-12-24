/**
 * Converts Markdown content to Lexical JSON format
 * This is a simple converter that handles common Markdown elements
 */

interface LexicalTextNode {
  type: 'text'
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  version: number
}

interface LexicalHeadingNode {
  type: 'heading'
  children: LexicalTextNode[]
  direction: 'ltr'
  format: string
  indent: number
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  version: number
}

interface LexicalParagraphNode {
  type: 'paragraph'
  children: LexicalTextNode[]
  direction: 'ltr'
  format: string
  indent: number
  textFormat: number
  textStyle: string
  version: number
}

interface LexicalListNode {
  type: 'list'
  children: LexicalListItemNode[]
  direction: 'ltr'
  format: string
  indent: number
  listType: 'bullet' | 'number'
  start: number
  tag: 'ul' | 'ol'
  version: number
}

interface LexicalListItemNode {
  type: 'listitem'
  children: (LexicalTextNode | LexicalListNode)[]
  direction: 'ltr'
  format: string
  indent: number
  version: number
  value: number
}

interface LexicalLinkNode {
  type: 'link'
  children: LexicalTextNode[]
  direction: 'ltr'
  fields: {
    linkType: 'custom'
    url: string
    newTab: boolean
  }
  format: string
  indent: number
  version: number
}

type LexicalNode =
  | LexicalHeadingNode
  | LexicalParagraphNode
  | LexicalListNode
  | LexicalListItemNode
  | LexicalLinkNode

interface LexicalRoot {
  root: {
    type: 'root'
    children: LexicalNode[]
    direction: 'ltr'
    format: string
    indent: number
    version: number
  }
}

function createTextNode(text: string, format: number = 0): LexicalTextNode {
  return {
    type: 'text',
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  }
}

function createParagraphNode(children: LexicalTextNode[]): LexicalParagraphNode {
  return {
    type: 'paragraph',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    textStyle: '',
    version: 1,
  }
}

function createHeadingNode(level: number, text: string): LexicalHeadingNode {
  return {
    type: 'heading',
    children: [createTextNode(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    tag: `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
    version: 1,
  }
}

function parseInlineFormatting(text: string): LexicalTextNode[] {
  const nodes: LexicalTextNode[] = []

  // Simple regex patterns for bold, italic, and links
  // This is a simplified version - a full parser would be more robust
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|_.*?_|\[.*?\]\(.*?\))/g)

  for (const part of parts) {
    if (!part) continue

    // Bold (**text** or __text__)
    if ((part.startsWith('**') && part.endsWith('**')) ||
        (part.startsWith('__') && part.endsWith('__'))) {
      const cleanText = part.slice(2, -2)
      nodes.push(createTextNode(cleanText, 1)) // format: 1 = bold
    }
    // Italic (*text* or _text_)
    else if ((part.startsWith('*') && part.endsWith('*')) ||
             (part.startsWith('_') && part.endsWith('_'))) {
      const cleanText = part.slice(1, -1)
      nodes.push(createTextNode(cleanText, 2)) // format: 2 = italic
    }
    // Links [text](url)
    else if (part.match(/\[.*?\]\(.*?\)/)) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/)
      if (match) {
        nodes.push(createTextNode(match[1]))
        // Note: Lexical links need special handling - for now just use text
      }
    }
    // Plain text
    else {
      nodes.push(createTextNode(part))
    }
  }

  return nodes.length > 0 ? nodes : [createTextNode(text)]
}

export function markdownToLexical(markdown: string): LexicalRoot {
  const lines = markdown.split('\n')
  const nodes: LexicalNode[] = []
  let currentListItems: string[] = []
  let currentListIndent = 0

  const flushList = () => {
    if (currentListItems.length > 0) {
      const listItems: LexicalListItemNode[] = currentListItems.map((item, index) => ({
        type: 'listitem',
        children: [createTextNode(item)],
        direction: 'ltr',
        format: '',
        indent: currentListIndent,
        version: 1,
        value: index + 1,
      }))

      nodes.push({
        type: 'list',
        children: listItems,
        direction: 'ltr',
        format: '',
        indent: 0,
        listType: 'bullet',
        start: 1,
        tag: 'ul',
        version: 1,
      })

      currentListItems = []
      currentListIndent = 0
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Skip empty lines
    if (line.trim() === '') {
      flushList()
      continue
    }

    // Skip hashtags (like #work-on-myself/blog)
    if (line.trim().startsWith('#') && !line.trim().startsWith('# ')) {
      continue
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
    if (headingMatch) {
      flushList()
      const level = headingMatch[1].length
      const text = headingMatch[2]
      nodes.push(createHeadingNode(level, text))
      continue
    }

    // List items (bullet points with * or -)
    const listMatch = line.match(/^(\s*)[\*\-]\s+(.+)/)
    if (listMatch) {
      const indent = Math.floor(listMatch[1].length / 2)
      const text = listMatch[2]

      // If indent changed, flush previous list
      if (currentListItems.length > 0 && indent !== currentListIndent) {
        flushList()
      }

      currentListIndent = indent
      currentListItems.push(text)
      continue
    }

    // Regular paragraph
    flushList()
    if (line.trim()) {
      const textNodes = parseInlineFormatting(line.trim())
      nodes.push(createParagraphNode(textNodes))
    }
  }

  // Flush any remaining list
  flushList()

  return {
    root: {
      type: 'root',
      children: nodes,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

/**
 * Extracts title from markdown (first # heading or filename)
 */
export function extractTitle(markdown: string, fallback: string = 'Untitled'): string {
  const lines = markdown.split('\n')
  for (const line of lines) {
    const headingMatch = line.match(/^#\s+(.+)/)
    if (headingMatch) {
      return headingMatch[1]
    }
  }
  return fallback
}

/**
 * Generates a slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Extracts a description from markdown content (first paragraph)
 */
export function extractDescription(markdown: string, maxLength: number = 160): string {
  const lines = markdown.split('\n')

  for (const line of lines) {
    // Skip headings and hashtags
    if (line.trim().startsWith('#')) continue
    // Skip list items
    if (line.trim().match(/^[\*\-]\s/)) continue
    // Skip empty lines
    if (!line.trim()) continue

    // Found first paragraph
    const text = line.trim()
    if (text.length <= maxLength) {
      return text
    }
    return text.substring(0, maxLength - 3) + '...'
  }

  return 'No description available'
}
