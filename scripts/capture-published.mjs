#!/usr/bin/env node
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const artifactDir = process.argv[2] ?? path.join(root, "..", "artifacts-screenshots");
const base = "https://faddsistemas.github.io/isavel-redesign/";

fs.mkdirSync(artifactDir, { recursive: true });

const browser = await chromium.launch();
const contexts = [
  { name: "1280", width: 1280, height: 800 },
  { name: "390", width: 390, height: 844 },
];

for (const vp of contexts) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(base, { waitUntil: "networkidle", timeout: 60_000 });
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: path.join(artifactDir, `published-home-${vp.name}.png`),
    fullPage: true,
  });
  await page.getByTestId("vehicle-card").first().click({ timeout: 30_000 });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(artifactDir, `published-modal-${vp.name}.png`),
    fullPage: false,
  });
  await page.keyboard.press("Escape");
  await page.goto(`${base}estoque/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(artifactDir, `published-estoque-${vp.name}.png`), fullPage: true });
  await page.goto(
    `${base}carros/jeep/renegade-s-t270-1-3-tb-4x4-flex-aut/2023/1174974/`,
    { waitUntil: "networkidle" },
  );
  await page.screenshot({ path: path.join(artifactDir, `published-anuncio-${vp.name}.png`), fullPage: true });
  await page.close();
}

await browser.close();
console.log("Published screenshots:", artifactDir);
