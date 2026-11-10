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
    await new Promise((resolve) => setTimeout(resolve, 700));

    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 110));
      }
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 400));
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

      const visible = (selector) => {
        const el = document.querySelector(selector);
        return Boolean(el && el.getClientRects().length > 0);
      };

      const broken = [...document.images]
        .filter((img) => img.getClientRects().length > 0)
        .filter((img) => !(img.complete && img.naturalWidth > 0))
        .map((img) => img.getAttribute("src"));

      const parse = (value) => {
        const nums = value.match(/[\d.]+/g)?.map(Number) || [0, 0, 0];
        return nums.slice(0, 3);
      };
      const lum = (rgb) => {
        const channel = (v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
      };
      const bgOf = (el) => {
        let node = el;
        while (node && node !== document.documentElement) {
          const bg = getComputedStyle(node).backgroundColor;
          if (bg && !bg.startsWith("rgba(0, 0, 0, 0)")) return parse(bg);
          node = node.parentElement;
        }
        return parse(getComputedStyle(document.body).backgroundColor);
      };
      const contrast = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const fg = parse(getComputedStyle(el).color);
        const bg = bgOf(el);
        const l1 = lum(fg);
        const l2 = lum(bg);
        return Number(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2));
      };

      const hero = document.querySelector("h1");
      const h1Style = hero ? getComputedStyle(hero) : null;
      const rows = [...document.querySelectorAll(".work-row")];
      const first = rows[0]?.getBoundingClientRect();
      const firstMedia = rows[0]?.querySelector(".work-media")?.getBoundingClientRect();
      const firstCopy = rows[0]?.querySelector(".work-copy")?.getBoundingClientRect();
      const secondMedia = rows[1]?.querySelector(".work-media")?.getBoundingClientRect();
      const secondCopy = rows[1]?.querySelector(".work-copy")?.getBoundingClientRect();

      return {
        overflowX:
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
        docHeight: document.documentElement.scrollHeight,
        box: {
          masthead: box(".masthead"),
          hero: box(".hero"),
          h1: box(".hero h1"),
          portrait: box(".hero-portrait"),
          ticker: box(".ticker"),
          projects: box("#projects"),
          firstRow: box(".work-row"),
          certificates: box("#certificates"),
          credList: box(".cred-list"),
          contact: box("#contact"),
          form: box(".contact-form"),
          footer: box(".site-footer"),
        },
        h1Font: h1Style?.fontFamily,
        h1Size: h1Style?.fontSize,
        h1Weight: h1Style?.fontWeight,
        bodyFont: getComputedStyle(document.body).fontFamily,
        bodySize: getComputedStyle(document.body).fontSize,
        bodyBg: getComputedStyle(document.body).backgroundColor,
        gridSize: getComputedStyle(document.documentElement).getPropertyValue("--grid").trim(),
        brokenImages: broken,
        mastheadVisible: visible(".masthead"),
        indexToggleVisible: visible("#indexToggle"),
        workRows: rows.length,
        credRows: document.querySelectorAll(".cred-row").length,
        indexLinks: document.querySelectorAll(".index-nav a").length,
        rowLayout: {
          first: first ? { w: Math.round(first.width), h: Math.round(first.height) } : null,
          firstMediaW: firstMedia ? Math.round(firstMedia.width) : null,
          firstCopyW: firstCopy ? Math.round(firstCopy.width) : null,
          secondMediaW: secondMedia ? Math.round(secondMedia.width) : null,
          secondCopyW: secondCopy ? Math.round(secondCopy.width) : null,
          mediaLeftFirst: firstMedia && firstCopy ? firstMedia.left < firstCopy.left : null,
          mediaRightSecond: secondMedia && secondCopy ? secondMedia.left > secondCopy.left : null,
        },
        revealPending: document.querySelectorAll("[data-reveal]:not(.is-visible)").length,
        sheetCurrent: document.querySelector("[data-sheet-current]")?.textContent,
        sheetLabel: document.querySelector("[data-sheet-label]")?.textContent,
        clock: document.getElementById("localClock")?.textContent,
        progressVar: getComputedStyle(document.documentElement).getPropertyValue("--progress").trim(),
        fontsLoaded: document.fonts.status,
        contrast: {
          heroLede: contrast(".hero-lede"),
          workDesc: contrast(".work-desc"),
          sheetLede: contrast(".sheet-lede"),
          credSub: contrast(".cred-sub"),
          formNote: contrast(".form-note"),
          footerMeta: contrast(".footer-meta"),
        },
        cursorPresent: Boolean(document.querySelector(".cursor")),
      };
    });
  }

  /* Index overlay */
  const overlayAudit = async (width, height) => {
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(base, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 700));

    await page.click("#indexToggle");
    await new Promise((resolve) => setTimeout(resolve, 850));

    const opened = await page.evaluate(() => {
      const overlay = document.getElementById("indexOverlay");
      const r = overlay.getBoundingClientRect();
      return {
        hidden: overlay.hidden,
        open: overlay.classList.contains("is-open"),
        expanded: document.getElementById("indexToggle").getAttribute("aria-expanded"),
        bodyLocked: document.body.classList.contains("menu-open"),
        focused: document.activeElement?.id,
        rect: { w: Math.round(r.width), h: Math.round(r.height) },
        linksVisible: [...document.querySelectorAll(".index-nav a")].every(
          (a) => a.getClientRects().length > 0
        ),
        firstLinkOpacity: getComputedStyle(document.querySelector(".index-nav a")).opacity,
      };
    });

    await page.keyboard.press("Escape");
    await new Promise((resolve) => setTimeout(resolve, 850));

    const closed = await page.evaluate(() => ({
      hidden: document.getElementById("indexOverlay").hidden,
      open: document.getElementById("indexOverlay").classList.contains("is-open"),
      expanded: document.getElementById("indexToggle").getAttribute("aria-expanded"),
      bodyLocked: document.body.classList.contains("menu-open"),
      focused: document.activeElement?.id,
    }));

    return { opened, closed };
  };

  report.overlayDesktop = await overlayAudit(1440, 900);
  report.overlayMobile = await overlayAudit(390, 844);

  /* Modals */
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, 800));

  const modalAudit = async (selector) => {
    await page.evaluate((sel) => {
      document.querySelector(sel)?.click();
    }, selector);
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
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
  };

  report.modalLms = await modalAudit('.project-card[data-title*="Library"] .view-project-btn');
  await page.keyboard.press("Escape");
  await new Promise((resolve) => setTimeout(resolve, 400));
  report.modalTravelConnect = await modalAudit('.project-card[data-title="TravelConnect"] .view-project-btn');
  await page.keyboard.press("Escape");
  await new Promise((resolve) => setTimeout(resolve, 400));
  report.modalCanson = await modalAudit('.project-card[data-title*="Canson"] .view-project-btn');
  await page.keyboard.press("Escape");

  /* Contact form states */
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
