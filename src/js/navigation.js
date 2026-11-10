const drawer = document.getElementById("mobileDrawer");
const toggle = document.getElementById("navToggle");
const closeBtn = document.getElementById("drawerClose");
const backdrop = document.getElementById("navBackdrop");
const progress = document.getElementById("scrollProgress");
const navLinks = [...document.querySelectorAll(".rail-nav a[href^='#']")];
const drawerLinks = [...document.querySelectorAll(".drawer-nav a[href^='#']")];
const sections = [...document.querySelectorAll("main section[id]")];

let lastFocused = null;

function setDrawer(open) {
  if (!drawer || !toggle || !backdrop) return;

  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  drawer.classList.toggle("open", open);
  drawer.hidden = !open;
  backdrop.hidden = !open;
  document.body.classList.toggle("menu-open", open);

  if (open) {
    lastFocused = document.activeElement;
    drawer.querySelector("a")?.focus({ preventScroll: true });
  } else if (lastFocused) {
    lastFocused.focus({ preventScroll: true });
    lastFocused = null;
  }
}

toggle?.addEventListener("click", () => {
  setDrawer(toggle.getAttribute("aria-expanded") !== "true");
});

closeBtn?.addEventListener("click", () => setDrawer(false));
backdrop?.addEventListener("click", () => setDrawer(false));

[...drawerLinks, ...navLinks].forEach((link) => {
  link.addEventListener("click", () => {
    if (drawer?.classList.contains("open")) setDrawer(false);
  });
});

document.addEventListener("keydown", (event) => {
  if (!drawer?.classList.contains("open")) return;

  if (event.key === "Escape") {
    event.preventDefault();
    setDrawer(false);
    return;
  }

  if (event.key !== "Tab") return;

  const items = [closeBtn, ...drawerLinks].filter(Boolean);
  if (!items.length) return;

  const first = items[0];
  const last = items[items.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900 && drawer?.classList.contains("open")) {
    setDrawer(false);
  }
});

/* Scroll progress — single CSS variable drives both rail and top bar */
function updateProgress() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
  doc.style.setProperty("--progress", ratio.toFixed(4));
}

/* Active section marker */
const allLinks = [...navLinks, ...drawerLinks];
const linkMap = new Map();

allLinks.forEach((link) => {
  const id = link.getAttribute("href")?.slice(1);
  if (!id) return;
  if (!linkMap.has(id)) linkMap.set(id, []);
  linkMap.get(id).push(link);
});

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        allLinks.forEach((link) => link.removeAttribute("aria-current"));
        linkMap.get(entry.target.id)?.forEach((link) => {
          link.setAttribute("aria-current", "true");
        });
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateProgress();
      ticking = false;
    });
  },
  { passive: true }
);

updateProgress();

// The progress element is decorative; keep it referenced so markup changes fail loudly.
if (!progress) {
  console.warn("Scroll progress element is missing.");
}
