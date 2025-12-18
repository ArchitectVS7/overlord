# Story 10-1: User Account Creation

**Epic:** 10 - User Accounts & Cross-Device Persistence
**Status:** drafted
**Complexity:** Medium
**Implementation Tag:** [GREENFIELD] - Auth + Supabase
**Human Intervention:** YES - Supabase project configuration

## Story Description

As a new player, I want to create a user account with email and password, so that my game progress is saved and accessible across devices.

## Acceptance Criteria

- [ ] AC1: "Create Account" and "Login" buttons on main menu
- [ ] AC2: Registration form with email/password/confirm
- [ ] AC3: Real-time email validation
- [ ] AC4: Password strength indicator
- [ ] AC5: Success creates account in Supabase
- [ ] AC6: "Play as Guest" option for offline play

## Task Breakdown

### Task 1: Configure Supabase Client
**File:** `src/config/supabase.ts`
**Duration:** ~15 min (HUMAN INPUT)
- Supabase project URL and anon key
- Initialize Supabase client
- Environment variable handling

### Task 2: Create AuthService
**File:** `src/core/services/AuthService.ts`
**Duration:** ~20 min
- signUp(email, password)
- signIn(email, password)
- signOut()
- getCurrentUser()
- onAuthStateChanged callback

### Task 3: Create RegistrationPanel Component
**File:** `src/scenes/ui/RegistrationPanel.ts`
**Duration:** ~20 min
- Email input with validation
- Password inputs with strength meter
- Submit button
- Error message display

### Task 4: Integrate with MainMenuScene
**File:** `src/scenes/MainMenuScene.ts`
**Duration:** ~15 min
- Show auth buttons when logged out
- Show username when logged in
- Handle auth state changes

### Task 5: Guest Mode Implementation
**File:** `src/core/services/AuthService.ts`
**Duration:** ~10 min
- Generate guest user ID
- Store in localStorage
- Flag for offline mode

## Definition of Done

- [ ] Supabase client configured
- [ ] Account creation works
- [ ] Validation feedback clear
- [ ] Guest mode functional
- [ ] 15+ tests passing
- [ ] All acceptance criteria verified

---

## Pre-Planning (Game Dev)

### Human Intervention Required

- **Supabase project setup** - Create project at supabase.com
- **API keys** - Copy project URL and anon key
- **Auth configuration** - Enable email/password auth
- **Environment variables** - Configure for dev/prod

### Data Schemas

```typescript
interface UserProfile {
  id: string;
  email: string;
  username?: string;
  createdAt: Date;
  isGuest: boolean;
}
```
