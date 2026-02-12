# Task 3.3 — Error Boundary Component

## Objective

Prevent full application crashes.

A single broken component must NEVER blank the UI.

This is **production-grade resilience**.

---

## Implementation

Create:

```
src/shared/components/error-boundary/
```

Use React Error Boundaries.

---

## Behavior

When a runtime error occurs:

1. Capture error
2. Log it (console for now)
3. Display fallback UI

---

## Fallback UI Requirements

Show:

* Friendly message
* Retry button
* Optional refresh

DO NOT expose stack traces to users.

---

## Placement Strategy

Wrap:

👉 Router
👉 Module roots
👉 Complex dashboards

Avoid wrapping tiny components.

---

## Future Upgrade (Do NOT implement yet)

Prepare structure to integrate:

* Sentry
* Datadog
* NewRelic

---

## Deliverables

✅ ErrorBoundary component
✅ Fallback UI
✅ App-level integration

---
