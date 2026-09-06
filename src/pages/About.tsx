import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/PageHero";
import { SafeImage } from "@/components/SafeImage";
import { Emblem } from "@/components/Emblem";
import { site } from "@/data/site";

const pillars = [
  {
    num: "01",
    title: "Prayer",
    desc: "A community gathered daily around the Eucharist and the Rosary, with the Adoration Room open from dawn to evening.",
  },
  {
    num: "02",
    title: "Formation",
    desc: "Handing on the faith to every age — catechism for the young, RCIA for adults on the journey into the Church.",
  },
  {
    num: "03",
    title: "Service",
    desc: "Reaching out to workers far from home, families in need, and the sick and homebound — as the Indian Church has always done.",
  },
];

const heritage = [
  {
    title: "Singapore's First Tamil Parish",
    desc: "Established for the Indian Catholics of Singapore in 1884 and built by 1888, OLL remains the archdiocese's oldest Tamil Catholic community.",
  },
  {
    title: "A National Monument",
    desc: "The gothic church — cornices and pilasters, tracery parapets, louvered French windows — is recognised as a National Monument of Singapore.",
  },
  {
    title: "Modelled on Lourdes",
    desc: "The building takes its mould from the Basilica at Lourdes in France, with a replica of the grotto keeping the Virgin Mary at the heart of the sanctuary.",
  },
  {
    title: "Cast Iron & Natural Light",
    desc: "Slender cast-iron columns lift the nave to a clerestory of fifteen Rosary windows, flooding the church with daylight.",
  },
];

export function About() {
  return (
    <>
      <PageHero
        title="The Parish"
        subtitle="Our story, our monument, and our family of two tongues — at 50 Ophir Road since 1888."
        image="/images/hero-church.jpg"
      />

      {/* Vision */}
      <section className="bg-oll-cream py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <SectionHeading
                eyebrow="Our Parish"
                title="Two tongues, one faith, one family."
                description="The Church of Our Lady of Lourdes is Singapore's oldest Tamil Catholic parish — a gothic national monument in the heart of Rochor where the English and Tamil communities worship, serve, and grow together as one household of faith."
              />
              <div className="mt-8 grid gap-6">
                {pillars.map((p) => (
                  <div key={p.num} className="flex gap-4">
                    <span className="font-display text-4xl font-light text-oll-blue-200">
                      {p.num}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-oll-blue-900">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-oll-charcoal">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="relative overflow-hidden rounded-2xl">
                <SafeImage
                  src="/images/main-church.jpg"
                  alt="The white gothic facade of the Church of Our Lady of Lourdes at dusk, framed by palm fronds"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Heritage */}
      <section className="bg-oll-parchment py-16 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="A Monument of Grace"
            title="Why Ophir Road Keeps Praying"
            description="Four facts tell the story of this extraordinary survivor of Singapore's built heritage."
            align="center"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {heritage.map((h, i) => (
              <Reveal key={h.title} delay={i * 100}>
                <div className="card-tint flex h-full flex-col rounded-2xl border p-6">
                  <h3 className="font-display text-xl font-semibold text-oll-blue-900">
                    {h.title}
                  </h3>
                  <p className="mt-3 flex-1 leading-relaxed text-oll-charcoal">
                    {h.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Patroness */}
      <section className="bg-oll-cream py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal className="lg:order-2">
              <SectionHeading
                eyebrow="Our Patroness"
                title="Our Lady of Lourdes"
                description={`In 1858, a young girl named Bernadette Soubirous reported eighteen apparitions of the Virgin Mary in a grotto at Lourdes, France — the last on the feast we now keep on ${site.feast.date}. Thirty years later, the Catholics of Singapore raised this church in her honour, and a replica of that grotto has stood at the heart of our sanctuary ever since.`}
              />
              <p className="mt-4 leading-relaxed text-oll-charcoal">
                Pilgrims and parishioners alike find in the grotto a place of
                quiet confidence — the same message Our Lady gave Bernadette:
                prayer, penance, and trust in God&rsquo;s mercy. Each{" "}
                {site.feast.date}, the parish keeps her feast with trilingual
                celebrations announced in the bulletin.
              </p>
            </Reveal>
            <Reveal delay={150} className="lg:order-1">
              <div className="relative overflow-hidden rounded-2xl">
                <SafeImage
                  src="/images/grotto.jpg"
                  alt="The parish grotto with the statue of Our Lady of Lourdes and pews for prayer"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Emblem band */}
      <section className="bg-oll-blue-950 py-16">
        <Container>
          <div className="flex flex-col items-center text-center">
            <Emblem className="h-20 w-20 text-oll-gold-400" />
            <p className="mt-6 max-w-xl font-display text-xl italic text-oll-cream/80">
              &ldquo;I am the Immaculate Conception.&rdquo;
            </p>
            <p className="mt-3 text-sm text-oll-cream/50">
              — Our Lady of Lourdes to St Bernadette, 25 March 1858
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
