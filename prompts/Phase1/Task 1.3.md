# Phase 1 — Task 1.3

## DTO Generator from Swagger

---

## Objective

Generate strongly typed TypeScript definitions directly from the OpenAPI specification.

Manual DTO creation is forbidden.

Swagger is the single source of truth.

---

## Dependencies

* ApiAuthority.md
* ApiIndex.md

---

## Implementation Requirements

### Tooling

Install:

```
openapi-typescript
```

---

### Generation Script

Add script:

```
"generate:types": "openapi-typescript http://localhost:8080/api-docs -o src/shared/types/api.ts"
```

---

### Rules

* Generated file is read-only
* Never modify generated types manually
* Extend via wrapper types if needed
* Regenerate on contract change

---

## Integration Requirement

All API calls MUST use generated types.

No inline interfaces allowed.

---

## Testing Requirements

* Ensure types compile
* Validate one endpoint integration compiles with generated types

---

## Completion Criteria

* Types generated successfully
* Script operational
* No handwritten duplicate DTOs
* TypeScript fully aligned with Swagger

Task complete only when contract drift risk is eliminated.
