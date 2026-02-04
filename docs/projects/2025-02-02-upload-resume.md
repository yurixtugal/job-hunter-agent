# 🏗️ Resume Upload & Parsing - Implementation Design

## 🎯 Objective
Enable users to upload resume files (PDF/DOCX), store them securely in Supabase Storage, and use OpenAI to parse them into structured data (Prisma/PostgreSQL).

## 🗄️ Database Schema (Prisma)

We will add the following models to `prisma/schema.prisma`:

### `Resume`
The core entity representing an uploaded resume.
- `id`: UUID
- `userId`: Link to `User`
- `fileUrl`: Supabase Storage URL
- `status`: `PENDING` -> `PARSING` -> `COMPLETED` | `FAILED`
- `content`: Parsed JSON data (for caching/quick access)

### Detailed Relations
- `WorkExperience`: Jobs/Roles
- `Education`: Degrees
- `Skill`: Tagged skills with levels
- `Project`: Portfolio items
- `Certification`: Licenses/Certs

> **Note**: These will map 1:1 to the schema defined in `docs/requirements/01-resume-upload.md`.

## 📦 Storage Strategy

### Supabase Storage
- **Bucket**: `resumes` (Private)
- **Path Structure**: `{userId}/{timestamp}-{filename}`
- **RLS Policies**:
  - `INSERT`: Auth users can upload to their own folder.
  - `SELECT`: Auth users can read their own files.
  - `DELETE`: Auth users can delete their own files.

## 🔌 API Architecture

### 1. Upload Resume (`POST /api/resume/upload`)
- Receives `FormData` (file).
- Validates file type (PDF/DOCX) and size (<5MB).
- Uploads to Supabase Storage.
- Creates `Resume` record in DB with `fileUrl`.
- **Returns**: `resumeId`.

### 2. Parse Resume (`POST /api/resume/[id]/parse`)
- Fetches file from Storage.
- Extracts text (using `pdf-parse` or generic text extractor).
- Sends text to OpenAI (GPT-4o) with structured output schema.
- Updates `Resume` record with parsed data.
- Creates related records (`WorkExperience`, `Education`, etc.).
- **Returns**: Parsed data.

## 🧩 UI Components

- **`ResumeDropzone`**: Drag & drop area with progress bar.
- **`ParsingStatus`**: Visual indicator of parsing state.
- **`ResumePreview`**: Read-only view of parsed data (for verification).

## 🚀 Migration Plan

1. **Schema Update**: Add models to `schema.prisma`.
2. **Migration**: Run `prisma migrate dev` to create tables.
3. **Storage Init**: Create bucket and policies via SQL editor (or migration script if using Supabase CLI).
