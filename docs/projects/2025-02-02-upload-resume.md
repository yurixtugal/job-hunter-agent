# 🏗️ Resume Upload & Parsing - Implementation Design

## 🎯 Objective
Enable users to upload resume files (PDF/DOCX), store them securely in Supabase Storage, and track the upload in PostgreSQL.

**Phase 1 (Current)**: Upload file to Storage + create record in DB.  
**Phase 2 (Future)**: AI parsing with OpenAI to extract structured data.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Supabase Storage | File storage (PDFs) |
| Supabase PostgreSQL | Database (resumes table) |
| Supabase Types | Type-safe queries |
| Next.js API Routes | Backend logic |
| Zod 4 | Validation |

---

## 🗄️ Database Schema

Already created via migration (`migrations/20260204_create_resumes_table.sql`):

```sql
CREATE TABLE public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    parse_status TEXT DEFAULT 'PENDING',
    parsed_data JSONB,
    parse_error TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

- **RLS Enabled**: Users can only access their own resumes.
- **Indexes**: `user_id`, `parse_status` for fast queries.

---

## 📦 Storage Strategy

### Supabase Storage
- **Bucket**: `resumes` (Private)
- **Path Structure**: `{userId}/{timestamp}-{filename}`
- **Allowed Types**: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Max Size**: 5MB

### RLS Policies (to configure in Supabase Dashboard):
- `INSERT`: Authenticated users can upload to their own folder.
- `SELECT`: Authenticated users can read their own files.
- `DELETE`: Authenticated users can delete their own files.

---

## 🔌 API Architecture

### Upload Resume
- **Endpoint**: `POST /api/resume`
- **Auth**: Required (uses Supabase session)
- **Body**: `FormData` with `file` field

#### Flow:
1. Validate user is authenticated.
2. Validate file type (PDF/DOCX) and size (<5MB).
3. Upload file to Supabase Storage (`resumes/{userId}/{timestamp}-{filename}`).
4. Create record in `resumes` table with `file_url`, `file_name`, etc.
5. Return `{ success: true, resumeId: "..." }`.

#### Error Responses:
- `401`: Not authenticated
- `400`: Invalid file type or size
- `500`: Storage or DB error

---

## 🧩 UI Components

### Page: `/upload-resume`
- **Route**: `app/upload-resume/page.tsx`
- **Auth**: Protected (redirect to `/sign-in` if not logged in)

### Components:
- **`ResumeDropzone`**: Drag & drop area with file validation.
- **`UploadProgress`**: Visual indicator during upload.
- **`UploadSuccess`**: Confirmation with link to view/manage.

---

## 📁 File Structure

```
app/
├── upload-resume/
│   └── page.tsx          # Upload UI
├── api/
│   └── resume/
│       └── route.ts      # POST handler
components/
├── resume/
│   ├── resume-dropzone.tsx
│   └── upload-progress.tsx
lib/
├── validations/
│   └── resume.ts         # Zod schemas
```

---

## 🚀 Implementation Steps

### Step 1: Create Storage Bucket
Configure in Supabase Dashboard:
1. Go to Storage → New Bucket
2. Name: `resumes`
3. Public: OFF
4. File size limit: 5MB
5. Allowed MIME types: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### Step 2: Create API Route
`app/api/resume/route.ts`:
- Handle file upload
- Store in Supabase Storage
- Insert record in `resumes` table

### Step 3: Create Upload Page
`app/upload-resume/page.tsx`:
- Dropzone component
- File validation (client-side)
- Upload progress
- Success/error feedback

### Step 4: Test & Deploy
- Test locally with `pnpm dev`
- Push to `feature/upload-resume` branch
- Vercel will create preview deployment
- Merge to `main` when ready

---

## 🔐 Security Considerations

1. **Authentication**: All endpoints require valid session.
2. **RLS**: Database policies ensure user isolation.
3. **Storage Policies**: Users can only access their own files.
4. **File Validation**: Server-side validation of MIME type and size.
5. **Signed URLs**: Use signed URLs for file access (not public).

---

## 📝 Migration Workflow

Using MCP (no local CLI needed):

1. Create SQL file in `migrations/` folder.
2. Apply via MCP: `mcp_supabase-mcp-server_apply_migration`.
3. Generate types: `mcp_supabase-mcp-server_generate_typescript_types`.
4. Update `types/database.types.ts`.
5. Commit to Git.
