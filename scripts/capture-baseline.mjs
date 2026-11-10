import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chrome =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const base = process.env.PORTFOLIO_URL || "http://localhost:4173/";
const outDir = path.join(root, "docs", "baseline");

fs.mkdirSync(outDir, { recursive: true });

const viewport = { width: 1440, height: 900, deviceScaleFactor: 1 };

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

try {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(base, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, 1200));
  await page.screenshot({ path: path.join(outDir, "before-desktop.png") });

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.reload({ waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, 800));
  await page.screenshot({ path: path.join(outDir, "before-mobile.png") });

  console.log("Baseline screenshots saved to docs/baseline");
} finally {
  await browser.close();
}
