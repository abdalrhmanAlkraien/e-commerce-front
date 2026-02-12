# Task 2.4 — Auth Tests (MANDATORY)

## Objective

Authentication MUST be test-verified.

Security without tests is negligence.

---

## Testing Stack

Use:

* Vitest
* React Testing Library
* MSW

NO real API calls allowed.

---

## Required Coverage

### Unit Tests

✅ auth.store
✅ validation schemas
✅ token utilities

---

### Integration Tests

Simulate full flows:

### Login Success

* user authenticated
* redirected
* token stored

### Login Failure

* error displayed
* store unchanged

### Auto Logout

* simulate 401
* verify redirect

### Route Guard

* anonymous blocked
* admin allowed

---

## Coverage Requirement

```
MINIMUM: 80%
```

Lower coverage is considered FAILURE.

---

## Pre-Completion Validation

Before marking phase complete:

✅ Zero failing tests
✅ Zero console errors
✅ Zero TypeScript errors
✅ Lint passes

---