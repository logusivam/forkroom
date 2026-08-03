import { Link } from 'react-router'

export function Footer() {
  return (
    <footer className="w-full bg-surface-2 border-t border-border py-8 px-6 text-center select-none">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="text-sm text-text-secondary">
          Built by{' '}
          <strong className="text-text-primary">Loganathan G P</strong> ·{' '}
          <span className="text-accent-green font-bold">Forkroom</span> ·{' '}
          <a
            href="https://github.com/logusivam/forkroom"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:underline font-semibold"
          >
            GitHub &rarr;
          </a>
        </div>
        <div className="text-xs text-text-secondary">
          Logusivam Vision · &copy; 2026&ndash;present Forkroom
        </div>
        <div className="flex justify-center space-x-6 text-xs font-semibold">
          <Link to="/terms" className="text-accent-blue hover:underline">
            Terms of Service
          </Link>
          <Link to="/privacy" className="text-accent-blue hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
