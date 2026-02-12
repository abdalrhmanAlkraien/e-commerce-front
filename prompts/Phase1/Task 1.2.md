# Phase 1 — Task 1.2

## Global Error Handling System

---

## Objective

Implement a centralized error handling mechanism to prevent inconsistent UI failures.

Errors must never be handled ad-hoc in components.

---

## Dependencies

* Task 1.1 (Axios Client)

---

## Functional Requirements

* Catch rendering errors
* Normalize API errors
* Provide safe user messages
* Prevent blank screens
* Integrate with toast system

---

## Implementation Requirements

### Error Boundary

Create:

```
src/shared/components/ErrorBoundary.tsx
```

Must:

* Catch render errors
* Show fallback UI
* Prevent infinite loops

---

### Error Mapper

Create:

```
src/shared/utils/errorMapper.ts
```

Map:

| Scenario      | User Message                       |
| ------------- | ---------------------------------- |
| Network error | "Network error. Please try again." |
| 401           | "Session expired."                 |
| 403           | "Access denied."                   |
| 500           | "Unexpected server error."         |

Never expose backend stack traces.

---

### React Query Integration

Configure global mutation error handler.

All mutation errors must pass through the error mapper.

---

## Testing Requirements

Test:

* ErrorBoundary fallback
* Error mapping logic
* Axios normalized errors
* Global handler invocation

---

## Completion Criteria

* No unhandled promise rejections
* Runtime errors do not crash app
* Tests pass
* Error UI stable

Task complete only when the application is crash-resistant.
