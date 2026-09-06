import { useScrollProgress } from "@/hooks/useScrollProgress";

export function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div
      data-testid="scroll-progress"
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left"
      style={{
        transform: `scaleX(${progress})`,
        background: "linear-gradient(90deg, #3458a8, #7a9bdb, #3458a8)",
      }}
    />
  );
}
