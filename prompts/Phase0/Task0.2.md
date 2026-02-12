# Task 0.2 — Environment Strategy

## Objective

Implement a production-safe environment configuration strategy.

No API base URLs or secrets may be hardcoded anywhere in the application.

---

## Functional Requirements

* Support development
* Support staging
* Support production
* Allow future extension

---

## Technical Requirements

Use Vite environment variable system.

---

## Required Files

Create:

```
.env.development
.env.staging
.env.production
```

---

## Required Variables

Each file MUST include:

```
VITE_API_BASE_URL=
VITE_APP_ENV=
```

Example (development):

```
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_ENV=development
```

---

## Implementation Requirements

* Create `shared/config/env.ts`
* Implement typed environment accessor
* Validate required variables exist
* Throw error if missing

Example requirement:

If VITE_API_BASE_URL is undefined → application must fail fast.

---

## Forbidden Actions

* No hardcoded API URLs
* No direct usage of import.meta.env in components
* No console logging of secrets

---

## Deliverables

* Environment files created
* Typed env accessor implemented
* App compiles successfully
* No direct usage of raw environment variables outside config layer

---

## Validation

* TypeScript passes
* App runs in development mode
* Switching environment changes base URL correctly

Task complete only when environment handling is centralized and safe.
