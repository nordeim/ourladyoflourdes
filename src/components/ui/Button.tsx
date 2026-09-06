import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";

interface ButtonBase {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline-light";
  icon?: LucideIcon;
  className?: string;
}

interface ButtonAsLink extends ButtonBase {
  to: string;
  href?: never;
  onClick?: never;
  type?: never;
}

interface ButtonAsAnchor extends ButtonBase {
  href: string;
  to?: never;
  onClick?: never;
  type?: never;
}

interface ButtonAsButton extends ButtonBase {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  to?: never;
  href?: never;
}

type ButtonProps = ButtonAsLink | ButtonAsAnchor | ButtonAsButton;

const variantClasses: Record<string, string> = {
  primary:
    "bg-oll-gold-500 text-oll-blue-950 hover:bg-oll-gold-600 hover:-translate-y-0.5 hover:shadow-oll focus:ring-oll-gold-400",
  secondary:
    "bg-oll-blue-700 text-oll-cream hover:bg-oll-blue-800 hover:-translate-y-0.5 hover:shadow-oll focus:ring-oll-blue-500",
  ghost:
    "bg-transparent text-oll-blue-700 hover:bg-oll-blue-50 focus:ring-oll-blue-300",
  "outline-light":
    "bg-transparent border border-oll-cream/40 text-oll-cream hover:bg-oll-cream/10 hover:border-oll-cream/70 focus:ring-oll-cream/30",
};

export function Button({
  children,
  variant = "primary",
  icon: Icon,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-oll-cream active:translate-y-0 active:scale-[0.98]",
    variantClasses[variant],
    className
  );

  const iconSpan = Icon ? (
    <span aria-hidden="true" className="inline-flex transition-transform group-hover:translate-x-0.5">
      <Icon className="h-4 w-4" />
    </span>
  ) : null;

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} className={cn(classes, "group")}>
        {children}
        {iconSpan}
      </Link>
    );
  }

  if ("href" in props && props.href) {
    return (
      <a href={props.href} className={cn(classes, "group")}>
        {children}
        {iconSpan}
      </a>
    );
  }

  return (
    <button
      type={(props as ButtonAsButton).type ?? "button"}
      onClick={(props as ButtonAsButton).onClick}
      className={cn(classes, "group")}
    >
      {children}
      {iconSpan}
    </button>
  );
}
