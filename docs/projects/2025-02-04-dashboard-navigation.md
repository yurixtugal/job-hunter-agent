# 🧭 Dashboard Navigation & Onboarding - Implementation Design

## 🎯 Objective

Create a complete navigation system for the dashboard with all available options, and implement an onboarding flow that redirects users without a resume to upload one first.

## 📋 Features

### 1. Navigation Menu
A sidebar or top navigation with all available sections:

| Section | Icon | Route | Description |
|---------|------|-------|-------------|
| Dashboard | Home | `/dashboard` | Overview and stats |
| My Resume | FileText | `/dashboard/resume` | View/manage uploaded resume |
| Job Search | Search | `/dashboard/jobs` | Search and browse jobs |
| Applications | Briefcase | `/dashboard/applications` | Track job applications |
| Settings | Settings | `/dashboard/settings` | User preferences |

### 2. Onboarding Flow
If user has no resume uploaded:
1. Redirect to `/upload-resume` automatically
2. Show a welcome message explaining the process
3. After upload, redirect to dashboard

### 3. Dashboard Sections
Once onboarding is complete, show:
- Resume summary card (parsed data)
- Recent job matches
- Application statistics
- Quick actions

---

## 🗄️ Database Check

### Query to Check Resume Exists
```sql
SELECT id, file_name, parse_status, created_at 
FROM resumes 
WHERE user_id = :userId 
ORDER BY created_at DESC 
LIMIT 1;
```

---

## 🔧 Technical Implementation

### 1. API Route: Check Onboarding Status
**File**: `app/api/user/onboarding/route.ts`

```typescript
// GET /api/user/onboarding
// Returns: { hasResume: boolean, resumeStatus?: string }
```

### 2. Dashboard Layout
**File**: `app/dashboard/layout.tsx`

```typescript
// Server component that:
// 1. Checks if user has resume
// 2. If not, redirects to /upload-resume
// 3. If yes, renders dashboard with navigation
```

### 3. Navigation Component
**File**: `components/dashboard/sidebar.tsx`

Using Shadcn components:
- `NavigationMenu` or custom sidebar
- Icons from `lucide-react`
- Active state indication
- Mobile responsive (sheet/drawer)

### 4. Onboarding Modal (Optional)
Show a welcome modal on first visit explaining:
- What the app does
- Steps to get started
- Skip option (for later)

---

## 🎨 UI/UX Design

### Desktop Layout
```
┌─────────────────────────────────────────────────────┐
│  Logo    Dashboard   Resume   Jobs   Applications   │  <- Top Nav
├─────────┬───────────────────────────────────────────┤
│         │                                           │
│ Sidebar │           Main Content Area               │
│  Menu   │                                           │
│         │                                           │
│         │                                           │
└─────────┴───────────────────────────────────────────┘
```

### Mobile Layout
```
┌─────────────────────┐
│  Logo    ☰ Menu     │  <- Hamburger menu
├─────────────────────┤
│                     │
│   Main Content      │
│                     │
├─────────────────────┤
│  Bottom Nav Icons   │  <- Mobile navigation
└─────────────────────┘
```

---

## 📁 File Structure

```
app/
├── dashboard/
│   ├── layout.tsx          # Dashboard layout with nav + onboarding check
│   ├── page.tsx            # Main dashboard (overview)
│   ├── resume/
│   │   └── page.tsx        # Resume details page
│   ├── jobs/
│   │   └── page.tsx        # Job search page
│   ├── applications/
│   │   └── page.tsx        # Applications tracker
│   └── settings/
│       └── page.tsx        # User settings
├── api/
│   └── user/
│       └── onboarding/
│           └── route.ts    # Check onboarding status

components/
├── dashboard/
│   ├── sidebar.tsx         # Sidebar navigation
│   ├── mobile-nav.tsx      # Mobile bottom navigation
│   ├── header.tsx          # Dashboard header
│   └── onboarding-modal.tsx # Welcome modal
```

---

## 🔐 Middleware Enhancement

Update `middleware.ts` to handle onboarding:

```typescript
// If user is authenticated and accessing /dashboard
// Check if they have a resume
// If not, redirect to /upload-resume
```

**Note**: This check should be done at the layout level, not middleware, to avoid unnecessary DB calls on every request.

---

## 🚀 Implementation Steps

### Phase 1: Navigation Structure
1. [ ] Create `app/dashboard/layout.tsx` with sidebar
2. [ ] Create `components/dashboard/sidebar.tsx`
3. [ ] Add navigation links with icons
4. [ ] Style active states

### Phase 2: Onboarding Check
5. [ ] Create `app/api/user/onboarding/route.ts`
6. [ ] Add resume check in dashboard layout
7. [ ] Redirect to `/upload-resume` if no resume
8. [ ] Show success message after upload

### Phase 3: Dashboard Content
9. [ ] Create placeholder pages for each section
10. [ ] Add resume summary card
11. [ ] Add quick action buttons

### Phase 4: Mobile Responsiveness
12. [ ] Create mobile navigation component
13. [ ] Add hamburger menu
14. [ ] Test on different screen sizes

---

## 🧪 Testing Checklist

- [ ] New user is redirected to upload resume
- [ ] User with resume sees full dashboard
- [ ] Navigation links work correctly
- [ ] Active state shows current page
- [ ] Mobile navigation works
- [ ] Logout button works from menu
- [ ] Protected routes require authentication

---

## 📝 Notes

- Use `next/navigation` for client-side navigation
- Server components for initial data fetching
- Shadcn `Sheet` for mobile menu
- Consider using `next/link` with prefetch for performance
- Store onboarding status in localStorage to avoid repeated checks
