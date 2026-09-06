import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Emblem } from "@/components/Emblem";
import { SafeImage } from "@/components/SafeImage";
import { EventMeta } from "@/components/EventMeta";
import { site } from "@/data/site";
import { grounds, upcomingEvents } from "@/data/content";
import { ArrowRight, MapPin, Clock, Church } from "lucide-react";

export function Home() {
  const featuredEvents = upcomingEvents.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-oll-blue-950">
        <div className="hero-fade absolute inset-0">
          <SafeImage
            src="/images/hero-church.jpg"
            alt="The gothic spire of the Church of Our Lady of Lourdes, Singapore, bearing the year 1888 above its rose window"
            className="hero-ken-burns h-full w-full object-cover opacity-55"
            fetchPriority="high"
          />
        </div>
        <div aria-hidden="true" className="scrim-hero absolute inset-0" />
        <div aria-hidden="true" className="bg-grain absolute inset-0" />
        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 lg:pb-24 lg:pt-40">
          <div className="max-w-3xl">
            <p className="rise-in text-xs font-bold uppercase tracking-[0.3em] text-oll-gold-300">
              {site.name} — since 1888
            </p>
            <h1 className="rise-in rise-in-d1 mt-4 font-display text-4xl font-bold text-oll-cream sm:text-5xl lg:text-7xl">
              The grotto in the city.
            </h1>
            <p className="rise-in rise-in-d2 mt-5 text-lg text-oll-cream/80 sm:text-xl">
              {site.tagline}
            </p>
            <div className="rise-in rise-in-d3 mt-8 flex flex-wrap gap-3">
              <Button to="/worship" variant="primary" icon={ArrowRight}>
                Mass Times
              </Button>
              <Button to="/history" variant="outline-light">
                Our History
              </Button>
            </div>
            <div aria-hidden="true" className="divider-weave-thin mt-10 opacity-50" />
            <div className="rise-in rise-in-d4 mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-oll-cream/70">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-oll-gold-400" />
                {site.address.street}, Rochor
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-oll-gold-400" />
                Sunday Masses 8:00 AM – 6:30 PM
              </span>
              <span className="flex items-center gap-2">
                <Church className="h-4 w-4 text-oll-gold-400" />
                English &amp; Tamil since 1888
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome */}
      <section className="bg-oll-cream py-16 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <figure className="welcome-quote relative z-10 -mt-24 rounded-2xl border border-oll-stone bg-oll-parchment p-8 shadow-oll-lg sm:p-10 lg:-mt-32 lg:p-12">
                <blockquote className="gold-rule-left rule-draw font-display text-2xl font-semibold leading-snug text-oll-blue-900 sm:text-3xl">
                  You are not a stranger here. You are home.
                </blockquote>
              </figure>
              <Emblem className="mx-auto mt-14 h-20 w-20 text-oll-gold-500" />
              <p className="mt-6 text-center text-xs font-bold uppercase tracking-[0.25em] text-oll-blue-500">
                Welcome
              </p>
              <h2 className="mt-4 text-center font-display text-3xl font-semibold text-oll-blue-900 sm:text-4xl">
                A House of Grace at Ophir Road
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-oll-charcoal">
                {site.vision}
              </p>
              <div className="mt-8 text-center">
                <Button to="/about" variant="secondary" icon={ArrowRight}>
                  Discover Our Parish
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Grounds preview */}
      <section className="bg-oll-parchment py-16 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Our Grounds"
            title="A Gothic Survivor in Rochor"
            description="From the spire that has watched over Ophir Road since 1888 to the grotto at the heart of our prayer — spaces that have welcomed generations."
            align="center"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {grounds.map((place, i) => (
              <Reveal key={place.id} delay={i * 100}>
                <Link
                  to={`/worship#visit`}
                  className="group card-lift block overflow-hidden rounded-2xl border border-oll-stone bg-oll-cream"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src={place.image}
                      alt={place.imageAlt}
                      fallback={place.imageFallback}
                      className="img-zoom h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-oll-blue-900">
                      {place.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-oll-charcoal">
                      {place.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-oll-gold-600">
                      Visit
                      <ArrowRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured events */}
      <section className="bg-oll-cream py-16 lg:py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Upcoming"
              title="News & Events"
              description="Join us for devotions, formation programmes, and parish celebrations."
            />
            <Button to="/news-events" variant="ghost" icon={ArrowRight}>
              View All
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredEvents.map((event, i) => (
              <Reveal key={event.title} delay={i * 100}>
                <div className="card-lift card-tint group flex h-full flex-col rounded-2xl border p-5">
                  <EventMeta event={event} />
                  <h3 className="mt-3 font-display text-lg font-semibold text-oll-blue-900">
                    {event.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-oll-charcoal">
                    {event.summary}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden bg-oll-blue-900 py-16 lg:py-24">
        <div aria-hidden="true" className="bloom-drift bg-gold-bloom absolute inset-0" />
        <div className="bg-grain absolute inset-0" />
        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <Emblem className="mx-auto h-16 w-16 text-oll-gold-400" />
              <h2 className="mt-6 font-display text-3xl font-semibold text-oll-cream sm:text-4xl">
                Come, pray with us.
              </h2>
              <p className="mt-4 text-lg text-oll-cream/75">
                Whether you speak English or Tamil, whether it has been years
                since your last visit or only hours — the doors on Ophir Road
                are open, and a seat is kept for you.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button to="/worship" variant="primary" icon={ArrowRight}>
                  Mass Times
                </Button>
                <Button to="/worship#visit" variant="outline-light">
                  Find Us
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
