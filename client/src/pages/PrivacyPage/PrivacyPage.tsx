import { Helmet } from 'react-helmet-async'

export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet>
        <title>Privacy Policy — Forkroom</title>
        <link rel="canonical" href="https://forkroom.dev/privacy" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">1. Introduction</h2>
          <p>We respect your privacy. This policy describes how we handle room sessions.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">2. Information Collection</h2>
          <p>We do not collect personal identifiers or require logins. We collect room user names and session IDs.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">3. Cookies</h2>
          <p>We do not use cookies for tracking or ad targeting.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">4. Code Snippets Data</h2>
          <p>Code snippets edits are synchronized in memory using Yjs CRDT. We do not persist code snippets in any database.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">5. Data Deletion</h2>
          <p>All in-memory room data is deleted when all users disconnect from the room.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">6. Security</h2>
          <p>We implement rate limiting and origin checks to safeguard our server resources.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">7. Third-Party Services</h2>
          <p>We use Vercel for hosting and Railway for WebSocket servers.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">8. Children's Privacy</h2>
          <p>Forkroom is intended for developers and does not knowingly collect kids' details.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">9. International Transfers</h2>
          <p>Server instances run globally depending on hosting availability.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">10. Contact Us</h2>
          <p>For questions, contact our support channels.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">11. Changes to Policy</h2>
          <p>We update this policy from time to time as features require.</p>
        </section>
      </div>
    </div>
  )
}
