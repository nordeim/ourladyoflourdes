import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/PageHero";
import { site } from "@/data/site";
import { devotions } from "@/data/content";
import { massDayKey } from "@/utils/massDay";
import { Clock, MapPin, Phone, Mail, Bus, Train, HeartHandshake, Church } from "lucide-react";

function MassCard({
  title,
  children,
  today,
}: {
  title: string;
  children: React.ReactNode;
  today?: boolean;
}) {
  return (
    <div
      data-testid="mass-card"
      data-today={today ? "true" : undefined}
      className={`relative overflow-hidden rounded-xl border bg-oll-cream p-5 ${
        today
          ? "border-oll-gold-400 shadow-oll"
          : "border-oll-stone"
      }`}
    >
      {today && (
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-oll-gold-400 to-oll-gold-600" />
      )}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-oll-blue-900">
          {title}
        </h3>
        {today && (
          <span className="rounded-full bg-oll-gold-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-oll-gold-700">
            Today
          </span>
        )}
      </div>
      <div className="mt-3 text-oll-charcoal">{children}</div>
    </div>
  );
}

export function Worship() {
  const todayKey = massDayKey(new Date());

  return (
    <>
      <PageHero
        title="Worship"
        subtitle="Mass, reconciliation, and adoration in English and Tamil at Ophir Road."
        image="/images/hero-church.jpg"
        variant="light"
      />

      {/* Mass Times */}
      <section id="mass" className="scroll-mt-28 bg-oll-cream py-16 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Mass Times"
            title="Join Us at the Altar"
            description="All are welcome to celebrate the Eucharist with us — in English and in Tamil."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MassCard
              title="Monday – Friday"
              today={todayKey === "weekdays"}
            >
              <ul className="space-y-1.5 text-sm">
                <li className="flex justify-between">
                  <span>Rosary (Mon, Wed, Thu &amp; Fri)</span>
                  <span className="font-medium">11:35 AM</span>
                </li>
                <li className="flex justify-between">
                  <span>Divine Mercy (Tue)</span>
                  <span className="font-medium">11:35 AM</span>
                </li>
                <li className="flex justify-between">
                  <span>English</span>
                  <span className="font-medium">{site.mass.weekdayEnglish}</span>
                </li>
                <li className="flex justify-between">
                  <span>Tamil</span>
                  <span className="font-medium">{site.mass.weekdayTamil}</span>
                </li>
              </ul>
            </MassCard>

            <MassCard title="Saturday" today={todayKey === "saturday"}>
              <ul className="space-y-1.5 text-sm">
                <li className="flex justify-between">
                  <span>Rosary</span>
                  <span className="font-medium">4:15 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>English</span>
                  <span className="font-medium">5:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>English</span>
                  <span className="font-medium">6:15 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>English</span>
                  <span className="font-medium">7:30 PM</span>
                </li>
              </ul>
            </MassCard>

            <MassCard title="Sunday" today={todayKey === "sunday"}>
              <ul className="space-y-1.5 text-sm">
                {site.mass.sunday.map((s) => (
                  <li key={s.time} className="flex justify-between">
                    <span>{s.time}</span>
                    <span className="font-medium">{s.language}</span>
                  </li>
                ))}
              </ul>
            </MassCard>

            <MassCard title="Public Holidays">
              <ul className="space-y-1.5 text-sm">
                {site.mass.publicHoliday.map((s) => (
                  <li key={s.time} className="flex justify-between">
                    <span>{s.time}</span>
                    <span className="font-medium">{s.language}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs italic text-oll-charcoal/70">
                {site.mass.note}
              </p>
            </MassCard>
          </div>
        </Container>
      </section>

      {/* Confession & Adoration */}
      <section
        id="confession"
        className="scroll-mt-28 bg-oll-parchment py-16 lg:py-24"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHeading
                eyebrow="Sacraments"
                title="Reconciliation & Adoration"
                description="Experience God's mercy in the sacrament of Reconciliation, offered before every Mass, and spend time with our Lord in the Adoration Room."
              />
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-oll-stone bg-oll-cream p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-lg font-semibold text-oll-blue-900">
                      Confession
                    </h3>
                    <span
                      aria-hidden="true"
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-oll-gold-300/60 bg-oll-gold-100 text-oll-gold-700"
                    >
                      <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-oll-charcoal">
                    {site.mass.confession}.
                  </p>
                </div>
                <div className="rounded-xl border border-oll-stone bg-oll-cream p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-lg font-semibold text-oll-blue-900">
                      Eucharistic Adoration
                    </h3>
                    <span
                      aria-hidden="true"
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-oll-gold-300/60 bg-oll-gold-100 text-oll-gold-700"
                    >
                      <Church className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-oll-charcoal">
                    The Adoration Room is open {site.mass.adoration}.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <SectionHeading
                eyebrow="Devotions"
                title="Regular Devotions"
              />
              <div className="mt-6 space-y-3">
                {devotions.map((d) => (
                  <div
                    key={d.title}
                    className="flex items-start justify-between rounded-xl border border-oll-stone bg-oll-cream p-4"
                  >
                    <div>
                      <h4 className="font-medium text-oll-blue-900">
                        {d.title}
                      </h4>
                      <p className="text-sm text-oll-charcoal">{d.where}</p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-oll-blue-600">
                      {d.when}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Find Us */}
      <section id="visit" className="scroll-mt-28 bg-oll-cream py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHeading
                eyebrow="Find Us"
                title="Visit Our Lady of Lourdes"
                description="We are located in the heart of Rochor, beside the Ophir-Rochor corridor — a gothic landmark amid the city."
              />
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-oll-blue-500" />
                  <div>
                    <p className="font-medium text-oll-blue-900">
                      {site.name}
                    </p>
                    <p className="text-oll-charcoal">{site.address.full}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-oll-blue-500" />
                  <div>
                    <p className="font-medium text-oll-blue-900">
                      Church Hours
                    </p>
                    <p className="text-oll-charcoal">{site.hours.church}</p>
                    <p className="text-sm text-oll-charcoal/70">
                      Office: {site.hours.office}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-oll-blue-500" />
                  <div>
                    <p className="font-medium text-oll-blue-900">Contact</p>
                    <p className="text-oll-charcoal">
                      {site.contact.officePhone}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-oll-blue-500" />
                  <div>
                    <p className="font-medium text-oll-blue-900">Email</p>
                    <p className="text-oll-charcoal">{site.contact.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Train className="mt-0.5 h-5 w-5 shrink-0 text-oll-blue-500" />
                  <div>
                    <p className="font-medium text-oll-blue-900">MRT</p>
                    <p className="text-oll-charcoal">{site.transport.mrt}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bus className="mt-0.5 h-5 w-5 shrink-0 text-oll-blue-500" />
                  <div>
                    <p className="font-medium text-oll-blue-900">Buses</p>
                    <p className="text-oll-charcoal">{site.transport.buses}</p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="overflow-hidden rounded-2xl border border-oll-stone shadow-oll">
                <iframe
                  title="Map to Church of Our Lady of Lourdes"
                  src={site.mapsEmbedSrc}
                  className="h-80 w-full border-0 sm:h-96"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
