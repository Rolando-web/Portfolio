export function initReveal() {
  const targets = [...document.querySelectorAll("[data-reveal]")];
  const rules = [...document.querySelectorAll(".rule")];

  if (!targets.length && !rules.length) return;

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    targets.forEach((target) => target.classList.add("is-revealed"));
    rules.forEach((rule) => rule.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        if (element.classList.contains("rule")) {
          element.classList.add("is-visible");
        } else {
          element.classList.add("is-revealed");
        }
        observer.unobserve(element);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  [...targets, ...rules].forEach((element) => observer.observe(element));
}

export function initCursorGlow() {
  const glow = document.querySelector(".cursor-glow");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!glow || !finePointer.matches || reducedMotion.matches) return;

  let frame = null;
  let x = 0;
  let y = 0;

  window.addEventListener(
    "pointermove",
    (event) => {
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        frame = null;
      });
    },
    { passive: true }
  );
}
