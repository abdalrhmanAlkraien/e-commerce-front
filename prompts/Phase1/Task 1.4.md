# Phase 1 — Task 1.4

## React Query Provider

---

## Objective

Establish centralized server-state management.

React Query becomes authoritative for:

* caching
* synchronization
* retries
* background refetch

---

## Dependencies

* Task 1.2 (Error Handling)
* Task 1.3 (DTO Types)

---

## Implementation Requirements

Create:

```
src/providers/QueryProvider.tsx
```

Wrap application root.

---

## QueryClient Configuration

Set defaults:

* retry: 2
* staleTime: 60_000
* refetchOnWindowFocus: false

Integrate global error handler.

Enable DevTools in development only.

---

## Rules

* No manual loading state flags
* No duplicate caching logic
* No fetch inside components

All server state must use React Query.

---

## Testing Requirements

* Verify caching works
* Verify retry behavior
* Verify error handling through Query layer

---

## Completion Criteria

* Provider wraps app
* Queries operational
* DevTools environment-based
* Tests pass

Task complete only when server state is centrally controlled.
