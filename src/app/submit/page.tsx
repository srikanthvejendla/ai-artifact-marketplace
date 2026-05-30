"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ARTIFACT_TYPES, TYPE_META } from "@/lib/types";

const field =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30 dark:border-white/10 dark:bg-white/5";
const label = "mb-1.5 block text-sm font-medium";

export default function SubmitPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErrors([]);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/artifacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.details || [data.error || "Something went wrong"]);
        setBusy(false);
        return;
      }
      router.push(`/a/${data.artifact.slug}`);
    } catch {
      setErrors(["Network error — please try again"]);
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <h1 className="text-3xl font-bold tracking-tight">Publish an artifact</h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        Share a skill, agent, MCP server, or plugin with the community. It’s saved to the
        local SQLite catalog.
      </p>

      {errors.length > 0 && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300">
          <ul className="list-inside list-disc space-y-1">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label}>Name *</label>
            <input name="name" required placeholder="My Awesome Skill" className={field} />
          </div>
          <div>
            <label className={label}>Type *</label>
            <select name="type" defaultValue="skill" className={field}>
              {ARTIFACT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_META[t].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={label}>Tagline *</label>
          <input
            name="tagline"
            required
            maxLength={140}
            placeholder="One line that sells it"
            className={field}
          />
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea
            name="description"
            rows={4}
            placeholder="What does it do and when should someone use it?"
            className={field}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label}>Author</label>
            <input name="author" placeholder="your-handle" className={field} />
          </div>
          <div>
            <label className={label}>Version</label>
            <input name="version" placeholder="1.0.0" className={field} />
          </div>
        </div>

        <div>
          <label className={label}>Install command *</label>
          <input
            name="install_cmd"
            required
            placeholder="npx artifact add skill my-skill"
            className={`${field} font-mono`}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label}>Homepage</label>
            <input name="homepage" placeholder="https://…" className={field} />
          </div>
          <div>
            <label className={label}>Tags (comma-separated)</label>
            <input name="tags" placeholder="research, web, tools" className={field} />
          </div>
        </div>

        <div>
          <label className={label}>Details / README</label>
          <textarea
            name="content"
            rows={5}
            placeholder="Usage notes, configuration, examples…"
            className={`${field} font-mono`}
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "Publishing…" : "Publish to marketplace"}
        </button>
      </form>
    </div>
  );
}
