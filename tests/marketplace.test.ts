import { test } from "node:test";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { rmSync } from "node:fs";

// Isolated temp DB before importing the db module
const DBP = join(tmpdir(), `mkt-test-${process.pid}.db`);
process.env.DATABASE_PATH = DBP;

const { validateArtifact } = await import("../src/lib/validate.ts");
const db = await import("../src/lib/db.ts");
const { seed } = await import("../src/lib/seed.ts");

test.after(() => {
  for (const ext of ["", "-wal", "-shm"]) {
    try {
      rmSync(DBP + ext);
    } catch {}
  }
});

test("validateArtifact rejects missing fields", () => {
  const r = validateArtifact({ name: "x" });
  assert.equal(r.ok, false);
  assert.ok(r.errors.length >= 1);
});

test("validateArtifact rejects bad type", () => {
  const r = validateArtifact({
    name: "Cool Thing",
    type: "widget",
    tagline: "hi",
    install_cmd: "npx x",
  });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes("type")));
});

test("validateArtifact accepts a valid artifact", () => {
  const r = validateArtifact({
    name: "Cool Thing",
    type: "skill",
    tagline: "Does cool things",
    install_cmd: "npx artifact add skill cool-thing",
  });
  assert.equal(r.ok, true);
  assert.equal(r.value?.author, "anonymous");
  assert.equal(r.value?.version, "1.0.0");
});

test("seed populates the catalog and is idempotent", () => {
  const first = seed({ reset: true });
  assert.ok(first > 0);
  const second = seed();
  assert.equal(second, 0);
  assert.ok(db.listArtifacts().length === first);
});

test("listArtifacts filters by type and search", () => {
  const skills = db.listArtifacts({ type: "skill" });
  assert.ok(skills.every((a) => a.type === "skill"));
  const found = db.listArtifacts({ q: "research" });
  assert.ok(found.length >= 1);
});

test("createArtifact + incrementDownloads round-trip", () => {
  const a = db.createArtifact({
    name: "Round Trip Tester",
    type: "plugin",
    tagline: "test",
    description: "",
    author: "tester",
    install_cmd: "npx test",
  });
  assert.equal(a.downloads, 0);
  assert.ok(a.slug.length > 0);
  const n = db.incrementDownloads(a.slug);
  assert.equal(n, 1);
  assert.equal(db.incrementDownloads("does-not-exist"), null);
});

test("slug is unique on duplicate names", () => {
  const a = db.createArtifact({
    name: "Dup Name",
    type: "agent",
    tagline: "t",
    description: "",
    author: "x",
    install_cmd: "npx a",
  });
  const b = db.createArtifact({
    name: "Dup Name",
    type: "agent",
    tagline: "t",
    description: "",
    author: "x",
    install_cmd: "npx a",
  });
  assert.notEqual(a.slug, b.slug);
});
