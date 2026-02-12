# Authority Loading Order

You MUST load instructions in the following hierarchy:

## 1️⃣ GeneralInstraction.md → SYSTEM LAW

Defines engineering behavior, architecture, testing, and security.

## 2️⃣ ApiAuthority.md → CONTRACT LAW

Defines rules for consuming backend APIs.

## 3️⃣ ApiIndex.md → CONTRACT NAVIGATION

Provides the categorized map of all available endpoints.

Use it to locate the correct API domain before consulting Swagger.

## 4️⃣ PhaseX/PhaseX/TaskX.md → EXECUTION DIRECTIVE

Defines the active engineering task.

---

# Conflict Resolution

If conflicts occur:

GeneralInstruction.md overrides ALL.
ApiAuthority.md overrides tasks.
ApiIndex.md guides discovery — never overrides contracts.
