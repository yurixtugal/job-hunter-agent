# 🔐 Feature 00: Authentication

## Description
User authentication system using Supabase Auth. Users must be authenticated to access the application and manage their resume data.

---

## User Stories

### US-001: User Registration
**As a** new user  
**I want to** create an account with email and password  
**So that** I can access the Job Hunter Agent

**Acceptance Criteria:**
- [ ] Registration form with email and password fields
- [ ] Password strength validation (min 8 chars, mixed case, numbers)
- [ ] Email verification sent after registration
- [ ] Error handling for duplicate emails
- [ ] Redirect to dashboard after successful registration

### US-002: User Login
**As a** registered user  
**I want to** log in with my credentials  
**So that** I can access my dashboard and resume data

**Acceptance Criteria:**
- [ ] Login form with email and password
- [ ] "Remember me" option (persistent session)
- [ ] Error message for invalid credentials
- [ ] Redirect to dashboard after successful login
- [ ] Rate limiting to prevent brute force attacks

### US-003: OAuth Login (Optional - Phase 2)
**As a** user  
**I want to** sign in with Google or GitHub  
**So that** I can access the app without creating a new password

**Acceptance Criteria:**
- [ ] Google OAuth button
- [ ] GitHub OAuth button
- [ ] Account linking if email already exists
- [ ] First-time OAuth creates new user profile

### US-004: Password Reset
**As a** user who forgot my password  
**I want to** reset my password via email  
**So that** I can regain access to my account

**Acceptance Criteria:**
- [ ] "Forgot password" link on login page
- [ ] Email input to request reset
- [ ] Reset link sent to email
- [ ] Secure token-based reset flow
- [ ] Password update confirmation

### US-005: Logout
**As a** logged-in user  
**I want to** log out  
**So that** I can securely end my session

**Acceptance Criteria:**
- [ ] Logout button in navigation/header
- [ ] Session cleared on logout
- [ ] Redirect to login page

### US-006: Protected Routes
**As the** system  
**I want to** protect authenticated routes  
**So that** unauthorized users cannot access private data

**Acceptance Criteria:**
- [ ] Middleware to check authentication status
- [ ] Redirect unauthenticated users to login
- [ ] Public routes: `/login`, `/register`, `/forgot-password`
- [ ] Protected routes: `/dashboard`, `/resume`, `/chat`, etc.

---

## Technical Specifications

### Supabase Auth Setup

**Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/logout` | End session |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Update password with token |
| GET | `/api/auth/session` | Get current session |

### Prisma Schema

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  supabaseId    String    @unique @map("supabase_id")
  
  // Profile
  firstName     String?   @map("first_name")
  lastName      String?   @map("last_name")
  avatarUrl     String?   @map("avatar_url")
  
  // Relations
  resumes       Resume[]
  applications  Application[]
  
  // Timestamps
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  @@map("users")
}
```

### Middleware (Next.js)

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Protected routes
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/resume/:path*', '/chat/:path*']
}
```

---

## UI Components

### Pages
- `/login` - Login form
- `/register` - Registration form  
- `/forgot-password` - Password reset request
- `/reset-password` - New password form

### Components (shadcn/ui)
- `AuthForm` - Reusable form container
- `Button` - Submit buttons
- `Input` - Email/password fields
- `Label` - Form labels
- `Card` - Form wrapper
- `Alert` - Error/success messages

---

## Dependencies

```bash
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
pnpm add prisma @prisma/client -D
```

---

## Security Considerations

- [ ] HTTPS only in production
- [ ] Secure, HttpOnly cookies for session
- [ ] CSRF protection
- [ ] Rate limiting on auth endpoints
- [ ] Password hashing handled by Supabase
- [ ] Email verification required (configurable)

---

## Implementation Notes

1. **Use Supabase Auth Helpers** for Next.js integration
2. **Sync Supabase Auth users with Prisma** - After successful auth, create/update User record
3. **API Routes only** - No Server Actions per project rules
4. **Session management** - Use `@supabase/auth-helpers-nextjs` for SSR session handling
