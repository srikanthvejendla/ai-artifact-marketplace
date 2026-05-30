import Link from "next/link";
import type { Artifact } from "@/lib/types";
import TypeBadge from "./TypeBadge";

function fmt(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export default function ArtifactCard({ a }: { a: Artifact }) {
  const tags = a.tags.split(",").map((t) => t.trim()).filter(Boolean);
  return (
    <Link
      href={`/a/${a.slug}`}
      className="group flex flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-400/40 hover:shadow-xl hover:shadow-violet-500/5 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
    >
      <div className="mb-3 flex items-center justify-between">
        <TypeBadge type={a.type} />
        <span className="text-xs text-zinc-400">v{a.version}</span>
      </div>
      <h3 className="text-lg font-semibold tracking-tight group-hover:text-violet-500">
        {a.name}
      </h3>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-zinc-500 dark:text-zinc-400">
        {a.tagline}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded-md bg-black/5 px-2 py-0.5 text-[11px] text-zinc-500 dark:bg-white/5 dark:text-zinc-400"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3 text-xs text-zinc-500 dark:border-white/5 dark:text-zinc-400">
        <span>@{a.author}</span>
        <span className="flex items-center gap-3">
          <span title="downloads">↓ {fmt(a.downloads)}</span>
          <span title="stars">★ {fmt(a.stars)}</span>
        </span>
      </div>
    </Link>
  );
}
