# 📊 Feature 05: Application Tracker

## Description
System to save and track analyzed job postings. Kanban or List view to visualize the status of each application.

---

## User Stories

### US-501: Save Job Posting
**As a** user  
**I want to** save an analyzed job posting  
**So that** I can track it later

**Acceptance Criteria:**
- [ ] "Save" button after analyzing a posting
- [ ] Stored in database (Supabase via Prisma)
- [ ] Visual confirmation of save

### US-502: View My Applications
**As a** user  
**I want to** see all saved job postings  
**So that** I have an overview of my job search

**Acceptance Criteria:**
- [ ] List view with all postings
- [ ] Summary info: title, company, date, status
- [ ] Sort by date, company, or status

### US-503: Kanban View
**As a** user  
**I want to** see my applications in Kanban format  
**So that** I can visualize my search pipeline

**Acceptance Criteria:**
- [ ] Columns: Saved → Applied → Interview → Offer → Rejected
- [ ] Drag & drop to move between columns
- [ ] Cards with summary information

### US-504: Update Status
**As a** user  
**I want to** change an application's status  
**So that** I can keep my tracking updated

**Acceptance Criteria:**
- [ ] Dropdown or drag&drop to change status
- [ ] Change date recorded
- [ ] Optional notes on each change

---

## Technical Specifications

### Application Status
```typescript
type ApplicationStatus = 
  | 'saved'      // Saved for review
  | 'applied'    // Already applied
  | 'interview'  // In interview process
  | 'offer'      // Received offer
  | 'rejected'   // Rejected
  | 'withdrawn'  // Withdrew from process
```

### Prisma Schema
```prisma
model Application {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Job info
  title       String
  company     String?
  location    String?
  remoteType  String?  @map("remote_type")
  jobUrl      String?  @map("job_url")
  
  // Analysis data
  techStack   Json?    @map("tech_stack")
  salaryRange Json?    @map("salary_range")
  redFlags    Json?    @map("red_flags")
  matchScore  Int?     @map("match_score")
  
  // Tracking
  status      String   @default("saved")
  notes       String?
  
  // Timestamps
  postedAt    DateTime? @map("posted_at")
  appliedAt   DateTime? @map("applied_at")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  
  // History
  statusHistory ApplicationStatusHistory[]
  
  @@map("applications")
}

model ApplicationStatusHistory {
  id            String   @id @default(uuid())
  applicationId String   @map("application_id")
  application   Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  
  fromStatus    String?  @map("from_status")
  toStatus      String   @map("to_status")
  notes         String?
  changedAt     DateTime @default(now()) @map("changed_at")
  
  @@map("application_status_history")
}
```

### API Routes
```
GET    /api/applications          # List all
POST   /api/applications          # Create new
PATCH  /api/applications/:id      # Update
DELETE /api/applications/:id      # Delete
```

---

## UI Components

### List View
- `ApplicationsTable` - Table with sorting and filters
- `ApplicationRow` - Individual row
- `StatusBadge` - Colored badge by status

### Kanban View
- `KanbanBoard` - Column container
- `KanbanColumn` - Individual column (droppable)
- `KanbanCard` - Application card (draggable)

---

## Dependencies
- Prisma Client
- DnD Kit or similar for drag & drop
- shadcn/ui: Table, Badge, Card, Tabs

---

## Implementation Notes
- Start with List view (simpler)
- Add Kanban as second phase
- Consider real-time updates with Supabase Realtime (future)
