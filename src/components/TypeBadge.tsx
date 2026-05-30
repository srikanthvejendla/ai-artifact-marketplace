import { TYPE_META, type ArtifactType } from "@/lib/types";

export default function TypeBadge({ type }: { type: ArtifactType }) {
  const meta = TYPE_META[type];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${meta.accent} px-2.5 py-0.5 text-xs font-medium text-white shadow-sm`}
    >
      <span aria-hidden>{meta.icon}</span>
      {meta.label}
    </span>
  );
}
