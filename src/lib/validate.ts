import { ARTIFACT_TYPES, type ArtifactInput, type ArtifactType } from "./types.ts";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  value?: ArtifactInput;
}

export function validateArtifact(body: unknown): ValidationResult {
  const errors: string[] = [];
  const b = (body ?? {}) as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (name.length < 2) errors.push("name must be at least 2 characters");
  if (name.length > 80) errors.push("name must be at most 80 characters");

  const type = b.type as ArtifactType;
  if (!(ARTIFACT_TYPES as readonly string[]).includes(type))
    errors.push(`type must be one of: ${ARTIFACT_TYPES.join(", ")}`);

  const tagline = typeof b.tagline === "string" ? b.tagline.trim() : "";
  if (tagline.length < 1) errors.push("tagline is required");
  if (tagline.length > 140) errors.push("tagline must be at most 140 characters");

  const install_cmd = typeof b.install_cmd === "string" ? b.install_cmd.trim() : "";
  if (install_cmd.length < 1) errors.push("install_cmd is required");

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    errors: [],
    value: {
      name,
      type,
      tagline,
      description: typeof b.description === "string" ? b.description : "",
      author: typeof b.author === "string" && b.author.trim() ? b.author : "anonymous",
      version: typeof b.version === "string" && b.version.trim() ? b.version : "1.0.0",
      homepage: typeof b.homepage === "string" ? b.homepage : undefined,
      install_cmd,
      content: typeof b.content === "string" ? b.content : "",
      tags: typeof b.tags === "string" ? b.tags : "",
    },
  };
}
