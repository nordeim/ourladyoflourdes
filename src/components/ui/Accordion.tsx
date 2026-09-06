import { useId, useState, useRef, useCallback } from "react";
import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const ids = items.map((i) => i.id);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = (index + 1) % ids.length;
        buttonRefs.current.get(ids[next])?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (index - 1 + ids.length) % ids.length;
        buttonRefs.current.get(ids[prev])?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        buttonRefs.current.get(ids[0])?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        buttonRefs.current.get(ids[ids.length - 1])?.focus();
      }
    },
    [items]
  );

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-panel-${index}`;
        const triggerId = `${baseId}-trigger-${index}`;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border border-oll-stone bg-oll-cream"
          >
            <button
              id={triggerId}
              ref={(el) => {
                if (el) buttonRefs.current.set(item.id, el);
              }}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className={cn(
                "flex w-full items-center justify-between px-5 py-4 text-left transition-colors",
                "hover:bg-oll-parchment focus:outline-none focus:ring-2 focus:ring-inset focus:ring-oll-blue-400",
                isOpen && "bg-oll-parchment"
              )}
            >
              <span className="font-display text-lg font-medium text-oll-blue-900">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-oll-blue-500 transition-transform",
                  isOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={isOpen ? undefined : true}
              inert={!isOpen ? true : undefined}
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pt-1 text-oll-charcoal leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
