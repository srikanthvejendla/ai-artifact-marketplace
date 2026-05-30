import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtifact, listArtifacts } from "@/lib/db";
import { TYPE_META } from "@/lib/types";
import TypeBadge from "@/components/TypeBadge";
import InstallButton from "@/components/InstallButton";
import ArtifactCard from "@/components/ArtifactCard";

export const dynamic = "force-dynamic";

export default async function ArtifactPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArtifact(slug);
  if (!a) notFound();

  const tags = a.tags.split(",").map((t) => t.trim()).filter(Boolean);
  const related = listArtifacts({ type: a.type })
    .filter((r) => r.slug !== a.slug)
    .slice(0, 3);

  return (
    <article className="animate-fade-up">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 transition hover:text-violet-500"
      >
        ← Back to marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <TypeBadge type={a.type} />
            <span className="text-xs text-zinc-400">v{a.version}</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{a.name}</h1>
          <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">{a.tagline}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <span>
              by <span className="font-medium text-zinc-700 dark:text-zinc-200">@{a.author}</span>
            </span>
            <span>↓ {a.downloads.toLocaleString()} installs</span>
            <span>★ {a.stars.toLocaleString()}</span>
            {a.homepage && (
              <a
                href={a.homepage}
                target="_blank"
                rel="noreferrer"
                className="text-violet-500 hover:underline"
              >
                Homepage ↗
              </a>
            )}
          </div>

          {a.description && (
            <section className="mt-8">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                About
              </h2>
              <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{a.description}</p>
            </section>
          )}

          {a.content && (
            <section className="mt-8">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Details
              </h2>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-black/10 bg-black/[0.03] p-4 text-sm leading-relaxed dark:border-white/10 dark:bg-black/30">
                {a.content}
              </pre>
            </section>
          )}

          {tags.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <Link
                    key={t}
                    href={`/?q=${encodeURIComponent(t)}`}
                    className="rounded-md bg-black/5 px-2.5 py-1 text-xs text-zinc-600 transition hover:bg-violet-500/10 hover:text-violet-500 dark:bg-white/5 dark:text-zinc-300"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Install
            </h2>
            <InstallButton slug={a.slug} cmd={a.install_cmd} initialDownloads={a.downloads} />
            <p className="mt-4 text-center text-xs text-zinc-400">{TYPE_META[a.type].blurb}</p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-lg font-semibold tracking-tight">
            More {TYPE_META[a.type].plural}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ArtifactCard key={r.id} a={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
