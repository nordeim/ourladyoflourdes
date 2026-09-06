export function Emblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      {/* Gothic arch — the grotto niche at the heart of OLL */}
      <path
        d="M60 22 L34 44 L34 98 L86 98 L86 44 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.55"
      />
      {/* Marian star */}
      <path
        d="M60 40 l2.6 5.7 6.2.6 -4.7 4.2 1.4 6.1 -5.5-3.2 -5.5 3.2 1.4-6.1 -4.7-4.2 6.2-.6 Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path d="M44 98 h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}
