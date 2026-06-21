import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy | Ondrej Svec',
  description:
    'What the newsletter collects, why, who processes it, and how to withdraw — plain language, no dark patterns.',
}

const UPDATED = '21 June 2026'

export default function PrivacyPage() {
  return (
    <div className="max-w-[65ch] mx-auto px-6 py-12">
      <header className="mb-12 landing-rise">
        <h1 className="text-2xl font-normal mb-4 rotate-slight-left">privacy</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          plain language. no dark patterns. last updated {UPDATED}.
        </p>
        <div className="mt-4 text-muted-foreground opacity-40 text-xs">
          ────────────────────────────────────────
        </div>
      </header>

      <div className="prose-mono text-sm leading-relaxed text-muted-foreground space-y-8">
        <section>
          <h2 className="text-foreground text-base font-normal mb-2 lowercase">the short version</h2>
          <p>
            this site is a personal blog. the only personal data i collect is the email address you
            give me when you subscribe to new posts — and only after you confirm it. i don&apos;t sell
            it, i don&apos;t share it, and you can leave in one click.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-normal mb-2 lowercase">
            the newsletter — what i collect
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>your email address.</li>
            <li>
              the date you subscribed and confirmed, the consent text you agreed to, and the ip
              address of the request — kept only as proof of consent (gdpr requires this).
            </li>
          </ul>
          <p className="mt-3">
            i use <span className="text-foreground">double opt-in</span>: after you subscribe you get
            one email asking you to confirm. if you don&apos;t confirm, your address is never used and
            is eventually removed.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-normal mb-2 lowercase">why, and on what basis</h2>
          <p>
            i process your email solely to send you new blog posts. the legal basis is your consent
            (gdpr art. 6(1)(a)), which you give by ticking the box and confirming. that&apos;s the only
            thing i&apos;ll ever email you for.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-normal mb-2 lowercase">who else touches it</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="text-foreground">Resend</span> — my email provider, acting as a data
              processor under a signed data-processing agreement. it sends the emails on my behalf.
            </li>
            <li>
              <span className="text-foreground">Neon</span> — the database that stores the subscriber
              list.
            </li>
            <li>
              <span className="text-foreground">Vercel</span> — hosts the site and runs the daily job
              that sends new posts.
            </li>
          </ul>
          <p className="mt-3">no advertising networks, no data brokers, no profiling.</p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-normal mb-2 lowercase">
            how long i keep it
          </h2>
          <p>
            until you unsubscribe. when you unsubscribe i stop emailing you immediately; i may retain
            a minimal record of the unsubscribe to honour your choice and as proof of consent history.
            unconfirmed subscriptions are pruned over time.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-normal mb-2 lowercase">your rights</h2>
          <p>
            you can <span className="text-foreground">unsubscribe</span> from any email in one click —
            every email carries a one-click unsubscribe link and header. you can also ask me to access,
            correct, or delete your data, or withdraw consent entirely. just email me and i&apos;ll
            sort it.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-normal mb-2 lowercase">analytics</h2>
          <p>
            i use privacy-friendly, aggregate analytics to see which posts land. it doesn&apos;t
            identify you and isn&apos;t tied to your email.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-normal mb-2 lowercase">contact</h2>
          <p>
            questions about any of this? email{' '}
            <a
              href="mailto:hi@ondrejsvec.com"
              className="text-foreground underline underline-offset-2 hover:opacity-70"
            >
              hi@ondrejsvec.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
