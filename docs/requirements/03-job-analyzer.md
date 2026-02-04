# 🔍 Feature 03: Job Analyzer

## Description
AI tool that analyzes job postings. Users can paste job posting text and the agent extracts structured information: tech stack, estimated salary range, requirements, and potential red flags.

---

## User Stories

### US-301: Job Posting Analysis
**As a** user  
**I want to** paste a job posting in the chat  
**So that** I can get a detailed analysis of the position

**Acceptance Criteria:**
- [ ] Can paste long text (job description) in chat
- [ ] Agent automatically identifies it's a job posting
- [ ] Receive structured analysis in readable format

### US-302: Tech Stack Extraction
**As a** developer  
**I want to** see what technologies the position requires  
**So that** I can evaluate if it matches my skills

**Acceptance Criteria:**
- [ ] List of mentioned technologies/languages
- [ ] Classification: Required vs Nice-to-have
- [ ] Visual tags for each technology

### US-303: Salary Estimation
**As a** user  
**I want to** see an estimated salary range  
**So that** I can evaluate if the offer is worth my time

**Acceptance Criteria:**
- [ ] Salary range if explicit in the posting
- [ ] Estimation based on role/location/seniority if not
- [ ] Confidence indicator for the estimation

### US-304: Red Flag Detection
**As a** user  
**I want to** have the agent identify warning signs  
**So that** I can avoid problematic offers

**Acceptance Criteria:**
- [ ] Identify phrases like "fast-paced environment" (burnout risk)
- [ ] Detect excessive requirements for the level
- [ ] Alert on lack of salary/benefits information

---

## Technical Specifications

### Tool Schema (Zod)
```typescript
const analyzeJobTool = {
  name: 'analyze_job',
  description: 'Analyzes a job posting and extracts structured information',
  parameters: z.object({
    jobDescription: z.string().describe('The full job posting text'),
  }),
  execute: async ({ jobDescription }) => {
    // Analysis logic
  }
}
```

### Output Schema
```typescript
interface JobAnalysis {
  title: string
  company: string | null
  location: string | null
  remote: 'full' | 'hybrid' | 'onsite' | 'unknown'
  
  techStack: {
    required: string[]
    niceToHave: string[]
  }
  
  salary: {
    min: number | null
    max: number | null
    currency: string
    confidence: 'explicit' | 'estimated' | 'unknown'
  }
  
  seniority: 'junior' | 'mid' | 'senior' | 'lead' | 'unknown'
  
  redFlags: Array<{
    flag: string
    severity: 'low' | 'medium' | 'high'
    explanation: string
  }>
  
  summary: string
}
```

---

## UI Components
- Results displayed in chat as structured message
- Cards/badges for tech stack
- Colored alerts for red flags (⚠️ warning, 🚨 critical)

---

## Dependencies
- Zod for schema validation
- Vercel AI SDK tools

---

## Implementation Notes
- Tool executes as part of chat conversation
- Use OpenAI `structured outputs` to guarantee format
- Optional: Cache analysis by content hash (token savings)
