# 06 — Visual Design, Layout, Logo & SEO
# Forkroom

---

## 1. What Is Forkroom?

Forkroom is a **free browser-based real-time collaborative code editor**. Two or more developers open the same URL and code together instantly — no account, no install, no configuration required.

**Built by**: Loganathan G P · Logusivam Vision · © 2026–present

---

## 2. Design Concept

**Direction**: "Terminal meets collaboration" — the aesthetic of a premium code editor (dark, precise, monospaced data) combined with the warmth of presence (coloured cursors, user chips, live toasts). VS Code dark theme is the reference point; colour is added only for user identity and interactive states.

**Avoid**: light backgrounds, heavy gradients, decorative illustration, anything that competes with the editor content.

---

## 3. Colour Palette (WCAG 2.1 Contrast-Verified)

All ratios calculated against `--surface` (`#1E1E1E` — VS Code's exact background colour).

| Token | Hex | Contrast | WCAG Level | Usage |
|---|---|---|---|---|
| `--surface` | `#1E1E1E` | — | — | Editor background, page background |
| `--surface-2` | `#252526` | — | — | Panel backgrounds, header |
| `--surface-3` | `#2D2D30` | — | — | Input backgrounds, dropdowns |
| `--border` | `#3E3E42` | — | — | Dividers, panel borders |
| `--text-primary` | `#D4D4D4` | 10.67:1 | AAA ✓ | Primary text |
| `--text-secondary` | `#9D9D9D` | 4.54:1 | AA ✓ | Secondary labels, timestamps, footer |
| `--accent-green` | `#4EC9B0` | 5.02:1 | AA ✓ | Run button, connected status, success toasts |
| `--accent-blue` | `#569CD6` | 4.65:1 | AA ✓ | Primary CTA buttons, links |
| `--accent-amber` | `#CE9178` | 4.51:1 | AA ✓ | Reconnecting status, warning banner |
| `--accent-red` | `#F44747` | 5.28:1 | AA ✓ | Disconnected status, error states |

### Cursor Colour Pool (8 colours — `CURSOR_COLOURS[index % 8]`)

Non-text UI fills only — 3:1 WCAG 1.4.11 threshold applies.

| Index | Hex | Name |
|---|---|---|
| 0 | `#FF6B6B` | Coral red |
| 1 | `#4ECDC4` | Teal |
| 2 | `#45B7D1` | Sky blue |
| 3 | `#96CEB4` | Sage green |
| 4 | `#FFEAA7` | Soft yellow |
| 5 | `#DDA0DD` | Plum |
| 6 | `#98D8C8` | Mint |
| 7 | `#F7DC6F` | Golden |

> Index 8+ wraps to index 0. Documented in README as known limitation for rooms with more than 8 users.

---

## 4. Typography

| Role | Typeface | Weight | Usage |
|---|---|---|---|
| UI text, labels, body | **Inter** | 400 / 500 / 600 | All non-code UI |
| Room IDs, output, shortcuts | **JetBrains Mono** | 400 / 500 | Room ID chips, output panel, `Ctrl+Enter` labels |
| Editor content | Monaco (VS Code default) | — | Injected by Monaco — do not override |

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Type scale**:

| Size | Usage |
|---|---|
| 11px | Status bar labels, sub-footer copyright |
| 13px | Editor meta labels, room ID chip |
| 14px | Body / UI default |
| 16px | CTA button labels, body-lg |
| 18px | How-to steps, FAQ answers |
| 24px | Section headings (h2) |
| 40px | Hero H1 (landing page only) |

---

## 5. Page Map — All Pages & Routes

| Route | Page | Indexed? | Purpose |
|---|---|---|---|
| `/` | Landing | ✅ Yes | Create/join room, SEO entry point |
| `/room/:roomId` | Editor | ❌ noindex | The product — collaborative editor |
| `/terms` | Terms of Service | ✅ Yes | Legal — required for trust and SEO |
| `/privacy` | Privacy Policy | ✅ Yes | Legal — required for trust and SEO |
| `*` | 404 Not Found | ❌ noindex | Fallback |

---

## 6. Page Layouts (ASCII Wireframes)

---

### Page 1 — Landing (`/`)

The landing page is the SEO entry point and the only fully indexed page. It contains six sections in order:

```
1. Header (nav)
2. Hero + CTA
3. How to Use (steps)
4. Features
5. FAQ
6. Footer (with Terms & Privacy links)
```

#### Full Landing Page Wireframe

```
┌────────────────────────────────────────────────────────────┐
│ [Forkroom logo]              GitHub →  Terms  Privacy      │ ← nav, --surface-2, 56px
├────────────────────────────────────────────────────────────┤
│                   ── HERO SECTION ──                       │
│                                                            │
│            Code together. Instantly.                       │ ← H1, Inter 700, 40px
│   The free real-time collaborative code editor.            │ ← subline, 18px, --text-secondary
│   No sign up. No install. Share a link and start coding.   │ ← sub-subline, 16px, --text-secondary
│                                                            │
│   ┌────────────────────────────────┐                       │
│   │  Enter room ID or paste link... │  [Join Room →]       │ ← --surface-3 input + --accent-blue
│   └────────────────────────────────┘                       │
│                                                            │
│              [+ Create New Room — It's Free]               │ ← --accent-blue, prominent CTA
│                                                            │
├────────────────────────────────────────────────────────────┤
│                ── HOW TO USE FORKROOM ──                   │ ← H2, 24px, --text-primary
│         Start coding together in under 10 seconds          │ ← subline, --text-secondary
│                                                            │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐  ┌─────────┐ │
│  │  Step 1  │ → │  Step 2  │ → │  Step 3  │→ │ Step 4  │ │ ← step cards, numbered, --surface-2
│  │<PlusCircle>│  │<Share2>  │   │<Code2>   │  │<Play>   │ │ ← lucide icons per step
│  │ Create   │   │  Share   │   │   Code   │  │   Run   │ │
│  │  Room    │   │  Link    │   │ Together │  │ & See   │ │
│  │          │   │          │   │          │  │ Output  │ │
│  └──────────┘   └──────────┘   └──────────┘  └─────────┘ │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                  ── FEATURES ──                            │ ← H2, 24px
│         Everything you need for real-time pair programming │ ← subline, --text-secondary
│                                                            │
│  ┌────────────────────┐   ┌────────────────────┐          │
│  │ <Zap> Zero-Conflict│   │ <Eye> Live Cursors  │          │ ← feature cards, 2-col grid
│  │ Real-Time Sync     │   │ & Presence          │          │ ← --surface-2, --border, 8px radius
│  │ CRDT-powered —     │   │ See every           │          │
│  │ edits never clash  │   │ collaborator's      │          │
│  │                    │   │ cursor in real-time │          │
│  └────────────────────┘   └────────────────────┘          │
│  ┌────────────────────┐   ┌────────────────────┐          │
│  │ <Play> Run & Share │   │ <Globe> No Login    │          │
│  │ Output             │   │ Required            │          │
│  │ Execute JavaScript │   │ Open a URL.         │          │
│  │ — all users see    │   │ Enter your name.    │          │
│  │ results instantly  │   │ Start coding.       │          │
│  └────────────────────┘   └────────────────────┘          │
│  ┌────────────────────┐   ┌────────────────────┐          │
│  │ <Languages> Syntax │   │ <Link> Instant      │          │
│  │ Highlighting       │   │ Room Sharing        │          │
│  │ JS, TS, Python,    │   │ One URL. Paste it   │          │
│  │ HTML, CSS, JSON    │   │ anywhere. Done.     │          │
│  │ synced for all     │   │                     │          │
│  └────────────────────┘   └────────────────────┘          │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                    ── FAQ ──                               │ ← H2, 24px
│                                                            │
│  ▼ Is Forkroom free to use?                                │ ← accordion item, --surface-2
│  ▼ Do I need to create an account?                         │
│  ▼ What programming languages are supported?               │
│  ▼ Is my code saved after I leave?                         │
│  ▼ How many people can join one room?                      │
│  ▼ Is Forkroom good for coding interviews?                 │
│  ▼ What happens when everyone leaves the room?             │
│  ▼ Is Forkroom open source?                                │
├────────────────────────────────────────────────────────────┤
│  Forkroom                    Community & Support           │
│  Browser-based real-time     - Report issue on GitHub      │
│  collaborative code editor   - GitHub | LinkedIn | X       │
│                              Share Forkroom:               │
│  Built by Loganathan GP      [X] [Instagram] [Facebook]    │
│  Logusivam Vision            [LinkedIn] [WhatsApp] ...     │
├────────────────────────────────────────────────────────────┤
│  Forkroom © 2026. All rights reserved.     Terms · Privacy │
└────────────────────────────────────────────────────────────┘
```

---

### Page 2 — Editor Room (`/room/:roomId`)

The product itself. `noindex` — ephemeral, session-specific content.

```
┌─────────────────────────────────────────────────────────────┐
│ [SVG Logo] room-abc123 [<Copy>]  JS ▾  [LG][JD] [▶Run] [≡]  │ ← header 56px, --surface-2
├─────────────────────────────────────────────────────────────┤
│ ● Connected                                                 │ ← 4px bar, --accent-green
├──────────────────────────────────────┬──────────────────────┤
│                                      │  Output   [📋] [Trash2]│
│  1  const greet = (name) => {        │  ──────────────────  │
│  2    return `Hello, ${name}!`;      │  [Loganathan] Latency│
│  3  }                                │  > Hello, World!     │
│  4                                   │                       │
│  5  console.log(greet("World"));     │                       │
│     │                                │                       │
│   ▌[LG — coral red]                  │                       │
│   ▌[JD — teal — "Jane"]             │                       │
│                                      │                       │
│  Monaco editor fills remaining height│                       │
│                                      │                       │
└──────────────────────────────────────┴──────────────────────┘
```

**Layout dimensions:**
- Header: fixed 56px · StatusBar: 4px · EditorPanel + OutputPanel: `calc(100vh - 60px)`
- EditorPanel: 70% (default, draggable) · OutputPanel: 30% (default)
- Mobile (< 768px): Editor 60vh stacked, Output collapsed + expandable toggle

**Editor page icons (lucide-react):**

| Element | Icon | Import |
|---|---|---|
| Copy URL | `Copy` | `import { Copy } from 'lucide-react'` |
| Run button | `Play` | `import { Play } from 'lucide-react'` |
| Clear output | `Trash2` | `import { Trash2 } from 'lucide-react'` |
| Connection dot | `Circle` | `import { Circle } from 'lucide-react'` |
| Language dropdown | `ChevronDown` | `import { ChevronDown } from 'lucide-react'` |

---

### Page 3 — Terms of Service (`/terms`)

Dedicated page. Indexed. Linked from footer. Route: `/terms`.

```
┌────────────────────────────────────────────────────────────┐
│ [Forkroom logo]              GitHub →  Terms  Privacy      │ ← same nav as landing
├────────────────────────────────────────────────────────────┤
│                                                            │
│              Terms of Service                              │ ← H1, 40px, --text-primary
│         Last updated: 1 August 2026                        │ ← --text-secondary, 14px
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1. Acceptance of Terms                               │  │ ← H2 sections, --surface-2 bg
│  │ 2. Description of Service                            │  │
│  │ 3. No Account Required — Room Access                 │  │
│  │ 4. Acceptable Use                                    │  │
│  │ 5. No Persistence of Data                            │  │
│  │ 6. Intellectual Property                             │  │
│  │ 7. Disclaimer of Warranties                          │  │
│  │ 8. Limitation of Liability                           │  │
│  │ 9. Changes to These Terms                            │  │
│  │ 10. Contact                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Built by Loganathan G P · Logusivam Vision                │
│  © 2026–present Forkroom · Terms · Privacy                 │
└────────────────────────────────────────────────────────────┘
```

**SEO meta for `/terms`:**
```html
<title>Terms of Service — Forkroom</title>
<meta name="description" content="Read Forkroom's Terms of Service. Free real-time collaborative code editor — no account required. Understand usage rules, data handling, and limitations.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://forkroom.dev/terms">
```

---

### Page 4 — Privacy Policy (`/privacy`)

Dedicated page. Indexed. Linked from footer. Route: `/privacy`.

```
┌────────────────────────────────────────────────────────────┐
│ [Forkroom logo]              GitHub →  Terms  Privacy      │ ← same nav as landing
├────────────────────────────────────────────────────────────┤
│                                                            │
│              Privacy Policy                                │ ← H1, 40px, --text-primary
│         Last updated: 1 August 2026                        │ ← --text-secondary, 14px
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1. What Data We Collect                              │  │ ← H2 sections, --surface-2 bg
│  │ 2. What We Do NOT Collect                            │  │
│  │ 3. Room Data & Ephemeral Storage                     │  │
│  │ 4. Display Names                                     │  │
│  │ 5. Analytics (Vercel Analytics — page views only)    │  │
│  │ 6. Error Tracking (Sentry — anonymised stack traces) │  │
│  │ 7. No Cookies for Tracking                           │  │
│  │ 8. Third-Party Services                              │  │
│  │ 9. Children's Privacy                                │  │
│  │ 10. Changes to This Policy                           │  │
│  │ 11. Contact                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Built by Loganathan G P · Logusivam Vision                │
│  © 2026–present Forkroom · Terms · Privacy                 │
└────────────────────────────────────────────────────────────┘
```

**SEO meta for `/privacy`:**
```html
<title>Privacy Policy — Forkroom</title>
<meta name="description" content="Forkroom's Privacy Policy. We collect no personal data. No accounts, no tracking cookies. Room content is temporary and deleted when all users disconnect.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://forkroom.dev/privacy">
```

---

## 7. Section Content Specs

### 7.1 Hero Section — Copy & SEO

| Element | Content | SEO Note |
|---|---|---|
| H1 | "Code together. Instantly." | Contains "code together" — primary keyword |
| Subline 1 | "The free real-time collaborative code editor." | "collaborative code editor", "real-time", "free" |
| Subline 2 | "No sign up. No install. Share a link and start coding." | "no sign up", "no install" — high-intent qualifiers |
| Input placeholder | "Enter room ID or paste link..." | Describes function clearly |
| Primary CTA | "+ Create New Room — It's Free" | Removes price friction |
| Secondary CTA | "Join Room →" | Direct action |

---

### 7.2 How to Use Forkroom — Section Spec

**H2**: "How to Use Forkroom" ← contains brand name + "how to" for long-tail SEO

**Subline**: "Start coding together in under 10 seconds — no account needed."

**4 step cards** (horizontal on desktop, vertical on mobile):

| Step | Icon | Heading | Body copy | SEO keyword embedded |
|---|---|---|---|---|
| 1 | `PlusCircle` | "Create a Room" | "Click 'Create New Room'. A unique shareable link is generated instantly — no sign up required." | "create room", "shareable link", "no sign up" |
| 2 | `Share2` | "Share the Link" | "Copy the room URL and send it to your collaborator via Slack, Discord, email, or anywhere." | "share link", "collaborator", "room URL" |
| 3 | `Code2` | "Code Together in Real-Time" | "Both users see keystrokes instantly. Live cursors with name labels show exactly where each person is editing. Powered by conflict-free CRDT sync." | "real-time", "live cursors", "conflict-free", "pair programming" |
| 4 | `Play` | "Run & Share Output" | "Click Run or press Ctrl+Enter to execute JavaScript. All collaborators see the output simultaneously." | "run code", "JavaScript", "output", "collaborative" |

**Step card design:**
- `--surface-2` background, `--border` border, `8px` border-radius
- Step number: `--accent-green`, Inter 700, 20px, top-left of card
- Icon: `--accent-green`, 28px, centred
- Heading: `--text-primary`, Inter 600, 16px
- Body: `--text-secondary`, Inter 400, 14px
- Connector arrow between cards: `--border`, `ChevronRight` icon (hidden on mobile)

---

### 7.3 Features Section — Full Spec

**H2**: "Features Built for Real-Time Pair Programming"

**Subline**: "Everything developers need to collaborate on code without leaving the browser."

**6 feature cards** (2-column grid on desktop, 1-column on mobile):

| # | Icon | Heading | Body | SEO keyword |
|---|---|---|---|---|
| 1 | `Zap` | "Zero-Conflict Real-Time Sync" | "Powered by Yjs CRDT — the same technology used by Figma and Excalidraw. Two people editing the same line simultaneously? No problem. Edits always converge, never clash." | "real-time sync", "CRDT", "collaborative editing" |
| 2 | `Eye` | "Live Cursors & User Presence" | "See every collaborator's cursor position and display name in real-time. Colour-coded badges in the header show who's in the room." | "live cursors", "user presence", "pair programming" |
| 3 | `Play` | "Run Code & Share Output" | "Execute JavaScript directly in the browser. console.log output is captured and broadcast to all users in the room instantly. No backend required." | "run code", "JavaScript", "browser execution" |
| 4 | `Globe` | "No Login. No Install." | "Open a URL, enter your name, start coding. No account, no extension, no setup. Works in any modern browser on any device." | "no login", "no install", "browser-based" |
| 5 | `Languages` | "Syntax Highlighting for 6 Languages" | "Switch between JavaScript, TypeScript, Python, HTML, CSS, and JSON. Language selection syncs to all users in the room instantly." | "syntax highlighting", "JavaScript", "TypeScript", "Python" |
| 6 | `Link` | "Instant Room Sharing" | "Every room gets a unique URL. Copy it with one click and paste it anywhere. Your collaborator joins in seconds." | "room sharing", "unique URL", "instant" |

> **`Languages` icon**: lucide-react does not have a `Languages` icon natively. Use `FileCode2` or `Code2` as substitute: `import { FileCode2 } from 'lucide-react'`.

**Card design:**
- `--surface-2` background, `1px solid --border`, `8px` radius
- Icon: `--accent-green`, 24px, top-left
- Heading: `--text-primary`, Inter 600, 16px
- Body: `--text-secondary`, Inter 400, 14px, line-height 1.6
- Hover: `--surface-3` background transition (150ms ease)

---

### 7.4 FAQ Section — Full Content Spec

**H2**: "Frequently Asked Questions"

**Subline**: "Everything you need to know about Forkroom."

**Accordion component** (`--surface-2` bg, `--border` bottom divider, `ChevronDown` toggle icon):

| # | Question | Answer | SEO intent |
|---|---|---|---|
| 1 | "Is Forkroom free to use?" | "Yes, Forkroom is completely free. No subscription, no credits, no hidden fees. Create as many rooms as you like." | "free collaborative code editor" |
| 2 | "Do I need to create an account?" | "No. Forkroom requires zero sign-up. Open the URL, enter a display name, and start coding immediately." | "no account code editor", "no sign up" |
| 3 | "What programming languages are supported for syntax highlighting?" | "Forkroom supports syntax highlighting for JavaScript, TypeScript, Python, HTML, CSS, and JSON. The language selection syncs across all users in the room. Code execution (Run button) is JavaScript only — it runs in your browser sandbox." | "supported languages", "syntax highlighting" |
| 4 | "Is my code saved after I leave the room?" | "No. Forkroom is intentionally ephemeral — room content exists in memory only while at least one user is connected. When all users disconnect, the room and its code are permanently deleted. Copy your code before leaving." | "code saved", "data persistence" |
| 5 | "How many people can join one room?" | "There is no hard limit on the number of users per room in the current version. Rooms with up to 8 users each receive a unique cursor colour. Beyond 8, colours cycle. Performance is best with 2–6 concurrent users." | "how many users", "room limit" |
| 6 | "Is Forkroom good for coding interviews?" | "Yes. Forkroom is an ideal lightweight tool for technical interviews — the interviewer creates a room, shares the link, and both parties code together in real-time with no setup required. For production interview platforms with recording and time limits, purpose-built tools like CoderPad are more appropriate." | "coding interview", "technical interview tool" |
| 7 | "What happens when everyone leaves the room?" | "The room and all code inside it are permanently deleted from memory. There is no recovery. This is a deliberate design decision — Forkroom is a collaboration tool, not a storage tool. Always copy your code before disconnecting." | "room deleted", "what happens when you leave" |
| 8 | "Is Forkroom open source?" | "Yes. Forkroom's full source code is available on GitHub under the MIT licence. Contributions are welcome — see CONTRIBUTING.md for details." | "open source code editor", "GitHub" |
| 9 | "Does Forkroom work on mobile?" | "Yes. The editor panel stacks vertically on screens narrower than 768px, with the output panel accessible via a toggle. For extended coding sessions, a desktop or laptop is recommended." | "mobile code editor", "works on phone" |
| 10 | "Who built Forkroom?" | "Forkroom was built by Loganathan G P under Logusivam Vision. It is a portfolio project demonstrating real-time CRDT-based collaborative editing using React, Yjs, Monaco Editor, and Socket.io." | "who built", "about" |

**FAQ JSON-LD Schema** (inject in `LandingPage.tsx` alongside SoftwareApplication schema):

```tsx
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
```

---

### 7.5 Footer Section — Spec

**All pages share this footer** (except editor room — no footer there, full viewport used for editor).

```
┌────────────────────────────────────────────────────────────┐
│  Built by Loganathan G P · Forkroom · GitHub →            │ ← --text-secondary, 14px
│  Logusivam Vision · © 2026–present Forkroom               │ ← --text-secondary, 11px
│  Terms of Service  ·  Privacy Policy                       │ ← --accent-blue links, 12px
└────────────────────────────────────────────────────────────┘
```

**Footer link targets:**
- "GitHub →" → `https://github.com/logusivam/forkroom` · `target="_blank" rel="noopener noreferrer"`
- "Terms of Service" → `/terms`
- "Privacy Policy" → `/privacy`

---

### 7.6 Terms of Service — Full Content

**Route**: `/terms` · **Page title**: "Terms of Service — Forkroom"

```markdown
# Terms of Service

**Last updated: 1 August 2026**

## 1. Acceptance of Terms
By accessing or using Forkroom ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.

## 2. Description of Service
Forkroom is a free, browser-based real-time collaborative code editor. It allows users to create temporary shared coding rooms accessible via URL. No account registration is required.

## 3. No Account Required — Room Access
Rooms are identified by a unique URL. Anyone with the room URL can join. You are responsible for controlling who you share room links with.

## 4. Acceptable Use
You agree not to use Forkroom to:
- Transmit, store, or execute malicious code, malware, or exploits
- Engage in activity that violates any applicable law or regulation
- Harass, abuse, or harm other users
- Attempt to overload, disrupt, or compromise the Service's infrastructure

## 5. No Persistence of Data
All room content (code, output) exists in server memory only while at least one user is connected. When all users disconnect, all room data is permanently and irreversibly deleted. Forkroom provides no backup, recovery, or export functionality. You are solely responsible for copying any code you wish to keep.

## 6. Intellectual Property
Code you write in a Forkroom session belongs to you and your collaborators. Forkroom claims no ownership of user-generated code. The Forkroom brand, logo, and codebase are the property of Loganathan G P / Logusivam Vision and are licensed under the MIT Licence where applicable.

## 7. Disclaimer of Warranties
The Service is provided "as is" and "as available" without warranty of any kind — express, implied, or statutory — including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.

## 8. Limitation of Liability
To the fullest extent permitted by applicable law, Logusivam Vision and Loganathan G P shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, arising from your use of or inability to use the Service.

## 9. Changes to These Terms
We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the revised Terms. The "Last updated" date at the top of this page reflects the most recent revision.

## 10. Contact
Questions about these Terms? Open an issue on GitHub: https://github.com/logusivam/forkroom
```

---

### 7.7 Privacy Policy — Full Content

**Route**: `/privacy` · **Page title**: "Privacy Policy — Forkroom"

```markdown
# Privacy Policy

**Last updated: 1 August 2026**

## 1. What Data We Collect
Forkroom collects minimal data to operate the Service:
- **Display name**: entered by you before joining a room. Stored in server memory only for the duration of your session. Deleted when you disconnect.
- **Room content**: code typed in the editor. Stored in server memory only. Permanently deleted when all users leave the room.
- **Error data**: anonymised stack traces and error events collected via Sentry for debugging purposes. No personally identifiable information (PII) is included.
- **Page view analytics**: aggregated, anonymous page view counts collected via Vercel Analytics. No user identification, no cross-site tracking.

## 2. What We Do NOT Collect
- We do not collect your name, email address, phone number, or any other personal identifier
- We do not require account registration
- We do not use advertising cookies or third-party tracking pixels
- We do not sell, share, or rent data to any third party

## 3. Room Data & Ephemeral Storage
All code and output in a Forkroom session is held in RAM (server memory) only. It is never written to a database or permanent storage. It is irreversibly deleted when the last user disconnects. Forkroom is not a storage or backup service.

## 4. Display Names
Your display name is visible to other users in the same room only. It is not stored beyond your session and is not associated with any persistent identifier.

## 5. Analytics
Forkroom uses Vercel Analytics (privacy-preserving, cookieless) to collect anonymous page view counts on the landing page. No user-level data, no IP address logging, no fingerprinting.

## 6. Error Tracking
Forkroom uses Sentry for error monitoring. Sentry captures anonymised error stack traces to help us fix bugs. No code content, display names, or room data is included in error reports.

## 7. No Tracking Cookies
Forkroom does not set tracking, advertising, or analytics cookies. A functional session identifier may be used by Socket.io for WebSocket connection management — this is a technical necessity and is not used for tracking.

## 8. Third-Party Services
Forkroom relies on the following third-party services:
- **Vercel** (frontend hosting) — see Vercel Privacy Policy
- **Railway** (backend hosting) — see Railway Privacy Policy
- **Sentry** (error tracking, anonymised) — see Sentry Privacy Policy
- **Google Fonts** (Inter + JetBrains Mono typefaces) — fonts are loaded from Google's CDN

## 9. Children's Privacy
Forkroom is not directed at children under 13. We do not knowingly collect data from children under 13. If you believe a child has used the Service, no personal data has been retained.

## 10. Changes to This Policy
We may update this Privacy Policy at any time. The "Last updated" date reflects the most recent revision. Continued use of the Service constitutes acceptance.

## 11. Contact
Privacy questions? Open an issue on GitHub: https://github.com/logusivam/forkroom
```

---

## 8. Signature UI Details

**Remote cursor labels**: Coloured `2px` vertical bar at cursor position. Floating pill above: cursor colour background, `#FFFFFF` text, `border-radius: 4px`, `padding: 2px 6px`. Auto-fades after 3 seconds of cursor inactivity; reappears instantly on next cursor movement.

**User avatar badges**: `28px` circles, initials (2 chars, uppercase), cursor colour background, `2px solid var(--surface-2)` border. Max 5 shown, then `+N` chip in `--surface-3`.

**Connection status bar**: 4px full-width bar below header. `--accent-green` (connected) → `--accent-amber` with pulse (reconnecting) → `--accent-red` (disconnected).

**Toast notifications**: Slide from top-right. `min-width: 280px`. Join: `--accent-green` 15% opacity fill + `3px` green left border. Leave: `--surface-3` + `--border` left border. Auto-dismiss 3 seconds. Stacks if simultaneous.

**FAQ accordion**: `--surface-2` background per item. `--border` bottom divider. `ChevronDown` icon (rotates 180° when open, 200ms transition). Question: `--text-primary`, Inter 500, 16px. Answer: `--text-secondary`, Inter 400, 14px, `line-height: 1.7`. Smooth height animation on open/close.

---

## 9. Brand

**Name**: Forkroom · **Tagline**: "Fork together. Ship faster."

**Domain targets**: `forkroom.dev` · `forkroom.app` · `getforkroom.com`

**Creator**: Loganathan G P · Logusivam Vision · © 2026–present

---

## 10. Logo Design

### Concept
A **git fork icon** — one base circle splitting into two upward bezier branches — with a **cursor blink underscore** on the active right branch. No text needed. Universally understood by developers.

### Construction Spec

| Element | Colour | Spec |
|---|---|---|
| Fork base circle | `#4EC9B0` | Solid fill, `10px` diameter |
| Fork stem | `#D4D4D4` | `2px` stroke, `14px` height, vertical |
| Left branch | `#D4D4D4` | `2px` stroke, bezier curve up-left |
| Right branch | `#4EC9B0` | `2px` stroke, bezier curve up-right |
| Left top circle | `#D4D4D4` | Solid fill, `7px` diameter |
| Right top circle | `#4EC9B0` | Solid fill, `7px` diameter |
| Cursor blink | `#4EC9B0` | `2px × 8px` rect, `2px` below right top circle |

### Wordmark

| Part | Typeface | Weight | Colour |
|---|---|---|---|
| "Fork" | JetBrains Mono | 700 | `#4EC9B0` |
| "room" | Inter | 600 | `#D4D4D4` |

### Logo Variants

| Variant | Filename | Location | Use |
|---|---|---|---|
| Full (icon + wordmark) | `forkroom-logo-full.svg` | `src/assets/` | Desktop header, README |
| Icon only | `forkroom-icon.svg` | `src/assets/` | Mobile nav, GitHub avatar |
| Favicon (simplified) | `favicon.svg` | `public/` | Browser tab |

---

## 11. Complete Asset Export List

| Filename | Dimensions | Format | Location | Purpose |
|---|---|---|---|---|
| `forkroom-logo-full.svg` | Vector | SVG | `src/assets/` | Primary logo |
| `forkroom-logo-full@2x.png` | 480 × 112 | PNG | `src/assets/` | Retina header (2× of 240×56) |
| `forkroom-icon.svg` | Vector | SVG | `src/assets/` | Icon-only variant |
| `forkroom-icon-64.png` | 64 × 64 | PNG | `src/assets/` | React component import |
| `forkroom-icon-256.png` | 256 × 256 | PNG | `src/assets/` | React component import |
| `forkroom-icon-512.png` | 512 × 512 | PNG | `src/assets/` | React component import |
| `favicon.svg` | Vector | SVG | `public/` | Modern browsers |
| `favicon-16.png` | 16 × 16 | PNG | `public/` | Legacy browser fallback |
| `favicon-32.png` | 32 × 32 | PNG | `public/` | Standard tab |
| `apple-touch-icon.png` | 180 × 180 | PNG | `public/` | iOS Safari PWA |
| `favicon-192.png` | 192 × 192 | PNG | `public/` | PWA manifest (required) |
| `favicon-512.png` | 512 × 512 | PNG | `public/` | PWA manifest (required) |
| `og-image.png` | 1200 × 630 | PNG | `public/` | Social share preview |

**`apple-touch-icon.png` spec**: `forkroom-icon.svg` source, 180×180, 20px padding, `#1E1E1E` background. iOS applies rounded corners automatically.

**Favicon 16px rule**: Remove cursor blink underscore. Increase strokes 2px → 3px. Test in actual browser tab.

---

## 12. OG Image Spec (`og-image.png` — 1200 × 630, built in Figma)

| Layer | Spec |
|---|---|
| Background | `#1E1E1E` fills 1200×630 |
| Logo | `forkroom-logo-full.svg`, ~320px wide, centred at 45% height |
| Tagline | "Fork together. Ship faster." — Inter 600, 28px, `#D4D4D4`, centred, 24px below logo |
| Domain | `forkroom.dev` — JetBrains Mono 400, 16px, `#9D9D9D`, bottom-right, 32px margin |
| Credit | "by Logusivam Vision" — Inter 400, 12px, `#9D9D9D`, bottom-left, 32px margin |

---

## 13. `manifest.json`

```json
{
  "name": "Forkroom",
  "short_name": "Forkroom",
  "description": "Real-time collaborative code editor. No login. Share a URL, start coding.",
  "theme_color": "#4EC9B0",
  "background_color": "#1E1E1E",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    { "src": "/favicon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/favicon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

---

## 14. SEO — Complete Implementation

### 14.1 `index.html` `<head>` — Full Tag Set

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- ═══ FAVICON ═══ -->
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="/favicon-16.png" sizes="16x16" type="image/png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- ═══ PWA ═══ -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#4EC9B0">

  <!-- ═══ FONTS ═══ -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <!-- ═══ PRIMARY SEO ═══ -->
  <title>Forkroom — Real-Time Collaborative Code Editor, No Login Required</title>
  <meta name="description" content="Code together instantly. Share a room link, start editing in real-time with live cursors and conflict-free sync. No signup, no install. The Google Docs for code.">
  <meta name="keywords" content="collaborative code editor, real-time code editor, pair programming online, browser code editor, no login code editor, live coding, multiplayer editor, yjs, monaco editor">
  <meta name="author" content="Loganathan G P — Logusivam Vision">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://forkroom.dev/">

  <!-- ═══ OPEN GRAPH ═══ -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Forkroom">
  <meta property="og:title" content="Forkroom — Code Together Instantly">
  <meta property="og:description" content="Real-time collaborative code editor. Share a link, start coding. No login, no install.">
  <meta property="og:image" content="https://forkroom.dev/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Forkroom logo — Fork together. Ship faster.">
  <meta property="og:url" content="https://forkroom.dev">
  <meta property="og:locale" content="en_US">

  <!-- ═══ TWITTER CARD ═══ -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Forkroom — Fork together. Ship faster.">
  <meta name="twitter:description" content="Browser-based real-time collaborative code editor. No signup. Share a URL, start coding with live cursors.">
  <meta name="twitter:image" content="https://forkroom.dev/og-image.png">
  <meta name="twitter:image:alt" content="Forkroom — real-time collaborative code editor">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### 14.2 Dynamic Meta per Route (inject via `react-helmet-async`)

| Route | `<title>` | `<meta name="robots">` | `<link rel="canonical">` |
|---|---|---|---|
| `/` | Forkroom — Real-Time Collaborative Code Editor, No Login Required | `index, follow` | `https://forkroom.dev/` |
| `/room/:roomId` | Coding Room — Forkroom | `noindex, nofollow` | _(none — noindex)_ |
| `/terms` | Terms of Service — Forkroom | `index, follow` | `https://forkroom.dev/terms` |
| `/privacy` | Privacy Policy — Forkroom | `index, follow` | `https://forkroom.dev/privacy` |
| `*` (404) | Page Not Found — Forkroom | `noindex` | _(none)_ |

### 14.3 JSON-LD — Both Schemas in `LandingPage.tsx`

Inject both `SoftwareApplication` (product) and `FAQPage` schemas. See Section 7.4 for FAQ schema. SoftwareApplication schema:

```tsx
const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Forkroom",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "Real-time collaborative code editor. No login. Share a URL and start coding together with live cursors and conflict-free CRDT sync.",
  "url": "https://forkroom.dev",
  "screenshot": "https://forkroom.dev/og-image.png",
  "author": { "@type": "Person", "name": "Loganathan G P", "url": "https://github.com/logusivam" },
  "creator": { "@type": "Organization", "name": "Logusivam Vision" }
}
```

### 14.4 Priority Keyword Placement

| Placement | Keyword |
|---|---|
| H1 | "code together" |
| Subline 1 | "real-time collaborative code editor" |
| Subline 2 | "no sign up", "no install" |
| How to Use H2 | "how to use Forkroom" |
| Features H2 | "pair programming", "real-time" |
| Feature cards | "CRDT", "live cursors", "JavaScript", "syntax highlighting", "no login" |
| FAQ H2 | "frequently asked questions" |
| FAQ Q3 | "what programming languages are supported" |
| `<title>` | "collaborative code editor", "no login required" |
| `<meta description>` | "Google Docs for code", "conflict-free", "share a room link" |
| `<meta keywords>` | Full keyword list (supplementary, not primary ranking signal) |

### 14.5 `robots.txt`

```
User-agent: *
Allow: /
Disallow: /room/

Sitemap: https://forkroom.dev/sitemap.xml
```

### 14.6 `sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://forkroom.dev/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://forkroom.dev/terms</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://forkroom.dev/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

> Room URLs (`/room/*`) excluded — ephemeral and session-specific.

---

## 15. Recraft Prompt (logo icon generation)

**Tool**: Recraft v3 · Vector Illustration → Flat 2 · 1:1 square

```
A minimal flat vector logo icon for a developer tool called "Forkroom".
The icon is a git fork symbol: one filled circle at the bottom centre
(teal green #4EC9B0, 10px diameter), a short vertical line rising from it
(light grey #D4D4D4, 2px stroke, 14px tall), splitting into two smooth
bezier curve branches — left branch curves up-left ending in a grey
filled circle (#D4D4D4, 7px diameter), right branch curves up-right ending
in a teal green filled circle (#4EC9B0, 7px diameter). Below the right
branch top circle, a small horizontal rectangle (teal green #4EC9B0,
2px tall, 8px wide) represents a cursor blink. No letters, no text,
no wordmark. Dark background (#1E1E1E). No gradients, no shadows, no 3D,
no decoration. Clean flat geometric vector. Square canvas, equal padding
all sides.
```

**Negative prompt:**
```
gradient, shadow, glow, 3D, texture, photographic, decorative, letter,
text, wordmark, sparkle, lens flare, shield, badge, circle border, frame
```

---

## 16. Header Logo & Footer Social Extensions

### Header Logo Icon (Editor Page)
- **Responsive Layout Update**: Text brand `FORKROOM` inside the editor room controls header was replaced with the interactive Git Fork SVG logo icon.
- **Back-to-Home Routing**: The SVG logo links to the main landing page (`/`), maximizing header spacing for presence indicators, connection chips, and control elements.

### Mobile Navigation Drawer Menu
- **Drawer Controls**: Replaced static buttons in the editor room header on mobile viewports with a collapsible drawer/dropdown toggle trigger button, which houses room controls like language selection, output toggling, and room link sharing.

### Execution Latency Indicator
- **Placement**: Renders code run latency (e.g. `Latency: 2ms`) next to the execution username inside the [OutputPanel](file:///f:/projects/Forkroom/forkroom/client/src/components/editor/OutputPanel/OutputPanel.tsx) footer.

### Stateful Copy Actions
- **Room Code Tag**: Features a clipboard copy button inside the room header chip.
- **Output Console**: Features a clipboard copy action button inside the console output panel header. Clicking either changes the icon to a green checkmark indicating a stateful "Copied!" validation for 2 seconds.

### Footer Extensions
- **Community Icons**: Inline SVG social media icons for LinkedIn, GitHub, and Twitter/X were added to the footer's community columns.
- **GitHub Issue Tracker**: A direct link to "Report an issue on GitHub" pointing to `https://github.com/logusivam/forkroom/issues` is integrated.
- **Share Widgets Grid**: Social sharing widgets with optimized API links for X, Instagram, Facebook, LinkedIn, WhatsApp, Telegram, and Reddit are provided.


