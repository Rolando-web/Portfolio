import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chrome =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.env.PORTFOLIO_URL || "http://localhost:4173/";

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

const out = {};

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 700));

  out.rateLimit = await page.evaluate(async () => {
    const { createRateLimiter, formatWait } = await import("/src/js/rate-limit.js");
    const limiter = createRateLimiter({
      key: "audit:test",
      cooldownMs: 60_000,
      windowMs: 600_000,
      maxInWindow: 3,
    });
    limiter.reset();

    const first = limiter.status();
    limiter.record();
    const afterFirst = limiter.status();

    const now = Date.now();
    localStorage.setItem(
      "audit:test",
      JSON.stringify({ lastAt: now - 61_000, hits: [now - 300_000, now - 120_000, now - 61_000] })
    );
    const atMax = limiter.status();
    const wait = formatWait(atMax.retryAfterMs);

    limiter.reset();
    const cleared = limiter.status();

    return {
      first: first.allowed,
      afterFirst: {
        allowed: afterFirst.allowed,
        reason: afterFirst.reason,
        wait: formatWait(afterFirst.retryAfterMs),
      },
      atMax: { allowed: atMax.allowed, reason: atMax.reason, remaining: atMax.remainingInWindow },
      wait,
      cleared: cleared.allowed,
    };
  });

  out.accessibility = await page.evaluate(() => {
    const name = (el) =>
      el.getAttribute("aria-label") ||
      el.innerText?.trim() ||
      el.getAttribute("title") ||
      el.querySelector("img")?.alt;

    const badButtons = [...document.querySelectorAll("button")]
      .filter((b) => !name(b) && !b.getAttribute("aria-labelledby"))
      .map((b) => b.outerHTML.slice(0, 90));

    const badLinks = [...document.querySelectorAll("a[href]")]
      .filter((a) => !name(a) && !a.getAttribute("aria-labelledby"))
      .map((a) => a.outerHTML.slice(0, 90));

    const imagesWithoutAlt = [...document.images]
      .filter((img) => !img.hasAttribute("alt"))
      .map((img) => img.src);

    return { badButtons, badLinks, imagesWithoutAlt };
  });

  /* Reduced motion: ticker/hero stop, carousel does not auto-advance. */
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.reload({ waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 600));
  await page.evaluate(() => document.querySelectorAll(".view-project-btn")[0].click());
  await new Promise((r) => setTimeout(r, 500));
  out.reducedMotion = await page.evaluate(() => ({
    tickerAnimation: getComputedStyle(document.querySelector(".ticker-track")).animationName,
    heroAnimation: getComputedStyle(document.querySelector(".hero-line > span")).animationName,
    cursor: Boolean(document.querySelector(".cursor")),
    before: document.querySelector(".carousel-indicator.active")?.getAttribute("aria-label"),
  }));
  await new Promise((r) => setTimeout(r, 4600));
  out.reducedMotion.after = await page.evaluate(
    () => document.querySelector(".carousel-indicator.active")?.getAttribute("aria-label")
  );
  await page.keyboard.press("Escape");

  /* Normal motion: carousel advances. */
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.reload({ waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 500));
  await page.evaluate(() => document.querySelectorAll(".view-project-btn")[0].click());
  await new Promise((r) => setTimeout(r, 400));
  out.autoSlide = {
    before: await page.evaluate(
      () => document.querySelector(".carousel-indicator.active")?.getAttribute("aria-label")
    ),
  };
  await new Promise((r) => setTimeout(r, 4400));
  out.autoSlide.after = await page.evaluate(
    () => document.querySelector(".carousel-indicator.active")?.getAttribute("aria-label")
  );
  await page.keyboard.press("Escape");

  /* Index overlay behaviour on mobile. */
  await page.setViewport({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 500));

  await page.click("#indexToggle");
  await new Promise((r) => setTimeout(r, 850));
  out.overlay = await page.evaluate(() => ({
    expanded: document.getElementById("indexToggle").getAttribute("aria-expanded"),
    open: document.getElementById("indexOverlay").classList.contains("is-open"),
    hidden: document.getElementById("indexOverlay").hidden,
    bodyLocked: document.body.classList.contains("menu-open"),
    focused: document.activeElement?.id,
  }));

  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 850));
  out.overlayClosed = await page.evaluate(() => ({
    expanded: document.getElementById("indexToggle").getAttribute("aria-expanded"),
    hidden: document.getElementById("indexOverlay").hidden,
    bodyLocked: document.body.classList.contains("menu-open"),
    focus: document.activeElement?.id,
  }));

  /* Overlay link navigates and closes. */
  await page.click("#indexToggle");
  await new Promise((r) => setTimeout(r, 800));
  await page.click('.index-nav a[href="#certificates"]');
  await new Promise((r) => setTimeout(r, 900));
  out.overlayNavigation = await page.evaluate(() => ({
    hidden: document.getElementById("indexOverlay").hidden,
    expanded: document.getElementById("indexToggle").getAttribute("aria-expanded"),
    hash: window.location.hash,
    certTop: Math.round(document.getElementById("certificates").getBoundingClientRect().top),
  }));

  /* Modal keyboard open + focus trap. */
  await page.setViewport({ width: 1440, height: 900 });
  await page.reload({ waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 500));
  await page.evaluate(() => document.querySelector(".view-project-btn").focus());
  await page.keyboard.press("Enter");
  await new Promise((r) => setTimeout(r, 500));
  const tabbables = await page.evaluate(() => {
    const panel = document.querySelector(".modal-panel");
    return [...panel.querySelectorAll('a[href], button:not([disabled]), input, textarea')].filter(
      (el) => !el.hidden && el.offsetParent !== null
    ).length;
  });
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 300));
  out.keyboard = {
    tabbables,
    focusRestored: await page.evaluate(() => document.activeElement?.className),
  };
} finally {
  await browser.close();
}

console.log(JSON.stringify(out, null, 2));
