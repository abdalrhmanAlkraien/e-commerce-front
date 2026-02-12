# Task 2.2 — Token Lifecycle

## Objective

Implement a **production-grade token lifecycle manager**.

Poor token handling is one of the most common SaaS vulnerabilities.

Treat this as **security infrastructure**, not UI logic.

---

## Mandatory Behaviors

### Axios Interceptor

Attach token automatically:

```
Authorization: Bearer <token>
```

---

### Auto Logout

If API returns:

```
401 Unauthorized
```

System MUST:

1. Clear auth state
2. Redirect to `/login`
3. Show session expired toast

Silent failures are forbidden.

---

### Refresh Strategy (If Supported)

Detect expiration via:

```
expiresInSeconds
```

If refresh endpoint exists → implement refresh flow.

If NOT → enforce forced logout.

Do NOT invent refresh endpoints.

Follow Swagger only.

---

### Multi-Tab Sync (Recommended)

Use:

```
BroadcastChannel
```

When logout occurs → notify other tabs.

Prevents zombie sessions.

---

## Deliverables

✅ Axios auth interceptor
✅ Token expiry handler
✅ Global logout trigger
✅ Optional refresh flow
✅ BroadcastChannel sync

---
