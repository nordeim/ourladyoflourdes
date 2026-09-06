import { cn } from "@/utils/cn";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-7xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}
