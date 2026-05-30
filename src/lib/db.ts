import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { Artifact, ArtifactInput } from "./types.ts";
import { ARTIFACT_TYPES } from "./types.ts";

let _db: Database.Database | null = null;

function dbPath(): string {
  return resolve(process.env.DATABASE_PATH || "./data/marketplace.db");
}

export function getDb(): Database.Database {
  if (_db) return _db;
  const path = dbPath();
  mkdirSync(dirname(path), { recursive: true });
  const db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS artifacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('skill','agent','mcp','plugin')),
      tagline TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT 'anonymous',
      version TEXT NOT NULL DEFAULT '1.0.0',
      homepage TEXT,
      install_cmd TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '',
      downloads INTEGER NOT NULL DEFAULT 0,
      stars INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_artifacts_type ON artifacts(type);
  `);
  _db = db;
  return db;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function uniqueSlug(base: string): string {
  const db = getDb();
  let slug = base || "artifact";
  let n = 1;
  const stmt = db.prepare("SELECT 1 FROM artifacts WHERE slug = ?");
  while (stmt.get(slug)) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

export interface ListOpts {
  type?: string;
  q?: string;
  sort?: "popular" | "recent" | "stars" | "name";
}

export function listArtifacts(opts: ListOpts = {}): Artifact[] {
  const db = getDb();
  const where: string[] = [];
  const params: Record<string, unknown> = {};
  if (opts.type && (ARTIFACT_TYPES as readonly string[]).includes(opts.type)) {
    where.push("type = @type");
    params.type = opts.type;
  }
  if (opts.q && opts.q.trim()) {
    where.push("(name LIKE @q OR tagline LIKE @q OR description LIKE @q OR tags LIKE @q OR author LIKE @q)");
    params.q = `%${opts.q.trim()}%`;
  }
  const order =
    opts.sort === "recent"
      ? "created_at DESC, id DESC"
      : opts.sort === "stars"
        ? "stars DESC, downloads DESC"
        : opts.sort === "name"
          ? "name COLLATE NOCASE ASC"
          : "downloads DESC, stars DESC";
  const sql =
    `SELECT * FROM artifacts` +
    (where.length ? ` WHERE ${where.join(" AND ")}` : "") +
    ` ORDER BY ${order}`;
  return db.prepare(sql).all(params) as Artifact[];
}

export function getArtifact(slug: string): Artifact | undefined {
  return getDb().prepare("SELECT * FROM artifacts WHERE slug = ?").get(slug) as
    | Artifact
    | undefined;
}

export function countsByType(): Record<string, number> {
  const rows = getDb()
    .prepare("SELECT type, COUNT(*) as n FROM artifacts GROUP BY type")
    .all() as { type: string; n: number }[];
  const out: Record<string, number> = {};
  for (const r of rows) out[r.type] = r.n;
  return out;
}

export function createArtifact(input: ArtifactInput): Artifact {
  const db = getDb();
  const slug = uniqueSlug(slugify(input.name));
  const info = db
    .prepare(
      `INSERT INTO artifacts
        (slug, name, type, tagline, description, author, version, homepage, install_cmd, content, tags, downloads, stars)
       VALUES
        (@slug, @name, @type, @tagline, @description, @author, @version, @homepage, @install_cmd, @content, @tags, 0, 0)`,
    )
    .run({
      slug,
      name: input.name.trim(),
      type: input.type,
      tagline: (input.tagline || "").trim(),
      description: (input.description || "").trim(),
      author: (input.author || "anonymous").trim(),
      version: (input.version || "1.0.0").trim(),
      homepage: input.homepage?.trim() || null,
      install_cmd: (input.install_cmd || "").trim(),
      content: (input.content || "").trim(),
      tags: (input.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .join(","),
    });
  return getDb()
    .prepare("SELECT * FROM artifacts WHERE id = ?")
    .get(info.lastInsertRowid) as Artifact;
}

export function incrementDownloads(slug: string): number | null {
  const db = getDb();
  const res = db
    .prepare("UPDATE artifacts SET downloads = downloads + 1 WHERE slug = ?")
    .run(slug);
  if (res.changes === 0) return null;
  const row = db
    .prepare("SELECT downloads FROM artifacts WHERE slug = ?")
    .get(slug) as { downloads: number };
  return row.downloads;
}
