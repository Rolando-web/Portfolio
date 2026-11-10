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

const report = {};

try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.goto(base, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Scroll the page so lazy images load.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    report[width] = await page.evaluate(() => {
      const box = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: Math.round(r.x),
          y: Math.round(r.y + window.scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      };

      const broken = [...document.images]
        .filter((img) => !(img.complete && img.naturalWidth > 0))
        .map((img) => img.getAttribute("src"));

      const hero = document.querySelector("h1");
      const style = hero ? getComputedStyle(hero) : null;

      return {
        overflowX: document.documentElement.scrollWidth - window.innerWidth,
        docHeight: document.documentElement.scrollHeight,
        box: {
          header: box(".site-header"),
          hero: box(".hero"),
          h1: box(".hero h1"),
          profile: box(".profile-frame"),
          projects: box("#projects"),
          firstCard: box(".project-card"),
          certGrid: box(".cert-grid"),
          contactForm: box(".contact-form"),
          footer: box(".site-footer"),
        },
        h1Font: style?.fontFamily,
        h1Size: style?.fontSize,
        bodyFont: getComputedStyle(document.body).fontFamily,
        bodyBg: getComputedStyle(document.body).backgroundColor,
        brokenImages: broken,
        navVisible: getComputedStyle(document.querySelector(".nav-links")).display,
        toggleVisible: getComputedStyle(document.querySelector(".nav-toggle")).display,
        swiperSlides: document.querySelectorAll(".swiper-slide").length,
        projectCards: document.querySelectorAll(".project-card").length,
        fontsLoaded: document.fonts.status,
      };
    });
  }

  // Desktop interaction: LMS modal, then Canson empty gallery.
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, 800));

  const modalAudit = async (index) => {
    await page.evaluate((i) => {
      document.querySelectorAll(".view-project-btn")[i]?.click();
    }, index);
    await new Promise((resolve) => setTimeout(resolve, 700));
    return page.evaluate(() => {
      const modal = document.getElementById("projectModal");
      const gallery = document.getElementById("modalGallery");
      const visit = document.getElementById("visitSiteBtn");
      return {
        hidden: modal.hidden,
        role: modal.getAttribute("role"),
        ariaModal: modal.getAttribute("aria-modal"),
        labelledBy: modal.getAttribute("aria-labelledby"),
        title: document.getElementById("modalTitle").textContent,
        descriptionLength: document.getElementById("modalDescription").textContent.length,
        slides: document.querySelectorAll(".carousel-slide").length,
        empty: Boolean(document.querySelector(".carousel-empty")),
        prevHidden: document.getElementById("prevBtn").hidden,
        nextHidden: document.getElementById("nextBtn").hidden,
        indicatorsHidden: document.getElementById("carouselIndicators").hidden,
        visitLabel: visit.querySelector("[data-label]")?.textContent,
        visitHref: visit.getAttribute("href"),
        galleryHeight: Math.round(gallery.getBoundingClientRect().height),
        panelHeight: Math.round(document.querySelector(".modal-panel").getBoundingClientRect().height),
        bodyLocked: document.body.classList.contains("menu-open"),
        focused: document.activeElement?.id,
      };
    });
  };

  report.modalLms = await modalAudit(0);
  await page.keyboard.press("Escape");
  await new Promise((resolve) => setTimeout(resolve, 400));
  report.modalCanson = await modalAudit(2);
  await page.keyboard.press("Escape");

  // Contact form: invalid submit, then valid-but-too-fast, then honeypot.
  report.form = await page.evaluate(async () => {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
    const result = {};

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 200));
    result.invalid = {
      status: status.textContent,
      state: status.dataset.state,
      ariaInvalid: document.getElementById("name").getAttribute("aria-invalid"),
    };

    form.elements.name.value = "Test User";
    form.elements.email.value = "test@example.com";
    form.elements.title.value = "Test project";
    form.elements.message.value = "This is a test message long enough to pass validation.";
    form.elements.company.value = "bot";
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 300));
    result.honeypot = {
      status: status.textContent,
      state: status.dataset.state,
      reset: form.elements.name.value === "",
    };

    return result;
  });

  report.errors = errors;
} finally {
  await browser.close();
}

console.log(JSON.stringify(report, null, 2));
