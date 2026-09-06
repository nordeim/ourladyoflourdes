import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Emblem } from "@/components/Emblem";

export function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-oll-blue-950 py-16">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <Emblem className="mx-auto h-24 w-24 text-oll-gold-400/40" />
          <h1 className="rise-in mt-8 font-display text-5xl font-bold text-oll-cream sm:text-6xl">
            404
          </h1>
          <p className="rise-in rise-in-d1 mt-4 text-xl text-oll-cream/75">
            This path does not lead to the church.
          </p>
          <p className="rise-in rise-in-d2 mt-2 text-oll-cream/50">
            The page you are looking for may have moved or no longer exists.
          </p>
          <div className="rise-in rise-in-d3 mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/" variant="primary">
              Return Home
            </Button>
            <Button to="/worship" variant="outline-light">
              Mass Times
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
