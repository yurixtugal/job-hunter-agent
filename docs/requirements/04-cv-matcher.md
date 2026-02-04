# 🎯 Feature 04: CV Matcher

## Description
Compares user profile/CV against a job posting to generate a compatibility percentage and improvement suggestions.

---

## User Stories

### US-401: Profile Comparison with Job
**As a** user  
**I want to** compare my profile against a job posting  
**So that** I know how good of a fit I am for the position

**Acceptance Criteria:**
- [ ] Match percentage (0-100%)
- [ ] Breakdown by categories (tech skills, experience, soft skills)
- [ ] Clear visualization of result

### US-402: Improvement Suggestions
**As a** user  
**I want to** receive recommendations  
**So that** I can improve my chances of being selected

**Acceptance Criteria:**
- [ ] Skills I should highlight in my application
- [ ] Gaps I could close (courses, projects)
- [ ] Keywords to include in cover letter

---

## Technical Specifications

### Tool Schema
```typescript
const matchCVTool = {
  name: 'match_cv',
  description: 'Compares user profile against a job posting',
  parameters: z.object({
    resumeId: z.string().describe('ID of user resume to compare'),
    jobDescription: z.string().describe('Job posting to match against'),
  })
}
```

### Output Schema
```typescript
interface CVMatchResult {
  overallMatch: number // 0-100
  
  breakdown: {
    technicalSkills: {
      score: number
      matched: string[]
      missing: string[]
    }
    experience: {
      score: number
      notes: string
    }
    softSkills: {
      score: number
      matched: string[]
    }
  }
  
  suggestions: {
    highlight: string[]      // Skills to emphasize
    develop: string[]        // Skills to learn
    keywords: string[]       // For cover letter/resume
  }
  
  coverLetterTips: string
}
```

---

## Dependencies
- Parsed resume data from Feature 01
- Job analysis from Feature 03 (optional)

---

## Implementation Notes
- Uses parsed resume data (not raw file)
- Integrates with chat as a tool
- Consider embeddings for semantic matching (future)
