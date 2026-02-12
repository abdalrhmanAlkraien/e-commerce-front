# PHASE 4 — Commerce Domain (Revenue-Critical Systems)

This phase builds the **core business engine** of the platform.

Everything implemented here directly impacts:

* Revenue
* Conversion rate
* Customer trust
* Operational flow
* Order lifecycle

This is NOT just UI work.

This is **domain engineering**.

Mistakes in this phase cause:

* Lost orders
* Payment failures
* Inventory inconsistencies
* Customer churn

Treat this phase with **production-level seriousness**.

---

# Domain Architecture Rule (CRITICAL)

All modules MUST follow modular architecture:

```
src/modules/<domain>/
 ├── api/
 ├── hooks/
 ├── components/
 ├── pages/
 ├── types/
 └── utils/
```

DTOs MUST come from:

```
src/shared/types/api.ts
```

Manual DTO creation is forbidden.

---

# Task 4.1 — Categories Module

## Objective

Enable customers to browse the product universe through structured taxonomy.

Categories are **navigation infrastructure**, not just labels.

Bad category UX destroys product discoverability.

---

## APIs (From OpenAPI)

Use ONLY public endpoints:

```
GET /api/v1/public/categories
```

Support pagination via `Pageable`.

---

## Capabilities

### Category Listing Page

Route:

```
/categories
```

Must support:

✅ pagination
✅ skeleton loading
✅ empty state
✅ error boundary

---

### Category Navigation Component

Reusable component for storefront:

* sidebar
  OR
* horizontal navigation

Must NOT be tightly coupled to the page.

---

### React Query Strategy

Cache categories aggressively.

Recommended stale time:

```
5–10 minutes
```

Categories rarely change.

Avoid unnecessary refetches.

---

## Deliverables

✅ categories.api.ts
✅ useCategories hook
✅ CategoryList page
✅ Navigation component

---

# Testing Requirement (MANDATORY FOR ALL TASKS)

Use:

* MSW
* Vitest
* React Testing Library

---

## Critical Flows To Test

### Products

✅ load
✅ filter
✅ error

### Cart

✅ add
✅ update
✅ remove
✅ rollback

### Checkout

✅ success
✅ failure

### Refund

✅ valid request
✅ validation error

---

## Coverage Requirement

```
MINIMUM: 80%
```

Lower = failure.

---