# 🕵️‍♂️ Job Hunter Agent

> **Your personal AI agent to dominate the job hunt.**

An intelligent AI-powered agent designed to automate, analyze, and optimize the job search process for **software developers**. Built with the **Vercel AI SDK** and **OpenAI**, it parses resumes, analyzes job postings, and helps you track applications—all in real-time.

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
| OpenAI GPT-4o-mini | Fast, cost-effective inference |
| OpenAI GPT-4o | Advanced reasoning tasks |
| Zod | Schema validation for AI outputs |

### Backend & Data
| Technology | Purpose |
|------------|---------|
| [Supabase](https://supabase.com/) | PostgreSQL + Auth + Storage |
| [Prisma](https://www.prisma.io/) | Type-safe ORM |
| pgvector | Semantic search (future) |
| API Routes | RESTful backend (no Server Actions) |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| [Vercel](https://vercel.com/) | Deployment & Edge Functions |
| Supabase Storage | Resume file storage |
| Supabase Auth | User authentication |

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
│  Supabase Auth  │  │  Vercel AI SDK  │  │ Prisma + Supabase│
│                 │  │  + OpenAI       │  │  PostgreSQL     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Supabase Storage│
                     │  (Resume PDFs)  │
                     └─────────────────┘
```

---

## 🚀 Features (Roadmap)

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 0 | **Authentication** | ⬜ Pending | Supabase Auth (email/password, OAuth) |
| 1 | **Resume Parser** | ⬜ Pending | Upload CV, AI extraction to structured data |
| 2 | **Chat Interface** | ⬜ Pending | Streaming chat with AI agent |
| 3 | **Job Analyzer** | ⬜ Pending | Extract stack, salary, red flags from postings |
| 4 | **CV Matcher** | ⬜ Pending | Match profile vs job (compatibility %) |
| 5 | **Application Tracker** | ⬜ Pending | Kanban/List view for job applications |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended)
- [OpenAI API Key](https://platform.openai.com/)
- [Supabase Project](https://supabase.com/)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd job-hunter-agent

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Setup Prisma
pnpm prisma generate
pnpm prisma db push

# Run development server
pnpm dev
```

### Environment Variables

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (Prisma)
DATABASE_URL=postgresql://...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📁 Project Structure

```
job-hunter-agent/
├── app/
│   ├── api/              # API Routes (backend)
│   │   ├── auth/
│   │   ├── resume/
│   │   ├── chat/
│   │   └── applications/
│   ├── (auth)/           # Auth pages (login, register)
│   ├── dashboard/        # Protected routes
│   └── layout.tsx
├── components/
│   ├── ui/               # shadcn/ui components
│   └── ...
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── prisma/           # Prisma client
│   └── ai/               # AI SDK utilities
├── prisma/
│   └── schema.prisma     # Database schema
├── docs/
│   └── requirements/     # Feature requirements
└── .agent/
    └── rules.md          # Project conventions
```

---

## 🧑‍💻 Development

```bash
# Run dev server
pnpm dev

# Run Prisma Studio (DB GUI)
pnpm prisma studio

# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev
```

---

## 📄 License

MIT