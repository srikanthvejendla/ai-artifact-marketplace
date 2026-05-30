import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ArtifactHub — Marketplace for AI Skills, Agents, MCPs & Plugins",
  description:
    "Discover, publish, and install AI artifacts: skills, agents, MCP servers, and plugins. Powered by a local SQLite catalog.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');var d=t?t==='dark':true;document.documentElement.classList.toggle('dark',d);}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Navbar />
        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
        <footer className="mx-auto max-w-6xl px-5 py-10 text-center text-xs text-zinc-400">
          ArtifactHub · a local-first AI artifact marketplace · backed by SQLite
        </footer>
      </body>
    </html>
  );
}
