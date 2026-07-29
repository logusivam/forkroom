import { Helmet } from 'react-helmet-async'

export function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <Helmet>
        <title>Forkroom — Real-Time Collaborative Code Editor, No Login Required</title>
        <meta name="description" content="Code together instantly. Share a room link, start editing in real-time with live cursors and conflict-free sync." />
        <link rel="canonical" href="https://forkroom.dev/" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <h1 className="text-4xl font-bold mb-4">Fork together. Ship faster.</h1>
      <p className="text-text-secondary max-w-lg mb-8">
        Collaborative editor features will be built here in the next phases.
      </p>
    </div>
  )
}
