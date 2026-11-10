import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "assets", "images", "projects", "travelconnect");
const chrome =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const email = process.env.TC_EMAIL;
const password = process.env.TC_PASS;

if (!email || !password) {
  console.error("Missing TC_EMAIL / TC_PASS environment variables.");
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto("https://travel-connect-xi.vercel.app/", {
    waitUntil: "networkidle2",
    timeout: 90000,
  });
  await new Promise((r) => setTimeout(r, 2000));

  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll("button")];
    const target = buttons.find(
      (b) => b.innerText.trim() === "Sign In" && b.offsetParent !== null
    );
    target?.click();
  });

  await page.waitForSelector('input[type="email"]', { visible: true, timeout: 20000 });
  await new Promise((r) => setTimeout(r, 600));

  const emailInput = await page.$('input[type="email"]');
  await emailInput.click({ clickCount: 3 });
  await emailInput.type(email, { delay: 10 });

  const passwordInput = await page.$('input[type="password"]');
  await passwordInput.click({ clickCount: 3 });
  await passwordInput.type(password, { delay: 10 });

  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll("button")].filter(
      (b) => b.offsetParent !== null && b.innerText.trim() === "Sign In"
    );
    buttons[buttons.length - 1]?.click();
  });

  await new Promise((r) => setTimeout(r, 6000));

  await page.goto("https://travel-connect-xi.vercel.app/admin", {
    waitUntil: "networkidle2",
    timeout: 90000,
  });
  await new Promise((r) => setTimeout(r, 5000));

  await page.screenshot({ path: path.join(outDir, "05-admin-dashboard.png") });
  console.log("saved 05-admin-dashboard.png at", page.url());

  await page.goto("https://travel-connect-xi.vercel.app/admin/bookings", {
    waitUntil: "networkidle2",
    timeout: 90000,
  });
  await new Promise((r) => setTimeout(r, 3500));
  await page.screenshot({ path: path.join(outDir, "06-admin-bookings.png") });
  console.log("saved 06-admin-bookings.png at", page.url());

  await page.goto("https://travel-connect-xi.vercel.app/admin/support", {
    waitUntil: "networkidle2",
    timeout: 90000,
  });
  await new Promise((r) => setTimeout(r, 3500));
  await page.screenshot({ path: path.join(outDir, "07-admin-support.png") });
  console.log("saved 07-admin-support.png at", page.url());
} finally {
  await browser.close();
}
