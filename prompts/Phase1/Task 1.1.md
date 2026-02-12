# Phase 1 — Task 1.1

## Axios API Client

---

## Objective

Implement a centralized HTTP client layer responsible for ALL backend communication.

This client becomes the single gateway between frontend and backend.

No direct API calls are allowed outside this layer.

---

## Dependencies

* Task 0.2 (Environment Strategy)
* Task 0.3 (Core Stack Installed)

---

## Functional Requirements

* Read base URL from environment config
* Automatically inject JWT token
* Normalize backend errors
* Support request cancellation
* Enforce strong typing
* Trigger logout on 401

---

## Implementation Requirements

### Location

```
src/shared/api/axiosClient.ts
```

---

### Configuration

* baseURL from typed environment config
* default headers: application/json
* timeout defined
* no hardcoded URLs

---

### Request Interceptor

You MUST:

* Retrieve token from centralized auth store
* Inject `Authorization: Bearer <token>` when present
* Avoid direct storage access

---

### Response Interceptor

Handle globally:

| Status | Behavior                         |
| ------ | -------------------------------- |
| 401    | trigger logout via auth store    |
| 403    | throw normalized forbidden error |
| 500    | map to generic server error      |

Never return raw Axios errors.

---

### Error Normalization

Create:

```
src/shared/api/apiError.ts
```

Standard shape:

```
interface ApiError {
  message: string
  status: number
  code?: string
}
```

All failures MUST conform to this format.

---

## Testing Requirements

Unit tests MUST cover:

* Token injection
* 401 logout behavior
* Error normalization mapping
* Request configuration

Mock axios using MSW.

---

## Completion Criteria

* No inline axios usage anywhere
* Types pass
* Tests pass
* No console errors
* Interceptors verified

Task is complete only when the HTTP layer is production-safe.
