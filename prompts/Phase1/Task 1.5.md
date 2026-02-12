# Phase 1 — Task 1.5

## Routing System Architecture

---

## Objective

Implement scalable routing architecture supporting:

* Public storefront
* Admin portal
* Authentication flows
* Role-based protection

---

## Dependencies

* Task 1.1 (Axios)
* Task 1.2 (Error handling)
* Task 1.4 (Query provider)

---

## Layout Structure

Create:

```
layouts/
  PublicLayout.tsx
  AdminLayout.tsx
  AuthLayout.tsx
```

Layouts must manage shared navigation and structure.

---

## Central Route Definition

Create:

```
src/routes/index.tsx
```

All routes must be declared here.

No scattered route definitions allowed.

---

## Route Guards

Implement:

### ProtectedRoute

Requires authentication.

### AdminRoute

Requires ADMIN role.

### CustomerRoute

Requires CUSTOMER role.

Unauthorized users must be redirected safely.

Never render restricted content.

---

## Lazy Loading

All route-level components must use dynamic imports.

Bundle size must remain optimized.

---

## Testing Requirements

Test:

* Unauthorized access redirect
* Role-based route enforcement
* Public routes accessible
* Lazy loading does not break routing

---

## Completion Criteria

* Routing centralized
* Guards enforced
* Layout separation clean
* No navigation warnings
* Tests pass

Task complete only when routing is production-safe and secure.
