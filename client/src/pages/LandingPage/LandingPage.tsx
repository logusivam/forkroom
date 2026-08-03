import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Helmet } from 'react-helmet-async'
import {
  PlusCircle,
  Share2,
  Code2,
  Play,
  Zap,
  Eye,
  Globe,
  FileCode2,
  Link,
  ChevronDown,
} from 'lucide-react'
import { Header } from '../../components/common/Header'
import { Footer } from '../../components/common/Footer'

export function LandingPage() {
  const [roomId, setRoomId] = useState('')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const navigate = useNavigate()

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomId.trim()) return
    navigate(`/room/${roomId.trim()}`)
  }

  const handleCreateRandom = () => {
    const randomId = Math.random().toString(36).substring(2, 10)
    navigate(`/room/${randomId}`)
  }

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is Forkroom free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Forkroom is completely free. No subscription, no credits, no hidden fees. Create as many rooms as you like."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to create an account?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Forkroom requires zero sign-up. Open the URL, enter a display name, and start coding immediately."
        }
      },
      {
        "@type": "Question",
        "name": "What programming languages are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Forkroom supports syntax highlighting for JavaScript, TypeScript, Python, HTML, CSS, and JSON. Code execution runs JavaScript only in the browser sandbox."
        }
      },
      {
        "@type": "Question",
        "name": "Is my code saved after I leave the room?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Room content exists in memory only while at least one user is connected. When all users disconnect, the room and its code are permanently deleted. Copy your code before leaving."
        }
      },
      {
        "@type": "Question",
        "name": "How many people can join one room?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "There is no hard limit. Performance is best with 2–6 concurrent users. Beyond 8 users, cursor colours cycle."
        }
      },
      {
        "@type": "Question",
        "name": "Is Forkroom good for coding interviews?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Forkroom is ideal for lightweight technical interviews — share a link and code together instantly with no setup."
        }
      },
      {
        "@type": "Question",
        "name": "Is Forkroom open source?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Forkroom's full source code is available on GitHub under the MIT licence."
        }
      },
      {
        "@type": "Question",
        "name": "Does Forkroom work on mobile?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The layout adapts for screens under 768px. For extended sessions, desktop is recommended."
        }
      }
    ]
  }

  const faqItems = [
    {
      q: 'Is Forkroom free to use?',
      a: 'Yes, Forkroom is completely free. No subscription, no credits, no hidden fees. Create as many rooms as you like.',
    },
    {
      q: 'Do I need to create an account?',
      a: 'No. Forkroom requires zero sign-up. Open the URL, enter a display name, and start coding immediately.',
    },
    {
      q: 'What programming languages are supported for syntax highlighting?',
      a: 'Forkroom supports syntax highlighting for JavaScript, TypeScript, Python, HTML, CSS, and JSON. The language selection syncs across all users in the room. Code execution (Run button) is JavaScript only — it runs in your browser sandbox.',
    },
    {
      q: 'Is my code saved after I leave the room?',
      a: 'No. Forkroom is intentionally ephemeral — room content exists in memory only while at least one user is connected. When all users disconnect, the room and its code are permanently deleted. Copy your code before leaving.',
    },
    {
      q: 'How many people can join one room?',
      a: 'There is no hard limit on the number of users per room in the current version. Rooms with up to 8 users each receive a unique cursor colour. Beyond 8, colours cycle. Performance is best with 2–6 concurrent users.',
    },
    {
      q: 'Is Forkroom good for coding interviews?',
      a: 'Yes. Forkroom is an ideal lightweight tool for technical interviews — the interviewer creates a room, shares the link, and both parties code together in real-time with no setup required. For production interview platforms with recording and time limits, purpose-built tools like CoderPad are more appropriate.',
    },
    {
      q: 'What happens when everyone leaves the room?',
      a: 'The room and all code inside it are permanently deleted from memory. There is no recovery. This is a deliberate design decision — Forkroom is a collaboration tool, not a storage tool. Always copy your code before disconnecting.',
    },
    {
      q: 'Is Forkroom open source?',
      a: 'Yes. Forkroom\'s full source code is available on GitHub under the MIT licence. Contributions are welcome.',
    },
    {
      q: 'Does Forkroom work on mobile?',
      a: 'Yes. The editor panel stacks vertically on screens narrower than 768px, with the output panel accessible via a toggle. For extended coding sessions, a desktop or laptop is recommended.',
    },
    {
      q: 'Who built Forkroom?',
      a: 'Forkroom was built by Loganathan G P under Logusivam Vision. It is a portfolio project demonstrating real-time CRDT-based collaborative editing using React, Yjs, Monaco Editor, and Socket.io.',
    },
  ]

  const featureItems = [
    {
      icon: <Zap className="w-6 h-6 text-accent-green" />,
      title: 'Zero-Conflict Real-Time Sync',
      desc: 'Powered by Yjs CRDT — the same technology used by Figma and Excalidraw. Two people editing the same line simultaneously? No problem. Edits always converge, never clash.',
    },
    {
      icon: <Eye className="w-6 h-6 text-accent-green" />,
      title: 'Live Cursors & User Presence',
      desc: 'See every collaborator\'s cursor position and display name in real-time. Colour-coded badges in the header show who\'s in the room.',
    },
    {
      icon: <Play className="w-6 h-6 text-accent-green" />,
      title: 'Run Code & Share Output',
      desc: 'Execute JavaScript directly in the browser. console.log output is captured and broadcast to all users in the room instantly. No backend required.',
    },
    {
      icon: <Globe className="w-6 h-6 text-accent-green" />,
      title: 'No Login. No Install.',
      desc: 'Open a URL, enter your name, start coding. No account, no extension, no setup. Works in any modern browser on any device.',
    },
    {
      icon: <FileCode2 className="w-6 h-6 text-accent-green" />,
      title: 'Syntax Highlighting for 6 Languages',
      desc: 'Switch between JavaScript, TypeScript, Python, HTML, CSS, and JSON. Language selection syncs to all users in the room instantly.',
    },
    {
      icon: <Link className="w-6 h-6 text-accent-green" />,
      title: 'Instant Room Sharing',
      desc: 'Every room gets a unique URL. Copy it with one click and paste it anywhere. Your collaborator joins in seconds.',
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-surface-1 text-text-primary">
      <Helmet>
        <title>Forkroom — Real-Time Collaborative Code Editor, No Login Required</title>
        <meta name="description" content="Code together instantly. Share a room link, start editing in real-time with live cursors and conflict-free sync. No signup, no install. The Google Docs for code." />
        <link rel="canonical" href="https://forkroom.dev/" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-4xl mx-auto select-none">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4 leading-tight">
          Code together. <span className="text-accent-green">Instantly.</span>
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mb-2">
          The free real-time collaborative code editor.
        </p>
        <p className="text-sm md:text-base text-text-secondary max-w-xl mb-10">
          No sign up. No install. Share a link and start coding.
        </p>

        <div className="w-full max-w-md p-6 bg-surface-2 border border-border rounded-lg shadow-xl mb-6 text-left">
          <form onSubmit={handleJoin} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Enter room ID or paste link..."
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="flex-1 bg-surface-3 border border-border rounded px-4 py-2 text-sm focus:outline-none focus:border-accent-green transition-colors"
            />
            <button
              type="submit"
              className="bg-accent-blue hover:bg-opacity-90 text-white rounded px-5 py-2 text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              Join Room &rarr;
            </button>
          </form>
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-xs text-text-secondary uppercase font-semibold">Or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>
          <button
            onClick={handleCreateRandom}
            className="w-full bg-accent-green hover:bg-opacity-95 text-black rounded py-2.5 text-sm font-bold transition-all cursor-pointer"
          >
            + Create New Room — It's Free
          </button>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="bg-surface-2 border-y border-border py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-3">
              How to Use Forkroom
            </h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              Start coding together in under 10 seconds &mdash; no account needed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start relative">
            {/* Step 1 */}
            <div className="bg-surface-1 border border-border rounded-lg p-5 relative min-h-[190px]">
              <span className="absolute top-3 left-4 text-lg font-bold text-accent-green">01</span>
              <div className="flex justify-center mb-4 mt-2">
                <PlusCircle className="w-8 h-8 text-accent-green" />
              </div>
              <h3 className="text-sm font-bold text-text-primary text-center mb-2">Create a Room</h3>
              <p className="text-xs text-text-secondary text-center leading-relaxed">
                Click 'Create New Room'. A unique shareable link is generated instantly &mdash; no sign up required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-1 border border-border rounded-lg p-5 relative min-h-[190px]">
              <span className="absolute top-3 left-4 text-lg font-bold text-accent-green">02</span>
              <div className="flex justify-center mb-4 mt-2">
                <Share2 className="w-8 h-8 text-accent-green" />
              </div>
              <h3 className="text-sm font-bold text-text-primary text-center mb-2">Share the Link</h3>
              <p className="text-xs text-text-secondary text-center leading-relaxed">
                Copy the room URL and send it to your collaborator via Slack, Discord, email, or anywhere.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-1 border border-border rounded-lg p-5 relative min-h-[190px]">
              <span className="absolute top-3 left-4 text-lg font-bold text-accent-green">03</span>
              <div className="flex justify-center mb-4 mt-2">
                <Code2 className="w-8 h-8 text-accent-green" />
              </div>
              <h3 className="text-sm font-bold text-text-primary text-center mb-2">Code Together</h3>
              <p className="text-xs text-text-secondary text-center leading-relaxed">
                Both users see keystrokes instantly. Live cursors show exactly where each person is editing.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-surface-1 border border-border rounded-lg p-5 relative min-h-[190px]">
              <span className="absolute top-3 left-4 text-lg font-bold text-accent-green">04</span>
              <div className="flex justify-center mb-4 mt-2">
                <Play className="w-8 h-8 text-accent-green" />
              </div>
              <h3 className="text-sm font-bold text-text-primary text-center mb-2">Run & Share Output</h3>
              <p className="text-xs text-text-secondary text-center leading-relaxed">
                Click Run or press Ctrl+Enter to execute JavaScript. All collaborators see the output simultaneously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-3">
              Features Built for Pair Programming
            </h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              Everything developers need to collaborate on code without leaving the browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-surface-2 border border-border rounded-lg p-6 hover:bg-surface-3 transition-colors duration-150 flex flex-col items-start"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-base font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-surface-2 border-t border-border py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-text-secondary">
              Everything you need to know about Forkroom.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div
                  key={idx}
                  className="bg-surface-1 border border-border rounded-lg overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-text-primary text-sm hover:bg-surface-3 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-text-secondary leading-relaxed border-t border-border pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
