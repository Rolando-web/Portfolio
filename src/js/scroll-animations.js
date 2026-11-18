const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/**
 * Initialise AOS for section-level scroll reveals. The work plates and
 * credential ledger keep their custom observer choreography; everything with
 * `data-aos` is handled here.
 */
export function initScrollAnimations() {
  const targets = [...document.querySelectorAll("[data-aos]")];
  if (!targets.length) return;

  const revealAll = () => {
    targets.forEach((target) => target.classList.add("aos-animate"));
  };

  if (!window.AOS || reducedMotion.matches) {
    revealAll();
    return;
  }

  window.AOS.init({
    duration: 800,
    easing: "ease-out-cubic",
    offset: 80,
    once: true,
    disable: () => reducedMotion.matches,
  });

  reducedMotion.addEventListener?.("change", (event) => {
    if (!event.matches) return;
    revealAll();
  });
}
