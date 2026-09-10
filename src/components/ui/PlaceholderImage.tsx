/**
 * Bloc visuel temporaire tant que les vraies photos ne sont pas fournies.
 * À remplacer par un <Image /> (next/image) une fois les visuels disponibles.
 */
export default function PlaceholderImage({
  label,
  className = "",
  tone = "peach",
}: {
  label: string;
  className?: string;
  tone?: "peach" | "border";
}) {
  const toneClasses =
    tone === "peach" ? "bg-peach text-walnut" : "bg-border text-walnut";

  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center rounded-2xl border border-border p-6 text-center text-sm font-medium ${toneClasses} ${className}`}
    >
      {label}
    </div>
  );
}
