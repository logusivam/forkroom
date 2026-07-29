import { Helmet } from 'react-helmet-async'

export function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet>
        <title>Terms of Service — Forkroom</title>
        <link rel="canonical" href="https://forkroom.dev/terms" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="space-y-6 text-text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">1. Acceptance of Terms</h2>
          <p>By using Forkroom, you agree to these terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">2. Description of Service</h2>
          <p>Forkroom is a temporary, collaborative browser code editor. We do not guarantee code persistence.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">3. User Conduct</h2>
          <p>Users must not use Forkroom for malicious purposes or write harmful scripts.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">4. Room Expiry & Data</h2>
          <p>Rooms are temporary. Data is cleared once all collaborators leave.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">5. Privacy</h2>
          <p>We do not store room details or code snippets permanently.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">6. Intellectual Property</h2>
          <p>You retain ownership of the code you write in Forkroom.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">7. Disclaimer of Warranties</h2>
          <p>The service is provided "as is" without warranties of any kind.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">8. Limitation of Liability</h2>
          <p>Forkroom is not liable for data loss or any damages from service use.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">9. Changes to Terms</h2>
          <p>We reserve the right to change these terms at any time.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">10. Governing Law</h2>
          <p>These terms are governed by the laws of India.</p>
        </section>
      </div>
    </div>
  )
}
