# 🕵️‍♂️ Job Hunter Agent

> **Your personal AI agent to dominate the job hunt.**

An intelligent AI-powered agent designed to automate, analyze, and optimize the job search process for **software developers**. Built with the **Vercel AI SDK**, **Next.js 16**, and **Supabase**, it parses resumes, analyzes job postings, and helps you track applications—all in real-time.

---

## 🛠️ Tech Stack

A modern, scalable architecture built on the **Vercel ecosystem**.

### Core Framework
| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org/) | App Router, React 19, API Routes |
| TypeScript | Type-safe development |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible UI components |

### AI & Agent
| Technology | Purpose |
|------------|---------|
| [Vercel AI SDK](https://sdk.vercel.ai/docs) | AI orchestration & streaming |
| [AI SDK Agents](https://sdk.vercel.ai/docs/ai-sdk-core/agents) | Multi-step AI workflows |
| OpenAI GPT-4o | Advanced reasoning tasks |
| Zod 4 | Schema validation for forms and AI outputs |

### Backend & Data
| Technology | Purpose |
|------------|---------|
| [Supabase](https://supabase.com/) | PostgreSQL + Auth + Storage |
| Supabase Types | Generated TypeScript types from DB |
| API Routes | RESTful backend architecture |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  Next.js 16 + React 19 + shadcn/ui + Tailwind              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API ROUTES                             │
│  /api/auth/* │ /api/resume/* │ /api/chat/* │ /api/jobs/*   │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Supabase Auth  │  │  Vercel AI SDK  │  │  Supabase DB    │
│                 │  │  + OpenAI       │  │ (Postgres)      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Supabase Storage│
                     │  (Resume PDFs)  │
                     └─────────────────┘
```

---

## 🚀 Features Status

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 1 | **Authentication** | ✅ Done | Supabase Auth (email/password) + Protected Routes |
| 2 | **Landing Page** | ✅ Done | Responsive landing with session awareness |
| 3 | **Resume Parser** | ⏳ In Progress | Upload CV, AI extraction to structured data |
| 4 | **Chat Interface** | ⬜ Pending | Streaming chat with AI agent |
| 5 | **Job Analyzer** | ⬜ Pending | Extract stack, salary, red flags from postings |
| 6 | **Application Tracker** | ⬜ Pending | Kanban/List view for job applications |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended)
- OpenAI API Key
- Supabase Project

### Installation

```bash
# Clone the repository
git clone git@github.com:yurixtugal/job-hunter-agent.git
cd job-hunter-agent

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Fill in your Supabase and OpenAI keys in .env.local

# Run development server
pnpm dev
```

### Environment Variables (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
OPENAI_API_KEY=sk-...
```

---

## 🧑‍💻 Development Conventions

- **API Routes Only**: We avoid Next.js Server Actions in favor of Route Handlers for better control and separation.
- **Zod 4**: All validation is performed using JSR Zod 4.
- **Supabase Types**: We use `npx supabase gen types` to maintain full-stack type safety.

---

## 👩‍🍳 Credits

Made with 🚀 **Passion** by **yurixtugal**.

---

## 📄 License

MIT
