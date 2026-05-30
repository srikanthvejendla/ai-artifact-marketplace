import { getDb, slugify } from "./db.ts";
import type { ArtifactType } from "./types.ts";

interface Seed {
  name: string;
  type: ArtifactType;
  tagline: string;
  description: string;
  author: string;
  version: string;
  homepage?: string;
  install_cmd: string;
  content: string;
  tags: string;
  downloads: number;
  stars: number;
}

const SEEDS: Seed[] = [
  {
    name: "Deep Research",
    type: "skill",
    tagline: "Fan-out web search, verify claims, synthesize a cited report.",
    description:
      "A multi-source research skill that decomposes a question, runs parallel web searches, fetches and reads sources, adversarially verifies each claim, and synthesizes a fully cited report. Ideal for due diligence, literature scans, and competitive analysis.",
    author: "anthropic",
    version: "2.3.0",
    homepage: "https://example.com/deep-research",
    install_cmd: "npx artifact add skill deep-research",
    content:
      "# Deep Research\n\nProvide a specific question. The skill expands it into sub-questions, searches the web in parallel, cross-checks sources, and returns a report with inline citations.",
    tags: "research,web,citations,verification",
    downloads: 18420,
    stars: 1290,
  },
  {
    name: "PR Reviewer",
    type: "agent",
    tagline: "Autonomous code reviewer that comments inline on your diffs.",
    description:
      "An agent that reads a pull request diff, reasons about correctness, security, and style, then posts a structured findings list. Catches bugs, missing tests, and risky patterns before a human ever looks.",
    author: "octocat",
    version: "1.8.2",
    homepage: "https://example.com/pr-reviewer",
    install_cmd: "npx artifact add agent pr-reviewer",
    content:
      "# PR Reviewer Agent\n\nRuns against the current branch diff. Configurable severity threshold and per-language rules.",
    tags: "code-review,github,quality,ci",
    downloads: 9310,
    stars: 870,
  },
  {
    name: "Postgres MCP",
    type: "mcp",
    tagline: "Query and introspect Postgres safely from any model.",
    description:
      "A Model Context Protocol server exposing read-only and guarded write access to a Postgres database. Schema introspection, parameterized queries, and row-level limits keep the model on rails.",
    author: "supabase-labs",
    version: "0.9.4",
    homepage: "https://example.com/postgres-mcp",
    install_cmd: "npx @marketplace/postgres-mcp",
    content:
      "# Postgres MCP\n\nSet DATABASE_URL and add the server to your MCP config. Tools: list_tables, describe_table, query, explain.",
    tags: "database,postgres,sql,tools",
    downloads: 14002,
    stars: 1105,
  },
  {
    name: "Tailwind Snippets",
    type: "plugin",
    tagline: "Drop-in command palette of polished Tailwind UI blocks.",
    description:
      "A plugin bundling 120+ copy-paste Tailwind component blocks — hero sections, pricing tables, dashboards — plus slash commands to insert them and a hook that lints class ordering on save.",
    author: "uiwizards",
    version: "3.1.0",
    install_cmd: "npx artifact add plugin tailwind-snippets",
    content:
      "# Tailwind Snippets\n\nRun /tw <block> to insert a component. Includes a save hook that sorts utility classes.",
    tags: "tailwind,ui,frontend,snippets",
    downloads: 23110,
    stars: 1640,
  },
  {
    name: "SQL Migrator Agent",
    type: "agent",
    tagline: "Plans and applies schema migrations with rollback safety.",
    description:
      "Reads your current schema, diffs it against the desired state, generates ordered migration steps, dry-runs them in a shadow database, and applies with automatic rollback on failure.",
    author: "dbops",
    version: "1.2.7",
    install_cmd: "npx artifact add agent sql-migrator",
    content: "# SQL Migrator\n\nSupports Postgres, MySQL, SQLite. Always dry-runs first.",
    tags: "database,migrations,devops",
    downloads: 6720,
    stars: 540,
  },
  {
    name: "Filesystem MCP",
    type: "mcp",
    tagline: "Scoped read/write file access with allowlisted directories.",
    description:
      "Gives models safe filesystem access constrained to explicitly allowed directories. Supports read, write, search, and tree listing with path traversal protection.",
    author: "modelcontext",
    version: "1.0.6",
    homepage: "https://example.com/fs-mcp",
    install_cmd: "npx @marketplace/filesystem-mcp ~/projects",
    content: "# Filesystem MCP\n\nPass allowed roots as arguments. All paths are validated against them.",
    tags: "files,tools,security",
    downloads: 17880,
    stars: 1320,
  },
  {
    name: "Commit Crafter",
    type: "skill",
    tagline: "Generate clean, conventional commit messages from a diff.",
    description:
      "Analyzes staged changes and writes a conventional-commits message with a scoped subject and a tidy body. Understands monorepos and groups changes by package.",
    author: "gitwise",
    version: "1.4.1",
    install_cmd: "npx artifact add skill commit-crafter",
    content: "# Commit Crafter\n\nStage your changes, then invoke. Outputs type(scope): subject + body.",
    tags: "git,productivity,commits",
    downloads: 11240,
    stars: 760,
  },
  {
    name: "Browser Pilot",
    type: "plugin",
    tagline: "Drive a real browser for E2E testing and scraping.",
    description:
      "A plugin wrapping a headless browser with high-level commands: navigate, click, type, assert, and screenshot. Records traces and saves artifacts for every run.",
    author: "playwrights",
    version: "2.0.0",
    homepage: "https://example.com/browser-pilot",
    install_cmd: "npx artifact add plugin browser-pilot",
    content: "# Browser Pilot\n\nCommands: /goto, /click, /type, /assert, /shot. Saves traces to artifacts/.",
    tags: "browser,testing,automation,e2e",
    downloads: 15670,
    stars: 1180,
  },
  {
    name: "Threat Modeler",
    type: "agent",
    tagline: "Maps attack surface and ranks risks for a codebase.",
    description:
      "An agent that walks your code and dependencies, builds a data-flow map, enumerates threats using STRIDE, and outputs a prioritized risk register with mitigations.",
    author: "redteam",
    version: "0.7.3",
    install_cmd: "npx artifact add agent threat-modeler",
    content: "# Threat Modeler\n\nRuns STRIDE analysis and emits a ranked risk register as Markdown.",
    tags: "security,threat-model,audit",
    downloads: 4980,
    stars: 610,
  },
  {
    name: "Slack MCP",
    type: "mcp",
    tagline: "Read channels and post messages through one protocol surface.",
    description:
      "An MCP server for Slack: list channels, read recent messages, search, and post. Scoped by bot token with per-channel permission checks.",
    author: "chatops",
    version: "1.1.0",
    install_cmd: "npx @marketplace/slack-mcp",
    content: "# Slack MCP\n\nSet SLACK_BOT_TOKEN. Tools: list_channels, read_messages, search, post_message.",
    tags: "slack,chatops,messaging,tools",
    downloads: 8120,
    stars: 590,
  },
  {
    name: "Doc Summarizer",
    type: "skill",
    tagline: "Turn long documents into structured, skimmable briefs.",
    description:
      "Ingests PDFs, web pages, or Markdown and produces a layered summary: one-line gist, key points, and a section-by-section breakdown with quotes.",
    author: "brevity",
    version: "2.1.5",
    install_cmd: "npx artifact add skill doc-summarizer",
    content: "# Doc Summarizer\n\nFeed a document path or URL. Outputs gist + key points + section breakdown.",
    tags: "summarization,docs,productivity",
    downloads: 13340,
    stars: 980,
  },
  {
    name: "Env Doctor",
    type: "plugin",
    tagline: "Diagnose and fix broken local dev environments.",
    description:
      "A plugin that audits your toolchain — runtimes, package managers, env vars, ports — and proposes one-click fixes for common misconfigurations.",
    author: "devtools",
    version: "1.0.3",
    install_cmd: "npx artifact add plugin env-doctor",
    content: "# Env Doctor\n\nRun /doctor to scan your environment and apply suggested fixes.",
    tags: "devx,environment,tooling",
    downloads: 7450,
    stars: 520,
  },
];

export function seed({ reset = false }: { reset?: boolean } = {}): number {
  const db = getDb();
  if (reset) db.exec("DELETE FROM artifacts");
  const existing = db.prepare("SELECT COUNT(*) as n FROM artifacts").get() as {
    n: number;
  };
  if (existing.n > 0 && !reset) return 0;

  const insert = db.prepare(
    `INSERT INTO artifacts
      (slug, name, type, tagline, description, author, version, homepage, install_cmd, content, tags, downloads, stars, created_at)
     VALUES
      (@slug, @name, @type, @tagline, @description, @author, @version, @homepage, @install_cmd, @content, @tags, @downloads, @stars, datetime('now', '-' || @ago || ' days'))`,
  );
  const tx = db.transaction((rows: Seed[]) => {
    rows.forEach((s, i) => {
      insert.run({
        ...s,
        slug: slugify(s.name),
        homepage: s.homepage ?? null,
        ago: (rows.length - i) * 3,
      });
    });
  });
  tx(SEEDS);
  return SEEDS.length;
}

// Allow `node --experimental-strip-types src/lib/seed.ts`
if (process.argv[1] && process.argv[1].endsWith("seed.ts")) {
  const n = seed({ reset: process.argv.includes("--reset") });
  console.log(`Seeded ${n} artifacts into the database.`);
}
