import { listArtifacts, countsByType } from "@/lib/db";
import { seed } from "@/lib/seed";
import { TYPE_META, ARTIFACT_TYPES } from "@/lib/types";
import ArtifactCard from "@/components/ArtifactCard";
import Filters from "@/components/Filters";

export const dynamic = "force-dynamic";

type SP = Promise<{ [k: string]: string | string[] | undefined }>;

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function Home({ searchParams }: { searchParams: SP }) {
  seed(); // idempotent: populates demo catalog on first run
  const sp = await searchParams;
  const type = str(sp.type);
  const q = str(sp.q);
  const sort = (str(sp.sort) as "popular" | "recent" | "stars" | "name") || "popular";

  const artifacts = listArtifacts({ type, q, sort });
  const counts = countsByType();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div>
      <section className="grid-backdrop relative mb-10 overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br from-violet-600/10 via-fuchsia-500/5 to-transparent px-6 py-12 text-center dark:border-white/10">
        <p className="mb-3 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-500">
          {total} artifacts · local SQLite catalog
        </p>
        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          The marketplace for{" "}
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            AI artifacts
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-500 dark:text-zinc-400">
          Discover and publish skills, agents, MCP servers, and plugins. One click to
          install, fully self-hosted.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {ARTIFACT_TYPES.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm dark:bg-white/5 dark:text-zinc-300"
            >
              {TYPE_META[t].icon} {TYPE_META[t].plural}
            </span>
          ))}
        </div>
      </section>

      <Filters counts={counts} />

      {type && (
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          {TYPE_META[type as keyof typeof TYPE_META]?.blurb}
        </p>
      )}

      {artifacts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 py-20 text-center text-zinc-500 dark:border-white/10">
          No artifacts match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artifacts.map((a) => (
            <ArtifactCard key={a.id} a={a} />
          ))}
        </div>
      )}
    </div>
  );
}
