# PHASE 2 — Authentication & Security Foundation

This phase establishes the **security boundary** of the application.

Authentication is NOT a feature.

It is **infrastructure**.

If implemented incorrectly, the entire SaaS becomes vulnerable.

Therefore this phase carries **HIGH architectural authority**.

---
# Task 2.1 — Auth Module

## Objective

Build a **production-grade authentication module** that integrates strictly with the OpenAPI contract.

The module must support:

* User login
* User registration
* Secure logout
* Auth state persistence (memory-first)
* Role-aware session handling

This module becomes the **root security provider** of the application.

---

## Architectural Requirements

Create module:

```
src/modules/auth/
```

Required structure:

```
auth/
 ├── api/
 ├── hooks/
 ├── store/
 ├── components/
 ├── pages/
 ├── types/
 └── utils/
```

---

## Mandatory Capabilities

### API Layer

Use the shared Axios client.

Create:

```
auth.api.ts
```

Endpoints MUST be derived from:

```
/v3/api-docs
```

Never hardcode DTOs.

Always import generated types from:

```
src/shared/types/api.ts
```

---

### Required Hooks

```
useLogin()
useRegister()
useLogout()
useCurrentUser()
```

Hooks MUST use React Query mutations.

No direct API calls inside components.

---

### Global Auth Store (Zustand)

Create:

```
auth.store.ts
```

Store MUST manage:

* accessToken
* user
* role
* isAuthenticated

### Forbidden:

❌ Redux
❌ Context-based auth
❌ localStorage-first strategy

---

### UI Pages

Create minimal but production-safe pages:

```
/login
/register
```

Requirements:

✅ React Hook Form
✅ Zod validation
✅ Accessible inputs
✅ Loading states
✅ Error messaging
✅ Disabled submit during mutation

NO design perfection required — focus on reliability.

---

## Security Requirements

### Token Storage Strategy

Primary → **Memory**

Fallback → **Secure cookie** (if backend supports)

Avoid localStorage unless explicitly justified.

---

### Logout MUST:

* Clear token
* Reset store
* Invalidate React Query cache
* Redirect to login

---

## Deliverables

✅ Auth API layer
✅ Zustand store
✅ Auth hooks
✅ Login/Register pages
✅ Zod schemas
✅ Role extraction logic

Auth MUST compile with ZERO TypeScript errors.

---






