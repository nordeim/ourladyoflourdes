import type { EventItem } from "@/data/content";

export function categoryTone(category: EventItem["category"]): string {
  switch (category) {
    case "Parish":
      return "text-oll-blue-700 border-oll-blue-300 bg-oll-blue-50";
    case "Devotion":
      return "text-oll-gold-700 border-oll-gold-300 bg-oll-gold-100";
    case "Formation":
      return "text-oll-sage-600 border-oll-sage-300 bg-oll-sage-50";
    case "Archdiocese":
      return "text-oll-rose-600 border-oll-rose-300 bg-oll-rose-50";
    default:
      return "text-oll-charcoal border-oll-stone bg-oll-cream";
  }
}
