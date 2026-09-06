export type MassDayKey = "weekdays" | "saturday" | "sunday";

export function massDayKey(date: Date): MassDayKey {
  const day = date.getDay();
  if (day === 0) return "sunday";
  if (day === 6) return "saturday";
  return "weekdays";
}
