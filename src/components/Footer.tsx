import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { footerNav } from "@/data/nav";
import { site } from "@/data/site";

export function Footer() {
  const explore = footerNav.filter((_, i) => i < 5);
  const involved = footerNav.filter((_, i) => i >= 5 && i < 10);

  return (
    <footer className="bg-oll-blue-950 text-oll-cream/70">
      <div className="divider-weave-thin" />
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Explore */}
          <nav aria-label="Explore">
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-oll-cream">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {explore.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="link-underline text-sm transition-colors hover:text-oll-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Get Involved */}
          <nav aria-label="Get involved">
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-oll-cream">
              Get Involved
            </h3>
            <ul className="space-y-2.5">
              {involved.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="link-underline text-sm transition-colors hover:text-oll-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Parish */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-oll-cream">
              Parish
            </h3>
            <address className="not-italic text-sm leading-relaxed">
              <p className="text-oll-cream">{site.name}</p>
              <p>{site.address.street}</p>
              <p>
                {site.address.city} {site.address.zip}
              </p>
              <p className="mt-3">
                <a
                  href={`tel:${site.contact.officePhone}`}
                  className="transition-colors hover:text-oll-cream"
                >
                  {site.contact.officePhone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="transition-colors hover:text-oll-cream"
                >
                  {site.contact.email}
                </a>
              </p>
            </address>
          </div>

          {/* Visit */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-oll-cream">
              Visit
            </h3>
            <p className="text-sm leading-relaxed">
              <span className="text-oll-cream">Church:</span> {site.hours.church}
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              <span className="text-oll-cream">Office:</span> {site.hours.office}
            </p>
            <p className="mt-3 text-sm">
              <span className="text-oll-cream">Nearest MRT:</span>{" "}
              {site.transport.mrt}
            </p>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <a
                href={site.archdiocese}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline transition-colors hover:text-oll-cream"
              >
                Archdiocese
              </a>
              <a
                href={site.dailyReadings}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline transition-colors hover:text-oll-cream"
              >
                Daily Readings
              </a>
              <a
                href={site.myCatholic}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline transition-colors hover:text-oll-cream"
              >
                myCatholic.sg
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-oll-cream/10">
        <Container>
          <div className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
            <p className="text-center text-xs text-oll-cream/40 sm:text-left">
              {site.name} · {site.address.street} · Singapore&rsquo;s oldest Tamil
              Catholic parish, built 1888
            </p>
            <p className="text-xs text-oll-cream/40">
              &copy; {new Date().getFullYear()} {site.shortName}
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
