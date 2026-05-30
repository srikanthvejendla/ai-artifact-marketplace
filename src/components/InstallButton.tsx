"use client";

import { useState } from "react";

export default function InstallButton({
  slug,
  cmd,
  initialDownloads,
}: {
  slug: string;
  cmd: string;
  initialDownloads: number;
}) {
  const [downloads, setDownloads] = useState(initialDownloads);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function install() {
    setBusy(true);
    try {
      await navigator.clipboard?.writeText(cmd).catch(() => {});
      const res = await fetch(`/api/artifacts/${slug}/install`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setDownloads(data.downloads);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 font-mono text-sm dark:border-white/10 dark:bg-black/40">
        <span className="select-none text-zinc-400">$</span>
        <code className="flex-1 overflow-x-auto whitespace-nowrap">{cmd}</code>
      </div>
      <button
        onClick={install}
        disabled={busy}
        className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:opacity-90 disabled:opacity-60"
      >
        {copied ? "✓ Copied install command" : busy ? "Installing…" : "Install — copy command"}
      </button>
      <p className="text-center text-xs text-zinc-400">
        {downloads.toLocaleString()} installs
      </p>
    </div>
  );
}
