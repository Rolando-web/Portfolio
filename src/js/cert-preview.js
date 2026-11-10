export function initCertPreview() {
  const image = document.getElementById("credPreviewImage");
  const rows = [...document.querySelectorAll(".cred-row[data-badge]")];
  if (!image || !rows.length) return;

  const fallback = image.getAttribute("src");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  rows.forEach((row) => {
    const swap = () => {
      const src = row.dataset.badge;
      if (!src || image.getAttribute("src") === src) return;
      image.classList.toggle("is-swapping", !reducedMotion.matches);
      image.setAttribute("src", src);
      if (!reducedMotion.matches) {
        window.setTimeout(() => image.classList.remove("is-swapping"), 220);
      }
    };

    row.addEventListener("pointerenter", swap);
    row.addEventListener("focus", swap);
  });

  rows[0]?.addEventListener("pointerleave", () => {
    // Keep the last preview; only restore when focus leaves the ledger entirely.
  });

  document.getElementById("credList")?.addEventListener("pointerleave", () => {
    if (fallback) image.setAttribute("src", fallback);
  });
}
