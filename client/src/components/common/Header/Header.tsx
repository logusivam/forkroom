import { Link } from 'react-router'

export function Header() {
  return (
    <header className="w-full h-14 bg-surface-2 border-b border-border flex items-center justify-between px-6 select-none z-50">
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

      <nav className="flex items-center space-x-6 text-sm font-semibold">
        <a
          href="https://github.com/logusivam/forkroom"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-secondary hover:text-text-primary transition-colors"
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
    </header>
  )
}
