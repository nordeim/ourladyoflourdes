import { cn } from "@/utils/cn";
import { SafeImage } from "@/components/SafeImage";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
  fallback?: string;
  compact?: boolean;
  variant?: "dusk" | "light";
  children?: React.ReactNode;
}

export function PageHero({
  title,
  subtitle,
  image,
  fallback = "/images/hero-church.jpg",
  compact = false,
  variant = "dusk",
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-oll-blue-950",
        compact ? "py-20 lg:py-28" : "py-28 lg:py-40"
      )}
    >
      {image && (
        <>
          <SafeImage
            src={image}
            alt=""
            fallback={fallback}
            className={cn(
              "hero-fade absolute inset-0 h-full w-full object-cover",
              variant === "light" ? "opacity-55" : "opacity-45"
            )}
            fetchPriority="high"
          />
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0",
              variant === "light" ? "scrim-hero" : "scrim-page"
            )}
          />
          <div
            aria-hidden="true"
            className="divider-weave-thin absolute inset-x-0 bottom-0 opacity-50"
          />
        </>
      )}
      <div className="bg-grain absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <h1 className="rise-in font-display text-4xl font-bold text-oll-cream sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="rise-in rise-in-d1 mt-4 text-lg text-oll-cream/85 sm:text-xl">
              {subtitle}
            </p>
          )}
          {children && <div className="rise-in rise-in-d2 mt-6">{children}</div>}
        </div>
      </div>
    </section>
  );
}
