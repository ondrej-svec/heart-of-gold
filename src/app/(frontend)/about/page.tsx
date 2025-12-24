import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About | Ondrej Svec',
  description:
    'ICF ACC Coach, NeuroLeadership certified, former Tech Lead. Cultivating systems that empower wholehearted living.',
}

export default function AboutPage() {
  return (
    <div className="max-w-[65ch] mx-auto px-6 py-12">
      {/* Header with photo */}
      <header className="mb-12">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          {/* Photo - simple, no fancy styling */}
          <div className="w-32 h-32 shrink-0 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
            <Image
              src="/media/IMG-001-author-portrait-v6-900x900.jpg"
              alt="Ondrej Svec"
              width={128}
              height={128}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          <div>
            <h1 className="text-2xl font-normal mb-2 rotate-slight-left">about</h1>
            <p className="text-muted-foreground text-sm">prague · icf acc coach · builder</p>
          </div>
        </div>

        <div className="mt-6 text-muted-foreground opacity-40 text-xs">
          ────────────────────────────────────────
        </div>
      </header>

      {/* Story - simple prose */}
      <div className="prose-mono space-y-8">
        <section>
          <h2 className="text-base font-semibold mb-4">the roots</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            12+ years in software architecture and IT leadership taught me technical mastery. but
            burnout in 2021 taught me something deeper—perfectionism isn&apos;t a superpower,
            it&apos;s a 20-ton shield preventing flight.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground mt-3">
            i dove into psychology and neuroscience. completed blue core coaching at ibm. became
            neuroleadership certified. learned from brené brown that vulnerability creates
            connection, not weakness.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-4">the trunk</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            january 2024: tech lead. one month later: managing 28 people across teams. the
            experience taught me that caring about people means accepting their realities are
            different from mine.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground mt-3">
            by year&apos;s end, i made the leap. left corporate to become an icf acc coach. a gentle
            whisper spoke of life&apos;s brevity and the courage to embrace the undefined.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-4">the branches</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            i work with individuals and teams—not to reach new highs, but to help them orient
            themselves, plant both feet on the ground, slow down, focus on what matters.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground mt-3">
            i&apos;m an introvert energized by small groups who actually care. those coaching
            circles where we support each other through life&apos;s storms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-4 rotate-slight-right">the forest</h2>
          <p className="text-sm leading-relaxed">
            my vision: cultivating systems that empower us to live wholeheartedly, to nurture
            ourselves so we can authentically support others.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground mt-3">
            i&apos;m looking for fellow travelers—to walk alongside, share a segment of the path, or
            simply exchange insights. the road leads over steep mountains. i love mountains. i need
            challenges.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground mt-3">
            i may not know all the details. that&apos;s the beautiful mystery.
          </p>
        </section>
      </div>

      {/* ASCII divider */}
      <div className="mt-12 text-muted-foreground opacity-40 text-xs">
        ────────────────────────────────────────
      </div>

      {/* Simple footer note */}
      <footer className="mt-6 text-xs text-muted-foreground">
        <p>let&apos;s walk together.</p>
      </footer>
    </div>
  )
}
