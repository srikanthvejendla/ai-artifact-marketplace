# Stack Decision — AI Artifact Marketplace

## Request
A web app marketplace for AI artifacts: **skills, agents, MCPs, plugins**. Must use a **local SQLite database**.

## Interpreted scope
A polished, full-stack marketplace: browse a catalog of artifacts, filter by type/search/sort, view rich detail pages with install instructions, publish new artifacts (writes to SQLite), and a working download/install counter. Implicit expectations: responsive design, dark mode, server-side persistence, seeded demo content, clean modern UI.

## Stack candidates

| Stack | Pros for THIS task | Cons |
|---|---|---|
| **Next.js 15 (App Router) + TS + Tailwind + better-sqlite3** | One repo for UI + API; Route Handlers give a clean REST surface over SQLite; React Server Components fetch directly from DB; great DX; trivial dark mode with Tailwind | Native module needs `serverExternalPackages` config |
| Vite + React SPA + separate Express/SQLite API | Simple SPA | Two processes to run/deploy; more glue; no SSR SEO |
| Astro + SQLite | Fast static-ish | Marketplace is dynamic (publish, counters) — fights Astro's static strengths |

## Pick: **Next.js 15 + TypeScript + Tailwind v4 + better-sqlite3**
Best fit: the marketplace is inherently dynamic (publish, search, counters) and benefits from a single deployable that co-locates DB access, API routes, and a server-rendered UI. `better-sqlite3` is synchronous, fast, zero-config, and satisfies the explicit "local SQLite" requirement.

## Data model
`artifacts(id, slug, name, type[skill|agent|mcp|plugin], tagline, description, author, version, homepage, install_cmd, content, tags(csv), downloads, stars, created_at)`

## API contract
- `GET /api/artifacts?type=&q=&sort=` → list
- `GET /api/artifacts/:slug` → one
- `POST /api/artifacts` → create (validated)
- `POST /api/artifacts/:slug/install` → increments downloads, returns count

## Hosting
Production build → port 8001 → `expose_url.sh` → Tailscale URL. SQLite file at `data/marketplace.db`.

## Risks & mitigations
- *Native build of better-sqlite3*: Node 22 prebuilds available → verify on install. Mitigation fallback: `node:sqlite` builtin.
- *DB on read-only FS in build*: open DB lazily at request time, not at import in client bundles → use `serverExternalPackages`.
