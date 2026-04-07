import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About | Ondrej Svec',
  description:
    'ICF ACC Coach, builder, systems thinker. 14+ years across software architecture, technical sales, and leadership. Exploring what happens to teams when AI makes working alone easier than ever.',
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
              src="/ondrej-profile.png"
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
            14+ years in software architecture, technical sales, and IT leadership taught me technical mastery. but
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
          <h2 className="text-base font-semibold mb-4">the clearing</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            then aibility happened. i built aimee — an ai coach that walked with
            people and organizations as they figured out ai for themselves. small team,
            impossible speed, everything ai promised. it wasn&apos;t the logical next step.
            probably none of my steps were.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground mt-3">
            the speed was real. so were the lessons. i watched the connective tissue
            dissolve — not because anyone chose to cut it, but because the work stopped
            requiring it. the conversations, the check-ins, the human parts. the things
            that felt like overhead turned out to be everything.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-4 rotate-slight-right">the forest</h2>
          <p className="text-sm leading-relaxed">
            that experience sharpened a question i can&apos;t shake: how do we keep teams
            human when the work no longer requires them to be?
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground mt-3">
            i work at the intersection of coaching, technology, and the stubborn belief
            that humans need humans. ai makes working alone easier than ever. it won&apos;t
            genuinely disagree with you. it won&apos;t bring a perspective shaped by a life
            you haven&apos;t lived. that&apos;s the gap i care about.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground mt-3">
            i&apos;m looking for fellow travelers — to walk alongside, share a segment of
            the path, or simply sit with the questions. the road leads over steep mountains.
            i love mountains. i need challenges.
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
