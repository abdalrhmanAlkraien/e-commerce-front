# Task 2.3 — Route Protection & Role Enforcement

## Objective

Secure the navigation layer.

Users MUST NEVER access routes outside their role.

Frontend is NOT the primary security layer — but it must enforce UX-level protection.

---

## Required Guards

Create:

```
ProtectedRoute
AdminRoute
CustomerRoute
```

---

### Behavior

ProtectedRoute:

* Blocks anonymous users
* Redirect → `/login`

AdminRoute:

* Allows only ADMIN
* Redirect unauthorized → `/403`

CustomerRoute:

* Blocks ADMIN-only screens when required

---

### Router Integration

Use React Router v6.

Centralize routes inside:

```
src/app/router.tsx
```

Avoid scattered routing.

---

## Deliverables

✅ Route guards
✅ Role-based redirects
✅ Unauthorized page
✅ Clean router structure

---