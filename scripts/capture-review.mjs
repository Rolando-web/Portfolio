import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "docs", "baseline", "review");
fs.mkdirSync(outDir, { recursive: true });

const chrome =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.env.PORTFOLIO_URL || "http://localhost:4173/";

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

const problems = [];

try {
  const page = await browser.newPage();
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  page.on("requestfailed", (request) =>
    problems.push(`requestfailed: ${request.url()} ${request.failure()?.errorText}`)
  );
  page.on("response", (response) => {
    if (response.status() >= 400) {
      problems.push(`http ${response.status()}: ${response.url()}`);
    }
  });

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, 1400));
  await page.screenshot({ path: path.join(outDir, "desktop-full.png"), fullPage: true });
  await page.screenshot({ path: path.join(outDir, "desktop-fold.png") });

  await page.evaluate(() => {
    document.querySelector(".view-project-btn")?.click();
  });
  await new Promise((resolve) => setTimeout(resolve, 1200));
  await page.screenshot({ path: path.join(outDir, "desktop-modal.png") });

  await page.keyboard.press("Escape");
  await new Promise((resolve) => setTimeout(resolve, 300));

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.reload({ waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, 1200));
  await page.screenshot({ path: path.join(outDir, "mobile-full.png"), fullPage: true });

  await page.evaluate(() => {
    document.getElementById("navToggle")?.click();
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
  await page.screenshot({ path: path.join(outDir, "mobile-drawer.png") });

  const audit = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector("h1")?.innerText,
    slides: document.querySelectorAll(".project-card").length,
    images: [...document.images].map((img) => ({
      src: img.getAttribute("src"),
      ok: img.complete && img.naturalWidth > 0,
    })),
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    swiperLoaded: Boolean(window.Swiper),
    emailjsLoaded: Boolean(window.emailjs),
  }));

  console.log(JSON.stringify(audit, null, 2));
  console.log(
    problems.length ? "PROBLEMS:\n" + problems.join("\n") : "No console/network problems."
  );
} finally {
  await browser.close();
}
