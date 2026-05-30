"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ARTIFACT_TYPES, TYPE_META } from "@/lib/types";

export default function Filters({ counts }: { counts: Record<string, number> }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const activeType = params.get("type") || "";
  const activeSort = params.get("sort") || "popular";
  const [q, setQ] = useState(params.get("q") || "");

  useEffect(() => {
    setQ(params.get("q") || "");
  }, [params]);

  function push(next: URLSearchParams) {
    const s = next.toString();
    router.push(s ? `${pathname}?${s}` : pathname);
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    push(next);
  }

  function setSort(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set("sort", value);
    push(next);
  }

  function typeHref(t: string) {
    const next = new URLSearchParams(params.toString());
    if (t) next.set("type", t);
    else next.delete("type");
    const s = next.toString();
    return s ? `?${s}` : pathname;
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const pill = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
      active
        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
        : "bg-black/5 text-zinc-600 hover:bg-black/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
    }`;

  return (
    <div className="mb-8 space-y-4">
      <form onSubmit={onSearch} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search skills, agents, MCPs, plugins…"
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30 dark:border-white/10 dark:bg-white/5"
        />
        <button
          type="submit"
          className="rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <Link href={typeHref("")} className={pill(!activeType)} scroll={false}>
          All <span className="opacity-60">{total}</span>
        </Link>
        {ARTIFACT_TYPES.map((t) => (
          <Link key={t} href={typeHref(t)} className={pill(activeType === t)} scroll={false}>
            {TYPE_META[t].plural} <span className="opacity-60">{counts[t] || 0}</span>
          </Link>
        ))}
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-zinc-400">Sort</span>
          <select
            value={activeSort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-black/10 bg-white px-2 py-1.5 outline-none dark:border-white/10 dark:bg-white/5"
          >
            <option value="popular">Most downloaded</option>
            <option value="stars">Top rated</option>
            <option value="recent">Newest</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
