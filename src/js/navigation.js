const drawer = document.getElementById("mobileDrawer");
const toggle = document.getElementById("navToggle");
const backdrop = document.getElementById("navBackdrop");
const progress = document.getElementById("scrollProgress");
const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
const drawerLinks = [...document.querySelectorAll(".mobile-drawer a[href^='#']")];
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

backdrop?.addEventListener("click", () => setDrawer(false));

[...drawerLinks, ...navLinks].forEach((link) => {
  link.addEventListener("click", () => {
    if (drawer?.classList.contains("open")) setDrawer(false);
  });
});

document.addEventListener("keydown", (event) => {
  if (!drawer?.classList.contains("open")) return;

  if (event.key === "Escape") {
    setDrawer(false);
    return;
  }

  if (event.key !== "Tab") return;

  const items = [toggle, ...drawer.querySelectorAll("a[href]")].filter(Boolean);
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
  if (window.innerWidth > 860 && drawer?.classList.contains("open")) {
    setDrawer(false);
  }
});

/* Scroll progress */
function updateProgress() {
  if (!progress) return;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
  progress.style.width = `${ratio * 100}%`;
}

/* Active section marker */
const linkMap = new Map(
  [...navLinks, ...drawerLinks]
    .map((link) => [link.getAttribute("href")?.slice(1), link])
    .filter(([id]) => id)
);

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.removeAttribute("aria-current"));
        drawerLinks.forEach((link) => link.removeAttribute("aria-current"));
        linkMap.get(entry.target.id)?.setAttribute("aria-current", "true");
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
