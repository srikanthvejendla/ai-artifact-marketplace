export const ARTIFACT_TYPES = ["skill", "agent", "mcp", "plugin"] as const;
export type ArtifactType = (typeof ARTIFACT_TYPES)[number];

export interface Artifact {
  id: number;
  slug: string;
  name: string;
  type: ArtifactType;
  tagline: string;
  description: string;
  author: string;
  version: string;
  homepage: string | null;
  install_cmd: string;
  content: string;
  tags: string; // comma-separated in DB
  downloads: number;
  stars: number;
  created_at: string;
}

export interface ArtifactInput {
  name: string;
  type: ArtifactType;
  tagline: string;
  description: string;
  author: string;
  version?: string;
  homepage?: string;
  install_cmd: string;
  content?: string;
  tags?: string;
}

export const TYPE_META: Record<
  ArtifactType,
  { label: string; plural: string; icon: string; blurb: string; accent: string }
> = {
  skill: {
    label: "Skill",
    plural: "Skills",
    icon: "✦",
    blurb: "Reusable capabilities that extend what an AI assistant can do.",
    accent: "from-violet-500 to-fuchsia-500",
  },
  agent: {
    label: "Agent",
    plural: "Agents",
    icon: "◆",
    blurb: "Autonomous specialists that plan and execute multi-step tasks.",
    accent: "from-sky-500 to-cyan-400",
  },
  mcp: {
    label: "MCP",
    plural: "MCP Servers",
    icon: "⬡",
    blurb: "Model Context Protocol servers that connect tools and data.",
    accent: "from-emerald-500 to-teal-400",
  },
  plugin: {
    label: "Plugin",
    plural: "Plugins",
    icon: "◈",
    blurb: "Drop-in extensions that bundle commands, hooks, and config.",
    accent: "from-amber-500 to-orange-500",
  },
};
