import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/PageHero";
import { sacraments } from "@/data/content";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/utils/cn";
import { ArrowRight } from "lucide-react";

export function Sacraments() {
  const activeId = useScrollSpy(sacraments.map((s) => s.id));

  return (
    <>
      <PageHero
        title="Sacraments"
        subtitle="From the font to the altar to the sickbed — grace for every season of life."
        image="/images/stained-glass.jpg"
        variant="light"
      />

      {/* Jump nav */}
      <div className="sticky top-[60px] z-40 border-b border-oll-stone bg-oll-cream/95 backdrop-blur-sm">
        <Container>
          <nav
            aria-label="Jump to sacrament"
            className="flex gap-2 overflow-x-auto py-3"
          >
            {sacraments.map((s) => (
              <Link
                key={s.id}
                to={`/sacraments#${s.id}`}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  activeId === s.id
                    ? "border-oll-blue-600 bg-oll-blue-700 text-oll-cream"
                    : "border-oll-stone bg-oll-cream text-oll-charcoal hover:bg-oll-parchment"
                )}
                aria-current={activeId === s.id ? "true" : undefined}
              >
                {s.title}
              </Link>
            ))}
          </nav>
        </Container>
      </div>

      {/* Sacrament sections */}
      <div className="bg-oll-cream">
        {sacraments.map((sacrament, i) => (
          <section
            key={sacrament.id}
            id={sacrament.id}
            className={cn(
              "scroll-mt-28 py-16 lg:py-24",
              i % 2 === 1 && "bg-oll-parchment"
            )}
          >
            <Container>
              <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:items-start">
                <Reveal>
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-oll-blue-500">
                    Sacrament
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-semibold text-oll-blue-900 sm:text-4xl">
                    {sacrament.title}
                  </h2>
                  <p className="mt-3 text-lg font-medium text-oll-charcoal">
                    {sacrament.summary}
                  </p>
                  <p className="mt-4 leading-relaxed text-oll-charcoal">
                    {sacrament.description}
                  </p>
                </Reveal>
                <Reveal delay={150}>
                  <div className="rounded-2xl border border-oll-stone bg-oll-cream p-6 lg:sticky lg:top-32">
                    <h3 className="font-display text-base font-semibold uppercase tracking-wider text-oll-blue-700">
                      At Our Parish
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {sacrament.details.map((d) => (
                        <li
                          key={d}
                          className="flex gap-2.5 text-sm leading-relaxed text-oll-charcoal"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-oll-gold-400"
                          />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/worship#visit"
                      className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-oll-gold-600 transition-colors hover:text-oll-gold-700"
                    >
                      Contact the Parish Office
                      <ArrowRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </Reveal>
              </div>
            </Container>
          </section>
        ))}
      </div>
    </>
  );
}
