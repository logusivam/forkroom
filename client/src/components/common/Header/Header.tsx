import { useState } from 'react'
import { Link } from 'react-router'
import { Menu, X, FileText, Shield } from 'lucide-react'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative w-full h-14 bg-surface-2 border-b border-border flex items-center justify-between px-6 select-none z-55">
      <Link to="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
        {/* SVG Git Fork Logo */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block"
        >
          {/* Fork base circle */}
          <circle cx="12" cy="19" r="3" fill="#4EC9B0" />
          {/* Fork stem */}
          <path d="M12 16V10" stroke="#D4D4D4" strokeWidth="2" strokeLinecap="round" />
          {/* Left branch bezier */}
          <path d="M12 12C9 12 7 10 7 7" stroke="#D4D4D4" strokeWidth="2" strokeLinecap="round" />
          {/* Right branch bezier */}
          <path d="M12 12C15 12 17 10 17 7" stroke="#4EC9B0" strokeWidth="2" strokeLinecap="round" />
          {/* Left top circle */}
          <circle cx="7" cy="6" r="2" fill="#D4D4D4" />
          {/* Right top circle */}
          <circle cx="17" cy="6" r="2" fill="#4EC9B0" />
          {/* Cursor blink */}
          <rect x="16" y="9" width="2" height="6" fill="#4EC9B0" className="animate-pulse" />
        </svg>
        <span className="flex items-center text-lg">
          <span className="font-bold font-mono text-accent-green">Fork</span>
          <span className="font-semibold text-text-primary">room</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold">
        <a
          href="https://github.com/logusivam/forkroom"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-secondary hover:text-text-primary transition-colors flex items-center"
        >
          GitHub &rarr;
        </a>
        <Link to="/terms" className="text-text-secondary hover:text-text-primary transition-colors">
          Terms
        </Link>
        <Link to="/privacy" className="text-text-secondary hover:text-text-primary transition-colors">
          Privacy
        </Link>
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-text-primary hover:text-accent-green transition-colors focus:outline-none cursor-pointer"
        aria-label="Toggle Menu"
      >
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <nav className="absolute top-14 left-0 w-full bg-surface-2 border-b border-border p-4 flex flex-col space-y-4 z-50 shadow-lg md:hidden">
          <a
            href="https://github.com/logusivam/forkroom"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="text-text-secondary hover:text-text-primary transition-colors flex items-center font-semibold text-sm"
          >
            <svg className="w-4 h-4 mr-2.5 text-accent-blue" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            GitHub
          </a>
          <Link
            to="/terms"
            onClick={() => setMenuOpen(false)}
            className="text-text-secondary hover:text-text-primary transition-colors flex items-center font-semibold text-sm"
          >
            <FileText className="w-4 h-4 mr-2.5 text-accent-green" />
            Terms of Service
          </Link>
          <Link
            to="/privacy"
            onClick={() => setMenuOpen(false)}
            className="text-text-secondary hover:text-text-primary transition-colors flex items-center font-semibold text-sm"
          >
            <Shield className="w-4 h-4 mr-2.5 text-accent-amber" />
            Privacy Policy
          </Link>
        </nav>
      )}
    </header>
  )
}
