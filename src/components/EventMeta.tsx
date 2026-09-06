import { cn } from "@/utils/cn";
import { categoryTone } from "@/utils/categoryTone";
import type { EventItem } from "@/data/content";

interface EventMetaProps {
  event: EventItem;
}

export function EventMeta({ event }: EventMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className={cn(
          "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
          categoryTone(event.category)
        )}
      >
        {event.category}
      </span>
      <span className="font-display text-sm font-medium text-oll-charcoal/85">
        {event.date}
      </span>
    </div>
  );
}
