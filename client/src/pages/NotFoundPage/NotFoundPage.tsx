import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router'
import { ROUTES } from '../../constants/routes'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <Helmet>
        <title>Page Not Found — Forkroom</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <h1 className="text-5xl font-bold text-accent-red mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-text-secondary mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to={ROUTES.LANDING}
        className="px-6 py-3 bg-accent-blue text-white rounded-md font-medium hover:bg-opacity-90 transition-colors"
      >
        Go to Home
      </Link>
    </div>
  )
}
