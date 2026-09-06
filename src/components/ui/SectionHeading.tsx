import { cn } from "@/utils/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-10", align === "center" && "text-center")}>
      {eyebrow && (
        <span
          className={cn(
            "mb-3 block text-xs font-bold uppercase tracking-[0.25em]",
            light ? "text-oll-gold-300" : "text-oll-blue-500"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "gold-rule rule-draw font-display text-3xl font-semibold sm:text-4xl",
          light ? "text-oll-cream" : "text-oll-blue-900",
          align === "center" && "mx-auto",
          align === "left" && "gold-rule-left"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed",
            light ? "text-oll-cream/80" : "text-oll-charcoal",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
