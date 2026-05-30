import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[var(--bg)]/80 backdrop-blur-xl dark:border-white/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20">
            ▲
          </span>
          <span>
            Artifact<span className="text-violet-500">Hub</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/?type=skill"
            className="hidden rounded-lg px-3 py-1.5 text-zinc-600 transition hover:bg-black/5 hover:text-black sm:block dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Browse
          </Link>
          <Link
            href="/submit"
            className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-1.5 font-medium text-white shadow-lg shadow-violet-600/20 transition hover:opacity-90"
          >
            Publish
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
