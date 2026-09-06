import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { PageHero } from "@/components/PageHero";
import { faqs } from "@/data/content";

export function FAQ() {
  return (
    <>
      <PageHero
        title="FAQ"
        subtitle="Common questions about Mass, sacraments, and visiting our parish."
        image="/images/hero-church.jpg"
        variant="light"
        compact
      />

      <section className="bg-oll-cream py-16 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Questions"
              title="Frequently Asked Questions"
              description="If you cannot find the answer you need, please contact the parish office at +65 6294 0624."
              align="center"
            />
            <div className="mt-10">
              <Accordion
                items={faqs.map((f, i) => ({
                  id: `faq-${i}`,
                  question: f.question,
                  answer: f.answer,
                }))}
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
