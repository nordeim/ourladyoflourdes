import { useState } from "react";
import { cn } from "@/utils/cn";

interface SafeImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
}

export function SafeImage({
  src,
  alt,
  fallback = "/images/hero-church.jpg",
  className,
  loading = "lazy",
  fetchPriority,
}: SafeImageProps) {
  const [current, setCurrent] = useState(src);
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={current}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      className={cn(
        "transition-opacity duration-500",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
      onLoad={() => setLoaded(true)}
      onError={(e) => {
        const img = e.currentTarget;
        if (!img.dataset.fallback) {
          img.dataset.fallback = "1";
          setCurrent(fallback);
        }
      }}
    />
  );
}
