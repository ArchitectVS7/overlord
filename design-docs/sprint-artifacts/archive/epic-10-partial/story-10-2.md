# Story 10-2: User Login

**Epic:** 10 - User Accounts & Cross-Device Persistence
**Status:** done
**Complexity:** Low
**Implementation Tag:** [GREENFIELD] - Auth + Supabase

## Story Description

As a returning player, I want to log in to my account, so that I can access my saved campaigns and progress.

## Acceptance Criteria

- [ ] AC1: Login form with email/password
- [ ] AC2: "Remember me" checkbox option
- [ ] AC3: Password recovery link
- [ ] AC4: Successful login shows welcome message
- [ ] AC5: Invalid credentials show error
- [ ] AC6: Session persists across browser refresh

## Task Breakdown

### Task 1: Create LoginPanel Component
**File:** `src/scenes/ui/LoginPanel.ts`
**Duration:** ~15 min
- Email/password inputs
- Remember me checkbox
- Forgot password link
- Submit button

### Task 2: Session Persistence
**File:** `src/core/services/AuthService.ts`
**Duration:** ~15 min
- Store session in localStorage (if remember me)
- Restore session on app start
- Auto-logout on session expiry

### Task 3: Password Recovery Flow
**File:** `src/scenes/ui/ForgotPasswordPanel.ts`
**Duration:** ~15 min
- Email input for recovery
- Send recovery email via Supabase
- Success/error feedback

### Task 4: Auth State UI Updates
**File:** `src/scenes/MainMenuScene.ts`
**Duration:** ~10 min
- Update menu on login/logout
- Show logged-in username
- Logout button functionality

## Definition of Done

- [ ] Login works with valid credentials
- [ ] Session persistence works
- [ ] Password recovery sends email
- [ ] 12+ tests passing
