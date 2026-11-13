#!/usr/bin/env node
import { chromium } from "@playwright/test";
import fs from "fs";

const base = `https://faddsistemas.github.io/isavel-redesign/?v=${Date.now()}`;
const dir = process.argv[2] ?? "/opt/cursor/artifacts";

fs.mkdirSync(dir, { recursive: true });

const viewports = [
  { name: "1280x720", width: 1280, height: 720 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "390x844", width: 390, height: 844 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
  });
  await page.goto(base, { waitUntil: "networkidle", timeout: 60_000 });
  await page.getByTestId("vehicle-card").first().click();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: `${dir}/published-modal-${vp.name}.png`,
  });
  await page.close();
}
await browser.close();
console.log("Modal screenshots:", dir);
