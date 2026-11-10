const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ── Scroll reveal ─────────────────────────────────────────── */
export function initReveal() {
  const targets = [...document.querySelectorAll("[data-reveal]")];

  if (!targets.length) return;

  if (!("IntersectionObserver" in window) || reducedMotion.matches) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );

  targets.forEach((target) => observer.observe(target));
}

/* ── Image and number parallax inside work plates ──────────── */
export function initParallax() {
  const media = [...document.querySelectorAll(".work-media img")];
  const floaters = [...document.querySelectorAll("[data-parallax]")];
  if ((!media.length && !floaters.length) || reducedMotion.matches) return;

  let frame = 0;

  function rowProgress(element) {
    const row = element.closest(".work-row");
    if (!row) return null;
    const rect = row.getBoundingClientRect();
    const viewport = window.innerHeight;
    if (rect.bottom < -200 || rect.top > viewport + 200) return null;

    // -1 at the bottom of the viewport, +1 at the top.
    return (rect.top + rect.height / 2 - viewport / 2) / (viewport + rect.height);
  }

  function render() {
    frame = 0;

    media.forEach((img) => {
      const progress = rowProgress(img);
      if (progress === null) return;
      const shift = Math.max(-30, Math.min(30, progress * -60));
      img.style.setProperty("--py", `${shift.toFixed(1)}px`);
    });

    floaters.forEach((element) => {
      const progress = rowProgress(element);
      if (progress === null) return;
      const shift = Math.max(-22, Math.min(22, progress * -44));
      element.style.setProperty("--ny", `${shift.toFixed(1)}px`);
    });
  }

  function request() {
    if (frame) return;
    frame = requestAnimationFrame(render);
  }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request, { passive: true });
  render();
}

/* ── Magnetic buttons ──────────────────────────────────────── */
export function initMagnetic() {
  const targets = [...document.querySelectorAll("[data-magnetic]")];
  if (!targets.length) return;
  if (reducedMotion.matches) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const strength = 12;

  targets.forEach((target) => {
    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    function apply() {
      frame = 0;
      target.style.setProperty("--mx", `${nextX.toFixed(1)}px`);
      target.style.setProperty("--my", `${nextY.toFixed(1)}px`);
    }

    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      nextX = x * strength;
      nextY = y * strength;
      if (!frame) frame = requestAnimationFrame(apply);
    });

    target.addEventListener("pointerleave", () => {
      nextX = 0;
      nextY = 0;
      target.style.setProperty("--mx", "0px");
      target.style.setProperty("--my", "0px");
    });
  });
}
