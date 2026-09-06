import "@testing-library/jest-dom/vitest";

// jsdom 26 ships throwing stubs for scrollTo/scrollIntoView/matchMedia and a
// no-op IntersectionObserver — unconditionally replace with test-safe mocks.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  constructor(private readonly callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    // Immediately report intersecting so Reveal.tsx becomes visible in tests.
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Unconditional — jsdom's built-in throws "Not implemented".
window.scrollTo = (() => {}) as unknown as typeof window.scrollTo;
Element.prototype.scrollIntoView = (() => {}) as unknown as typeof Element.prototype.scrollIntoView;

window.matchMedia = ((query: string) => ({
  matches: query.includes("prefers-reduced-motion") ? false : false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia;
