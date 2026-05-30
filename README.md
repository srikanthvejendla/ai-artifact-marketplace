# ArtifactHub — AI Artifact Marketplace

A full-stack marketplace for **AI artifacts**: skills, agents, MCP servers, and plugins.
Browse a catalog, filter by type, search, view rich detail pages with install commands,
and publish your own — all backed by a **local SQLite database**.

![stack](https://img.shields.io/badge/Next.js-15-black) ![db](https://img.shields.io/badge/SQLite-better--sqlite3-blue) ![ts](https://img.shields.io/badge/TypeScript-strict-3178c6)

## 🌐 Live demo

**https://mac-studio.therandomdotdev.ts.net/**

The production build runs locally on `:8001` and is exposed publicly over **Tailscale Funnel**
(`tailscale funnel --bg --https=443 localhost:8001`). Because it's served from a local
machine, the URL is reachable only while that machine and the server are running. To bring it
back up: `pnpm build && pnpm start` then re-run the funnel command.

![home](artifacts/screenshot-home.png)

## Features

- **Four artifact types** — skills, agents, MCPs, plugins, each with its own badge and accent.
- **Browse, filter & search** — filter by type, full-text search across name/tagline/tags/author, sort by downloads, rating, recency, or name.
- **Rich detail pages** — description, README/details, tags, homepage, and a one-click install (copies the command + increments the install counter via the API).
- **Publish flow** — a validated form (`/submit`) that writes new artifacts to SQLite.
- **REST API** over the same data layer.
- **Dark / light mode** with persisted preference, responsive design, polished gradient UI.
- **Local-first** — zero external services; the catalog lives in `data/marketplace.db`.

## Stack & rationale

**Next.js 15 (App Router) + TypeScript + Tailwind v4 + better-sqlite3.**
The marketplace is dynamic (publishing, counters, search), so a single deployable that
co-locates server-rendered UI, REST route handlers, and synchronous SQLite access is the
cleanest fit. See [`docs/stack-decision.md`](docs/stack-decision.md) for the alternatives
considered.

## Getting started

```bash
pnpm install
pnpm seed        # optional — the app also self-seeds on first load
pnpm dev         # http://localhost:8001
```

Production:

```bash
pnpm build
pnpm start       # http://localhost:8001
```

## Environment

| Var | Default | Purpose |
|---|---|---|
| `DATABASE_PATH` | `./data/marketplace.db` | Location of the SQLite file |

See [`.env.example`](.env.example).

## API

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/artifacts?type=&q=&sort=` | List / filter / search artifacts |
| `POST` | `/api/artifacts` | Create an artifact (JSON, validated) |
| `GET` | `/api/artifacts/:slug` | Fetch one artifact |
| `POST` | `/api/artifacts/:slug/install` | Increment install count |

`sort` ∈ `popular | stars | recent | name`. `type` ∈ `skill | agent | mcp | plugin`.

Create payload:

```json
{
  "name": "My Skill",
  "type": "skill",
  "tagline": "One-liner",
  "description": "Longer text",
  "author": "you",
  "version": "1.0.0",
  "install_cmd": "npx artifact add skill my-skill",
  "homepage": "https://…",
  "tags": "a, b, c",
  "content": "README…"
}
```

## Data model

`artifacts(id, slug, name, type, tagline, description, author, version, homepage, install_cmd, content, tags, downloads, stars, created_at)`

## Tests

```bash
pnpm test        # node:test — validation, db CRUD, seeding, slug uniqueness
```

## Project layout

```
src/
  app/
    page.tsx                 # home: hero + filters + grid
    a/[slug]/page.tsx        # artifact detail
    submit/page.tsx          # publish form
    api/artifacts/...        # REST handlers
  components/                # Navbar, Filters, ArtifactCard, InstallButton, …
  lib/                       # db.ts (SQLite), types.ts, validate.ts, seed.ts
data/marketplace.db          # local SQLite catalog (gitignored)
```
