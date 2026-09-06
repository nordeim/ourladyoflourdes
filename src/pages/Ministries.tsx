import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/PageHero";
import { SafeImage } from "@/components/SafeImage";
import { ministries } from "@/data/content";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/utils/cn";

export function Ministries() {
  const activeId = useScrollSpy(ministries.map((m) => m.id));

  return (
    <>
      <PageHero
        title="Ministries"
        subtitle="Serving the altar, the classroom, the grieving, and the city — twelve ministries, one family."
        image="/images/hero-church.jpg"
        variant="light"
      />

      {/* Jump nav */}
      <div className="sticky top-[60px] z-40 border-b border-oll-stone bg-oll-cream/95 backdrop-blur-sm">
        <Container>
          <nav
            aria-label="Jump to ministry"
            className="flex gap-2 overflow-x-auto py-3"
          >
            {ministries.map((m) => (
              <Link
                key={m.id}
                to={`/ministries#${m.id}`}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  activeId === m.id
                    ? "border-oll-blue-600 bg-oll-blue-700 text-oll-cream"
                    : "border-oll-stone bg-oll-cream text-oll-charcoal hover:bg-oll-parchment"
                )}
                aria-current={activeId === m.id ? "true" : undefined}
              >
                {m.title}
              </Link>
            ))}
          </nav>
        </Container>
      </div>

      {/* Ministry sections */}
      <div className="bg-oll-cream">
        {ministries.map((ministry, i) => (
          <section
            key={ministry.id}
            id={ministry.id}
            className={cn(
              "scroll-mt-28 py-16 lg:py-24",
              i % 2 === 1 && "bg-oll-parchment"
            )}
          >
            <Container>
              <div
                className={cn(
                  "grid gap-10 lg:grid-cols-2 lg:items-center",
                  i % 2 === 1 && "lg:flex-row-reverse"
                )}
              >
                <Reveal className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="overflow-hidden rounded-2xl">
                    <SafeImage
                      src={ministry.image}
                      alt={ministry.imageAlt}
                      fallback={ministry.imageFallback}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                </Reveal>
                <Reveal
                  delay={150}
                  className={i % 2 === 1 ? "lg:order-1" : ""}
                >
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-oll-blue-500">
                    Ministry
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-semibold text-oll-blue-900 sm:text-4xl">
                    {ministry.title}
                  </h2>
                  <p className="mt-3 text-lg font-medium text-oll-charcoal">
                    {ministry.summary}
                  </p>
                  <p className="mt-4 leading-relaxed text-oll-charcoal">
                    {ministry.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {ministry.details.map((d) => (
                      <li
                        key={d}
                        className="flex gap-2.5 rounded-xl border border-oll-stone bg-oll-cream p-4 text-sm leading-relaxed text-oll-charcoal"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-oll-gold-400"
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </Container>
          </section>
        ))}
      </div>
    </>
  );
}
