import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work with me | Ondrej Svec',
  description:
    'Coaching, solution architecture, AI adoption, harness engineering, and speaking — ways we might work together as AI reshapes how we build and who we are.',
}

type Offering = {
  name: string
  description: string
}

const OFFERINGS: Offering[] = [
  {
    name: 'coaching',
    description:
      "i'm an icf-certified coach. i work with people in the middle of a change they didn't entirely choose — a new role, a new chapter, or the slow realisation that the thing they were good at is being rewritten by ai. that one's close to home: i've watched brilliant engineers and builders quietly wonder where they fit now. the work isn't about reaching some new high. it's about orientation. both feet on the ground. what still matters to you, and who you want to be on the other side. individuals, and sometimes whole teams.",
  },
  {
    name: 'solution architecture',
    description:
      "taking a tangle of requirements and constraints and finding the shape that actually holds. system design, the trade-offs nobody wants to make explicit, how the pieces fit and where they'll break under load. fourteen years across architecture, technical sales, and leadership taught me this part. i love a hard problem — and i love helping teams actually get things out into the world, and get them right.",
  },
  {
    name: 'working well with ai',
    description:
      "i help teams actually adopt ai instead of just talking about it. the hard part was never the model — it's everything around it. the skills, the context, the workflows, the verification that decides whether ai makes your team faster or just louder. claude code, agentic coding, the unglamorous craft of it. hands-on, in your real codebase, not slides.",
  },
  {
    name: 'harness engineering hackathons',
    description:
      "a focused format for leveling up a team's ai craft together. we spend the time building real harnesses — skills, context, agents, evaluation — on your own problems, and your people leave knowing how to keep going without me. i call it harness lab.",
  },
  {
    name: 'speaking & webinars',
    description:
      "talks and sessions on ai, teams, and the human parts that are easy to lose in the rush. for engineers, for leaders, for anyone who can feel the ground moving and wants to think about it honestly.",
  },
]

export default function WorkingPage() {
  return (
    <div className="max-w-[65ch] mx-auto px-6 py-12">
      <header className="mb-12 landing-rise">
        <h1 className="text-2xl font-normal mb-4 rotate-slight-left">working</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          ways we might work together.
        </p>
        <div className="mt-4 text-muted-foreground opacity-40 text-xs">
          ────────────────────────────────────────
        </div>
      </header>

      <div className="prose-mono mb-10">
        <p className="text-sm leading-relaxed text-muted-foreground">
          ai is changing how we build, how we work, and quietly, who we think we
          need to be. i&apos;ve spent years on the technical side of that shift,
          and years on the human side — coaching people through change. i
          don&apos;t think you can separate the two anymore. here&apos;s how i
          can help.
        </p>
      </div>

      <div className="space-y-1">
        {OFFERINGS.map((offering) => (
          <article
            key={offering.name}
            className="motion-card group py-4 border-b border-foreground/10 last:border-b-0"
          >
            <h2 className="text-base font-normal group-hover:translate-x-1 transition-transform">
              {offering.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {offering.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-12 text-muted-foreground opacity-40 text-xs">
        ────────────────────────────────────────
      </div>

      <footer className="mt-6 prose-mono">
        <p className="text-sm leading-relaxed text-muted-foreground">
          not sure which of these you need? that&apos;s completely fine — most
          good conversations start there. write to me at{' '}
          <a
            href="mailto:os@ondrejsvec.com"
            className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-all"
          >
            os@ondrejsvec.com
          </a>{' '}
          and we&apos;ll figure it out.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground mt-4">
          no pitch. just a conversation.
        </p>
      </footer>
    </div>
  )
}
