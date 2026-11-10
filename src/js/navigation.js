const toggle = document.getElementById("indexToggle");
const overlay = document.getElementById("indexOverlay");
const closeBtn = document.getElementById("indexClose");
const masthead = document.querySelector(".masthead");
const progress = document.getElementById("scrollProgress");
const sheetCurrent = document.querySelector("[data-sheet-current]");
const sheetLabel = document.querySelector("[data-sheet-label]");
const sections = [...document.querySelectorAll("main section[data-sheet]")];
const overlayLinks = [...document.querySelectorAll(".index-nav a[href^='#']")];
const clocks = [...document.querySelectorAll("#localClock, [data-clock]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const pageRegions = [
  document.querySelector(".masthead"),
  document.getElementById("main"),
  document.querySelector(".site-footer"),
].filter(Boolean);

let lastFocused = null;
let closeTimer = 0;
let openTimer = 0;

/* ── Live Davao clock ──────────────────────────────────────── */
const clockFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Manila",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function tickClock() {
  const time = clockFormat.format(new Date());
  clocks.forEach((node) => {
    if (node.textContent !== time) node.textContent = time;
  });
}

if (clocks.length) {
  tickClock();
  window.setInterval(tickClock, 15_000);
}

/* ── Index overlay ─────────────────────────────────────────── */
function isOpen() {
  return overlay?.classList.contains("is-open") ?? false;
}

function openIndex() {
  if (!overlay || !toggle || isOpen()) return;

  window.clearTimeout(closeTimer);
  window.clearTimeout(openTimer);
  lastFocused = document.activeElement;
  overlay.hidden = false;
  // Force a frame so the clip-path transition runs from the closed state.
  void overlay.offsetWidth;
  overlay.classList.add("is-open");
  toggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
  pageRegions.forEach((region) => region.setAttribute("inert", ""));

  openTimer = window.setTimeout(
    () => {
      closeBtn?.focus({ preventScroll: true });
    },
    reducedMotion.matches ? 0 : 260
  );
}

function closeIndex() {
  if (!overlay || !toggle || !isOpen()) return;

  overlay.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
  pageRegions.forEach((region) => region.removeAttribute("inert"));

  window.clearTimeout(closeTimer);
  window.clearTimeout(openTimer);
  closeTimer = window.setTimeout(
    () => {
      overlay.hidden = true;
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus({ preventScroll: true });
      }
      lastFocused = null;
    },
    reducedMotion.matches ? 0 : 700
  );
}

toggle?.addEventListener("click", () => {
  if (isOpen()) closeIndex();
  else openIndex();
});

closeBtn?.addEventListener("click", closeIndex);

overlayLinks.forEach((link) => {
  link.addEventListener("click", () => closeIndex());
});

document.addEventListener("keydown", (event) => {
  if (!isOpen()) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeIndex();
    return;
  }

  if (event.key !== "Tab" || !overlay) return;

  const items = [
    closeBtn,
    ...overlay.querySelectorAll(
      "a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex='-1'])"
    ),
  ].filter((el, index, all) => el && el.getClientRects().length && all.indexOf(el) === index);

  if (!items.length) return;

  const first = items[0];
  const last = items[items.length - 1];

  if (event.shiftKey && (document.activeElement === first || !overlay.contains(document.activeElement))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

/* ── Sheet indicator + active index row ───────────────────── */
if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = entry.target;
        const id = section.id;
        const number = section.dataset.sheet || "00";
        const label = section.dataset.label || "";

        if (sheetCurrent) sheetCurrent.textContent = number;
        if (sheetLabel) sheetLabel.textContent = label;

        overlayLinks.forEach((link) => {
          const current = link.getAttribute("href") === `#${id}`;
          if (current) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ── Edge alignment ───────────────────────────────────────── */
// Keep the fixed masthead and full-bleed copy aligned to the measured shell
// edge, including when a scrollbar changes the content width.
function syncEdge() {
  if (document.body.classList.contains("menu-open")) return;
  const shell = document.querySelector(".hero-shell");
  if (!shell) return;
  const left = shell.getBoundingClientRect().left;
  if (left > 0) {
    document.documentElement.style.setProperty("--edge", `${left.toFixed(2)}px`);
  }
}

window.addEventListener("resize", syncEdge, { passive: true });
window.addEventListener("orientationchange", syncEdge);
if (document.fonts?.ready) {
  document.fonts.ready.then(syncEdge).catch(() => {});
}
syncEdge();

/* ── Scroll progress + masthead state ──────────────────────── */
let ticking = false;

function updateScrollState() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;

  doc.style.setProperty("--progress", ratio.toFixed(4));
  masthead?.classList.toggle("is-scrolled", window.scrollY > 24);
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScrollState);
  },
  { passive: true }
);

window.addEventListener("resize", updateScrollState, { passive: true });
updateScrollState();

// The progress bar is decorative; warn if the markup loses its anchor.
if (!progress) {
  console.warn("Scroll progress element is missing.");
}
