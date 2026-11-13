#!/usr/bin/env node
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const root = path.dirname(fileURLToPath(import.meta.url));
const artifactDir = process.argv[2] ?? path.join(root, "..", "artifacts-screenshots");
const port = 4191;
const base = `http://127.0.0.1:${port}/isavel-redesign/`;

fs.mkdirSync(artifactDir, { recursive: true });

const server = spawn("node", [path.join(root, "serve-export.mjs"), String(port)], {
  stdio: "inherit",
});

await sleep(800);

const browser = await chromium.launch();
const contexts = [
  { name: "1280", width: 1280, height: 800 },
  { name: "390", width: 390, height: 844 },
];

for (const vp of contexts) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(`${base}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(artifactDir, `home-${vp.name}.png`), fullPage: true });
  await page.getByTestId("vehicle-card").first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactDir, `modal-${vp.name}.png`) });
  await page.keyboard.press("Escape");
  await page.goto(`${base}estoque/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(artifactDir, `estoque-${vp.name}.png`), fullPage: true });
  await page.goto(
    `${base}carros/jeep/renegade-s-t270-1-3-tb-4x4-flex-aut/2023/1174974/`,
    { waitUntil: "networkidle" },
  );
  await page.screenshot({ path: path.join(artifactDir, `anuncio-${vp.name}.png`), fullPage: true });
  await page.close();
}

await browser.close();
server.kill();
console.log("Screenshots saved to", artifactDir);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
