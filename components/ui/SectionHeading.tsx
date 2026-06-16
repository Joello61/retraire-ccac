// src/components/ui/SectionHeading.tsx
// Composant reutilisable pour les titres de section avec divider dore

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "text-center" : "text-left"}>
      <h2
        className={[
          "section-heading",
          light ? "text-white" : "text-brand-navy",
        ].join(" ")}
      >
        {title}
      </h2>

      <div
        className={[
          "section-divider mt-3",
          centered ? "mx-auto" : "",
        ].join(" ")}
      />

      {subtitle && (
        <p
          className={[
            "mt-5 text-base leading-relaxed max-w-2xl",
            centered ? "mx-auto" : "",
            light ? "text-white/70" : "text-brand-gray",
          ].join(" ")}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}