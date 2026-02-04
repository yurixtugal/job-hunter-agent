# 📄 Feature 01: Resume Upload & Parser

## Description
Allow users to upload their resume (PDF/DOCX), use AI to parse and extract structured data, and store it in a standardized database schema. The parsed resume data is displayed in a structured table view. **Focused on software developers.**

---

## User Stories

### US-101: Upload Resume File
**As a** user  
**I want to** upload my resume as a PDF or DOCX file  
**So that** the system can analyze my professional profile

**Acceptance Criteria:**
- [ ] Drag & drop upload zone
- [ ] Click to browse files
- [ ] Accepted formats: PDF, DOCX
- [ ] Max file size: 5MB
- [ ] Upload progress indicator
- [ ] File stored in Supabase Storage
- [ ] Success/error feedback

### US-102: AI Resume Parsing
**As a** user  
**I want to** have my resume automatically parsed by AI  
**So that** I don't have to manually enter my information

**Acceptance Criteria:**
- [ ] AI extracts structured data from resume
- [ ] Parsing happens automatically after upload
- [ ] Loading state while parsing
- [ ] Extracted data shown for user review
- [ ] Handle parsing errors gracefully

### US-103: View Parsed Resume Data
**As a** user  
**I want to** see my extracted resume data in a structured table  
**So that** I can verify the information is correct

**Acceptance Criteria:**
- [ ] Contact information section
- [ ] Skills displayed as tags/badges
- [ ] Work experience in timeline format
- [ ] Education in card format
- [ ] Projects list with tech stack tags
- [ ] Certifications list

### US-104: Edit Parsed Data
**As a** user  
**I want to** edit the extracted resume data  
**So that** I can correct any AI parsing errors

**Acceptance Criteria:**
- [ ] Edit button for each section
- [ ] Inline editing or modal forms
- [ ] Save changes to database
- [ ] Cancel/undo edits
- [ ] Validation on save

### US-105: Multiple Resume Versions
**As a** user  
**I want to** upload multiple resume versions  
**So that** I can have different profiles for different job types

**Acceptance Criteria:**
- [ ] List of uploaded resumes
- [ ] Set one as "primary"
- [ ] Delete old versions
- [ ] Version naming/labeling

---

## Technical Specifications

### File Upload Flow

```
1. User uploads file
2. File → Supabase Storage (bucket: resumes)
3. API triggered to parse file
4. File content extracted (PDF → text)
5. AI parses text → structured JSON
6. Data validated with Zod
7. Data saved to Prisma/PostgreSQL
8. UI updated with parsed data
```

### API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/upload` | Upload file to Supabase Storage |
| POST | `/api/resume/parse` | Trigger AI parsing of uploaded file |
| GET | `/api/resume` | Get user's parsed resumes |
| GET | `/api/resume/:id` | Get specific resume |
| PATCH | `/api/resume/:id` | Update parsed data |
| DELETE | `/api/resume/:id` | Delete resume |

### Prisma Schema

```prisma
model Resume {
  id            String    @id @default(uuid())
  userId        String    @map("user_id")
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // File info
  fileName      String    @map("file_name")
  fileUrl       String    @map("file_url")
  fileType      String    @map("file_type") // pdf, docx
  
  // Metadata
  label         String?   // "Full Stack", "Backend Focus", etc.
  isPrimary     Boolean   @default(false) @map("is_primary")
  
  // Parsed data
  contactInfo   Json?     @map("contact_info")
  summary       String?
  
  // Relations
  skills        ResumeSkill[]
  experiences   WorkExperience[]
  education     Education[]
  projects      Project[]
  certifications Certification[]
  
  // Parsing status
  parseStatus   ParseStatus @default(PENDING) @map("parse_status")
  parseError    String?     @map("parse_error")
  
  // Timestamps
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  @@map("resumes")
}

enum ParseStatus {
  PENDING
  PARSING
  COMPLETED
  FAILED
}

model ResumeSkill {
  id          String   @id @default(uuid())
  resumeId    String   @map("resume_id")
  resume      Resume   @relation(fields: [resumeId], references: [id], onDelete: Cascade)
  
  name        String
  category    SkillCategory
  level       SkillLevel?
  yearsExp    Int?     @map("years_exp")
  
  @@map("resume_skills")
}

enum SkillCategory {
  PROGRAMMING_LANGUAGE
  FRAMEWORK
  DATABASE
  CLOUD
  DEVOPS
  TOOLS
  SOFT_SKILL
  OTHER
}

enum SkillLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

model WorkExperience {
  id          String    @id @default(uuid())
  resumeId    String    @map("resume_id")
  resume      Resume    @relation(fields: [resumeId], references: [id], onDelete: Cascade)
  
  company     String
  title       String
  location    String?
  startDate   DateTime  @map("start_date")
  endDate     DateTime? @map("end_date")
  isCurrent   Boolean   @default(false) @map("is_current")
  description String?
  
  // Tech used in this role
  technologies String[]
  
  @@map("work_experiences")
}

model Education {
  id          String    @id @default(uuid())
  resumeId    String    @map("resume_id")
  resume      Resume    @relation(fields: [resumeId], references: [id], onDelete: Cascade)
  
  institution String
  degree      String
  field       String?
  startDate   DateTime? @map("start_date")
  endDate     DateTime? @map("end_date")
  gpa         Float?
  
  @@map("education")
}

model Project {
  id          String   @id @default(uuid())
  resumeId    String   @map("resume_id")
  resume      Resume   @relation(fields: [resumeId], references: [id], onDelete: Cascade)
  
  name        String
  description String?
  url         String?
  repoUrl     String?  @map("repo_url")
  technologies String[]
  
  @@map("projects")
}

model Certification {
  id          String    @id @default(uuid())
  resumeId    String    @map("resume_id")
  resume      Resume    @relation(fields: [resumeId], references: [id], onDelete: Cascade)
  
  name        String
  issuer      String?
  issueDate   DateTime? @map("issue_date")
  expiryDate  DateTime? @map("expiry_date")
  credentialUrl String? @map("credential_url")
  
  @@map("certifications")
}
```

### AI Parsing Output Schema (Zod)

```typescript
import { z } from 'zod'

const contactInfoSchema = z.object({
  fullName: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  portfolio: z.string().url().optional(),
})

const skillSchema = z.object({
  name: z.string(),
  category: z.enum([
    'PROGRAMMING_LANGUAGE',
    'FRAMEWORK', 
    'DATABASE',
    'CLOUD',
    'DEVOPS',
    'TOOLS',
    'SOFT_SKILL',
    'OTHER'
  ]),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  yearsExp: z.number().optional(),
})

const workExperienceSchema = z.object({
  company: z.string(),
  title: z.string(),
  location: z.string().optional(),
  startDate: z.string(), // ISO date
  endDate: z.string().optional(),
  isCurrent: z.boolean(),
  description: z.string().optional(),
  technologies: z.array(z.string()),
})

const educationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.number().optional(),
})

const projectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  technologies: z.array(z.string()),
})

const certificationSchema = z.object({
  name: z.string(),
  issuer: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialUrl: z.string().url().optional(),
})

export const parsedResumeSchema = z.object({
  contactInfo: contactInfoSchema,
  summary: z.string().optional(),
  skills: z.array(skillSchema),
  workExperience: z.array(workExperienceSchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
})
```

### Supabase Storage Setup

**Bucket Configuration:**
```sql
-- Create bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false);

-- RLS Policy: Users can only access their own files
CREATE POLICY "Users can upload their own resumes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**File Path Structure:**
```
resumes/
  └── {user_id}/
      └── {timestamp}_{filename}.pdf
```

---

## UI Components

### Pages
- `/resume` - Resume management dashboard
- `/resume/upload` - Upload new resume
- `/resume/:id` - View/edit specific resume

### Components
- `ResumeUploader` - Drag & drop upload zone
- `ResumeList` - List of user's resumes
- `ResumeCard` - Summary card for each resume
- `ParsedResumeView` - Full structured view of parsed data
  - `ContactSection`
  - `SkillsGrid` - Skills as badges grouped by category
  - `ExperienceTimeline` - Work history timeline
  - `EducationCards`
  - `ProjectsGrid`
  - `CertificationsList`
- `EditResumeForm` - Form for editing parsed data

---

## Dependencies

```bash
# PDF parsing
pnpm add pdf-parse

# File handling
pnpm add formidable

# Supabase storage
pnpm add @supabase/supabase-js
```

---

## AI Parsing Prompt

```typescript
const parseResumePrompt = `
You are a resume parser specialized in extracting structured data from software developer resumes.

Given the following resume text, extract and return a JSON object with:
- contactInfo: name, email, phone, location, linkedin, github, portfolio
- summary: professional summary if present
- skills: array of skills with category (PROGRAMMING_LANGUAGE, FRAMEWORK, DATABASE, CLOUD, DEVOPS, TOOLS, SOFT_SKILL, OTHER) and estimated level
- workExperience: array of jobs with company, title, dates, description, technologies used
- education: array of degrees
- projects: personal/professional projects with tech stack
- certifications: professional certifications

Focus on:
1. Identifying programming languages, frameworks, and tools
2. Extracting specific technologies mentioned in job descriptions
3. Inferring skill levels from years of experience and context
4. Parsing dates in ISO format

Return ONLY valid JSON matching the schema.
`
```

---

## Implementation Notes

1. **Use Supabase Storage** - Files stored under user's folder
2. **PDF Parsing** - Use `pdf-parse` to extract text before AI processing
3. **Streaming response** - Show parsing progress to user
4. **Validation** - Zod validates AI output before database insert
5. **Error handling** - Graceful fallback if parsing fails, allow manual entry
6. **pgvector integration** (Future) - Generate embeddings for resume text for semantic search
