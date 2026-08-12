import { Helmet } from 'react-helmet-async'
import { Header } from '../../components/common/Header'
import { Footer } from '../../components/common/Footer'

export function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-1 text-text-primary">
      <Helmet>
        <title>Privacy Policy — Forkroom</title>
        <meta
          name="description"
          content="Forkroom's Privacy Policy. We collect no personal data. No accounts, no tracking cookies. Room content is temporary and deleted when all users disconnect."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://forkroom.dev/privacy" />
      </Helmet>

      <Header />

      <main className="w-full flex-grow max-w-4xl mx-auto px-6 py-16 select-none">
        <h1 className="text-4xl font-extrabold mb-2 text-text-primary">Privacy Policy</h1>
        <p className="text-sm text-text-secondary mb-10">Last updated: 1 August 2026</p>

        <div className="w-full space-y-8 text-sm text-text-secondary leading-relaxed bg-surface-2 border border-border rounded-lg p-4 sm:p-8">
          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">1. What Data We Collect</h2>
            <p>Forkroom collects minimal data to operate the Service:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>
                <strong>Display name</strong>: entered by you before joining a room. Stored in server memory only for the duration of your session. Deleted when you disconnect.
              </li>
              <li>
                <strong>Room content</strong>: code typed in the editor. Stored in server memory only. Permanently deleted when all users leave the room.
              </li>
              <li>
                <strong>Error data</strong>: anonymised stack traces and error events collected via Sentry for debugging purposes. No personally identifiable information (PII) is included.
              </li>
              <li>
                <strong>Page view analytics</strong>: aggregated, anonymous page view counts collected via Vercel Analytics. No user identification, no cross-site tracking.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">2. What We Do NOT Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>We do not collect your name, email address, phone number, or any other personal identifier</li>
              <li>We do not require account registration</li>
              <li>We do not use advertising cookies or third-party tracking pixels</li>
              <li>We do not sell, share, or rent data to any third party</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">3. Room Data & Ephemeral Storage</h2>
            <p>
              All code and output in a Forkroom session is held in RAM (server memory) only. It is never written to a database or permanent storage. It is irreversibly deleted when the last user disconnects. Forkroom is not a storage or backup service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">4. Display Names</h2>
            <p>
              Your display name is visible to other users in the same room only. It is not stored beyond your session and is not associated with any persistent identifier.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">5. Analytics</h2>
            <p>
              Forkroom uses Vercel Analytics (privacy-preserving, cookieless) to collect anonymous page view counts on the landing page. No user-level data, no IP address logging, no fingerprinting.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">6. Error Tracking</h2>
            <p>
              Forkroom uses Sentry for error monitoring. Sentry captures anonymised error stack traces to help us fix bugs. No code content, display names, or room data is included in error reports.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">7. No Tracking Cookies</h2>
            <p>
              Forkroom does not set tracking, advertising, or analytics cookies. A functional session identifier may be used by Socket.io for WebSocket connection management — this is a technical necessity and is not used for tracking.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">8. Third-Party Services</h2>
            <p>Forkroom relies on the following third-party services:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>
                <strong>Vercel</strong> (frontend hosting) — see Vercel Privacy Policy
              </li>
              <li>
                <strong>Railway</strong> (backend hosting) — see Railway Privacy Policy
              </li>
              <li>
                <strong>Sentry</strong> (error tracking, anonymised) — see Sentry Privacy Policy
              </li>
              <li>
                <strong>Google Fonts</strong> (Inter + JetBrains Mono typefaces) — fonts are loaded from Google's CDN
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">9. Children's Privacy</h2>
            <p>
              Forkroom is not directed at children under 13. We do not knowingly collect data from children under 13. If you believe a child has used the Service, no personal data has been retained.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy at any time. The "Last updated" date reflects the most recent revision. Continued use of the Service constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">11. Contact</h2>
            <p>
              Privacy questions? Open an issue on GitHub:{' '}
              <a
                href="https://github.com/logusivam/forkroom"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline break-all"
              >
                https://github.com/logusivam/forkroom
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
