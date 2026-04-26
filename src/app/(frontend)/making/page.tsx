import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Making | Ondrej Svec',
  description:
    "Open tools and frameworks I'm making — heart-of-gold-toolkit, harness-lab, and claude-code-lab.",
}

type Artifact = {
  name: string
  href: string
  description: string
}

const ARTIFACTS: Artifact[] = [
  {
    name: 'heart-of-gold-toolkit',
    href: 'https://github.com/ondrej-svec/heart-of-gold-toolkit',
    description:
      'claude code plugins. the tiny conventions and workflows i keep reaching for, bundled for anyone else who wants them.',
  },
  {
    name: 'harness-lab',
    href: 'https://github.com/ondrej-svec/harness-lab',
    description:
      "a framework for running harness engineering hackathons. the overlooked craft of what's around the ai: skills, context, agents, evaluation.",
  },
  {
    name: 'claude-code-lab',
    href: 'https://github.com/ondrej-svec/claude-code-lab',
    description:
      'a hands-on guide to agentic coding with claude code. nine chapters, copyable prompts, sample projects you can run through the full loop. bilingual — english and czech.',
  },
]

export default function MakingPage() {
  return (
    <div className="max-w-[65ch] mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-2xl font-normal mb-4 rotate-slight-left">making</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          three open tools i&apos;m making. small, in progress, shared as i go.
        </p>
        <div className="mt-4 text-muted-foreground opacity-40 text-xs">
          ────────────────────────────────────────
        </div>
      </header>

      <div className="space-y-1">
        {ARTIFACTS.map((artifact) => (
          <article
            key={artifact.name}
            className="group py-4 border-b border-foreground/10 last:border-b-0"
          >
            <a
              href={artifact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline hover:no-underline"
            >
              <h2 className="text-base font-normal group-hover:translate-x-1 transition-transform">
                {artifact.name}
              </h2>
            </a>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {artifact.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
