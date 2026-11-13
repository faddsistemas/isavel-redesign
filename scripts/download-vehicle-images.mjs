#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const vehiclesPath = path.join(root, "data", "vehicles.json");
const outDir = path.join(root, "public", "vehicles");

const data = JSON.parse(fs.readFileSync(vehiclesPath, "utf8"));

async function download(url, dest) {
  if (fs.existsSync(dest)) return;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
}

const concurrency = 6;
let idx = 0;
const tasks = [];

for (const v of data.veiculos) {
  const idDir = path.join(outDir, String(v.id));
  v.fotos.forEach((url, i) => {
    const ext = url.includes(".webp") ? "webp" : "jpg";
    const dest = path.join(idDir, `${i}.${ext}`);
    tasks.push({ url, dest });
  });
}

async function worker() {
  while (idx < tasks.length) {
    const i = idx++;
    const { url, dest } = tasks[i];
    try {
      await download(url, dest);
    } catch (e) {
      console.error(e.message);
    }
  }
}

console.log(`Downloading ${tasks.length} images...`);
await Promise.all(Array.from({ length: concurrency }, () => worker()));
console.log("Done.");
