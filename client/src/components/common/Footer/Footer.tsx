import { Link } from 'react-router'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const yearDisplay = currentYear > 2026 ? `2026 - ${currentYear}` : '2026'

  return (
    <footer className="w-full bg-surface-2 border-t border-border py-8 px-6 select-none">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left Side (Stacked) */}
        <div className="flex flex-col text-sm text-text-secondary text-center md:text-left space-y-1">
          <span className="text-accent-green font-bold font-mono">Forkroom</span>
          <span>Built by <strong className="text-text-primary">Loganathan GP</strong></span>
          <span>Logusivam Vision</span>
        </div>

        {/* Center Side */}
        <div className="text-xs text-text-secondary text-center">
          Forkroom &copy; {yearDisplay} . All rights reserved
        </div>

        {/* Right Side (Links) */}
        <div className="flex justify-center md:justify-end items-center space-x-4 sm:space-x-6 text-xs font-semibold">
          <a
            href="https://github.com/logusivam/forkroom"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:underline whitespace-nowrap"
          >
            GitHub
          </a>
          <Link to="/terms" className="text-accent-blue hover:underline whitespace-nowrap">
            Terms
          </Link>
          <Link to="/privacy" className="text-accent-blue hover:underline whitespace-nowrap">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
