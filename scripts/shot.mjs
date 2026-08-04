/**
 * Dev screenshot helper — drives the installed system Chrome via puppeteer-core.
 *
 * Usage:
 *   node scripts/shot.mjs <url> <out.png> [options]
 *
 * Options (repeatable, applied in order AFTER page load):
 *   --fill "selector::text to type"   fill an input/textarea
 *   --click "selector"                click an element (supports button:text('Label'))
 *   --wait 2500                       wait N ms
 *   --viewport 1280x900               set viewport before load (default 1280x900)
 *   --fullpage                        capture full page height
 *
 * Example:
 *   node scripts/shot.mjs http://localhost:3000/detect /tmp/out.png \
 *     --fill "textarea::My nephew video called me" --click "button:text('Investigate')" --wait 2500 --fullpage
 */
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const [, , url, out, ...args] = process.argv;
if (!url || out === undefined) {
  console.error("usage: node scripts/shot.mjs <url> <out.png> [options]");
  process.exit(1);
}

// First pass: viewport + flags.
let viewport = { width: 1280, height: 900 };
let fullPage = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--viewport" && args[i + 1]) {
    const [w, h] = args[i + 1].split("x").map(Number);
    viewport = { width: w, height: h };
    i++;
  } else if (args[i] === "--fullpage") {
    fullPage = true;
  }
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--disable-gpu", "--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport(viewport);
await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

// Second pass: actions in order.
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  const next = args[i + 1];
  if (arg === "--viewport" || arg === "--fullpage") {
    if (arg === "--viewport") i++;
    continue;
  }
  if (arg === "--wait" && next) {
    await new Promise((r) => setTimeout(r, Number(next)));
    i++;
  } else if (arg === "--fill" && next) {
    const [selector, text] = next.split("::");
    await page.waitForSelector(selector, { timeout: 8000 });
    await page.type(selector, text);
    i++;
  } else if (arg === "--click" && next) {
    const clicked = await page.evaluate((sel) => {
      const m = sel.match(/^(.*):text\(['"](.+)['"]\)$/);
      if (m) {
        const el = [...document.querySelectorAll(m[1])].find((e) =>
          e.textContent?.includes(m[2]),
        );
        if (el) {
          el.click();
          return true;
        }
        return false;
      }
      const el = document.querySelector(sel);
      if (el) {
        el.click();
        return true;
      }
      return false;
    }, next);
    if (!clicked) console.warn(`warning: nothing to click for "${next}"`);
    i++;
  }
}

await page.screenshot({ path: out, fullPage });
await browser.close();
console.log(`saved ${out}`);
