# 📋 Job Hunter Agent - Requirements

This directory contains all project requirements, organized by modules/features.

## Directory Structure

```
docs/requirements/
├── README.md                    # This file
├── 00-authentication.md         # Supabase Auth integration
├── 01-resume-upload.md          # CV upload, parsing & storage
├── 02-core-chat.md              # Interactive chat with agent
├── 03-job-analyzer.md           # Job posting analysis
├── 04-cv-matcher.md             # CV vs Job matching
└── 05-application-tracker.md    # Application management (Kanban)
```

---

## System Overview

**Job Hunter Agent** is an AI-powered agent designed to help **software developers** optimize their job search by:

1. **Resume Management** - Upload, parse, and structure CV data
2. **Interactive Chat** - Converse with the AI agent
3. **Job Analysis** - Extract tech stack, salary estimates, red flags
4. **CV Matching** - Generate compatibility % between profile and job
5. **Application Tracking** - Kanban/List view for job applications

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router, React 19) |
| UI | shadcn/ui + Tailwind CSS |
| AI Core | Vercel AI SDK + OpenAI |
| LLM | GPT-4o-mini (speed) / GPT-4o (reasoning) |
| Database | Supabase (PostgreSQL + pgvector) |
| ORM | Prisma |
| Auth | Supabase Auth |
| File Storage | Supabase Storage |
| Validation | Zod |

---

## Feature Priority

| # | Feature | Priority | Status | Dependencies |
|---|---------|----------|--------|--------------|
| 0 | Authentication | 🔴 Critical | ⬜ Pending | None |
| 1 | Resume Upload & Parser | 🔴 Critical | ⬜ Pending | Auth |
| 2 | Core Chat | 🟠 High | ⬜ Pending | Auth, Resume |
| 3 | Job Analyzer | 🟠 High | ⬜ Pending | Chat |
| 4 | CV Matcher | 🟡 Medium | ⬜ Pending | Resume, Job Analyzer |
| 5 | Application Tracker | 🟡 Medium | ⬜ Pending | Job Analyzer |

---

## Architecture Decisions

- **API Routes over Server Actions** - All backend logic uses `/api` routes
- **Prisma as ORM** - Type-safe database access with PostgreSQL
- **Supabase Storage** - File uploads (no AWS S3)
- **pgvector** - For future semantic search and embeddings
