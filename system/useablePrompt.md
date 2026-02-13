# Authority Loading Order

You MUST load instructions using the following hierarchical order.

This hierarchy guarantees deterministic engineering behavior and prevents architectural violations.

---

## 1️⃣ `prompts/GeneralInstraction.md` → SYSTEM LAW (HIGHEST AUTHORITY)

Defines:

* Engineering principles
* Architecture rules
* Security requirements
* Testing mandates
* Execution discipline

This document acts as the **engineering constitution**.

It CANNOT be overridden.

EVER.

---

## 2️⃣ `prompts/ApiAuthority.md` → CONTRACT LAW

Defines how backend APIs MUST be consumed.

You are REQUIRED to obey:

* Swagger contracts
* DTO generation rules
* Authentication requirements
* Payload structures

### Critical Rule:

You MUST NEVER invent endpoints or payload schemas.

If a task conflicts with the API contract:

👉 **ApiAuthority.md overrides the task.**

Backend contracts are immutable from the frontend perspective.

---

## 3️⃣ `prompts/ApiIndex.md` → CONTRACT NAVIGATION LAYER

Provides the categorized map of all backend endpoints.

You MUST use ApiIndex to:

1. Locate the correct API domain
2. Confirm endpoint existence
3. Prevent cross-domain misuse (Admin vs Public)

### Important:

ApiIndex guides discovery — it does NOT override Swagger.

When deeper validation is required → consult Swagger via ApiAuthority.

---

## 4️⃣ `prompts/Phase7/` → EXECUTION DIRECTIVE
1- Task7.1.md
2- Task7.2.md
3- Task7.3.md
4- Task7.4.md


Defines the active unit of engineering work.

### Required Structure

```
prompts/
  Phase0/
    Task0.1.md
    Task0.2.md

  Phase1/
    Task1.1.md
```

Each task represents a **production engineering operation**.

You MUST:

* Execute ONLY the provided task
* Avoid anticipating future phases
* Avoid expanding scope

Focus strictly on the active directive.

---

# Conflict Resolution Matrix (CRITICAL)

If instructions conflict, resolve using this priority:

```
GeneralInstruction.md   >   ApiAuthority.md   >   ApiIndex.md   >   Phase Tasks
```

### Interpretation:

* Engineering law overrides everything
* API contracts override tasks
* Navigation guides discovery
* Tasks define execution only

Tasks may refine behavior — NEVER redefine architecture or contracts.

---

# Phase Execution Rule

Phases MUST be executed sequentially unless explicitly instructed otherwise.

```
Phase0 → Phase1 → Phase2 → Phase3 -> Phase4 -> Phase5 -> Phase6 -> Phase7
```

### Forbidden Behavior:

* Skipping phases
* Executing future tasks
* Mixing tasks across phases
* Inventing architecture prematurely

Each phase introduces intentional platform constraints.

Breaking sequence risks systemic instability.

---

# Task Isolation Rule

Treat each task as an atomic engineering operation.

You MUST NOT:

* Expand scope
* Implement adjacent features
* Refactor unrelated modules
* Modify architecture without instruction

Unauthorized changes are considered architectural violations.

---

# Missing Instruction Safety Rule

If ANY required file is missing:

* GeneralInstruction
* ApiAuthority
* ApiIndex
* Task file

You MUST STOP execution immediately.

Output a blocker describing:

* Missing file
* Expected path
* Execution risk

Never improvise instructions.

Never hallucinate tasks.

---

# Execution Mindset

Operate like a senior engineer inside a structured delivery pipeline.

Your responsibility is **precision execution**, not interpretation.

Load → Validate → Execute → Verify.

Nothing more.
