# Task 7.3 — SEO (Storefront Only)

## Objective

Make the storefront discoverable by search engines.

Admin panel does NOT require SEO.

Public commerce pages DO.

Organic traffic is free revenue.

Ignoring SEO is a strategic mistake.

---

## Critical Decision

If SEO is a long-term priority, strongly consider:

👉 SSR / Hybrid rendering later (Next.js, Remix)

For now — implement **client SEO best practices.**

---

## Metadata Management

Install:

```
react-helmet-async
```

Every public page MUST define:

* title
* description
* canonical

Never ship default titles.

---

## Structured URLs

Prefer:

```
/products/macbook-pro
```

NOT:

```
/products?id=123
```

You already support slug — excellent.

---

## OpenGraph Tags

Ensure products generate:

* og:title
* og:image
* og:description

Critical for social sharing.

---

## Sitemap + Robots

Generate:

```
/sitemap.xml
/robots.txt
```

Even basic versions help crawlers.

---

## Performance & SEO Are Linked

Google penalizes slow sites.

Performance work from Task 7.1 boosts ranking.

---

## Deliverables

✅ Metadata system
✅ Helmet provider
✅ Product meta templates
✅ Sitemap
✅ Robots config

---
# Completion Criteria — Phase 7

Phase is complete ONLY when:

✅ Lighthouse performance improved
✅ Accessibility violations resolved
✅ Metadata present
✅ Logs structured
✅ No console spam

AND:

✅ Zero TypeScript errors
✅ Lint passes
✅ Tests unaffected

---