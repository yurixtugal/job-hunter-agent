# Resume AI Parser Implementation

## 🎯 Objective

Implement an AI-powered resume parser that extracts structured data (profile, experience, education, skills) from uploaded PDF/DOCX files and stores it in the database.

## 🏗️ Technical Architecture

### Database Schema
We will utilize the existing `parsed_data` column (JSONB) in the `resumes` table.

**JSON Structure (Schema):**
```typescript
interface ParsedResume {
  profile: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
    summary?: string;
  };
  workExperience: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
    technologies?: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
  }[];
  skills: {
    technical: string[];
    soft?: string[];
    languages?: string[];
  };
  projects?: {
    name: string;
    description: string;
    technologies?: string[];
    link?: string;
  }[];
}
```

### Dependencies
- **Parsing**: `pdf-parse` (Server-side PDF text extraction) or `mammoth` (for DOCX). *Initial focus: PDF*.
- **AI**: `openai` (GPT-4o or GPT-4-turbo) with Structured Outputs/Function Calling to guarantee JSON.
- **Validation**: `zod` to validate AI response.

### Workflow
1.  **Input**: User clicks "Analyze Resume" or Auto-trigger after upload.
2.  **Process**:
    -   Fetch file from Supabase Storage.
    -   Extract raw text (Text Extraction Layer).
    -   Send text to OpenAI with Zod Schema (AI Layer).
    -   Receive structured JSON.
3.  **Output**: Update `resumes` table: `parsed_data` = JSON, `parse_status` = 'COMPLETED'.

## 📋 Implementation Tasks

- [ ] **Setup**: Install `pdf-parse`, `openai`, `mammoth`.
- [ ] **Type Definitions**: Create strict Zod schemas and TypeScript interfaces for the resume data.
- [ ] **Text Extraction Service**: Create `lib/parser/extract-text.ts` to handle PDF/DOCX -> String.
- [ ] **AI Service**: Create `lib/ai/parse-resume.ts` using OpenAI Structured Outputs.
- [ ] **API Endpoint**: Create `POST /api/resume/parse` to orchestrate the process.
- [ ] **UI Integration**: Update `app/dashboard/resume/page.tsx` to display parsed data or a "Parse" button.

## 🧪 Testing Plan
- Test with standard text-based PDFs.
- Test with complex layout PDFs (checking for hallucination).
- Validate Error handling (corrupt files, AI timeout).
