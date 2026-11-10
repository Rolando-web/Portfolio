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
