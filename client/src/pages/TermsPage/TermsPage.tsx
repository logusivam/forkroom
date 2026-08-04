import { Helmet } from 'react-helmet-async'
import { Header } from '../../components/common/Header'
import { Footer } from '../../components/common/Footer'

export function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-1 text-text-primary">
      <Helmet>
        <title>Terms of Service — Forkroom</title>
        <meta
          name="description"
          content="Read Forkroom's Terms of Service. Free real-time collaborative code editor — no account required. Understand usage rules, data handling, and limitations."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://forkroom.dev/terms" />
      </Helmet>

      <Header />

      <main className="w-full flex-grow max-w-4xl mx-auto px-6 py-16 select-none">
        <h1 className="text-4xl font-extrabold mb-2 text-text-primary">Terms of Service</h1>
        <p className="text-sm text-text-secondary mb-10">Last updated: 1 August 2026</p>

        <div className="w-full space-y-8 text-sm text-text-secondary leading-relaxed bg-surface-2 border border-border rounded-lg p-4 sm:p-8">
          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Forkroom ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">2. Description of Service</h2>
            <p>
              Forkroom is a free, browser-based real-time collaborative code editor. It allows users to create temporary shared coding rooms accessible via URL. No account registration is required.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">3. No Account Required — Room Access</h2>
            <p>
              Rooms are identified by a unique URL. Anyone with the room URL can join. You are responsible for controlling who you share room links with.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">4. Acceptable Use</h2>
            <p>You agree not to use Forkroom to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>Transmit, store, or execute malicious code, malware, or exploits</li>
              <li>Engage in activity that violates any applicable law or regulation</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to overload, disrupt, or compromise the Service's infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">5. No Persistence of Data</h2>
            <p>
              All room content (code, output) exists in server memory only while at least one user is connected. When all users disconnect, all room data is permanently and irreversibly deleted. Forkroom provides no backup, recovery, or export functionality. You are solely responsible for copying any code you wish to keep.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">6. Intellectual Property</h2>
            <p>
              Code you write in a Forkroom session belongs to you and your collaborators. Forkroom claims no ownership of user-generated code. The Forkroom brand, logo, and codebase are the property of Loganathan G P / Logusivam Vision and are licensed under the MIT Licence where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">7. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" and "as available" without warranty of any kind — express, implied, or statutory — including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, Logusivam Vision and Loganathan G P shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, arising from your use of or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">9. Changes to These Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the revised Terms. The "Last updated" date at the top of this page reflects the most recent revision.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-primary mb-3">10. Contact</h2>
            <p>
              Questions about these Terms? Open an issue on GitHub:{' '}
              <a
                href="https://github.com/logusivam/forkroom"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline"
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
