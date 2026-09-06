import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/PageHero";
import { Timeline } from "@/components/Timeline";
import { lifeTimeline } from "@/data/content";

export function History() {
  return (
    <>
      <PageHero
        title="Our History"
        subtitle="From the first Tamil shepherd in 1856 to a gothic national monument on Ophir Road — the story of Our Lady of Lourdes."
        image="/images/stained-glass.jpg"
      />

      <section className="bg-oll-cream py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
            <Reveal>
              <div
                data-testid="history-story"
                className="lg:sticky lg:top-28 lg:self-start"
              >
                <SectionHeading
                  eyebrow="Timeline"
                  title="1856 – Today"
                  description="Known simply as the Indian Church or Tamil Church for a century, Our Lady of Lourdes has served Singapore's Indian Catholics from before the founding of the modern city-state — and still gathers two tongues under one spire."
                />
              </div>
            </Reveal>
            <Timeline entries={lifeTimeline} />
          </div>
        </Container>
      </section>
    </>
  );
}
