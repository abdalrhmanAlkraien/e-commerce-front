# Task 7.4 — Logging Strategy

## Objective

Give engineers visibility into runtime behavior.

Without logging:

👉 bugs become mysteries
👉 incidents become archaeology

Logging is operational intelligence.

---

## Logging Principles

Logs must be:

✅ structured
✅ minimal
✅ meaningful

Avoid console spam.

---

## Create a Logging Utility

Location:

```
src/shared/utils/logger.ts
```

Expose levels:

```
logger.info()
logger.warn()
logger.error()
```

---

## Environment Awareness

Behavior should change by environment:

### Development

Verbose logs allowed.

### Production

Only warnings + errors.

Silence noise.

---

## Error Logging

Global Error Boundary MUST log errors.

Include:

* message
* stack
* route

Prepare structure for future tools:

* Sentry
* Datadog
* LogRocket

Do NOT integrate yet — just architect cleanly.

---

## API Error Logging

Axios interceptor should log:

* endpoint
* status
* payload (safe only)

Never log secrets or tokens.

---

## Deliverables

✅ Logger utility
✅ Environment-aware logging
✅ Error boundary integration
✅ Axios logging

---
# Completion Criteria — Phase 7

Phase is complete ONLY when:

✅ Lighthouse performance improved
✅ Accessibility violations resolved
✅ Metadata present
✅ Logs structured
✅ No console spam

AND:

✅ Zero TypeScript errors
✅ Lint passes
✅ Tests unaffected

---