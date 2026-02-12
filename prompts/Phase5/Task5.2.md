---

# Global Admin Rules (CRITICAL)

## Security Boundary

ALL admin routes MUST be protected by:

```
AdminRoute
```

Never rely on UI hiding alone.

Unauthorized users MUST be redirected to:

```
/403
```

---

## Admin Module Structure

```
src/modules/admin/
 ├── layout/
 ├── dashboard/
 ├── categories/
 ├── products/
 ├── orders/
 ├── customers/
```

Each sub-module MUST follow:

```
api/
hooks/
components/
pages/
utils/
types/
```

---

## Data Authority

Admin panels MUST use server-driven state.

Never mutate UI assumptions.

Always refetch or invalidate queries after mutations.

---

# Task 5.2 — Admin Categories CRUD

## Objective

Allow operators to control taxonomy safely.

Category mistakes can break storefront navigation.

Build defensively.

---

## APIs

Use Admin endpoints ONLY:

```
GET    /api/v1/admin/categories
POST   /api/v1/admin/categories
PUT    /api/v1/admin/categories/{id}
DELETE /api/v1/admin/categories/{id}
```

---

## Required Screens

### Categories Table

Must support:

✅ pagination
✅ search/filter
✅ skeleton loading
✅ empty state

Columns:

* name
* slug
* createdAt

---

### Create / Edit Category

Use shared form patterns:

* React Hook Form
* Zod validation

Slug rules should mirror backend constraints.

Never invent validation.

---

## Delete Behavior (IMPORTANT)

Backend may return:

```
409 — category has products
```

You MUST surface this clearly.

Do NOT show generic errors.

---

## Deliverables

✅ categories.admin.api.ts
✅ useAdminCategories
✅ CategoryTable
✅ CategoryForm
✅ Create/Edit pages

---
# Testing Requirements (MANDATORY)

Use:

* MSW
* Vitest
* React Testing Library

---

## Critical Admin Flows

### Categories

✅ create
✅ update
✅ delete conflict

### Products

✅ create
✅ edit
✅ upload image

### Orders

✅ view
✅ change status
✅ refund

### Customers

✅ enable
✅ disable

---

## Coverage Requirement

```
MINIMUM: 80%
```

Failure to meet coverage = task incomplete.

---
